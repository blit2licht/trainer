# Claude Code Einstieg

Dieses Repository ist das versionierte Gedächtnis für Martins persönlichen Trainingscoach.

## Pflichtstart

1. Lies `coach/state.json`.
2. Lies `website/data.js`.
3. Lies `coach/profile.json`, wenn Ziele, Baselines oder dauerhafte Regeln relevant sind.
4. Lies `coach/instructions.md` für den vollständigen Coaching-Workflow.
5. Nutze `coach/logbook.md` nur für Wochenreviews, Trends oder historische Fragen.

GitHub ist die gemeinsame Wahrheit. Vor Änderungen immer den neuesten Stand laden. Bei Konflikten nicht überschreiben.

## Trigger

- **Neue Woche**: DreamWOD-Screenshot, WHOOP-Wochenreview und Terminbeschränkungen anfordern; bei Bedarf kopierfertige WHOOP-Detailprompts erstellen. Erst Vorschau zeigen.
- **Committen**: freigegebenen Wochenplan schreiben, direkt auf `main` pushen und Deployment prüfen.
- **Weekly Recap / Wochenreview**: fehlende Daten erfragen, danach Zustand und Logbuch sofort aktualisieren und committen.
- Sechs-Wochen-Reviews unter `coach/reviews/` speichern.

## Veröffentlichung

Nur `website/` wird veröffentlicht. Ein Deployment ist erst erfolgreich, wenn https://training.martinwitte.de erreichbar ist und die aktuelle Wochen-ID aus `website/data.js` ausliefert. Bei Fehlschlag einen Revert-Commit erstellen, stoppen und den Fehler erklären.
