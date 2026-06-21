# System-Architektur (Referenz)

Technischer Überblick des Coaching-Systems. Reine Referenz — die Coaching-Wahrheit steht in `instructions.md`, `profile.json`, `state.json`.

## Hosting & Deployment

- **Website:** training.martinwitte.de, gehostet auf **IONOS** (Homepage Perfect).
- **Stack:** PHP + **MariaDB**, Upload via **SFTP**.
- **Deployment:** GitHub Actions (`.github/workflows/deploy.yml`) bei jedem Push auf `main` → lädt `website/` per `lftp` zu IONOS. Der Workflow liest die erste Wochen-ID aus `website/data.js` und verifiziert sie nach dem Upload.
- **Veröffentlicht wird nur `website/`.** Deployment gilt erst als erfolgreich, wenn die Seite erreichbar ist und die aktuelle Wochen-ID ausliefert.
- IONOS nutzt teils nicht-standardisierte interne Pfade (z. B. AuthUserFile für Basic Auth) — vor `.htaccess`-Änderungen den tatsächlichen Pfad bestätigen, sonst HTTP 500.

## Tagesnotizen & RPE

- Notizen werden per **iOS-Voice-Input** erfasst und in MariaDB gespeichert (`session_notes`).
- `rpe_feel`: subjektive Sessionqualität 1–5 (Emoji-Skala), höher = besser. **Nicht** mit Load-RPE verwechseln.
- Lesen: `website/get_notes.php?from=YYYY-MM-DD&to=YYYY-MM-DD` (Datumsbereich Pflicht, sonst HTTP 400). Schreiben: `website/save_note.php`.

## Wöchentliche Mail-Summary

- IONOS-**Cron** stößt sonntags **20:00** `website/cron_summary.php` an → versendet die Wochen-Zusammenfassung per Mail.

## Datenquellen (extern)

- **WHOOP:** manuell eingefügter Weekly Review + gezielte Detailabfragen. Recovery-Skala: 0–33 rot / 34–66 gelb / 67–100 grün.
- **DreamWOD:** manuell eingefügtes Box-Wochenprogramm (Screenshot/Text).
- **Strava:** Radfahrten über MCP (`list_activities`). Sonntags-Ride oft in mehreren Segmenten → aggregieren.
- **Drive:** stillgelegt — nicht lesen oder schreiben.
