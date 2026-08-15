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

Beim ersten Lauf wird automatisch das Google-Pose-Modell (pose_landmarker_full,
~9,4 MB) nach ~/.cache/trainer/mediapipe_models/ geladen und dort gecacht —
kein Repo-Commit, kein erneuter Download bei Folgeläufen. Nutzt die
MediaPipe-Tasks-API (mp.tasks.vision.PoseLandmarker), da die ältere
Solutions-API (mp.solutions.pose) in aktuellen mediapipe-Wheels für macOS
arm64 nicht mehr enthalten ist.

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

# Skelett-Kanten für die Debug-Annotation (Teilmenge der Standard-BlazePose-
# Connections — Google liefert diese Liste über die Tasks-API nicht mehr mit).
POSE_CONNECTIONS = [
    (11, 12), (11, 13), (13, 15), (12, 14), (14, 16),
    (11, 23), (12, 24), (23, 24),
    (23, 25), (25, 27), (27, 29), (27, 31),
    (24, 26), (26, 28), (28, 30), (28, 32),
]

MODEL_URL = ("https://storage.googleapis.com/mediapipe-models/pose_landmarker/"
             "pose_landmarker_full/float16/latest/pose_landmarker_full.task")
MODEL_PATH = os.path.expanduser("~/.cache/trainer/mediapipe_models/pose_landmarker_full.task")


def ensure_model():
    """Pose-Landmarker-Modell lokal cachen (einmaliger Download von Google)."""
    if os.path.isfile(MODEL_PATH):
        return MODEL_PATH
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    import urllib.request
    print(f"Lade Pose-Modell nach {MODEL_PATH} …")
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
    return MODEL_PATH


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


def hysteresis_runs(signal, enter, exit_, min_len, merge_gap=0):
    """Schmitt-Trigger-Runs: Start erst über `enter`, Ende erst unter `exit_`.

    Ein einfacher Nulldurchgangs-Trigger reißt bei Landmark-Jitter um die
    Schwelle in viele Mini-Runs — sowohl kurze Störungen als eigene
    Fehl-Runs (z. B. beim Ab-/Aufschwingen) als auch kurze Aussetzer
    innerhalb eines echten, länger anhaltenden Halts. `merge_gap` fügt
    Runs mit kleinem Abstand zusammen, bevor die Mindestlänge greift.
    """
    raw = []
    state = False
    start = None
    for i, v in enumerate(signal):
        if not state and v > enter:
            state = True
            start = i
        elif state and v < exit_:
            raw.append((start, i))
            state = False
    if state:
        raw.append((start, len(signal)))

    merged = []
    for start, end in raw:
        if merged and start - merged[-1][1] <= merge_gap:
            merged[-1] = (merged[-1][0], end)
        else:
            merged.append((start, end))

    return [(s, e) for s, e in merged if e - s >= min_len]


# ------------------------------------------------------------------ Pipeline

def extract_landmarks(video_path, debug_path=None):
    """Video frameweise durch MediaPipe Pose schicken.

    Rückgabe: (points, fps, size) mit points[frame, landmark, xy] in Pixeln,
    unsichere Landmarks (visibility < 0.5) als NaN.
    """
    import mediapipe as mp
    from mediapipe.tasks import python as mp_python
    from mediapipe.tasks.python import vision as mp_vision

    model_path = ensure_model()

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

    options = mp_vision.PoseLandmarkerOptions(
        base_options=mp_python.BaseOptions(model_asset_path=model_path),
        running_mode=mp_vision.RunningMode.VIDEO,
        num_poses=1,
        min_pose_detection_confidence=0.5,
        min_pose_presence_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    frames = []
    last_ts = -1
    with mp_vision.PoseLandmarker.create_from_options(options) as landmarker:
        frame_idx = 0
        while True:
            ok, frame = cap.read()
            if not ok:
                break

            ts_ms = int(frame_idx * 1000 / fps)
            if ts_ms <= last_ts:
                ts_ms = last_ts + 1
            last_ts = ts_ms

            mp_image = mp.Image(
                image_format=mp.ImageFormat.SRGB,
                data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB),
            )
            result = landmarker.detect_for_video(mp_image, ts_ms)

            row = np.full((33, 2), np.nan)
            if result.pose_landmarks:
                lms = result.pose_landmarks[0]
                for i, lm in enumerate(lms):
                    vis = lm.visibility if lm.visibility is not None else 1.0
                    if vis >= MIN_VISIBILITY:
                        row[i] = (lm.x * width, lm.y * height)
                if writer is not None:
                    for a, b in POSE_CONNECTIONS:
                        if not (np.isnan(row[a]).any() or np.isnan(row[b]).any()):
                            cv2.line(frame, tuple(row[a].astype(int)),
                                     tuple(row[b].astype(int)), (0, 255, 0), 2)
                    for i in range(33):
                        if not np.isnan(row[i]).any():
                            cv2.circle(frame, tuple(row[i].astype(int)), 4, (0, 0, 255), -1)
            frames.append(row)

            if writer is not None:
                writer.write(frame)

            frame_idx += 1

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
    """Framewise Mittel aus linkem/rechtem Landmark, NaN-robust.

    Bei seitlicher Kameraperspektive ist eine Körperseite oft komplett
    verdeckt (0 % Erkennungsrate) — nanmean nutzt dann automatisch die
    sichtbare Seite statt beide Serien auf NaN zu ziehen.
    """
    stacked = np.stack([points[:, left, :], points[:, right, :]])
    with np.errstate(invalid="ignore"):
        return np.nanmean(stacked, axis=0)


