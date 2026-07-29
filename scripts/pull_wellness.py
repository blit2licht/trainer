#!/usr/bin/env python3
"""intervals.icu Wellness-Pull → coach/wellness.json

Pullt Wellness- und Aktivitätsdaten der letzten 14 Tage von intervals.icu,
verdichtet sie ins Zielformat und committet coach/wellness.json auf main.

Auth: Basic Auth, Username ist der literale String "API_KEY", Passwort kommt
aus der Env-Variable INTERVALS_API_KEY. Der Key landet nie im Repo und wird
nie ausgegeben.

Nutzung:
    INTERVALS_API_KEY=... python3 scripts/pull_wellness.py --inspect
        → Roh-Feldnamen + je ein Beispieldatensatz beider Endpoints
          (Pflichtschritt vor der ersten Validierung: Mapping gegen die
          tatsächlichen Feldnamen prüfen, nicht raten)
    INTERVALS_API_KEY=... python3 scripts/pull_wellness.py
        → wellness.json schreiben, committen, auf main pushen
    ... --no-commit
        → nur schreiben, nicht committen (Dry-Run)

Env:
    INTERVALS_API_KEY   Pflicht. Persönlicher API-Key.
    INTERVALS_ATHLETE   Optional, Default "0" (= eigener Account).
"""

import argparse
import base64
import datetime as dt
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request

BASE = "https://intervals.icu/api/v1/athlete/{athlete}"
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PATH = os.path.join(REPO_ROOT, "coach", "wellness.json")

# Kandidaten-Feldnamen (Reihenfolge = Priorität). Vor der ersten produktiven
# Nutzung per --inspect gegen die echten API-Antworten verifizieren.
WELLNESS_FIELDS = {
    "date": ["id", "date"],
    "recovery": ["readiness", "recovery"],
    "hrv": ["hrv"],
    "rhr": ["restingHR", "resting_hr"],
    "sleep_secs": ["sleepSecs", "sleep_secs"],
    "sleep_score": ["sleepScore", "sleep_score", "sleepQuality"],
}
ACTIVITY_FIELDS = {
    "date": ["start_date_local", "start_date"],
    "type": ["type"],
    "distance_m": ["distance", "icu_distance"],
    "moving_secs": ["moving_time", "icu_moving_time", "elapsed_time"],
    "avg_hr": ["average_heartrate", "icu_average_hr", "avg_hr"],
}
RIDE_TYPES = {"Ride", "VirtualRide", "GravelRide", "MountainBikeRide", "EBikeRide"}


