#!/usr/bin/env python3
"""Werkstatt-Helper: lokaler Server für den Werkstatt-Modus am Rechner.

Serviert die Werkstatt-Seite unter http://localhost:8125 und nimmt die
Planungs-Aufträge der Seite entgegen (Weekly Recap / Neue Woche planen).
Ein Auftrag wird als Datei nach V3.0/inbox/ geschrieben und in einem neuen
Terminal-Fenster an Claude Code übergeben — rein lokal, keine externe API.
Committen/Pushen passiert erst in der Claude-Code-Session durch Martin.

Start:      python3 scripts/werkstatt_serve.py
Test-Modus: python3 scripts/werkstatt_serve.py --dry-run   (kein Terminal)
"""
import json
import subprocess
import sys
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
INBOX = REPO / "V3.0" / "inbox"
PORT = 8125
DRY_RUN = "--dry-run" in sys.argv

PROMPTS = {
    "recap": (
        "Weekly Recap: Lies {datei} — sie enthält den WHOOP-Recap-Paste und "
        "Besonderheiten aus der Werkstatt. Führe damit den Weekly-Recap-"
        "Trigger aus CLAUDE.md aus (fehlende Daten erfragen, Zustand und "
        "Logbuch aktualisieren)."
    ),
    "plan": (
        "Neue Woche planen: Lies {datei} — sie enthält Einschränkungen und "
        "Besonderheiten der neuen Woche aus der Werkstatt. Führe damit den "
        "Neue-Woche-Trigger aus CLAUDE.md aus (Wellness-/Gewichts-Pull, "
        "DreamWOD, erst Vorschau zeigen)."
    ),
}


def schreibe_auftrag(typ: str, besonderheiten: str, whoop: str) -> Path:
    INBOX.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y-%m-%d-%H%M%S")
    datei = INBOX / f"{stamp}-{typ}.md"
    teile = [
        f"# Werkstatt-Auftrag · {'Weekly Recap' if typ == 'recap' else 'Neue Woche planen'}",
        f"Erstellt: {datetime.now().isoformat(timespec='seconds')} · Quelle: Werkstatt-Seite (lokal)",
        "",
        "## Besonderheiten",
        besonderheiten.strip() or "— keine —",
    ]
    if typ == "recap":
        teile += ["", "## WHOOP-Recap (Paste)", whoop.strip() or "— fehlt, in der Session nachfragen —"]
    datei.write_text("\n".join(teile) + "\n", encoding="utf-8")
    return datei


def starte_claude(typ: str, datei: Path) -> None:
    prompt = PROMPTS[typ].format(datei=datei.relative_to(REPO))
    if DRY_RUN:
        print(f"[dry-run] claude würde starten mit: {prompt}")
        return
    # Neues Terminal-Fenster, Repo-Verzeichnis, interaktive Claude-Code-Session.
    shell = f'cd {REPO} && claude {json.dumps(prompt)}'
    script = f'tell application "Terminal"\nactivate\ndo script {json.dumps(shell)}\nend tell'
    subprocess.Popen(["osascript", "-e", script])


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(REPO), **kw)

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self.send_response(302)
            self.send_header("Location", "/V3.0/werkstatt.html")
            self.end_headers()
            return
        if self.path == "/ping":
            return self._json({"ok": True, "helper": "werkstatt", "dry_run": DRY_RUN})
        super().do_GET()

    def do_POST(self):
        if self.path != "/auftrag":
            self.send_error(404)
            return
        laenge = int(self.headers.get("Content-Length", 0))
        try:
            daten = json.loads(self.rfile.read(laenge) or b"{}")
            typ = daten.get("typ")
            if typ not in PROMPTS:
                return self._json({"ok": False, "fehler": "unbekannter typ"}, 400)
            datei = schreibe_auftrag(typ, daten.get("besonderheiten", ""), daten.get("whoop", ""))
            starte_claude(typ, datei)
            return self._json({"ok": True, "datei": str(datei.relative_to(REPO)), "dry_run": DRY_RUN})
        except Exception as e:  # Fehler gehören auf die Seite, nicht ins Log-Nirwana
            return self._json({"ok": False, "fehler": str(e)}, 500)

    def _json(self, obj, status=200):
        body = json.dumps(obj).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        print(f"[werkstatt] {fmt % args}")


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Werkstatt läuft: http://localhost:{PORT}  (dry-run: {DRY_RUN})")
    server.serve_forever()
