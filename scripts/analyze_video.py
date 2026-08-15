#!/usr/bin/env python3
"""Lokale Bewegungsanalyse aus Handyvideos (MediaPipe Pose).

Zwei Modi:
    bmu     Kip-Rhythmus bei Linked Bar Muscle-Ups — baut Rep 2 den Arch neu
            auf oder wird verkürzt gezogen?
    snatch  Bar Path (Proxy) + Timing der vollen Extension relativ zum
            Geschwindigkeitspeak.

Alles läuft vollständig lokal. Es werden keine Videos, Frames oder Metriken
irgendwohin hochgeladen. Die Ausgaben landen unter coach/video_analysis/ und
sind per .gitignore vom Repo ausgeschlossen — analog zur WHOOP-Regel wandern
nur verdichtete Erkenntnisse manuell nach coach/state.json.

Installation (mediapipe ist schwer, daher eigene Requirements-Datei):
    python3 -m pip install -r scripts/requirements-video.txt

Nutzung:
    python3 scripts/analyze_video.py --mode bmu    --video ~/Videos/bmu.mp4
    python3 scripts/analyze_video.py --mode snatch --video ~/Videos/sn.mp4 --debug

Kamerahinweise (entscheiden über die Datenqualität):
    Snatch/OHS  Streng seitlich, Kamera hüfthoch, ~3–4 m Abstand. Ganzer
                Körper UND Bar über die volle Bewegung im Bild — nicht
                mitschwenken, nicht zoomen.
    BMU         Seitlich mit leichtem Schrägwinkel (~15–30°), damit Arch und
                Turnover sichtbar bleiben. Volle Hang- bis Stützposition im
                Bild, Bar oben nicht abschneiden.
    Allgemein   60 fps bevorzugt, 30 fps akzeptabel. Gleichmäßiges Licht,
                Kontrast zum Hintergrund, keine Person im Vordergrund.

Validierung vor produktivem Einsatz (analog zum intervals.icu-Schritt):
    Ersten Lauf mit --debug fahren, annotated.mp4 sichten und prüfen, ob die
    Landmarks plausibel auf den Gelenken sitzen. Erst danach den Metriken
    trauen. Bei springenden Landmarks Kamerawinkel/Licht korrigieren statt
    die Zahlen zu interpretieren.
"""

import argparse
import datetime as dt
import json
import math
import os
import sys

import cv2
import numpy as np

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_ROOT = os.path.join(REPO_ROOT, "coach", "video_analysis")

MIN_VISIBILITY = 0.5

# MediaPipe-Pose-Landmarkindizes
L_SHOULDER, R_SHOULDER = 11, 12
L_WRIST, R_WRIST = 15, 16
L_HIP, R_HIP = 23, 24
L_KNEE, R_KNEE = 25, 26
L_ANKLE, R_ANKLE = 27, 28

NEEDED = [
    L_SHOULDER, R_SHOULDER, L_WRIST, R_WRIST,
    L_HIP, R_HIP, L_KNEE, R_KNEE, L_ANKLE, R_ANKLE,
]


# ---------------------------------------------------------------- Hilfsmittel

def interpolate_nan(series):
    """NaN-Lücken linear füllen, Ränder mit dem nächsten gültigen Wert."""
    out = np.asarray(series, dtype=float).copy()
    valid = ~np.isnan(out)
    if not valid.any():
        return out
    idx = np.arange(len(out))
    out[~valid] = np.interp(idx[~valid], idx[valid], out[valid])
    return out