def api_get(path: str, key: str, athlete: str):
    url = BASE.format(athlete=athlete) + path
    token = base64.b64encode(f"API_KEY:{key}".encode()).decode()
    req = urllib.request.Request(url, headers={"Authorization": f"Basic {token}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        sys.exit(f"FEHLER: {url} → HTTP {e.code} {e.reason}")
    except urllib.error.URLError as e:
        sys.exit(f"FEHLER: {url} nicht erreichbar → {e.reason}")


def pick(record: dict, candidates: list):
    """Erstes vorhandenes, nicht-None Feld aus der Kandidatenliste; sonst None."""
    for name in candidates:
        if record.get(name) is not None:
            return record[name]
    return None


def warn_missing(records: list, fieldmap: dict, label: str):
    """Meldet Zielfelder, deren Kandidaten in KEINEM Datensatz vorkommen."""
    if not records:
        return
    seen = set()
    for r in records:
        seen.update(k for k, v in r.items() if v is not None)
    for target, candidates in fieldmap.items():
        if not seen.intersection(candidates):
            print(f"WARNUNG [{label}]: kein Feld für '{target}' gefunden "
                  f"(Kandidaten: {', '.join(candidates)}) — Wert bleibt null.")


def build(wellness_raw: list, activities_raw: list) -> dict:
    days = []
    for w in sorted(wellness_raw, key=lambda r: str(pick(r, WELLNESS_FIELDS["date"]) or "")):
        date = pick(w, WELLNESS_FIELDS["date"])
        if date is None:
            continue
        sleep_secs = pick(w, WELLNESS_FIELDS["sleep_secs"])
        days.append({
            "date": str(date)[:10],
            "recovery": pick(w, WELLNESS_FIELDS["recovery"]),
            "hrv": pick(w, WELLNESS_FIELDS["hrv"]),
            "rhr": pick(w, WELLNESS_FIELDS["rhr"]),
            "sleep_h": round(sleep_secs / 3600, 2) if sleep_secs else None,
            "sleep_score": pick(w, WELLNESS_FIELDS["sleep_score"]),
        })

    rides = []
    for a in activities_raw:
        if pick(a, ACTIVITY_FIELDS["type"]) not in RIDE_TYPES:
            continue
        date = pick(a, ACTIVITY_FIELDS["date"])
        dist = pick(a, ACTIVITY_FIELDS["distance_m"])
        secs = pick(a, ACTIVITY_FIELDS["moving_secs"])
        avg_hr = pick(a, ACTIVITY_FIELDS["avg_hr"])
        rides.append({
            "date": str(date)[:10] if date else None,
            "distance_km": round(dist / 1000, 1) if dist else None,
            "moving_time_min": round(secs / 60) if secs else None,
            "avg_hr": round(avg_hr) if avg_hr else None,
        })
    rides.sort(key=lambda r: r["date"] or "")

    return {
        "generated": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "source": "intervals.icu",
        "days": days,
        "rides": rides,
    }


def git(*args):
    subprocess.run(["git", "-C", REPO_ROOT, *args], check=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--inspect", action="store_true",
                    help="Roh-Feldnamen + Beispieldatensatz beider Endpoints ausgeben")
    ap.add_argument("--no-commit", action="store_true",
                    help="wellness.json schreiben, aber nicht committen/pushen")
    args = ap.parse_args()

    key = os.environ.get("INTERVALS_API_KEY")
    if not key:
        sys.exit("FEHLER: Env-Variable INTERVALS_API_KEY ist nicht gesetzt.")
    athlete = os.environ.get("INTERVALS_ATHLETE", "0")

    today = dt.date.today()
    oldest = today - dt.timedelta(days=14)
    rng = f"?oldest={oldest}&newest={today}"

    wellness = api_get("/wellness" + rng, key, athlete)
    activities = api_get("/activities" + rng, key, athlete)

    if args.inspect:
        for label, data in (("wellness", wellness), ("activities", activities)):
            print(f"\n=== {label}: {len(data)} Datensätze ===")
            if data:
                keys = sorted({k for r in data for k in r if r[k] is not None})
                print("Belegte Felder:", ", ".join(keys))
                print("Beispiel (neuester Datensatz):")
                print(json.dumps(data[-1], indent=2, ensure_ascii=False)[:3000])
            else:
                print("(leer — ggf. liegen noch keine Daten im Zeitraum)")
        return

    warn_missing(wellness, WELLNESS_FIELDS, "wellness")
    warn_missing(activities, {k: v for k, v in ACTIVITY_FIELDS.items() if k != "avg_hr"},
                 "activities")

    result = build(wellness, activities)
    with open(OUT_PATH, "w") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"geschrieben: {OUT_PATH} — {len(result['days'])} Tage, {len(result['rides'])} Rides")

    if args.no_commit:
        return

    status = subprocess.run(["git", "-C", REPO_ROOT, "status", "--porcelain",
                             "coach/wellness.json"], capture_output=True, text=True)
    if not status.stdout.strip():
        print("Keine Änderung gegenüber letztem Stand — kein Commit.")
        return
    git("add", "coach/wellness.json")
    git("commit", "-m", f"chore: wellness sync {today}")
    git("push", "origin", "main")
    print(f"committet und gepusht: chore: wellness sync {today}")


if __name__ == "__main__":
    main()
