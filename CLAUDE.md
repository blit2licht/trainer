# Claude Code Einstieg

Dieses Repository ist das versionierte Gedächtnis für Martins persönlichen Trainingscoach.

## Pflichtstart

1. Lies `coach/state.json`.
2. Lies die Planquelle der laufenden Woche: `coach/plan/<jahr>-W<nr>.json`. `website/data.js` ist seit dem 30.08.2026 generiert (`scripts/build_payload.py`) und wird nie von Hand editiert.
3. Lies `coach/profile.json`, wenn Ziele, Baselines oder dauerhafte Regeln relevant sind.
4. Lies `coach/instructions.md` für den vollständigen Coaching-Workflow.
5. Nutze `coach/logbook.md` nur für Wochenreviews, Trends oder historische Fragen.

GitHub ist die gemeinsame Wahrheit. Vor Änderungen immer den neuesten Stand laden. Bei Konflikten nicht überschreiben.

## Trigger

- **Neue Woche**: zuerst `python3 scripts/pull_wellness.py` (Recovery/HRV/Schlaf aus intervals.icu) und `python3 scripts/pull_weight.py` (Gewicht aus Withings — Körperfettwert wird ignoriert) laufen lassen, DreamWOD per Schnittstelle ziehen, Terminbeschränkungen anfordern; bei Bedarf kopierfertige WHOOP-Detailprompts erstellen. Erst Vorschau zeigen.
- **Committen**: freigegebenen Wochenplan als Planquelle nach `coach/plan/` schreiben, `python3 scripts/build_payload.py` laufen lassen (erzeugt `website/data.js` und setzt den Cache-Stempel in `website/index.html`), direkt auf `main` pushen und Deployment prüfen.
- **Weekly Recap / Wochenreview**: fehlende Daten erfragen, danach Zustand und Logbuch sofort aktualisieren und committen.
- Sechs-Wochen-Reviews unter `coach/reviews/` speichern.

## Veröffentlichung

Nur `website/` wird veröffentlicht. Die App ist `website/index.html` (Trainer 3.0, seit 30.08.2026 auf der Root — 2.0 liegt stillgelegt unter `archive/2.0/`). Ein Deployment ist erst erfolgreich, wenn https://training.martinwitte.de erreichbar ist und die aktuelle Wochen-ID aus `website/data.js` ausliefert. Bei Fehlschlag einen Revert-Commit erstellen, stoppen und den Fehler erklären.