def torso_scale(points):
    """Robuste Längenreferenz (Schulter–Hüfte, Median) zur Normierung."""
    shoulder = mean_pair(points, L_SHOULDER, R_SHOULDER)
    hip = mean_pair(points, L_HIP, R_HIP)
    return float(np.median(np.linalg.norm(shoulder - hip, axis=1)))


# ----------------------------------------------------------------- Modus BMU

SUPPORT_ENTER = 0.12   # Stütz-Signal-Schwelle zum Eintritt (Torsolängen)
# Echtes Verlassen der Stange (Dismount) reißt das Signal auf ~-1 bis -2;
# ein flaches Zittern mitten in einer durchgehenden Pull-under-Bewegung
# reicht nur auf ~-0.1 bis -0.2. -0.3 trennt beides zuverlässig, ohne einen
# einzelnen kontinuierlichen Turnover künstlich in zwei Reps zu zerreißen.
SUPPORT_EXIT = -0.3
SUPPORT_MIN_LEN_S = 0.4     # kürzere Ausschläge sind Kip-Peitsche/Abschwung, kein Halt
# Ein echter Support drückt das Signal auf ~0.9-1.2 (Handgelenke eine knappe
# Torsolänge unter den Schultern). Peitschen-/Abschwung-Artefakte bleiben
# bei ~0.5-0.6 hängen — das Peak-Kriterium filtert sie unabhängig von Dauer.
SUPPORT_PEAK_MIN = 0.7
# Kein Merge nahe beieinanderliegender Runs: das Stütz-Signal ist bereits
# savgol-geglättet, echte Frame-Aussetzer reißen es dadurch nicht auseinander
# — separate Runs sind fast immer tatsächlich getrennte Bewegungen.