def savgol(series, window, poly=2, deriv=0, delta=1.0):
    """Savitzky-Golay-Glättung/Ableitung, nur mit numpy.

    Bewusst selbst implementiert, damit scipy keine zusätzliche Abhängigkeit
    für dieses Script wird. Ränder werden per Randwiederholung gepolstert.
    """
    series = np.asarray(series, dtype=float)
    n = len(series)
    window = int(window)
    if window % 2 == 0:
        window += 1
    window = max(poly + 2 + (poly % 2), min(window, n if n % 2 else n - 1))
    if window < 3 or n < window:
        if deriv == 0:
            return series.copy()
        return np.gradient(series, delta)

    half = window // 2
    # Koeffizienten aus der Pseudoinversen der Vandermonde-Matrix
    x = np.arange(-half, half + 1, dtype=float)
    vander = np.vander(x, poly + 1, increasing=True)
    coef = np.linalg.pinv(vander)[deriv] * (math.factorial(deriv) / delta ** deriv)

    padded = np.concatenate([
        np.full(half, series[0]), series, np.full(half, series[-1]),
    ])
    return np.convolve(padded, coef[::-1], mode="valid")


def angle_series(a, b, c):
    """Winkel bei b (Grad) zwischen den Strecken b→a und b→c, framewise."""
    v1 = a - b
    v2 = c - b
    n1 = np.linalg.norm(v1, axis=1)
    n2 = np.linalg.norm(v2, axis=1)
    with np.errstate(invalid="ignore", divide="ignore"):
        cos = np.einsum("ij,ij->i", v1, v2) / (n1 * n2)
    return np.degrees(np.arccos(np.clip(cos, -1.0, 1.0)))


def contiguous_runs(mask, min_len):
    """Zusammenhängende True-Blöcke als (start, end_exklusiv)-Paare."""
    runs = []
    start = None
    for i, flag in enumerate(mask):
        if flag and start is None:
            start = i
        elif not flag and start is not None:
            if i - start >= min_len:
                runs.append((start, i))
            start = None
    if start is not None and len(mask) - start >= min_len:
        runs.append((start, len(mask)))
    return runs


# ------------------------------------------------------------------ Pipeline

