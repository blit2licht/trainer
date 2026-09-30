# Trainer

Versioniertes Gedächtnis und Veröffentlichungsoberfläche für Martins KI-gestützten Trainingscoach.

- `coach/`: Regeln (`instructions.md`), Profil, aktueller Zustand, Wochenpläne (`plan/`), Logbuch, Reviews und die technische Referenz (`architecture.md`)
- `website/`: die ausgelieferte App (Trainer 3.0) mit Wochenplan, Verdicts und Notizen; `data.js` ist generiert
- `scripts/`: Payload-Generator, Wellness- und Gewichts-Pull, Video-Analyse, Icons
- `design/`, `DESIGN.md`, `PRODUCT.md`, `personas/`: Gestaltung und Produktrahmen
- `CLAUDE.md`, `AGENTS.md`: Einstieg für Claude Code und Codex

Die App zeigt die laufende und die nächste Woche. Recovery, Gewicht und das Box-Programm werden per Skript bzw. Schnittstelle gezogen; in GitHub landen nur verdichtete Ergebnisse.

Die echte `website/config.php` liegt ausschließlich auf dem IONOS-Server und wird beim Deployment weder überschrieben noch gelöscht.
