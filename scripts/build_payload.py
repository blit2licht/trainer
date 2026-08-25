#!/usr/bin/env python3
"""build_payload.py — Trainer 3.0, Handy-Payload-Generator (datenmodell.md §5).

Liest die Planquelle (coach/plan/2026-Wxx.json) + die Registry
(coach/exercises.json) und erzeugt den schlanken Handy-Payload im data.js-Format.
Prinzip (Entscheid 11): Quelle speichert einmal, Payload leitet ab.

Der Generator
  - STRIPPT alle Prosa, die das Handy nie erreichen darf (handy-konzept §2b):
    warum, note (je Übung), intro, plan_note. recovery_day bleibt als
    Kurzform je Fokus-Tag (datenmodell §5).
  - REICHERT an: kurz aus der Registry, generierte kurzform / last_spanne /
    zeit_spanne (nie redundant in der Quelle gespeichert).
  - LINTET: Klammern im Blocktitel = Warnung (Planungsprosa gehört in note,
    nicht in den Titel — Schema-Anforderung 5).

SCHATTEN-LAUF (W35): Standard-Ausgabe ist V3.0/build/data.js — NICHT das live
website/data.js. Der 2.x-Bestand bleibt unangetastet, bis zur Scharfschaltung
(Meso-4-Start). Erst dann `--out website/data.js`.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
EXERCISES_JSON = REPO / "coach" / "exercises.json"
STATE_JSON = REPO / "coach" / "state.json"
PLAN_DIR = REPO / "coach" / "plan"
DEFAULT_OUT = REPO / "V3.0" / "build" / "data.js"

# Erlaubte target-Modi (datenmodell.md §3). `rpe` = Last selbst gewählt, der
# RPE-Deckel führt — für Layer-/Accessory-Arbeit ohne vorgeschriebenes Gewicht.
TARGET_MODES = {"kg", "bw", "bw_plus", "time", "band", "rpe"}


def load_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def build_day(day: dict, reg: dict, warns: list[str]) -> dict:
    """Ein Tag → Payload-Tag. Fokus-Tage tragen Vollzugsdaten, andere nur den Typ."""
    iso = day.get("iso_date")
    dtype = day.get("day_type")

    # Box-/Ride-Tage: Typ + WOD-Kerninfos (Vollzugsdaten, keine Engine).
    # einheit/sub/wod erreichen das Handy — der Tag-Klick zeigt die
    # DreamWOD-Kerninfos wie in 2.x (Martin, 23.08.).
    if dtype != "own":
        out = {"iso_date": iso, "day_type": dtype}
        for key in ("einheit", "sub", "wod", "warum"):
            if key in day:
                out[key] = day[key]
        return out

    out_blocks = []
    kurz_names: list[str] = []
    kg_targets: list[float] = []
    min_required = 0
    min_all = 0

    for block in day.get("blocks", []):
        title = block.get("title", "")
        if "(" in title or ")" in title:
            warns.append(f"{iso} Block {block.get('block_id')}: Klammern im "
                         f"Titel «{title}» — gehört in note, nicht in den Titel.")
        prio = block.get("prio")
        bmin = block.get("min", 0) or 0
        min_all += bmin
        if prio == "required":
            min_required += bmin

        ex_out = []
        for ex in block.get("exercises", []):
            ex_id = ex.get("ex_id")
            entry = reg.get(ex_id)
            # Anzeige-Bewegungen (z. B. Layer-Komponenten) müssen nicht in der
            # Registry stehen — dann trägt der Plan einen Inline-kurz.
            if entry:
                kurz = entry.get("kurz", ex_id)
            else:
                kurz = ex.get("kurz", ex_id)
                if not ex.get("kurz"):
                    warns.append(f"{iso} Block {block.get('block_id')}: ex_id "
                                 f"'{ex_id}' nicht in Registry und kein kurz.")
            target = ex.get("target", {})
            # Prinzip 1.7: der Modus ist explizit, und ein Modus ohne seinen
            # Pflichtwert erzeugt am Handy eine lastlose Zeile — lieber laut
            # warnen als still nichts anzeigen (Review 24.08.).
            mode = target.get("mode")
            if mode not in TARGET_MODES:
                warns.append(f"{iso} Block {block.get('block_id')} / {ex_id}: "
                             f"unbekannter target.mode «{mode}» — erlaubt: "
                             f"{', '.join(sorted(TARGET_MODES))}.")
            # ramp erzeugt nur ab zwei Stufen einen Teststreifen — eine
            # einstufige ramp ohne kg rendert genauso lastlos wie gar keine.
            elif mode == "kg" and target.get("kg") is None \
                    and len(target.get("ramp") or []) < 2:
                warns.append(f"{iso} Block {block.get('block_id')} / {ex_id}: "
                             f"mode:kg ohne kg und ohne mehrstufige ramp — Handy "
                             f"zeigt keine Last. Wert ergänzen oder mode:rpe.")
            elif mode == "bw_plus" and target.get("kg") is None:
                warns.append(f"{iso} Block {block.get('block_id')} / {ex_id}: "
                             f"mode:bw_plus ohne kg (Zusatzlast fehlt).")
            elif mode == "time" and target.get("sec") is None:
                warns.append(f"{iso} Block {block.get('block_id')} / {ex_id}: "
                             f"mode:time ohne sec.")
            elif mode == "band" and not target.get("band"):
                warns.append(f"{iso} Block {block.get('block_id')} / {ex_id}: "
                             f"mode:band ohne band (Stärke/Farbe fehlt).")
            # Bei mode:rpe IST der Deckel die Vorgabe — fehlt er, steht die
            # Übung ganz ohne Vorgabe da (selbst gewählt und ungedeckelt).
            elif mode == "rpe" and target.get("rpe_cap") is None:
                warns.append(f"{iso} Block {block.get('block_id')} / {ex_id}: "
                             f"mode:rpe ohne rpe_cap — Last selbst gewählt UND "
                             f"kein Deckel, das Handy zeigt keine Vorgabe.")
            # kg-Spanne nur aus mode:kg REQUIRED-Blöcke — Accessory-/Layer-Lasten
            # (optional) sind nie Tages-Kennzahl.
            if prio == "required" and target.get("mode") == "kg" \
                    and isinstance(target.get("kg"), (int, float)):
                kg_targets.append(target["kg"])
                for r in target.get("ramp", []):
                    if isinstance(r, (int, float)):
                        kg_targets.append(r)
            # Strip: note/intro/plan_note fallen weg. warum wandert seit
            # 23.08. mit (Martin-Revision der Content-Diät) — am Handy
            # ausklappbar als „Begründung", nie offen gerendert.
            # class trägt die Verdict-UI (technical → miss_reason Technik/Last).
            # name = voller Übungsname fürs Handy (Registry, sonst Plan-kurz) —
            # der Block zeigt immer, WAS zu tun ist (Martin, 23.08. PDF-Review).
            name = (entry.get("name") if entry else None) or ex.get("kurz") or ex_id
            ex_entry = {"ex_id": ex_id, "kurz": kurz, "name": name,
                        "class": entry.get("class") if entry else None,
                        "target": target}
            # WHOOP-Copy am Handy: der erste alias-Eintrag ist per Registry-
            # Konvention der verifizierte WHOOP-Library-Name (hinweis-Feld).
            if entry and entry.get("aliases"):
                ex_entry["whoop"] = entry["aliases"][0]
            if ex.get("warum"):
                ex_entry["warum"] = ex["warum"]
            ex_out.append(ex_entry)

        # kurzform: kurz der required-Blöcke (erste Übung je Block).
        if prio == "required" and block.get("exercises"):
            first = block["exercises"][0].get("ex_id")
            fk = reg.get(first, {}).get("kurz", first)
            if fk not in kurz_names:
                kurz_names.append(fk)

        # Verdict-Anker: generic Composite (z. B. Layer) bekommt EIN Verdict am
        # Block via verdict_ex_id, während mehrere Bewegungen nur angezeigt werden.
        vid = block.get("verdict_ex_id")
        block_out = {
            "block_id": block.get("block_id"),
            "prio": prio,
            "title": title,
            "min": bmin,
            "superset": block.get("superset", False),
            "exercises": ex_out,
        }
        if vid:
            block_out["verdict_ex_id"] = vid
            block_out["verdict_class"] = reg.get(vid, {}).get("class")
        out_blocks.append(block_out)

    day_out = {
        "iso_date": iso,
        "day_type": dtype,
        "focus": day.get("focus"),
        "focus_label": day.get("focus_label"),
        "kurzform": ", ".join(kurz_names),
        "blocks": out_blocks,
    }
    if kg_targets:
        day_out["last_spanne"] = [min(kg_targets), max(kg_targets)]
    if min_all:
        day_out["zeit_spanne"] = [min_required, min_all]
    # recovery_day bleibt als Kurzform (datenmodell §5), intro/plan_note nicht.
    if "recovery_day" in day:
        day_out["recovery_day"] = day["recovery_day"]
    return day_out


def build_week(plan: dict, reg: dict, warns: list[str]) -> dict:
    return {
        "id": plan.get("id"),
        "label": plan.get("label"),
        "meso": plan.get("meso"),
        "von": plan.get("von"),
        "bis": plan.get("bis"),
        "days": [build_day(d, reg, warns) for d in plan.get("days", [])],
    }


def build_payload(plans: list[dict], exercises: dict, warns: list[str]) -> dict:
    """Payload trägt jede noch nicht abgelaufene Planwoche (aktuelle + nächste).

    Grund (Martin, 23.08.): Wird die Folgewoche am Samstag veröffentlicht,
    darf das Handy die Resttage der laufenden Woche nicht verlieren. Das
    Handy wählt beim Öffnen selbst die Woche, in der HEUTE liegt — die
    Auswahl passiert also zur Anzeigezeit, nicht zur Bauzeit.
    Vergangene Wochen bleiben draußen (keine Wochenrückschau am Handy).
    """
    reg = {e["ex_id"]: e for e in exercises["exercises"]}
    weeks = [build_week(p, reg, warns) for p in plans]
    weeks.sort(key=lambda w: w.get("von") or "")
    # week (Singular) bleibt als erste Woche stehen: Deployment-Check und
    # ältere Leser greifen weiter auf die aktuelle Wochen-ID zu.
    return {"week": weeks[0], "weeks": weeks}


def render_js(payload: dict) -> str:
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    return ("/* GENERIERT von scripts/build_payload.py — nicht von Hand "
            "editieren.\n   Quelle: coach/plan/<id>.json + coach/exercises.json "
            "(datenmodell.md §5). */\n"
            f"const DATA = {body};\n")


def main() -> int:
    ap = argparse.ArgumentParser(description="Trainer 3.0 Handy-Payload-Generator")
    ap.add_argument("--plan", help="Einzelne Planquelle (überspringt die Auswahl)")
    ap.add_argument("--plan-dir", help=f"Verzeichnis der Planquellen (Default: {PLAN_DIR})")
    ap.add_argument("--heute", help="Stichtag YYYY-MM-DD (Default: heute) — Wochen, "
                                    "die davor enden, fallen raus")
    ap.add_argument("--out", help=f"Ausgabedatei (Default Schatten: {DEFAULT_OUT})")
    args = ap.parse_args()

    heute = args.heute or date.today().isoformat()

    if args.plan:
        plan_path = Path(args.plan)
        if not plan_path.is_file():
            print(f"Planquelle nicht gefunden: {plan_path}", file=sys.stderr)
            return 1
        plans = [load_json(plan_path)]
    else:
        plan_dir = Path(args.plan_dir) if args.plan_dir else PLAN_DIR
        plans = []
        for p in sorted(plan_dir.glob("*.json")):
            plan = load_json(p)
            # Abgelaufene Wochen fallen raus — keine Rückschau am Handy.
            if (plan.get("bis") or "") >= heute:
                plans.append(plan)
        if not plans:
            print(f"Keine gültige Planquelle in {plan_dir} (Stichtag {heute})",
                  file=sys.stderr)
            return 1

    exercises = load_json(EXERCISES_JSON)

    warns: list[str] = []
    payload = build_payload(plans, exercises, warns)
    out_path = Path(args.out) if args.out else DEFAULT_OUT
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(render_js(payload), encoding="utf-8")

    print(f"Payload geschrieben: {out_path}")
    for w in payload["weeks"]:
        n_focus = sum(1 for d in w["days"] if d["day_type"] == "own")
        print(f"  Woche {w['id']} ({w['von']}–{w['bis']}) · "
              f"{len(w['days'])} Tage, {n_focus} Fokus-Tage")
    if out_path.resolve() == (REPO / "website" / "data.js").resolve():
        print("  ACHTUNG: schreibt ins LIVE website/data.js (Scharfschaltung).")
    if warns:
        print(f"  LINT-Warnungen ({len(warns)}):")
        for w in warns:
            print(f"    - {w}")
    else:
        print("  Lint sauber.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
