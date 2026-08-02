#!/usr/bin/env python3
"""Withings Gewichts-Pull → coach/weight.json

Pullt Gewichtsmessungen der letzten 42 Tage von der Withings-API, verdichtet
sie zu Tageswerten + ISO-Wochenschnitten und committet coach/weight.json.

WICHTIG — bewusste Auslassung: Der Withings-Körperfettwert (BIA) wird NICHT
übernommen. Er liegt bei Martin ~10 %-Punkte zu niedrig und ist
steuerungsunbrauchbar (Entscheidung 2026-08-02). Einzige genutzte Größe ist
der Gewichtstrend (Wochenschnitte) für das Körperkompositions-Protokoll.

Auth: OAuth2. Client-Credentials kommen aus Env, Tokens liegen lokal
außerhalb des Repos (~/.config/trainer/withings_token.json, chmod 600) und
rotieren bei jedem Refresh. Nichts davon landet je im Repo oder in Ausgaben.

Einmalige Einrichtung:
    1. App auf https://developer.withings.com registrieren
       (Callback-URL z. B. https://training.martinwitte.de/), Scope: user.metrics
    2. WITHINGS_CLIENT_ID=... WITHINGS_CLIENT_SECRET=... \
           python3 scripts/pull_weight.py --auth
       → URL öffnen, Zugriff erlauben, komplette Redirect-URL (oder nur den
         code=…-Wert) zurück ins Terminal pasten. Tokens werden gespeichert.

Nutzung danach:
    WITHINGS_CLIENT_ID=... WITHINGS_CLIENT_SECRET=... python3 scripts/pull_weight.py
        → weight.json schreiben, committen, auf main pushen
    ... --inspect    → Roh-Beispieldatensatz ausgeben (Mapping verifizieren)
    ... --no-commit  → nur schreiben, nicht committen (Dry-Run)

Env:
    WITHINGS_CLIENT_ID       Pflicht.
    WITHINGS_CLIENT_SECRET   Pflicht.
    WITHINGS_REDIRECT_URI    Optional, Default "https://training.martinwitte.de/"
                             — muss exakt der in der App registrierten URL entsprechen.
"""

import argparse
import datetime as dt
import json
import os
import stat
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

API = "https://wbsapi.withings.net"
AUTHORIZE_URL = "https://account.withings.com/oauth2_user/authorize2"
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PATH = os.path.join(REPO_ROOT, "coach", "weight.json")
TOKEN_PATH = os.path.expanduser("~/.config/trainer/withings_token.json")
DEFAULT_REDIRECT = "https://training.martinwitte.de/"

MEASTYPE_WEIGHT = 1  # kg; Körperfett (Typ 6/8) wird bewusst NICHT abgefragt
WINDOW_DAYS = 42


def post(path: str, data: dict, access_token: str = None) -> dict:
    req = urllib.request.Request(
        API + path,
        data=urllib.parse.urlencode(data).encode(),
        headers={"User-Agent": "trainer-weight-sync/1.0",
                 **({"Authorization": f"Bearer {access_token}"} if access_token else {})},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        sys.exit(f"FEHLER: {path} → HTTP {e.code} {e.reason}")
    except urllib.error.URLError as e:
        sys.exit(f"FEHLER: {path} nicht erreichbar → {e.reason}")
    # Withings liefert Fehler als status != 0 bei HTTP 200.
    if payload.get("status") != 0:
        sys.exit(f"FEHLER: Withings {path} → status {payload.get('status')} "
                 f"({payload.get('error', 'ohne Fehlertext')})")
    return payload.get("body", {})


def creds():
    cid = os.environ.get("WITHINGS_CLIENT_ID")
    secret = os.environ.get("WITHINGS_CLIENT_SECRET")
    if not cid or not secret:
        sys.exit("FEHLER: WITHINGS_CLIENT_ID und/oder WITHINGS_CLIENT_SECRET nicht gesetzt.")
    return cid, secret, os.environ.get("WITHINGS_REDIRECT_URI", DEFAULT_REDIRECT)


def save_tokens(body: dict):
    os.makedirs(os.path.dirname(TOKEN_PATH), exist_ok=True)
    with open(TOKEN_PATH, "w") as f:
        json.dump({"access_token": body["access_token"],
                   "refresh_token": body["refresh_token"],
                   "expires_at": dt.datetime.now(dt.timezone.utc).timestamp()
                                 + int(body.get("expires_in", 0))}, f)
    os.chmod(TOKEN_PATH, stat.S_IRUSR | stat.S_IWUSR)


def auth_flow():
    cid, secret, redirect = creds()
    params = urllib.parse.urlencode({
        "response_type": "code", "client_id": cid, "scope": "user.metrics",
        "redirect_uri": redirect, "state": "trainer",
    })
    print("1. Diese URL im Browser öffnen und Zugriff erlauben:\n")
    print(f"   {AUTHORIZE_URL}?{params}\n")
    pasted = input("2. Komplette Redirect-URL (oder nur den code-Wert) hier einfügen: ").strip()
    code = pasted
    if "code=" in pasted:
        code = urllib.parse.parse_qs(urllib.parse.urlparse(pasted).query)["code"][0]
    body = post("/v2/oauth2", {
        "action": "requesttoken", "grant_type": "authorization_code",
        "client_id": cid, "client_secret": secret,
        "code": code, "redirect_uri": redirect,
    })
    save_tokens(body)
    print(f"OK — Tokens gespeichert in {TOKEN_PATH} (nur Benutzer-lesbar).")


def access_token() -> str:
    if not os.path.exists(TOKEN_PATH):
        sys.exit(f"FEHLER: {TOKEN_PATH} fehlt — einmalig mit --auth einrichten.")
    with open(TOKEN_PATH) as f:
        tok = json.load(f)
    # Refresh-Token rotiert bei jedem Refresh → immer refreshen und neu speichern.
    cid, secret, _ = creds()
    body = post("/v2/oauth2", {
        "action": "requesttoken", "grant_type": "refresh_token",
        "client_id": cid, "client_secret": secret,
        "refresh_token": tok["refresh_token"],
    })
    save_tokens(body)
    return body["access_token"]


def fetch_weights(token: str) -> list:
    start = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=WINDOW_DAYS)
    body = post("/measure", {
        "action": "getmeas", "meastypes": str(MEASTYPE_WEIGHT),
        "category": 1,  # echte Messungen, keine Ziele
        "startdate": int(start.timestamp()),
        "enddate": int(dt.datetime.now(dt.timezone.utc).timestamp()),
    }, access_token=token)
    return body.get("measuregrps", [])


