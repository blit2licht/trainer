#!/usr/bin/env python3
"""publish_v30.py — Trainer 3.0, Parallel-Deploy nach website/v30/.

Kopiert den Schatten-Build (V3.0/build/) in das veröffentlichte
Unterverzeichnis website/v30/, das die GitHub-Action als /v30/ auf den
Server spiegelt. Der 2.x-Bestand (website/index.html, website/data.js)
bleibt unangetastet — Parallelbetrieb laut Übergabe 4.4.

Transformationen:
  handy.html → index.html, Endpoint-Pfade ../../website/*.php → ../*.php
  (auf dem Server liegen die PHP-Endpoints im Root, /v30/ eine Ebene tiefer).
  data.js wird unverändert kopiert.

Bricht ab, wenn ein erwarteter Endpoint-Pfad nicht gefunden wird — Schutz
gegen stilles Auseinanderlaufen von Build und Publisher.
"""

from __future__ import annotations

import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
BUILD = REPO / "V3.0" / "build"
OUT = REPO / "website" / "v30"

ENDPOINT_REWRITES = [
    ("'../../website/save_verdict.php'", "'../save_verdict.php'"),
    ("'../../website/get_verdicts.php'", "'../get_verdicts.php'"),
    ("'../../website/save_note.php'", "'../save_note.php'"),
]


def main() -> int:
    html = (BUILD / "handy.html").read_text(encoding="utf-8")
    for old, new in ENDPOINT_REWRITES:
        if old not in html:
            print(f"FEHLER: Endpoint-Pfad nicht gefunden: {old}", file=sys.stderr)
            return 1
        html = html.replace(old, new)

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "index.html").write_text(html, encoding="utf-8")
    (OUT / "data.js").write_text(
        (BUILD / "data.js").read_text(encoding="utf-8"), encoding="utf-8"
    )
    print(f"OK: {OUT / 'index.html'} + data.js geschrieben")
    return 0


if __name__ == "__main__":
    sys.exit(main())
