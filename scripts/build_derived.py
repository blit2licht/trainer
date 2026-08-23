#!/usr/bin/env python3
"""build_derived.py — Trainer 3.0, Werkstatt-Export (datenmodell.md §6 / §7-5).

Erzeugt den DERIVED-Payload für die Werkstatt-Seite: das Lagebild ("Bewegt sich
mein Fitnesslevel noch?" als Antwort beim Öffnen) plus Übungs-, Gewichts- und
Regel-Treue-Daten. Vier Fortschrittswährungen je Klasse (werkstatt-konzept):
  loadable  → e1RM-Trend      technical → Ceiling-Bestätigungen
  skill     → Treppenstufe     Körper   → Wochentrend kg

PHASE-1-SCHATTEN: `coach/derived.json` ist noch nicht scharf (derive_state.py
läuft report-only). Dieser Generator zieht die Währungen deshalb aus den real
vorhandenen Quellen — Registry-Treppen, state.json-Ceilings, weight.json,
wellness.json, optional Verdicts/WHOOP-Paste — und markiert das Ergebnis
`provisional: true`. Ausgabe standardmäßig V3.0/build/derived.js (Schatten).

Zustandswörter (werkstatt-konzept, Entscheid 2): steigt / hält / stagniert /
fällt — nie handgesetzt. Regel hier: stagniert = keine neue Währungseinheit
seit 6 Wochen (deckungsgleich Review-Rhythmus). steigt/fällt nur, wo eine
Zeitreihe vorliegt (Gewicht); ohne Reihe max. hält/stagniert.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import derive_state as ds  # parse_whoop + LOADREF_TO_EXID wiederverwenden

REPO = Path(__file__).resolve().parent.parent
STATE_JSON = REPO / "coach" / "state.json"
PROFILE_JSON = REPO / "coach" / "profile.json"
EXERCISES_JSON = REPO / "coach" / "exercises.json"
WEIGHT_JSON = REPO / "coach" / "weight.json"
WELLNESS_JSON = REPO / "coach" / "wellness.json"
DEFAULT_OUT = REPO / "V3.0" / "build" / "derived.js"

STAGNATION_DAYS = 42  # 6 Wochen

# Aktive Meso-Ziele (state.json aktuelle_foki) -> ex_id, in Lagebild-Reihenfolge.
GOAL_TO_EXID = {
    "Snatch": "snatch",
    "Clean & Jerk": "clean_jerk",
    "Overhead Squat": "ohs",
    "Front Squat": "front_squat",
    "Bar Muscle-up": "bmu",
    "Weighted Pull-up": "wpu",
    "Strict HSPU": "hspu_strict",
    "Toes-to-Bar": "t2b",
}
ZIEL_ORDER = ["snatch", "clean_jerk", "ohs", "front_squat",
              "bmu", "wpu", "hspu_strict", "t2b", "gewicht"]


def load_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


WEEKDAY = {"Mo": 1, "Di": 2, "Mi": 3, "Do": 4, "Fr": 5, "Sa": 6, "So": 7}


def parse_de_date(s: str, year: int = 2026) -> date | None:
    m = re.search(r"(\d{2})\.(\d{2})\.", s)
    if not m:
        return None
    try:
        return date(year, int(m.group(2)), int(m.group(1)))
    except ValueError:
        return None


def week_weekday_dates(text: str, year: int = 2026) -> list[date]:
    """Löst 'W34 Mi'-Notation über die ISO-Woche auf (W34 Mi = 2026-08-19).
    Die Repo-Wochenlabels sind ISO-Wochen (state.json W35 = 24.–30.08.)."""
    out = []
    for m in re.finditer(r"W(\d{1,2})\s+(Mo|Di|Mi|Do|Fr|Sa|So)", text):
        try:
            out.append(date.fromisocalendar(year, int(m.group(1)),
                                             WEEKDAY[m.group(2)]))
        except ValueError:
            pass
    return out


def latest_date_in(text: str, today: date) -> date | None:
    """Jüngstes Datum im Text (dd.mm. ODER 'Wnn Wochentag'), nicht in der Zukunft."""
    cand = [d for mm in re.finditer(r"(\d{2})\.(\d{2})\.", text)
            if (d := parse_de_date(mm.group(0)))]
    cand += week_weekday_dates(text)
    cand = [d for d in cand if d <= today]
    return max(cand) if cand else None


def zustand_from_date(confirm: date | None, today: date) -> str:
    if confirm is None:
        return "offen"
    return "stagniert" if (today - confirm).days > STAGNATION_DAYS else "hält"


def weekly_weight(weight: dict) -> list[dict]:
    buckets: dict[str, list[float]] = {}
    for d in weight.get("days", []):
        try:
            iso = date.fromisoformat(d["date"]).isocalendar()
        except (KeyError, ValueError):
            continue
        key = f"{iso[0]}-W{iso[1]:02d}"
        buckets.setdefault(key, []).append(d["weight_kg"])
    out = []
    for key in sorted(buckets):
        vals = buckets[key]
        out.append({"woche": key, "kg": round(sum(vals) / len(vals), 2),
                    "n": len(vals)})
    return out


def gewicht_block(weight: dict, profile: dict) -> dict:
    schnitte = weekly_weight(weight)
    komp = profile.get("koerperkomposition", {})
    band = komp.get("wochentrend_ziel_kg", "-0,3 bis -0,5")
    ziel = komp.get("ziel_kg", "74-76")
    zustand, trend, im_band = "offen", None, None
    # Nur volle Wochen (n>=5) für den Trend, damit Teilwochen nicht kippen.
    voll = [s for s in schnitte if s["n"] >= 5]
    if len(voll) >= 2:
        prev, last = voll[-2], voll[-1]
        trend = round(last["kg"] - prev["kg"], 2)
        zustand = ("fällt" if trend <= -0.1 else
                   "steigt" if trend >= 0.1 else "hält")
        im_band = -0.5 <= trend <= -0.3
    return {"wochenschnitte": schnitte, "trend_kg": trend, "zustand": zustand,
            "im_zielband": im_band, "ziel_kg": ziel, "wochentrend_ziel": band}


def e1rm_from_whoop(sets: list[dict], rep_cap) -> dict | None:
    """Bestes Epley-e1RM aus den geparsten Sätzen (nur reps<=rep_cap, mit kg)."""
    cap = rep_cap if isinstance(rep_cap, int) else 12
    best = None
    for s in sets:
        w, r = s.get("weight"), s.get("reps")
        if w is None or r is None or r > cap:
            continue
        e = w * (1 + r / 30)
        if best is None or e > best["e1rm"]:
            best = {"e1rm": round(e, 1), "from": f"{r}×{w:g}"}
    return best


def currency_for(ex_id: str, reg: dict, load_refs: dict, today: date,
                 whoop_by_ex: dict) -> dict:
    ex = reg.get(ex_id, {})
    cls = ex.get("class")
    ref_key = next((k for k, v in ds.LOADREF_TO_EXID.items() if v == ex_id), None)
    ref = load_refs.get(ref_key, {}) if ref_key else {}

    if cls == "technical":
        wert = next((ref[k] for k in ("kg", "top_single_w30", "kg_1rm_geschaetzt")
                     if k in ref), None)
        confirm = latest_date_in(ref.get("note", ""), today)
        return {"class": cls, "waehrung": "ceiling",
                "wert": wert, "label": "Ceiling (coach-gepflegt)",
                "zustand": zustand_from_date(confirm, today),
                "beleg": f"zuletzt bestätigt {confirm.strftime('%d.%m.') if confirm else '—'}"}

    if cls == "skill":
        ladder = ex.get("ladder", {})
        steps = ladder.get("steps", [])
        step = ladder.get("confirmed_step")
        confirm = parse_de_date(ladder.get("confirmed_at", "")) \
            if re.search(r"\d{2}\.\d{2}\.", ladder.get("confirmed_at", "")) \
            else (date.fromisoformat(ladder["confirmed_at"])
                  if ladder.get("confirmed_at") else None)
        wert = (f"{steps[step]} (Stufe {step + 1}/{len(steps)})"
                if isinstance(step, int) and 0 <= step < len(steps) else None)
        return {"class": cls, "waehrung": "treppenstufe",
                "wert": wert, "label": "Treppenstufe",
                "zustand": zustand_from_date(confirm, today),
                "beleg": f"bestätigt {ladder.get('confirmed_at', '—')}"}

    if cls == "loadable":
        e1 = e1rm_from_whoop(whoop_by_ex.get(ex_id, []), ex.get("rep_cap_e1rm"))
        return {"class": cls, "waehrung": "e1rm",
                "wert": e1["e1rm"] if e1 else None, "label": "e1RM (Epley)",
                "zustand": "offen" if not e1 else "hält",
                "beleg": (f"aus {e1['from']}" if e1
                          else "kein Ist-Kanal (WHOOP-Paste nötig)")}

    return {"class": cls, "waehrung": None, "wert": None, "label": None,
            "zustand": "offen", "beleg": ""}


def verdict_history(ex_id: str, verdicts: list[dict]) -> list[dict]:
    rows = [v for v in verdicts if v.get("ex_id") == ex_id]
    rows.sort(key=lambda x: x.get("iso_date", ""))
    return [{"d": v.get("iso_date"), "verdict": v.get("verdict"),
             "miss_reason": v.get("miss_reason")} for v in rows]


def regel_treue(wellness: dict, von: str, bis: str) -> dict:
    tage = [d for d in wellness.get("days", []) if von <= d.get("date", "") <= bis]
    u50 = [d["date"] for d in tage if (d.get("recovery") or 100) < 50]
    return {"fenster": f"{von}..{bis}", "recovery_tage_u50": u50,
            "snooze_until": None,
            "hinweis": "Abgleich Steigerungssatz an <50%-Tagen = Phase 2 "
                       "(braucht Verdict+Recovery gekoppelt)."}


def build_derived(today: date, state: dict, profile: dict, exercises: dict,
                  weight: dict, wellness: dict, verdicts: list[dict],
                  whoop_by_ex: dict) -> dict:
    reg = {e["ex_id"]: e for e in exercises["exercises"]}
    load_refs = state.get("load_references", {})
    week = state.get("aktuelle_woche", {})

    # exercises: ALLE trackbaren ex_ids (nicht generic) — Übungsseiten sind per
    # Selektion erreichbar (werkstatt-konzept Entscheid 1), auch Nicht-Meso-Ziele
    # wie rdl/push_press/overhead_press mit e1RM.
    exercises_out = {}
    for ex_id, ex in reg.items():
        if ex.get("class") == "generic":
            continue
        cur = currency_for(ex_id, reg, load_refs, today, whoop_by_ex)
        exercises_out[ex_id] = {**cur,
                                "verdict_history": verdict_history(ex_id, verdicts),
                                "prescription": None, "soll_ist": []}

    # Lagebild: nur aktive Meso-Ziele (Entscheid 1) in kanonischer Reihenfolge.
    lagebild = []
    for ex_id in ZIEL_ORDER:
        if ex_id == "gewicht":
            continue
        cur = exercises_out.get(ex_id) or currency_for(ex_id, reg, load_refs,
                                                        today, whoop_by_ex)
        lagebild.append({
            "ziel": ex_id, "name": reg.get(ex_id, {}).get("name", ex_id),
            "klasse": cur["class"], "wert": cur["wert"], "label": cur["label"],
            "zustand": cur["zustand"], "beleg": cur["beleg"],
        })

    gew = gewicht_block(weight, profile)
    last_kg = gew["wochenschnitte"][-1]["kg"] if gew["wochenschnitte"] else None
    lagebild.append({
        "ziel": "gewicht", "name": "Körpergewicht", "klasse": "koerper",
        "wert": last_kg, "label": "Wochenschnitt kg", "zustand": gew["zustand"],
        "beleg": (f"Trend {gew['trend_kg']:+g}/Woche"
                  if gew["trend_kg"] is not None else "zu wenig Vollwochen"),
    })

    return {
        "derived_at": today.isoformat(),
        "provisional": True,
        "_hinweis": "PHASE-1-SCHATTEN: derived.json noch nicht scharf. Währungen "
                    "aus state.json/Registry/weight/wellness, nicht aus voller "
                    "Ist-Historie. Zustände best-effort (stagniert = >6 Wochen). "
                    "Nicht für die Live-Werkstatt verwenden.",
        "meso": {"id": week.get("mesocycle", "Meso 3"),
                 "ziele": [z for z in ZIEL_ORDER]},
        "lagebild": lagebild,
        "exercises": exercises_out,
        "gewicht": gew,
        "regel_treue": regel_treue(wellness, week.get("von", ""),
                                   week.get("bis", "")),
    }


def render_js(payload: dict) -> str:
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    return ("/* GENERIERT von scripts/build_derived.py — nicht von Hand "
            "editieren.\n   Werkstatt-Export (datenmodell.md §6). PHASE-1-"
            "SCHATTEN, provisional. */\n"
            f"const DERIVED = {body};\n")


def main() -> int:
    ap = argparse.ArgumentParser(description="Trainer 3.0 Werkstatt-Export")
    ap.add_argument("--verdicts", help="JSON-Dump im get_verdicts.php-Format")
    ap.add_argument("--whoop", help="WHOOP-Weekly-Paste (für loadable-e1RM)")
    ap.add_argument("--out", help=f"Ausgabedatei (Default Schatten: {DEFAULT_OUT})")
    args = ap.parse_args()

    state = load_json(STATE_JSON)
    profile = load_json(PROFILE_JSON)
    exercises = load_json(EXERCISES_JSON)
    weight = load_json(WEIGHT_JSON)
    wellness = load_json(WELLNESS_JSON)

    try:
        today = date.fromisoformat(state.get("aktualisiert_am"))
    except (TypeError, ValueError):
        today = date(2026, 8, 23)

    verdicts = []
    if args.verdicts:
        vd = load_json(Path(args.verdicts))
        verdicts = vd.get("verdicts", vd) if isinstance(vd, dict) else vd

    whoop_by_ex = {}
    if args.whoop:
        reg = {e["ex_id"]: e for e in exercises["exercises"]}
        whoop_by_ex = ds.parse_whoop(
            Path(args.whoop).read_text(encoding="utf-8"), reg)["by_ex"]

    payload = build_derived(today, state, profile, exercises, weight, wellness,
                            verdicts, whoop_by_ex)
    out_path = Path(args.out) if args.out else DEFAULT_OUT
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(render_js(payload), encoding="utf-8")

    print(f"Werkstatt-Export geschrieben: {out_path}")
    print(f"  derived_at {payload['derived_at']} · provisional "
          f"{payload['provisional']} · {len(payload['lagebild'])} Lagebild-Zeilen")
    for row in payload["lagebild"]:
        w = row["wert"] if row["wert"] is not None else "—"
        print(f"    {row['name']:<16} {str(w):<10} {row['zustand']:<10} "
              f"{row['beleg']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
