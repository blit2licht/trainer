# App-Arbeit (website/)

Diese Regeln gelten für Änderungen an der App selbst: `index.html`, die PHP-Endpoints, `sw.js`, Icons und Schriften. Coaching (Wochenplan, Review, Kanon) regelt die `CLAUDE.md` im Wurzelverzeichnis. Diese Datei wird nicht auf den Server geladen (Ausschluss in `.github/workflows/deploy.yml`).

Produktrahmen: `PRODUCT.md`. Gestaltung: `DESIGN.md` und `design/dunkelkammer.html`. Technik: `coach/architecture.md`. Offene Aufträge: `coach/auftraege/`.

## Arbeitsweise

- **App-Arbeit läuft auf einem Zweig**, nie direkt auf `main`. Wochenpläne gehen weiter direkt auf `main`; so kann ein halbfertiger Umbau nie mit einem Plan live gehen. Auf `main` kommt der Zweig erst nach Martins Abnahme.
- **Kein Umbau ohne Auftrag.** Nur bauen, was Martin beauftragt hat oder was unter `coach/auftraege/` freigegeben ist. Keine neuen Ansichten, Auswertungen oder Rückschauen auf Verdacht.
- Jeder Push auf `main`, der `website/` ändert, deployt sofort auf https://training.martinwitte.de.

## Bauregeln

- Die App ist **eine HTML-Datei ohne Build-Schritt**, Vanilla JS, keine Frameworks.
- `data.js` ist generiert und wird nie von Hand editiert. Quelle sind `coach/plan/` und `coach/exercises.json`.
- **Nach jeder Änderung an `index.html`, `sw.js` oder den Icons `python3 scripts/build_payload.py` laufen lassen.** Das Skript setzt den Cache-Stempel `?v=<hash>` neu; ohne ihn hält Safari am iPhone die alte Schale fest.
- `sw.js` ist ein Kill-Switch für den alten 2.0-Worker und bleibt liegen. Die App registriert keinen Service Worker.
- `config.php` existiert nur auf dem Server. Nie anlegen, nie committen.
- **Keine Tabellenänderung ohne Martin.** Jedes `ALTER TABLE` ist Handarbeit auf dem IONOS-Server. Die Altlasten `session_feel` und `blocks_done` bleiben unangetastet (`coach/architecture.md`).
- Kein unnützer Text am Handy: Coach-Prosa erreicht die App nicht, Begründungen sind eingeklappt, es gibt keine Wochenrückschau.

## Abnahme

Eine UI-Änderung ist erst fertig, wenn sie angesehen wurde. Datenchecks reichen nicht.

1. Lokal starten: `python3 -m http.server 8765 --directory website`. Die PHP-Endpoints fehlen lokal; Verdicts laufen dann im Stub-Modus, Notizen laden nicht.
2. Bei 375 px Breite ansehen, jeweils die ganze Seite: Wochenliste, ein Box-Tag, ein Open-Gym-Tag („Fokus-Tag“), die Vorschau auf die nächste Woche.
3. Auf abgeschnittenen Text, Überläufe und Umbrüche achten, mit den längsten echten Inhalten der Woche.
4. Nach dem Deployment dieselben Ansichten live prüfen und den Stempel in der ausgelieferten `index.html` mit dem im Repo vergleichen.
