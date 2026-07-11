#!/usr/bin/env python3
"""validate_data.py — Strukturvalidierung für website/data.js.

Prüft (Regeln aus CLAUDE.md, coach/instructions.md und deploy.yml abgeleitet):
  1. Maximal 4 Wochen in weeks[].
  2. Wochen-IDs im Format YYYY-Wnn (^\\d{4}-W\\d{2}$).
  3. Wochen neueste-zuerst, streng absteigend nach dateFrom.
  4. Erste Wochen-ID == coach/state.json → aktuelle_woche.id
     (und von/bis == dateFrom/dateTo der ersten Woche).
  5. Jede Woche hat genau 7 Tage.
  6. Jeder Tag hat isoDate; isoDates sind lückenlos aufsteigend (täglich)
     und decken exakt [dateFrom, dateTo] ab.
  7. Jeder Tag hat type in {box, own, rest, ride}.
  8. Die erste Wochen-ID ist mit dem deploy.yml-sed-Muster extrahierbar
     (Zeilenformat '      id: "…",'), sonst bricht der Deploy-Workflow.

Parser: pragmatisch zeilenbasiert (kein JS-Interpreter). Verlässt sich auf das
stabile Zeilenformat von data.js: Wochen-IDs als eigene 'id: "…",'-Zeilen,
Tage als einzeilige Objekte mit isoDate:"…" und type:"…".

Exit-Code: 0 = alle Checks bestanden, 1 = mindestens ein FAIL.
"""

import json
import re
import subprocess
import sys
from datetime import date, timedelta
from pathlib import Path