def extract_landmarks(video_path, debug_path=None):
    """Video frameweise durch MediaPipe Pose schicken.

    Rückgabe: (points, fps, size) mit points[frame, landmark, xy] in Pixeln,
    unsichere Landmarks (visibility < 0.5) als NaN.
    """
    import mediapipe as mp

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        sys.exit(f"Video nicht lesbar: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    writer = None
    if debug_path:
        writer = cv2.VideoWriter(
            debug_path, cv2.VideoWriter_fourcc(*"mp4v"), fps, (width, height)
        )

    drawing = mp.solutions.drawing_utils
    pose_module = mp.solutions.pose

    frames = []
    # static_image_mode=False → Video-Modus mit Tracking zwischen den Frames
    with pose_module.Pose(
        static_image_mode=False,
        model_complexity=2,
        smooth_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    ) as pose:
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            result = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

            row = np.full((33, 2), np.nan)
            if result.pose_landmarks:
                for i, lm in enumerate(result.pose_landmarks.landmark):
                    if lm.visibility >= MIN_VISIBILITY:
                        row[i] = (lm.x * width, lm.y * height)
                if writer is not None:
                    drawing.draw_landmarks(
                        frame, result.pose_landmarks, pose_module.POSE_CONNECTIONS
                    )
            frames.append(row)

            if writer is not None:
                writer.write(frame)

    cap.release()
    if writer is not None:
        writer.release()

    if not frames:
        sys.exit("Keine Frames gelesen — Videodatei prüfen.")

    points = np.stack(frames)
    for i in NEEDED:
        points[:, i, 0] = interpolate_nan(points[:, i, 0])
        points[:, i, 1] = interpolate_nan(points[:, i, 1])

    coverage = {
        "frames": len(frames),
        "landmark_coverage": {
            str(i): round(float(np.mean(~np.isnan(np.stack(frames)[:, i, 0]))), 3)
            for i in NEEDED
        },
    }
    return points, float(fps), (width, height), coverage


def mean_pair(points, left, right):
    return (points[:, left, :] + points[:, right, :]) / 2.0


def torso_scale(points):
    """Robuste Längenreferenz (Schulter–Hüfte, Median) zur Normierung."""
    shoulder = mean_pair(points, L_SHOULDER, R_SHOULDER)
    hip = mean_pair(points, L_HIP, R_HIP)
    return float(np.median(np.linalg.norm(shoulder - hip, axis=1)))


# ----------------------------------------------------------------- Modus BMU

def analyze_bmu(points, fps):
    t = np.arange(len(points)) / fps
    scale = torso_scale(points)

    hip_angle = np.nanmean(np.stack([
        angle_series(points[:, L_SHOULDER], points[:, L_HIP], points[:, L_KNEE]),
        angle_series(points[:, R_SHOULDER], points[:, R_HIP], points[:, R_KNEE]),
    ]), axis=0)
    shoulder_angle = np.nanmean(np.stack([
        angle_series(points[:, L_HIP], points[:, L_SHOULDER], points[:, L_WRIST]),
        angle_series(points[:, R_HIP], points[:, R_SHOULDER], points[:, R_WRIST]),
    ]), axis=0)

    hip_angle = savgol(interpolate_nan(hip_angle), max(5, int(fps * 0.12)))
    shoulder_angle = savgol(interpolate_nan(shoulder_angle), max(5, int(fps * 0.12)))

    shoulder = mean_pair(points, L_SHOULDER, R_SHOULDER)
    wrist = mean_pair(points, L_WRIST, R_WRIST)
    hip = mean_pair(points, L_HIP, R_HIP)

    # Bildkoordinaten: y wächst nach unten. In Stützposition liegen die
    # Handgelenke tiefer als die Schultern → Signal > 0.
    support_signal = savgol((wrist[:, 1] - shoulder[:, 1]) / scale, max(5, int(fps * 0.1)))
    support = support_signal > 0.0
    runs = contiguous_runs(support, min_len=max(2, int(fps * 0.08)))

    reps = []
    for start, end in runs:
        peak = start + int(np.argmax(support_signal[start:end]))
        reps.append({"start": start, "peak": peak, "end": end})

    # Referenz-Arch: Setup-Schwung vor dem ersten Turnover
    if reps:
        baseline_window = slice(0, reps[0]["start"])
    else:
        baseline_window = slice(0, len(points))
    baseline_arch = (
        float(np.max(hip_angle[baseline_window]))
        if hip_angle[baseline_window].size else float("nan")
    )

    transitions = []
    for i in range(len(reps) - 1):
        leave = reps[i]["end"]                      # Verlassen der Stützposition
        nxt = reps[i + 1]["start"]                  # nächster Turnover
        if nxt - leave < 2:
            continue
        seg = slice(leave, nxt)
        arch_idx = leave + int(np.argmax(hip_angle[seg]))
        descent = slice(leave, arch_idx + 1)
        horiz = np.abs(hip[descent, 0] - wrist[descent, 0]) / scale

        arch = float(hip_angle[arch_idx])
        transitions.append({
            "von_rep": i + 1,
            "zu_rep": i + 2,
            "zeit_stuetz_bis_arch_s": round(float(t[arch_idx] - t[leave]), 3),
            "arch_amplitude_grad": round(arch, 1),
            "arch_vs_baseline_grad": (
                round(arch - baseline_arch, 1) if np.isfinite(baseline_arch) else None
            ),
            "arch_vs_baseline_prozent": (
                round(100.0 * arch / baseline_arch, 1)
                if np.isfinite(baseline_arch) and baseline_arch else None
            ),
            "hueft_wrist_abstand_descent_max_torsolaengen": round(float(np.max(horiz)), 3),
            "hueft_wrist_abstand_descent_mittel_torsolaengen": round(float(np.mean(horiz)), 3),
            "uebergangsdauer_s": round(float(t[nxt] - t[leave]), 3),
        })

    # Kernfrage: voller Arch-Neuaufbau oder verkürzter Zug?
    if not transitions:
        verdict = ("Kein vollständiger Rep-Übergang erkannt — Video prüfen "
                   "(Bildausschnitt, Anzahl Reps, Landmark-Qualität).")
    else:
        pct = [x["arch_vs_baseline_prozent"] for x in transitions
               if x["arch_vs_baseline_prozent"] is not None]
        worst = min(pct) if pct else None
        if worst is None:
            verdict = "Referenz-Arch nicht bestimmbar (kein Setup-Schwung vor Rep 1 im Bild)."
        elif worst >= 95:
            verdict = (f"Arch wird neu aufgebaut (min. {worst:.0f} % des Setup-Arch). "
                       "Rhythmus trägt.")
        elif worst >= 85:
            verdict = (f"Arch leicht verkürzt (min. {worst:.0f} % des Setup-Arch) — "
                       "Grenzfall, im annotierten Video gegenprüfen.")
        else:
            verdict = (f"Arch deutlich verkürzt (min. {worst:.0f} % des Setup-Arch): "
                       "Rep 2+ wird aus dem Restschwung gezogen statt neu aufgebaut.")

    summary = {
        "modus": "bmu",
        "fps": round(fps, 2),
        "dauer_s": round(float(t[-1]), 2),
        "reps_erkannt": len(reps),
        "rep_zeitpunkte_s": [round(float(t[r["peak"]]), 2) for r in reps],
        "baseline_arch_grad": (
            round(baseline_arch, 1) if np.isfinite(baseline_arch) else None
        ),
        "uebergaenge": transitions,
        "bewertung": verdict,
        "hinweis": ("Winkel aus 2D-Projektion — bei schrägem Kamerawinkel systematisch "
                    "unterschätzt. Vergleiche innerhalb eines Videos sind belastbarer "
                    "als absolute Gradzahlen."),
    }

    series = {
        "t": t,
        "hip_angle": hip_angle,
        "shoulder_angle": shoulder_angle,
        "support_signal": support_signal,
        "reps": reps,
        "transitions": transitions,
    }
    return summary, series


def plot_bmu(series, path):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    t = series["t"]
    fig, axes = plt.subplots(3, 1, figsize=(11, 9), sharex=True)

    axes[0].plot(t, series["hip_angle"], color="#c1440e")
    axes[0].set_ylabel("Hüftwinkel (°)")
    axes[0].set_title("BMU — Kip-Rhythmus")

    axes[1].plot(t, series["shoulder_angle"], color="#1f4e79")
    axes[1].set_ylabel("Schulterwinkel (°)")

    axes[2].plot(t, series["support_signal"], color="#3a7d44")
    axes[2].axhline(0.0, color="grey", lw=0.8, ls="--")
    axes[2].set_ylabel("Stütz-Signal\n(Handgelenk−Schulter)")
    axes[2].set_xlabel("Zeit (s)")

    for ax in axes:
        for rep in series["reps"]:
            ax.axvspan(t[rep["start"]], t[rep["end"] - 1], color="#3a7d44", alpha=0.12)
        ax.grid(alpha=0.25)

    fig.tight_layout()
    fig.savefig(path, dpi=130)
    plt.close(fig)


# -------------------------------------------------------------- Modus Snatch

def analyze_snatch(points, fps):
    t = np.arange(len(points)) / fps
    scale = torso_scale(points)

    wrist = mean_pair(points, L_WRIST, R_WRIST)
    win = max(5, int(fps * 0.1))
    bar_x = savgol(interpolate_nan(wrist[:, 0]), win)
    bar_y_img = savgol(interpolate_nan(wrist[:, 1]), win)
    bar_y = -bar_y_img  # nach oben positiv

    v_y = savgol(interpolate_nan(wrist[:, 1]), win, deriv=1, delta=1.0 / fps)
    v_y = -v_y  # positiv = Bar bewegt sich nach oben
    v_y_norm = v_y / scale

    hip_angle = np.nanmean(np.stack([
        angle_series(points[:, L_SHOULDER], points[:, L_HIP], points[:, L_KNEE]),
        angle_series(points[:, R_SHOULDER], points[:, R_HIP], points[:, R_KNEE]),
    ]), axis=0)
    knee_angle = np.nanmean(np.stack([
        angle_series(points[:, L_HIP], points[:, L_KNEE], points[:, L_ANKLE]),
        angle_series(points[:, R_HIP], points[:, R_KNEE], points[:, R_ANKLE]),
    ]), axis=0)
    hip_angle = savgol(interpolate_nan(hip_angle), win)
    knee_angle = savgol(interpolate_nan(knee_angle), win)

    peak_idx = int(np.argmax(v_y))
    # Volle Extension: Hüfte und Knie gemeinsam am nächsten an 180°, im
    # Fenster ±0.5 s um den Geschwindigkeitspeak.
    lo = max(0, peak_idx - int(fps * 0.5))
    hi = min(len(t), peak_idx + int(fps * 0.5) + 1)
    deficit = (180.0 - hip_angle) + (180.0 - knee_angle)
    ext_idx = lo + int(np.argmin(deficit[lo:hi]))

    start_idx = int(np.argmin(bar_y[: peak_idx + 1])) if peak_idx > 0 else 0
    catch_idx = peak_idx + int(np.argmax(bar_y[peak_idx:]))

    dt_ext = float(t[ext_idx] - t[peak_idx])
    if dt_ext < -0.03:
        timing = (f"Volle Extension {abs(dt_ext) * 1000:.0f} ms VOR dem Geschwindigkeitspeak "
                  "— Bar beschleunigt nach der Extension weiter (früh geöffnet).")
    elif dt_ext > 0.03:
        timing = (f"Volle Extension {dt_ext * 1000:.0f} ms NACH dem Geschwindigkeitspeak "
                  "— Extension kommt zu spät, Zug läuft vorher aus.")
    else:
        timing = "Volle Extension fällt mit dem Geschwindigkeitspeak zusammen."

    summary = {
        "modus": "snatch",
        "fps": round(fps, 2),
        "dauer_s": round(float(t[-1]), 2),
        "bar_path_quelle": ("PROXY — Handgelenk-Mittelpunkt aus Pose-Landmarks, "
                            "KEINE echte Hantelstangen-Erkennung. Bei Griffdrehung "
                            "und Umgreifen weicht der Proxy von der Bar ab."),
        "zug_start_s": round(float(t[start_idx]), 3),
        "peak_geschwindigkeit_s": round(float(t[peak_idx]), 3),
        "peak_geschwindigkeit_torsolaengen_pro_s": round(float(v_y_norm[peak_idx]), 2),
        "volle_extension_s": round(float(t[ext_idx]), 3),
        "extension_minus_peak_s": round(dt_ext, 3),
        "hueftwinkel_bei_extension_grad": round(float(hip_angle[ext_idx]), 1),
        "kniewinkel_bei_extension_grad": round(float(knee_angle[ext_idx]), 1),
        "hueftwinkel_max_grad": round(float(np.max(hip_angle)), 1),
        "kniewinkel_max_grad": round(float(np.max(knee_angle)), 1),
        "bar_hub_torsolaengen": round(float((bar_y[catch_idx] - bar_y[start_idx]) / scale), 2),
        "bar_horizontal_ausschlag_torsolaengen": round(
            float((np.max(bar_x[start_idx:catch_idx + 1])
                   - np.min(bar_x[start_idx:catch_idx + 1])) / scale), 2
        ),
        "timing_bewertung": timing,
        "hinweis": ("Winkel und Wege aus 2D-Projektion. Nur bei streng seitlicher "
                    "Kamera belastbar; Abstände sind auf die Rumpflänge normiert."),
    }

    series = {
        "t": t,
        "bar_x": bar_x,
        "bar_y": bar_y,
        "v_y_norm": v_y_norm,
        "hip_angle": hip_angle,
        "knee_angle": knee_angle,
        "peak_idx": peak_idx,
        "ext_idx": ext_idx,
        "start_idx": start_idx,
        "catch_idx": catch_idx,
    }
    return summary, series


def plot_snatch(series, path):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    t = series["t"]
    fig = plt.figure(figsize=(13, 8))
    grid = fig.add_gridspec(2, 2, width_ratios=[1, 1.3])

    ax_path = fig.add_subplot(grid[:, 0])
    seg = slice(series["start_idx"], series["catch_idx"] + 1)
    sc = ax_path.scatter(
        series["bar_x"][seg], series["bar_y"][seg],
        c=t[seg], cmap="viridis", s=14
    )
    ax_path.set_aspect("equal", adjustable="datalim")
    ax_path.set_title("Bar Path (Proxy: Handgelenk-Mittelpunkt)")
    ax_path.set_xlabel("x (px)")
    ax_path.set_ylabel("Höhe (px)")
    ax_path.grid(alpha=0.25)
    fig.colorbar(sc, ax=ax_path, label="Zeit (s)")

    ax_v = fig.add_subplot(grid[0, 1])
    ax_v.plot(t, series["v_y_norm"], color="#1f4e79")
    ax_v.axhline(0, color="grey", lw=0.8, ls="--")
    ax_v.set_ylabel("v vertikal\n(Rumpflängen/s)")
    ax_v.grid(alpha=0.25)

    ax_a = fig.add_subplot(grid[1, 1], sharex=ax_v)
    ax_a.plot(t, series["hip_angle"], color="#c1440e", label="Hüfte")
    ax_a.plot(t, series["knee_angle"], color="#3a7d44", label="Knie")
    ax_a.set_ylabel("Winkel (°)")
    ax_a.set_xlabel("Zeit (s)")
    ax_a.legend(loc="lower right")
    ax_a.grid(alpha=0.25)

    for ax in (ax_v, ax_a):
        ax.axvline(t[series["peak_idx"]], color="#1f4e79", lw=1.2, ls=":", label=None)
        ax.axvline(t[series["ext_idx"]], color="#c1440e", lw=1.2, ls="--", label=None)

    fig.tight_layout()
    fig.savefig(path, dpi=130)
    plt.close(fig)


# ---------------------------------------------------------------------- Main

def output_dir(mode):
    base = os.path.join(OUT_ROOT, f"{dt.date.today().isoformat()}_{mode}")
    path, n = base, 2
    while os.path.exists(path):
        path, n = f"{base}_{n}", n + 1
    os.makedirs(path)
    return path


def main():
    parser = argparse.ArgumentParser(
        description="Lokale Bewegungsanalyse (MediaPipe Pose) für BMU und Snatch.")
    parser.add_argument("--mode", choices=["bmu", "snatch"], required=True)
    parser.add_argument("--video", required=True, help="Pfad zur Videodatei")
    parser.add_argument("--debug", action="store_true",
                        help="Zusätzlich annotated.mp4 mit Landmarks schreiben "
                             "(vor dem ersten produktiven Lauf sichten!)")
    args = parser.parse_args()

    video = os.path.expanduser(args.video)
    if not os.path.isfile(video):
        sys.exit(f"Video nicht gefunden: {video}")

    out = output_dir(args.mode)
    debug_path = os.path.join(out, "annotated.mp4") if args.debug else None

    print(f"Analysiere {video} (Modus {args.mode}) …")
    points, fps, size, coverage = extract_landmarks(video, debug_path)
    print(f"  {coverage['frames']} Frames, {fps:.1f} fps, {size[0]}×{size[1]}")

    if args.mode == "bmu":
        summary, series = analyze_bmu(points, fps)
        plot_bmu(series, os.path.join(out, "plot.png"))
    else:
        summary, series = analyze_snatch(points, fps)
        plot_snatch(series, os.path.join(out, "plot.png"))

    summary["quelle"] = os.path.basename(video)
    summary["aufloesung"] = f"{size[0]}x{size[1]}"
    summary["landmark_coverage"] = coverage["landmark_coverage"]

    with open(os.path.join(out, "summary.json"), "w", encoding="utf-8") as fh:
        json.dump(summary, fh, ensure_ascii=False, indent=2)
        fh.write("\n")

    print(f"\nGeschrieben nach {os.path.relpath(out, REPO_ROOT)}/")
    print(f"  summary.json, plot.png{', annotated.mp4' if debug_path else ''}")
    key = "bewertung" if args.mode == "bmu" else "timing_bewertung"
    print(f"\n{summary[key]}")
    if debug_path:
        print("\nVor dem Vertrauen in die Zahlen: annotated.mp4 sichten — "
              "sitzen die Landmarks auf den Gelenken?")


if __name__ == "__main__":
    main()
