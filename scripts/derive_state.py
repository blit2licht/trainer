#!/usr/bin/env python3
"""derive_state.py — Trainer 3.0, Ableitungsskript (Phase 1: read-only).

Läuft ausschließlich in Claude-Code-Sessions (Planung/Recap), nie im Gym
(Übergabe 2.6). Phase 1 ist der Parallel-Lauf laut Übergabe 4.4: das Skript
erzeugt NUR einen menschenlesbaren Vergleichs-/Lücken-Report. Es schreibt
KEIN derived.json und ersetzt nichts am 2.x-Bestand. Erst nach bestandenem
Vergleich (spätere Phase) wird derived.json scharf geschaltet und
state.json.load_references durch einen Verweis ersetzt (Übergabe 5.5).

Inputs
------
  coach/exercises.json        Registry (class, ladder, aliases, increment)
  coach/state.json            load_references (handgepflegte Referenzwerte) +
                              Mesocycle-Kontext
  Verdicts                    optional: --verdicts <datei.json> (Dump im Format
                              von get_verdicts.php: {"verdicts": [...]}), oder
                              --endpoint <url> zum Live-Abruf (nur in Sessions
                              mit Website-Zugriff). Ohne beides: keine Verdicts,
                              alles unknown (das ist in W35 der reale Stand).
  website/data.js             optional, Archiv: Best-effort-Zählung vergangener
                              Fokus-Tage (Alt-Historie ohne Targets — Backfill
                              läuft über WHOOP-Prompts, Entscheid 6).

Output
------
  Report nach stdout, optional zusätzlich --out <datei.txt>.

Bewusst NICHT implementiert (offene Frage, s. V3.0/offene-fragen-w35.md):
  - WHOOP-Weekly-Paste-Parser. Das exakte Textformat ist unbekannt; ein reales
    Sample muss vorliegen, bevor der Parser spezifiziert wird (Übergabe OFFEN
    6.1, Prinzip 1.7: raten verboten). Bis dahin bleibt der Lastkanal leer und
    e1RM/ceiling-Ableitungen werden als "kein Ist-Kanal" markiert.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
EXERCISES_JSON = REPO / "coach" / "exercises.json"
STATE_JSON = REPO / "coach" / "state.json"
DATA_JS = REPO / "website" / "data.js"

# Explizite Zuordnung state.json.load_references -> ex_id. Bewusst als Tabelle
# im Code statt Heuristik: die Schlüssel sind historisch gewachsen
# (pause_ohs, clean_jerk_komplex ...) und matchen nicht per Substring auf die
# ex_ids. Prinzip 1.7 — lieber eine gepflegte Zeile als ein ratender Parser.
LOADREF_TO_EXID = {
    "pause_ohs": "ohs",
    "push_press_basis": "push_press",
    "squat_snatch_ceiling": "snatch",
    "front_squat": "front_squat",
    "clean_jerk_komplex": "clean_jerk",
    "weighted_pull_up": "wpu",
    "strict_hspu": "hspu_strict",
    "bmu": "bmu",
    "toes_to_bar": "t2b",
}


def load_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def load_verdicts(args) -> tuple[list[dict], str]:
    """Liefert (verdicts, quelle). Leere Liste, wenn kein Kanal angegeben."""
    if args.verdicts:
        data = load_json(Path(args.verdicts))
        rows = data.get("verdicts", data) if isinstance(data, dict) else data
        return rows, f"Datei {args.verdicts}"
    if args.endpoint:
        url = f"{args.endpoint}?from={args.from_date}&to={args.to_date}"
        with urllib.request.urlopen(url, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return data.get("verdicts", []), f"Endpoint {url}"
    return [], "kein Kanal (keine --verdicts/--endpoint) — alles unknown"


def count_archive_focus_days(text: str) -> int:
    """Best-effort: zählt Fokus-Tage (type:"own") im data.js-Archiv.

    data.js ist JS, kein JSON — hier wird nur grob gezählt, nicht geparst.
    Alt-Historie trägt noch keine ex_id/target-Objekte; sie liefert kein Soll
    für den Ableitungsvergleich. Die Zahl dient nur der Einordnung im Report.
    """
    return len(re.findall(r'type\s*:\s*"own"', text))


# ── WHOOP-Weekly-Paste-Parser (Format: V3.0/whoop-paste-format.md) ──────────
# Set-Notation (von Martin bestätigt 23.08.2026):
#   A×B×C kg   -> Sätze × Reps × Gewicht(gesamt; DB summiert)
#   A×B kg     -> Reps × Gewicht, EIN Satz (Zeile = Satz)
#   A×B BW     -> Sätze × Reps (bodyweight)
#   A×B @ +N kg-> Sätze × Reps, Zusatzlast +N (bw_plus)
# Reihenfolge der Muster ist bedeutsam: spezifischer zuerst.
_X = r"\s*[×x]\s*"
SET_PATTERNS = [
    (re.compile(rf"^(\d+){_X}(\d+){_X}([\d.,]+)\s*kg", re.I), "srw"),
    (re.compile(rf"^(\d+){_X}(\d+)\s*@\s*\+?([\d.,]+)\s*kg", re.I), "sr_plus"),
    (re.compile(rf"^(\d+){_X}([\d.,]+)\s*kg", re.I), "rw"),
    (re.compile(rf"^(\d+){_X}(\d+)\s*BW", re.I), "sr_bw"),
]
_EQUIP_SUFFIX = re.compile(r"\s+[–—-]\s+.*$")  # " – Barbell" / " – DB" abstreifen
_HEADER_HINT = re.compile(r"(:|min|strain|kcal|km|\bh\b|session)", re.I)


def _norm_name(s: str) -> str:
    return _EQUIP_SUFFIX.sub("", s.strip()).lower()


def _to_float(s: str) -> float:
    return float(s.replace(".", "").replace(",", ".")) if "," in s \
        else float(s)


def build_alias_index(reg: dict) -> dict:
    idx: dict[str, str] = {}
    for ex_id, ex in reg.items():
        for cand in [ex["name"], ex["kurz"], *ex.get("aliases", [])]:
            idx[_norm_name(cand)] = ex_id
    return idx


def parse_whoop(text: str, reg: dict) -> dict:
    """Parst einen WHOOP-Weekly-Paste zu {ex_id: [sets]} + unmapped-Namen.

    Ein Satz-Eintrag: {mode, sets, reps, weight|None, plus|None}. weight ist die
    Satzlast in kg (bei DB die Gesamtlast beider Hanteln), plus die Zusatzlast
    (bw_plus). Nicht-gemappte Übungsnamen (Accessories ohne Registry-Eintrag)
    landen in unmapped — kein Rate-Mapping (Prinzip 1.7).
    """
    alias_idx = build_alias_index(reg)
    by_ex: dict[str, list[dict]] = {}
    unmapped: dict[str, list[str]] = {}
    current_ex: str | None = None
    current_raw: str | None = None

    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        line = re.sub(r"^[-*]\s+", "", line)      # Bullet
        line = line.strip("*").strip()            # Markdown-Fett
        if not line:
            continue

        # Satzzeile?
        matched = False
        for rx, mode in SET_PATTERNS:
            m = rx.match(line)
            if not m:
                continue
            matched = True
            if mode == "srw":
                entry = {"mode": "srw", "sets": int(m.group(1)),
                         "reps": int(m.group(2)), "weight": _to_float(m.group(3)),
                         "plus": None}
            elif mode == "sr_plus":
                entry = {"mode": "sr_plus", "sets": int(m.group(1)),
                         "reps": int(m.group(2)), "weight": None,
                         "plus": _to_float(m.group(3))}
            elif mode == "rw":
                entry = {"mode": "rw", "sets": 1, "reps": int(m.group(1)),
                         "weight": _to_float(m.group(2)), "plus": None}
            else:  # sr_bw
                entry = {"mode": "sr_bw", "sets": int(m.group(1)),
                         "reps": int(m.group(2)), "weight": None, "plus": None}
            if current_ex:
                by_ex.setdefault(current_ex, []).append(entry)
            elif current_raw:
                unmapped.setdefault(current_raw, []).append(line)
            break
        if matched:
            continue

        # Übungsnamen-Zeile? (Header mit :/Zeit/Strain überspringen.)
        if _HEADER_HINT.search(line):
            current_ex, current_raw = None, None
            continue
        norm = _norm_name(line)
        ex_id = alias_idx.get(norm)
        if ex_id:
            current_ex, current_raw = ex_id, None
        elif re.search(r"[A-Za-zÄÖÜäöü]", line) and len(line) <= 48:
            current_ex, current_raw = None, line  # potentiell Accessory
        # sonst: Header/Rauschen — Kontext unverändert lassen

    return {"by_ex": by_ex, "unmapped": unmapped}


def _summarize_sets(sets: list[dict]) -> str:
    n_sets = sum(s["sets"] for s in sets)
    weighted = [s for s in sets if s["weight"] is not None]
    plussed = [s for s in sets if s["plus"] is not None]
    if weighted:
        top = max(weighted, key=lambda s: s["weight"])
        return (f"Top-Satz {top['weight']:g} kg × {top['reps']} "
                f"(Sätze gesamt {n_sets})")
    if plussed:
        top = max(plussed, key=lambda s: s["plus"])
        return (f"Top +{top['plus']:g} kg × {top['reps']} "
                f"(Sätze gesamt {n_sets})")
    reps = sum(s["sets"] * s["reps"] for s in sets)
    return f"{n_sets} Sätze, {reps} Reps gesamt (BW)"


def build_report(exercises: dict, state: dict, verdicts: list[dict],
                 verdict_source: str, whoop: dict | None,
                 whoop_source: str, args) -> str:
    reg = {e["ex_id"]: e for e in exercises["exercises"]}
    load_refs = state.get("load_references", {})
    out: list[str] = []

    def line(s: str = "") -> None:
        out.append(s)

    line("=" * 72)
    line("Trainer 3.0 — derive_state.py Phase 1 (read-only Vergleichs-Report)")
    line(f"erzeugt: {datetime.now().isoformat(timespec='seconds')}")
    line(f"Bereich: {args.from_date} .. {args.to_date}")
    line(f"Verdict-Quelle: {verdict_source}")
    line("Hinweis: schreibt kein derived.json, ändert nichts (Übergabe 4.4).")
    line("=" * 72)

    # 1) Registry-Übersicht
    line("")
    line("1) REGISTRY")
    by_class: dict[str, list[str]] = {}
    for ex in exercises["exercises"]:
        by_class.setdefault(ex["class"], []).append(ex["ex_id"])
    for cls in ("loadable", "technical", "skill", "generic"):
        ids = by_class.get(cls, [])
        line(f"   {cls:<10} ({len(ids)}): {', '.join(ids) if ids else '—'}")

    # 2) Mapping load_references <-> ex_id
    line("")
    line("2) MAPPING state.json.load_references -> ex_id")
    unmapped_refs = []
    for key in load_refs:
        if key == "hinweis":
            continue
        ex_id = LOADREF_TO_EXID.get(key)
        if ex_id and ex_id in reg:
            line(f"   {key:<22} -> {ex_id}")
        elif ex_id:
            line(f"   {key:<22} -> {ex_id}  [WARN: ex_id nicht in Registry]")
            unmapped_refs.append(key)
        else:
            line(f"   {key:<22} -> ?  [WARN: keine Zuordnung]")
            unmapped_refs.append(key)
    # Registry-Einträge ohne Referenz (v. a. generic + neue Movements)
    referenced_exids = {v for v in LOADREF_TO_EXID.values()}
    no_ref = [e for e in reg if e not in referenced_exids]
    line(f"   ohne load_reference (erwartbar: generic/neu): {', '.join(no_ref)}")

    # 3) Verdict-Verfügbarkeit
    line("")
    line("3) VERDICT-VERFUEGBARKEIT im Bereich")
    v_by_ex: dict[str, list[dict]] = {}
    for v in verdicts:
        v_by_ex.setdefault(v.get("ex_id", "?"), []).append(v)
    if not verdicts:
        line("   keine Verdicts vorhanden -> jede Fokus-Übung = unknown")
        line("   (unknown zaehlt in keine Streak, bewegt keine Last — Übergabe 2.1)")
    else:
        for ex_id in reg:
            n = len(v_by_ex.get(ex_id, []))
            if n:
                marks = ", ".join(
                    f"{x.get('iso_date')}:{x.get('verdict')}"
                    + (f"/{x['miss_reason']}" if x.get("miss_reason") else "")
                    for x in v_by_ex[ex_id]
                )
                line(f"   {ex_id:<14} {n:>2}  {marks}")
        unknown = [e for e in reg if not v_by_ex.get(e)]
        line(f"   unknown (keine Zeile): {', '.join(unknown) if unknown else '—'}")
    # Verdicts auf ex_ids ausserhalb der Registry
    stray = [k for k in v_by_ex if k not in reg]
    if stray:
        line(f"   [WARN] Verdicts auf unbekannte ex_id: {', '.join(stray)}")

    # 4) Klassen-Währungsvergleich (Referenz vs. Ableitung)
    line("")
    line("4) WAEHRUNGSVERGLEICH  (state.json-Referenz  vs  Engine-Ableitung)")
    line("   Waehrung je Klasse: loadable=e1RM/prescription · technical=ceiling")
    line("   · skill=Treppenstufe (werkstatt-konzept)")
    for ex_id, ex in reg.items():
        cls = ex["class"]
        if cls == "generic":
            continue
        ref_key = next((k for k, v in LOADREF_TO_EXID.items() if v == ex_id), None)
        ref = load_refs.get(ref_key, {}) if ref_key else {}
        my_v = v_by_ex.get(ex_id, [])
        line("")
        line(f"   [{ex_id}]  class={cls}")

        if cls == "technical":
            ref_kg = ref.get("kg") or ref.get("kg_1rm_geschaetzt") or "—"
            line(f"     Referenz-Ceiling (coach-gepflegt): {ref_kg} kg")
            line("     Ableitung: technical liefert nie eine Prescription "
                 "(Übergabe 2.2).")
            line("     Ist-Last-Kanal (WHOOP-Paste) nicht implementiert -> "
                 "e1RM/Ceiling-Abgleich offen.")

        elif cls == "loadable":
            ref_kg = ref.get("kg") or "—"
            ref_schema = ref.get("schema", "")
            line(f"     Referenz: {ref_kg} kg {ref_schema}".rstrip())
            presc = derive_loadable(my_v, ex)
            line(f"     Ableitung: {presc}")

        elif cls == "skill":
            ladder = ex.get("ladder", {})
            steps = ladder.get("steps", [])
            step = ladder.get("confirmed_step")
            step_txt = (f"{steps[step]} (Stufe {step + 1}/{len(steps)})"
                        if isinstance(step, int) and 0 <= step < len(steps)
                        else "—")
            line(f"     Registry-Treppe: {step_txt}  "
                 f"bestätigt {ladder.get('confirmed_at', '?')}")
            ref_schema = ref.get("schema") or ref.get("protokoll", "")
            if ref_schema:
                line(f"     state.json-Referenz: {str(ref_schema)[:70]}")
            line("     Ableitung: Treppenstufe wird aus Verdicts + "
                 "profile.json-Regeln fortgeschrieben (Engine-Regel Phase 2).")

    # 5) WHOOP-Ist aus dem Paste (nur wenn --whoop gegeben)
    line("")
    line("5) WHOOP-IST (aus Paste)")
    if not whoop:
        line("   kein Paste (--whoop) übergeben — kein Ist-Lastkanal.")
    else:
        line(f"   Quelle: {whoop_source}")
        line("   Hinweis: WHOOP-Ist ist Untergrenze/Teilabdeckung (coverage-"
             "limitiert) — korrigiert nie eine coach-gepflegte Ceiling nach "
             "unten (Übergabe 2.5). Der Verdict-Button ist das Leading Signal "
             "für hit/miss; eine WHOOP-Lücke (z. B. nicht abbildbarer Komplex) "
             "erzeugt nie miss/unknown bei vorhandenem Verdict.")
        by_ex = whoop["by_ex"]
        for ex_id in reg:
            sets = by_ex.get(ex_id)
            if not sets:
                continue
            ex = reg[ex_id]
            ref_key = next((k for k, v in LOADREF_TO_EXID.items()
                            if v == ex_id), None)
            ref = load_refs.get(ref_key, {}) if ref_key else {}
            ref_kg = ref.get("kg") or ref.get("kg_1rm_geschaetzt") \
                or ref.get("schema") or "—"
            line(f"   [{ex_id}] {ex['class']}: {_summarize_sets(sets)}"
                 f"  · Ref {ref_kg}")
            # Plausibilitäts-Check (Martin-Heuristik): grösste Zahl = Gewicht.
            for s in sets:
                if s["weight"] is None:
                    continue
                nums = [s["sets"], s["reps"], s["weight"]]
                if s["weight"] != max(nums):
                    line(f"      [?] Satz {s['reps']}×{s['weight']:g}: Gewicht "
                         "ist nicht die grösste Zahl — Parse prüfen")
                    break
        if whoop["unmapped"]:
            line("   unmapped (nicht in Registry, kein Rate-Mapping):")
            for name, lines in whoop["unmapped"].items():
                line(f"      {name}: {', '.join(lines)}")

    # 6) Offene Punkte / Grenzen dieser Phase
    line("")
    line("6) GRENZEN DIESER PHASE (bewusst offen)")
    archive_days = "—"
    if DATA_JS.is_file():
        archive_days = count_archive_focus_days(DATA_JS.read_text(encoding="utf-8"))
    line(f"   - data.js-Archiv: {archive_days} Fokus-Tage (type:own), aber ohne "
         "ex_id/target -> kein Soll/Ist-Diff. Backfill via WHOOP-Prompt (Entscheid 6).")
    line("   - WHOOP-Parser gebaut (Format bestätigt 23.08., "
         "V3.0/whoop-paste-format.md); liefert Ist-Last, aber ableitende "
         "e1RM-/Ceiling-Fortschreibung ist Phase 2.")
    line("   - derived.json NICHT geschrieben (Phase 1 ist report-only).")
    line("   - Doppelprogression Rep-Range-Accessories offen (OFFEN 6.7).")
    line("=" * 72)
    return "\n".join(out)


def derive_loadable(verdicts: list[dict], ex: dict) -> str:
    """Skizze der loadable-Ableitung (Übergabe 1.2/1.3), soweit ohne Ist-Last
    möglich. Ohne Verdicts: unknown. Mit Verdicts: Streak-Auswertung; die
    konkrete kg-Prescription braucht die Ist-Last aus dem WHOOP-Paste und wird
    daher nur beschrieben, nicht berechnet."""
    if not verdicts:
        return "unknown (keine Verdicts) -> keine Prescription"
    ordered = sorted(verdicts, key=lambda x: x.get("iso_date", ""))
    tail = [v.get("verdict") for v in ordered]
    hits = 0
    for v in reversed(tail):
        if v == "hit":
            hits += 1
        else:
            break
    miss_streak = 0
    for v in reversed(tail):
        if v == "miss":
            miss_streak += 1
        else:
            break
    inc = ex.get("increment", 2.5)
    if miss_streak >= 3:
        return (f"miss_streak={miss_streak} -> Deload-Vorschlag "
                f"(snap(last*0.9), min last-{inc}); Ist-Last aus WHOOP nötig")
    if hits >= 2:
        return (f"{hits}x hit in Folge -> Vorschlag +{inc} kg; "
                "Ist-Last aus WHOOP nötig zum Snappen")
    return f"letzte Verdicts {tail[-3:]} -> Last halten"


def main() -> int:
    ap = argparse.ArgumentParser(description="Trainer 3.0 derive_state Phase 1")
    ap.add_argument("--verdicts", help="JSON-Dump im get_verdicts.php-Format")
    ap.add_argument("--endpoint", help="URL zu get_verdicts.php (Live-Abruf)")
    ap.add_argument("--whoop", help="WHOOP-Weekly-Paste als Textdatei (Ist-Last)")
    ap.add_argument("--from", dest="from_date",
                    default=None, help="Bereichsstart YYYY-MM-DD")
    ap.add_argument("--to", dest="to_date",
                    default=None, help="Bereichsende YYYY-MM-DD")
    ap.add_argument("--out", help="Report zusätzlich in Datei schreiben")
    args = ap.parse_args()

    # Default-Bereich: aktuelle Woche aus state.json.
    state = load_json(STATE_JSON)
    week = state.get("aktuelle_woche", {})
    if not args.from_date:
        args.from_date = week.get("von", "2026-01-01")
    if not args.to_date:
        args.to_date = week.get("bis", "2026-12-31")

    exercises = load_json(EXERCISES_JSON)
    verdicts, vsource = load_verdicts(args)

    whoop = None
    whoop_source = "kein Paste (--whoop)"
    if args.whoop:
        reg = {e["ex_id"]: e for e in exercises["exercises"]}
        whoop = parse_whoop(Path(args.whoop).read_text(encoding="utf-8"), reg)
        whoop_source = f"Datei {args.whoop}"

    report = build_report(exercises, state, verdicts, vsource,
                          whoop, whoop_source, args)

    print(report)
    if args.out:
        Path(args.out).write_text(report + "\n", encoding="utf-8")
        print(f"\n[report auch geschrieben: {args.out}]", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
