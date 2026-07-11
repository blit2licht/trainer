---
name: trainer-debugging-playbook
description: Symptom→Triage-Playbook für Fehler in Martins Trainer-System — Deployment fehlgeschlagen, Website down, HTTP 500, Notizen laden schlägt fehl (get_notes 400/405/503), DreamWOD leer oder false, WHOOP-Zahlen wirken falsch, PWA zeigt alten Plan, iOS-Icon schwarzer Bildschirm, state.json/data.js-Mismatch. Enthält getestete Diagnose-Skripte (scripts/). Use when something is broken and you need triage, a discriminating experiment, or a diagnostic script — "debug", "Fehler", "kaputt", "deployment failed", "website down", "triage", "welcher Check", "warum kommt 400/500/503".
---

# Trainer-Debugging-Playbook

Stand: 2026-07-11. Triage-Playbook für alle bekannten Fehlerklassen dieses Systems. Erst Symptom in der Tabelle suchen, dann das **diskriminierende Experiment** fahren, dann handeln. Doktrin aus `coach/instructions.md` („Quellen- und Verbindungsdisziplin"): Statuscode und Ursache feststellen, korrigieren, erneut versuchen; bleibt es kaputt → **präzise melden** (was geht nicht, welcher Fehler, was wäre als Nächstes nötig). Keine stillen Workarounds.

## Wann diese Skill NICHT die richtige ist

| Situation | Stattdessen |
|---|---|
| Es ist nichts kaputt — normaler Publish/Deploy | `trainer-publish-and-deploy` |
| Normale Nutzung der Datenquellen (DreamWOD/WHOOP/Notizen/Strava) | `trainer-data-sources` |
| „Gab es diesen Fehler schon mal? Warum ist X so?" | `trainer-failure-archaeology` |
| Was als Beweis/bestätigt gilt, Checklisten vor Committen | `trainer-validation-and-qa` |
| Trainingsinhaltliche Diagnose (Plateau, Stagnation) | `trainer-analysis-toolkit` |

## Symptom → Triage

| # | Symptom | Wahrscheinlichste Ursache(n) | Diskriminierendes Experiment | Fix / nächster Schritt |
|---|---|---|---|---|
| 1 | Deploy-Workflow rot („Verify deployment" failed) | (a) SFTP-Upload scheiterte, (b) Site liefert alte Wochen-ID, (c) data.js-Format bricht die sed-Extraktion | `scripts/verify_deploy.sh` — Exit 2 = lokales Extraktionsproblem, 3 = Netz/Site down, 4 = Site up aber stale. Actions-Log lesen: welcher Step scheiterte? | Bei (c): `python3 scripts/validate_data.py`. Achtung: der Auto-Revert-Bot hat evtl. schon revertiert — **immer zuerst** `git fetch origin main && git log origin/main -3` prüfen, bevor du weiterarbeitest |
| 2 | Website komplett HTTP 500 | `.htaccess`-Änderung (Hauptverdächtiger — IONOS nutzt nicht-standardisierte interne Pfade) | `git log -p -- website/.htaccess` — was wurde zuletzt geändert? `.htaccess` halbieren/bisektieren | Änderung revertieren, deployen; echten IONOS-Pfad erst bestätigen (dafür entstand `website/pfad.php`: gibt `__DIR__` aus). Historie: AuthUserFile-Vorfall 2026-06-21, Commits `c5de0bc`→`0b53b9b`→`b27cc8e`→`cd6083f`→`840903d` |
| 3 | `get_notes.php` liefert 400 | `from`/`to` fehlt oder nicht `YYYY-MM-DD` (Regex `^\d{4}-\d{2}-\d{2}$`, verifiziert in der PHP-Quelle) | `scripts/check_notes_api.sh 2026-07-06 2026-07-12` | Datumsbereich korrekt mitgeben. Datumsbereich ist PFLICHT |
| 4 | `get_notes.php`/`save_note.php` liefert 405 | Falsche HTTP-Methode: get_notes nur GET, save_note nur POST | Methode im Aufruf prüfen | Methode korrigieren |
| 5 | Notes-API liefert 503 | Server-`config.php` fehlt/ungültig/unvollständig ODER DB down (JSON-Body unterscheidet: „configuration missing/invalid/incomplete" vs. „Database unavailable") | `scripts/check_notes_api.sh` — liest den Body aus | Serverseitiges Problem: melden, nicht raten. `config.php` liegt NUR auf dem IONOS-Server |
| 6 | Notes-API 200, aber `notes: []` | Kein Fehler — keine Notizen im Zeitraum | Bekannt gefüllten Zeitraum abfragen (z. B. W27: 2026-06-29 bis 2026-07-05) | Als „keine Daten" behandeln, nichts erfinden |
| 7 | DreamWOD-Fetch liefert `false` oder leeres `workouts[]` bei HTTP 200 | Mehrdeutig: Soft-Block (Drosselung nach schnellen Serien) ODER Programm noch nicht veröffentlicht | **Bekannt veröffentlichte Vergangenheitswoche nachziehen**: auch leer → Drosselung (warten, einzeln wiederholen); kommt sie mit Daten → Zielwoche hängt noch nicht | Bei Drosselung: ~30 s Abstand, eine Woche pro Request. Bei „hängt noch": später ziehen oder Martin fragen. Hart kaputt = NUR HTTP ≠ 200 oder Parse-Fehler |
| 8 | WHOOP-Gewichte krumm (48, 43 kg) | WHOOP rundet auf ganze kg; Martin lädt real nur 1,25-kg-Vielfache | Ist der Wert ±0,5 kg neben einem 1,25-Vielfachen? | Auf nächstes 1,25-Vielfaches zurücklesen (48→47,5; 43→42,5). Nie wörtlich übernehmen |
| 9 | WHOOP-Auto-Log widerspricht freier Notiz | Auto-Tracking-Fehler (belegte Fälle: W26 BMU 13 vs. 12; W27 Front Squat als „Back Squat" 95 vs. real 100 kg) | Notiztext gegen Auto-Log halten | Martins expliziter Notiz-Log gewinnt. Konflikt im Review MARKIEREN, nie still auflösen |
| 10 | PWA/Handy zeigt alten Plan | Service-Worker-Cache (`training-v1`) — aber sw.js ist network-first und `.htaccess` setzt `no-cache` auf index.html/data.js/sw.js/manifest.json, online kommt also frischer Inhalt | `curl -s https://training.martinwitte.de/data.js \| grep '"2026-W'` — liefert die Site die neue Woche? | Ja → Client offline oder App neu öffnen (Pull-to-refresh); Nein → Deploy-Problem, Symptom 1 |
| 11 | iOS-Homescreen-Icon öffnet schwarzen Bildschirm | HTTP Basic Auth (inkompatibel mit iOS-Standalone-Modus) | Wurde Auth in `.htaccess` eingeführt? | Entfernen. Entschieden am 2026-06-21 (Commit `840903d`): keine Auth, stattdessen `robots.txt` |
| 12 | `state.json` und `data.js` widersprechen sich (Wochen-ID/Zeitraum) | Unvollständiger Wochen-Rollover | `python3 scripts/validate_data.py` (prüft Konsistenz explizit) | Konsistent nachziehen — welche Quelle stimmt, entscheidet der aktuelle Auftrag/Martin; nicht raten |
| 13 | favicon-Requests laufen ins Leere / auf PHP | Stale `.htaccess`-RewriteRules auf `icons/favicon.php` + `icons/apple-touch-icon.php` — beide 2026-06-21 gelöscht (Commit `4b429fc`), Rewrites blieben | `grep favicon website/.htaccess` vs. `ls website/icons/` | Bekannte Schwachstelle (siehe `trainer-architecture-contract`). Serverseitig existieren die PHP-Dateien evtl. noch: lftp-mirror löscht NIE (kein `--delete`) |

## Fallen, die real Zeit gekostet haben

- **`.htaccess` auf IONOS blind ändern.** Basic Auth eingeführt → Deploy-Verify rot → Bot-Auto-Revert; „korrigierter" AuthUserFile-Pfad → wieder rot → wieder Auto-Revert. Zwei Auto-Reverts an einem Vormittag (2026-06-21, `0b53b9b`, `cd6083f`). Lehre: IONOS-interne Pfade erst verifizieren (`pfad.php`), und Auth ist mit der iOS-PWA grundsätzlich inkompatibel.
- **DreamWOD im Batch ziehen.** Schnelle Request-Serien → Soft-Block: HTTP 200 mit `false`/leerem `workouts[]`, sieht aus wie „keine Daten". Lehre: eine Woche pro Request, ~30 s Abstand, Mehrdeutigkeit per Vergangenheitswoche auflösen (dokumentiert in `47e3d7f`).
- **Deploy-Verify-Timing.** Der Verify-Loop probiert 5× mit 12 s Pause. Ein einzelner manueller curl direkt nach dem Push kann noch die alte Datei sehen — das ist kein Fehler, sondern Propagation. Erst nach ~1 min urteilen.
- **Auto-Revert übersehen.** Nach einem roten Deploy liegt auf `origin/main` evtl. schon ein Bot-Revert-Commit. Wer das übersieht und lokal weiterarbeitet, baut auf falschem Stand. Immer erst `git fetch` + Log lesen. Achtung: Ein Commit, dessen Message mit „Revert" beginnt, wird bei Verify-Fehlschlag NICHT erneut auto-revertiert — ein kaputter Revert bleibt liegen und braucht manuelle Korrektur.

## Diagnose-Skripte (`scripts/`)

Alle drei sind getestet (Stand 2026-07-11: Parse-/Lokal-Logik ja; Netzzugriffe hängen von der Umgebung ab).

| Skript | Zweck | Aufruf | Exit-Codes |
|---|---|---|---|
| `verify_deploy.sh` | Liefert die Live-Site die erwartete Wochen-ID? Nutzt EXAKT den sed-Ausdruck aus deploy.yml | `bash scripts/verify_deploy.sh` (optional `DEPLOY_URL=…`) | 0 PASS · 2 lokal (data.js/ID) · 3 Netz · 4 stale |
| `check_notes_api.sh` | Notes-API-Status + Ursachen-Übersetzung laut PHP-Quelle | `bash scripts/check_notes_api.sh [FROM TO]` (Default: aktuelle Woche Mo–So) | 0 = HTTP 200 · 1 = anderer Status · 3 = curl-Fehler |
| `validate_data.py` | Strukturvalidierung data.js: ≤4 Wochen, neueste zuerst, 7 Tage, isoDate lückenlos, type-Werte, state.json-Konsistenz, deploy.yml-sed-Kompatibilität | `python3 scripts/validate_data.py` | 0 = alle PASS · 1 = mindestens ein FAIL |

Referenzlauf `validate_data.py` gegen das Repo (2026-07-11): **27 PASS, 0 FAIL** (4 Wochen 2026-W28…W25).

## Eskalation

Nach Debuggen weiterhin kaputt → an Martin melden mit: (1) was nicht geht, (2) exakter Fehler/Statuscode, (3) was du ausprobiert hast, (4) was als Nächstes nötig wäre. Nicht still umgehen, nichts erfinden (Kanon-Regeln 4–5 der Quellendisziplin).

## Provenanz und Wartung

| Behauptung | Quelle | Re-Verifikation |
|---|---|---|
| Notes-API-Statuscodes 400/405/503 | `website/get_notes.php`, `website/save_note.php` | `grep -n "http_response_code" website/*.php` |
| Verify-Loop 5×12 s, sed-Extraktion, Auto-Revert mit „Revert"-Guard | `.github/workflows/deploy.yml` | `grep -n "attempt\|sleep\|Revert" .github/workflows/deploy.yml` |
| Zwei Auto-Reverts am 2026-06-21 | Git-Historie | `git log --oneline --author="github-actions" --all` |
| Stale favicon-Rewrites | `.htaccess` vs. `website/icons/` | `grep favicon website/.htaccess; ls website/icons/` |
| lftp-mirror ohne `--delete` | deploy.yml | `grep -n "mirror" .github/workflows/deploy.yml` |
| DreamWOD-Soft-Block-Semantik | `coach/instructions.md` § Referenzen | `grep -n "Soft-Block" coach/instructions.md` |
| WHOOP-Rundung / 1,25-Vielfache | `coach/instructions.md` § Lasten und RPE | `grep -n "1,25" coach/instructions.md` |
| SW network-first, Cache `training-v1`, no-cache-Header | `website/sw.js`, `website/.htaccess` | `head -5 website/sw.js; grep -n Cache-Control website/.htaccess` |
| Skript-Referenzlauf 27 PASS | dieses Repo, 2026-07-11 | `python3 .claude/skills/trainer-debugging-playbook/scripts/validate_data.py` |