def swing_phase(hip_angle, window_start, window_end):
    """Hohlkörper-Tief und darauffolgenden Arch-Peak in einem Zeitfenster finden."""
    if window_end - window_start < 2:
        return None
    seg = slice(window_start, window_end)
    hollow_idx = window_start + int(np.argmin(hip_angle[seg]))
    arch_seg = slice(hollow_idx, window_end)
    arch_idx = hollow_idx + int(np.argmax(hip_angle[arch_seg]))
    return hollow_idx, arch_idx


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
    # Handgelenke tiefer als die Schultern → Signal > 0. Hysterese statt
    # Nulldurchgang, sonst reißt Landmark-Jitter beim Ab-/Aufschwingen den
    # echten Support-Halt in mehrere Mini-Runs.
    support_signal = savgol((wrist[:, 1] - shoulder[:, 1]) / scale, max(5, int(fps * 0.1)))
    runs = hysteresis_runs(
        support_signal, SUPPORT_ENTER, SUPPORT_EXIT,
        min_len=max(2, int(fps * SUPPORT_MIN_LEN_S)),
    )
    runs = [(s, e) for s, e in runs if np.max(support_signal[s:e]) >= SUPPORT_PEAK_MIN]

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

    # Pro-Rep-Kennzahlen: Hohlkörper → Arch → Pull-under → Support.
    # Gelten für jeden erkannten Rep, unabhängig davon, ob Single oder
    # Linked Double — bei Linked Doubles ergänzen sie die Übergangsdaten,
    # bei einem Single BMU sind sie die einzige verfügbare Auswertung.
    rep_metrics = []
    for i, rep in enumerate(reps):
        window_start = reps[i - 1]["end"] if i > 0 else 0
        phase = swing_phase(hip_angle, window_start, rep["start"])
        entry = {"rep": i + 1}
        if phase is not None:
            hollow_idx, arch_idx = phase
            descent = slice(arch_idx, rep["start"] + 1)
            horiz = np.abs(hip[descent, 0] - wrist[descent, 0]) / scale
            entry.update({
                "hohlkoerper_s": round(float(t[hollow_idx]), 3),
                "hohlkoerper_hueftwinkel_grad": round(float(hip_angle[hollow_idx]), 1),
                "arch_s": round(float(t[arch_idx]), 3),
                "arch_hueftwinkel_grad": round(float(hip_angle[arch_idx]), 1),
                "hohlkoerper_zu_arch_s": round(float(t[arch_idx] - t[hollow_idx]), 3),
                "arch_zu_support_s": round(float(t[rep["start"]] - t[arch_idx]), 3),
                "hueft_hand_abstand_pullunder_max_torsolaengen": round(float(np.max(horiz)), 3),
                "hueft_hand_abstand_pullunder_mittel_torsolaengen": round(float(np.mean(horiz)), 3),
            })
        entry.update({
            "support_dauer_s": round(float(t[rep["end"] - 1] - t[rep["start"]]), 3),
            "hueftwinkel_support_max_grad": round(
                float(np.max(hip_angle[rep["start"]:rep["end"]])), 1),
            "schulterwinkel_support_min_grad": round(
                float(np.min(shoulder_angle[rep["start"]:rep["end"]])), 1),
        })
        rep_metrics.append(entry)

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

    # Bewertung: bei 0 Reps Fehlermeldung, bei genau 1 Rep eine deskriptive
    # Einzel-Rep-Auswertung (keine Rhythmus-Frage möglich — dafür braucht es
    # einen Linked Double), bei ≥2 Reps die Arch-Rebuild-Kernfrage.
    if not reps:
        verdict = ("Kein Rep erkannt — Video prüfen (Bildausschnitt, "
                   "Landmark-Qualität, Stütz-Signal im Plot ansehen).")
    elif len(reps) == 1:
        rm = rep_metrics[0]
        if "arch_s" in rm:
            verdict = (
                f"Einzelner BMU: Hohlkörper bei {rm['hohlkoerper_s']} s "
                f"({rm['hohlkoerper_hueftwinkel_grad']}°), Arch-Peak bei {rm['arch_s']} s "
                f"({rm['arch_hueftwinkel_grad']}°) — Peitsche dauert "
                f"{rm['hohlkoerper_zu_arch_s']} s. Pull-under bis Support-Eintritt "
                f"{rm['arch_zu_support_s']} s, Hüft-Hand-Abstand dabei max. "
                f"{rm['hueft_hand_abstand_pullunder_max_torsolaengen']} Torsolängen. "
                f"Im Support: Hüftwinkel bis {rm['hueftwinkel_support_max_grad']}°, "
                f"Schulterwinkel bis {rm['schulterwinkel_support_min_grad']}°. "
                "Für die Rhythmus-Kernfrage (Arch-Neuaufbau vs. verkürzter Zug bei "
                "Rep 2) braucht es einen Linked-Double-Clip mit mind. 2 Reps — diese "
                "Einzelwerte sind aber der Referenzpunkt dafür."
            )
        else:
            verdict = "Einzelner BMU erkannt, aber kein Schwung vor dem Turnover im Bild."
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
        "rep_kennzahlen": rep_metrics,
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
        "rep_metrics": rep_metrics,
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
        for rm in series["rep_metrics"]:
            if "hohlkoerper_s" in rm:
                ax.axvline(rm["hohlkoerper_s"], color="#888", lw=1.0, ls=":")
                ax.axvline(rm["arch_s"], color="#c1440e", lw=1.0, ls="--")
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