def build(groups: list) -> dict:
    per_day = {}
    for g in groups:
        date = dt.datetime.fromtimestamp(g["date"], dt.timezone.utc).astimezone().date().isoformat()
        for m in g.get("measures", []):
            if m.get("type") != MEASTYPE_WEIGHT:
                continue
            per_day.setdefault(date, []).append(m["value"] * (10 ** m["unit"]))

    days = [{"date": d, "weight_kg": round(sum(v) / len(v), 2)}
            for d, v in sorted(per_day.items())]

    weeks = {}
    for d in days:
        iso = dt.date.fromisoformat(d["date"]).isocalendar()
        weeks.setdefault(f"{iso.year}-W{iso.week:02d}", []).append(d["weight_kg"])
    wochenschnitte = [{"woche": w, "avg_kg": round(sum(v) / len(v), 2), "n_messungen": len(v)}
                      for w, v in sorted(weeks.items())]

    return {
        "generated": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "source": "withings",
        "hinweis": "Nur Gewicht. Withings-Körperfett (BIA) bewusst nicht übernommen — "
                   "bei Martin ~10 %-Punkte zu niedrig, steuerungsunbrauchbar "
                   "(Entscheidung 2026-08-02). Steuerung läuft ausschließlich über "
                   "Wochenschnitt-Vergleich (Ziel −0,3 bis −0,5 kg/Wo ab W34 vs. W33).",
        "days": days,
        "wochenschnitte": wochenschnitte,
    }


def git(*args):
    subprocess.run(["git", "-C", REPO_ROOT, *args], check=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--auth", action="store_true", help="einmalige OAuth-Einrichtung")
    ap.add_argument("--inspect", action="store_true",
                    help="Roh-Beispieldatensatz ausgeben (Mapping verifizieren)")
    ap.add_argument("--no-commit", action="store_true",
                    help="weight.json schreiben, aber nicht committen/pushen")
    args = ap.parse_args()

    if args.auth:
        auth_flow()
        return

    groups = fetch_weights(access_token())

    if args.inspect:
        print(f"=== measuregrps: {len(groups)} Gruppen ===")
        if groups:
            print("Beispiel (neueste Gruppe):")
            print(json.dumps(groups[0], indent=2, ensure_ascii=False)[:3000])
        else:
            print("(leer — keine Messungen im Zeitraum)")
        return

    if not groups:
        sys.exit("FEHLER: keine Gewichtsmessungen im Zeitraum — nichts geschrieben.")

    result = build(groups)
    with open(OUT_PATH, "w") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"geschrieben: {OUT_PATH} — {len(result['days'])} Tage, "
          f"{len(result['wochenschnitte'])} Wochenschnitte")

    if args.no_commit:
        return

    status = subprocess.run(["git", "-C", REPO_ROOT, "status", "--porcelain",
                             "coach/weight.json"], capture_output=True, text=True)
    if not status.stdout.strip():
        print("Keine Änderung gegenüber letztem Stand — kein Commit.")
        return
    git("add", "coach/weight.json")
    git("commit", "-m", f"chore: weight sync {dt.date.today()}")
    git("push", "origin", "main")
    print(f"committet und gepusht: chore: weight sync {dt.date.today()}")


if __name__ == "__main__":
    main()