def repo_root() -> Path:
    here = Path(__file__).resolve().parent
    try:
        out = subprocess.run(
            ["git", "-C", str(here), "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        return Path(out)
    except Exception:
        return here.parents[3]  # scripts → skill → skills → .claude → repo


def parse_iso(s: str):
    try:
        return date.fromisoformat(s)
    except ValueError:
        return None


def parse_weeks(data_js_text: str):
    """Zerlege data.js in Wochenblöcke anhand der 'id: "…",'-Zeilen."""
    lines = data_js_text.splitlines()
    id_re = re.compile(r'^\s*id: "([^"]*)",')
    day_re = re.compile(r'isoDate:"([^"]*)"')
    type_re = re.compile(r'\btype:"([^"]*)"')
    from_re = re.compile(r'^\s*dateFrom: "([^"]*)"')
    to_re = re.compile(r'^\s*dateTo:\s*"([^"]*)"')

    id_lines = [(i, m.group(1)) for i, line in enumerate(lines)
                if (m := id_re.match(line))]

    weeks = []
    for n, (start, week_id) in enumerate(id_lines):
        end = id_lines[n + 1][0] if n + 1 < len(id_lines) else len(lines)
        block = lines[start:end]
        week = {"id": week_id, "dateFrom": None, "dateTo": None, "days": []}
        for line in block:
            if (m := from_re.match(line)):
                week["dateFrom"] = m.group(1)
            elif (m := to_re.match(line)):
                week["dateTo"] = m.group(1)
            elif (m := day_re.search(line)):
                tm = type_re.search(line)
                week["days"].append({
                    "isoDate": m.group(1),
                    "type": tm.group(1) if tm else None,
                })
        weeks.append(week)
    return weeks


def main() -> int:
    root = repo_root()
    data_js = root / "website" / "data.js"
    state_json = root / "coach" / "state.json"

    problems = []
    ok = []

    def check(cond: bool, label: str, detail: str = ""):
        if cond:
            ok.append(label)
        else:
            problems.append(f"{label}{' — ' + detail if detail else ''}")

    if not data_js.is_file() or not state_json.is_file():
        print(f"FAIL: {data_js} oder {state_json} nicht gefunden.")
        return 1

    text = data_js.read_text(encoding="utf-8")
    state = json.loads(state_json.read_text(encoding="utf-8"))
    state_week = state.get("aktuelle_woche", {})

    weeks = parse_weeks(text)

    # Check 8 zuerst: deploy.yml-sed-Kompatibilität (identisches Muster).
    sed_ids = re.findall(r'^[ \t]*id: "([^"]*)",', text, flags=re.MULTILINE)
    check(bool(sed_ids), "deploy.yml-sed findet eine Wochen-ID",
          "keine Zeile im Format '  id: \"…\",' — Deploy-Workflow würde abbrechen")

    check(len(weeks) >= 1, "mindestens 1 Woche vorhanden")
    check(len(weeks) <= 4, "maximal 4 Wochen",
          f"{len(weeks)} Wochen gefunden (Regel: max. 4, älteste entfernen)")

    for w in weeks:
        wid = w["id"]
        check(bool(re.fullmatch(r"\d{4}-W\d{2}", wid)),
              f"{wid}: ID-Format YYYY-Wnn")
        d_from, d_to = parse_iso(w["dateFrom"] or ""), parse_iso(w["dateTo"] or "")
        check(d_from is not None and d_to is not None,
              f"{wid}: dateFrom/dateTo vorhanden und ISO-parsebar",
              f"dateFrom={w['dateFrom']!r}, dateTo={w['dateTo']!r}")
        if d_from is None or d_to is None:
            continue

        check(len(w["days"]) == 7, f"{wid}: genau 7 Tage",
              f"{len(w['days'])} Tage gefunden")

        expected = d_from
        days_ok = True
        for day in w["days"]:
            iso = parse_iso(day["isoDate"])
            if iso is None or iso != expected or not (d_from <= iso <= d_to):
                problems.append(
                    f"{wid}: Tag-isoDate {day['isoDate']!r} erwartet {expected} "
                    f"(lückenlos, innerhalb [{d_from}, {d_to}])")
                days_ok = False
                break
            expected += timedelta(days=1)
        if days_ok and w["days"]:
            check(expected - timedelta(days=1) == d_to,
                  f"{wid}: isoDates lückenlos {d_from} … {d_to}",
                  f"letzter Tag {expected - timedelta(days=1)} != dateTo {d_to}")

        bad_types = [d["isoDate"] for d in w["days"]
                     if d["type"] not in {"box", "own", "rest", "ride"}]
        check(not bad_types, f"{wid}: alle type in {{box, own, rest, ride}}",
              f"ungültig an: {bad_types}")

    # Reihenfolge: neueste zuerst, streng absteigend nach dateFrom.
    froms = [parse_iso(w["dateFrom"] or "") for w in weeks]
    if all(froms):
        check(all(a > b for a, b in zip(froms, froms[1:])),
              "Wochen neueste-zuerst (dateFrom streng absteigend)",
              f"Reihenfolge: {[str(f) for f in froms]}")

    # Abgleich state.json ↔ data.js (erste Woche).
    if weeks:
        first = weeks[0]
        check(first["id"] == state_week.get("id"),
              "erste data.js-Woche == state.json aktuelle_woche.id",
              f"data.js={first['id']!r} vs. state.json={state_week.get('id')!r}")
        check(first["dateFrom"] == state_week.get("von")
              and first["dateTo"] == state_week.get("bis"),
              "erste Woche dateFrom/dateTo == state.json von/bis",
              f"data.js=({first['dateFrom']},{first['dateTo']}) "
              f"vs. state.json=({state_week.get('von')},{state_week.get('bis')})")
        if sed_ids:
            check(sed_ids[0] == first["id"],
                  "deploy.yml-sed extrahiert die erste Woche",
                  f"sed={sed_ids[0]!r} vs. parser={first['id']!r}")

    # Report
    print(f"validate_data.py — {data_js}")
    print(f"Wochen gefunden: {len(weeks)} ({', '.join(w['id'] for w in weeks)})")
    for label in ok:
        print(f"  PASS  {label}")
    for p in problems:
        print(f"  FAIL  {p}")
    print(f"Ergebnis: {len(ok)} PASS, {len(problems)} FAIL "
          f"→ {'OK' if not problems else 'DEFEKT — vor Deploy beheben'}")
    return 0 if not problems else 1


if __name__ == "__main__":
    sys.exit(main())
