---
name: trainer-architecture-contract
description: >
  Architektur-Vertrag des Trainer-Systems: System-Übersicht, tragende
  Design-Entscheidungen mit Begründung, Invarianten und bekannte Schwachstellen.
  Nutzen bei: "Architektur", "Invarianten", "system overview", "warum ist X so
  gebaut", "design decision", "was darf ich nicht kaputt machen", "wie hängt
  alles zusammen", "isoDate", "service worker", "sw.js", "data.js Struktur",
  "deploy verify", "auto-revert", "config.php", "Basic Auth", "warum kein
  Build-Step", "warum keine Datenbank für den Plan", "Schwachstellen",
  "known issues", "tech debt", "before you change".
---

# Architektur-Vertrag: Design-Entscheidungen, Invarianten, Schwachstellen

Ergänzt `coach/architecture.md` (Kurzreferenz Hosting/Deployment) um das
**Warum** und das **Was-darf-nicht-brechen**. Bei Widerspruch gilt:
`coach/instructions.md` > `CLAUDE.md` > `coach/architecture.md` > diese Skill.

Stand aller volatilen Fakten: **2026-07-11**.

## 1. Systemlandkarte

```
Martin (Chat) ──> Claude-Session ──git push──> GitHub main
                       │                          │
                       │ liest state.json,        │ Push-Trigger
                       │ data.js, profile.json    ▼
                       │                  GitHub Actions deploy.yml
   Manuelle Inputs ────┤                  (lftp SFTP-Mirror website/ → /,
   • WHOOP-Review      │                   curl-Verify Wochen-ID,
   • DreamWOD-Programm │                   Auto-Revert bei Fehlschlag)
                       │                          │
   Strava MCP ─────────┘                          ▼
   (list_activities)                IONOS (Homepage Perfect)
                                    https://training.martinwitte.de
                                    • index.html + data.js (PWA)
                                    • get_notes.php / save_note.php
                                    • MariaDB `session_notes`
                                    • cron_summary.php (So 20:00 → Mail)
                                    • config.php (NUR auf dem Server)
                                          │
                                          ▼
                              Martins iPhone (Standalone-PWA)
                              Plan lesen · Notizen + rpe_feel
                              per Voice-Input in die DB schreiben
```

| Komponente | Datei(en) | Rolle |
|---|---|---|
| Coaching-Kanon | `coach/instructions.md`, `coach/profile.json` | Regeln, Ziele — privat im Repo |
| Aktueller Zustand | `coach/state.json` | Schlanker Ist-Zustand, Lastreferenzen, Flags |
| Historie | `coach/logbook.md`, `coach/reviews/`, `coach/decisions.md` | Verdichtete Wochen-/Review-Einträge |
| Veröffentlichter Plan | `website/data.js` | `const DATA` mit `weeks[]`, max. 4 Wochen |
| PWA | `website/index.html`, `manifest.json`, `sw.js` | Single-File-App ohne Build-Step |
| Notes-API | `website/get_notes.php`, `save_note.php` | Lesen/Schreiben `session_notes` (MariaDB) |
| Wochenmail | `website/cron_summary.php` | IONOS-Cron sonntags 20:00 |
| Server-Config | `config.php` (nicht im Repo) | DB-Zugang, Keys — nur auf IONOS |
| Deploy | `.github/workflows/deploy.yml` | Push auf `main` → Mirror → Verify → ggf. Revert |

## 2. Invarianten

Jede Zeile: Regel → Warum → Was bricht bei Verletzung. Quellen sind im Repo
verifiziert (siehe Provenanz-Tabelle unten).

| # | Invariante | Warum | Bruchfolge |
|---|---|---|---|
| I1 | GitHub ist die einzige Wahrheit. Jede Session lädt den neuesten Stand; Chat-Historie ist nie Quelle (`CLAUDE.md`, `instructions.md` §Pflichtstart: „Verlasse dich nicht auf Chat-Historie. Vor jeder Änderung den neuesten GitHub-Stand laden."). | Mehrere Sessions/Geräte arbeiten am selben Zustand; nur das Repo ist versioniert und konfliktauflösbar. | Plan wird auf veralteten Zahlen gebaut; Commits überschreiben stillschweigend fremde Änderungen. |
| I2 | Nur `website/` wird veröffentlicht; `coach/` bleibt privat im Repo. (`deploy.yml`: Mirror-Quelle ist `./website/`; `CLAUDE.md` §Veröffentlichung.) | Trennung Coaching-Interna (Gesundheitsdaten, Steuerung) vom öffentlichen Plan. | `coach/`-Inhalte landen auf einem öffentlich erreichbaren Server. |
| I3 | `data.js` hält max. 4 Wochen, **neueste zuerst** (Kopfkommentar: „Neue Woche = neues Objekt VORNE in weeks[]"; `instructions.md` §Veröffentlichung: „maximal vier Wochen behalten"). | Der Deploy-Verifier extrahiert die **erste** `id: "…"`-Zeile (`deploy.yml`: `sed … | head -n 1`) und prüft sie gegen das ausgelieferte `data.js`. | Neue Woche hinten angefügt → Verifier prüft eine **alte** ID, die auch in einer veralteten Server-Datei vorkommt → Verifikation wertlos, kaputte Deploys gelten als grün. |
| I4 | Jedes Tages-Objekt trägt `isoDate` (Kopfkommentar `data.js`: „isoDate-Felder sind Pflicht"). Es ist der Join-Key zu `session_notes.note_date` (`index.html`: `weekNotes[n.note_date]`, `note_date: isoDate` beim Speichern, alle Note-DOM-IDs `np-/ntext-/nsave-${isoDate}`). | Notizen und Plan leben in getrennten Systemen (DB vs. statische Datei); das Datum ist die einzige Verbindung. | Notes-UI der Tageskarte bricht: Notizen werden nicht zugeordnet, Speichern schreibt falsche/leere Schlüssel, „Heute"-Erkennung (`d.isoDate === today`) versagt. |
| I5 | `config.php` existiert nur auf dem Server. Drei Schutzschichten: `.gitignore` (Zeilen `website/config.php`, `config.php`), `deploy.yml` (`--exclude-glob config.php`, `--exclude-glob config.template.php`), `.htaccess` (`<Files "config.php"> Require all denied`). | DB-Zugangsdaten und Keys dürfen weder ins Repo noch überschrieben noch ausgeliefert werden. | Commit: Secrets in der Git-Historie. Deploy ohne Exclude: Server-Config wird gelöscht/überschrieben → Notes-API und Cron tot. Ohne htaccess-Denial: Secrets per HTTP abrufbar. |
| I6 | Kalenderwochen sind Montag–Sonntag (`instructions.md` §Trainingsmodell; `cron_summary.php`: `strtotime('monday this week')`). | Wochenplan, Wochenmail und Reviews müssen denselben Zeitraum meinen. | Cron-Mail und Plan zeigen verschiedene Wochen; Reviews vergleichen falsche Zeiträume. |
| I7 | `state.json` bleibt schlank (aktueller Zustand, Lastreferenzen, akute Flags); Historie gehört ins `logbook.md`; Rohdaten bleiben in WHOOP/Strava/DB (`instructions.md` §Datenmodell: „Keine WHOOP-, Strava- oder Satz-Rohdaten nach GitHub kopieren"). | Der Pflichtstart jeder Session liest `state.json` komplett — er muss klein und aktuell bleiben; Rohdaten sind woanders bereits persistent. | Aufgeblähter State → Sessions übersehen Flags; Rohdaten im Repo → Datenschutz- und Konsistenzproblem. |
| I8 | Veröffentlichung nur nach explizitem Trigger „Committen". Erfolg = Website erreichbar **und** neue Wochen-ID wird ausgeliefert (`instructions.md` §Veröffentlichung; `CLAUDE.md`). Bei Fehlschlag: Revert-Commit, stoppen, Fehler erklären. | Vorschau-Iteration ohne versehentliche Publikation; „gepusht" ≠ „live" (Cache, SFTP, IONOS). | Halbfertige Pläne live; Erfolgsmeldung ohne Live-Prüfung täuscht einen Zustand vor, den Martins Handy nicht sieht. |
| I9 | Entscheidungshierarchie (Apex, `instructions.md`): 1. Gesundheit/Robustheit/langfristige Trainingsfähigkeit → 2. aktuelle Leistungsziele/Fokus-Tage → 3. Box-Auswahl/Mesocycle-Logik → 4. Recovery/Schlaf/Lebensstress/akute Signale → 5. Radfahrt (optionales Socializing) → 6. kurzfristige Übungswünsche. | Ohne feste Rangfolge gewinnt bei Konflikten der lauteste Kurzfrist-Wunsch. | Programmierung optimiert Nebensächliches gegen das Apex-Ziel. |

## 3. Tragende Design-Entscheidungen mit Begründung

Kennzeichnung: **[dokumentiert]** = Begründung steht in Repo/Commit;
**[abgeleitet, nicht dokumentiert]** = plausible Rekonstruktion aus dem Code.

| Entscheidung | Begründung | Beleg |
|---|---|---|
| Plan als statisches `data.js` statt DB | Versionierbar, diffbar pro Woche, und der Deploy-Verifier kann die Wochen-ID direkt aus der ausgelieferten Datei greppen. **[abgeleitet, nicht dokumentiert]** — dokumentiert ist nur der Mechanismus („Nur diese Datei wächst pro Woche", Kopfkommentar). | `website/data.js`, `deploy.yml` Verify-Step |
| Single-File-PWA ohne Build-Step | Kein Toolchain/Dependency-Rot, das zwischen Wochen brechen kann; jede Claude-Session kann `index.html` direkt editieren. **[abgeleitet, nicht dokumentiert]** | `website/index.html` (HTML+CSS+JS in einer Datei), kein package.json im Repo |
| Network-first Service Worker (`training-v1`) + `Cache-Control: no-cache` auf `index.html/data.js/sw.js/manifest.json` | **[dokumentiert]** `sw.js`-Kommentar: „Online kommt immer der frische Plan, offline der zuletzt gesehene"; `.htaccess`-Kommentar: „immer revalidieren, damit Planänderungen sofort ankommen". Planänderungen müssen sofort auf dem Handy ankommen; offline gibt es den letzten Stand. | `website/sw.js` Zeilen 1–3, `website/.htaccess` |
| Auto-Revert im Deploy (Verify schlägt fehl → Bot revertet HEAD, außer die Commit-Message beginnt mit „Revert") | **[dokumentiert durch Verhalten]** Ein kaputter Publish heilt sich selbst, bevor Martin es merkt. Beleg: am 2026-06-21 zweimal real gefeuert — `0b53b9b` (Revert „feat: HTTP Basic Auth für gesamte Seite", 08:15 UTC) und `cd6083f` (Revert „fix: korrekter AuthUserFile-Pfad für IONOS", 08:24 UTC), beide von `github-actions[bot]`. Die Revert-Ausnahme verhindert Endlos-Revert-Schleifen. | `deploy.yml` Steps `verify`/`Revert failed deployment`; `git log` |
| Notizen in Server-DB (MariaDB `session_notes`), nicht im Repo | **[dokumentiert]** `instructions.md`: Rohdaten gehören nicht nach GitHub; versioniert werden nur verdichtete Erkenntnisse. Zusätzlich praktisch: iOS-Voice-Input schreibt direkt via `save_note.php`, ohne Git-Roundtrip. | `instructions.md` §Datenmodell, `coach/architecture.md` §Tagesnotizen |
| Keine Authentifizierung, nur `robots.txt` (`Disallow: /`) | **[dokumentiert]** Commit `840903d`: „iOS Standalone-Mode (Add to Home Screen) ist mit Basic Auth inkompatibel → schwarzer Screen beim Öffnen des iPhone-Homescreen-Icons. Seite ist nicht öffentlich verlinkt/indexiert; robots.txt sperrt Crawler aus." Security-by-obscurity ist hier eine bewusste, dokumentierte Abwägung — **nicht** „vergessen". Wer Auth nachrüsten will, muss zuerst das iOS-Standalone-Problem lösen. | Commit `840903d`, `website/robots.txt` |

## 4. Bekannte Schwachstellen (Stand: 2026-07-11)

| # | Schwachstelle | Detail |
|---|---|---|
| W1 | Verwaiste `.htaccess`-RewriteRules | `.htaccess` rewritet `favicon.ico`/`apple-touch-icon*.png` weiterhin auf `/icons/favicon.php` und `/icons/apple-touch-icon.php` — beide `.php`-Dateien wurden in `4b429fc` (2026-06-21) aus dem Repo gelöscht. Da der lftp-Mirror ohne `--delete` läuft (W3), können die Server-Kopien noch existieren und Alt-Icons ausliefern; existieren sie nicht, laufen die Rewrites ins Leere (404). |
| W2 | Debug-Endpoint `website/pfad.php` | Eine Zeile `<?php echo __DIR__; ?>` — verrät den internen IONOS-Serverpfad an jeden Aufrufer. Wurde für das AuthUserFile-Debugging angelegt (`474a8e5`, 2026-06-21), ist noch im Repo und wird bei jedem Deploy mit ausgeliefert. |
| W3 | Deploy löscht nie Server-Orphans | `deploy.yml` nutzt `mirror --reverse` ohne `--delete`. Aus dem Repo entfernte Dateien bleiben auf dem Server liegen (siehe W1, W2). Vorsicht: `--delete` naiv nachrüsten würde `config.php` und die DB-fremden Serverdateien löschen — Excludes vorher prüfen. |
| W4 | Keine automatisierten Tests | Einzige automatische Prüfung ist der Deploy-Verifier (Wochen-ID in `data.js` erreichbar). Kein Test für `index.html`-Rendering, Notes-API, `isoDate`-Vollständigkeit oder JSON-Validität der `coach/`-Dateien. |
| W5 | `cron_summary.php` akzeptiert Legacy-`API_KEY` | Zeile 10: `CRON_KEY` bevorzugt, `API_KEY` bleibt „Übergangs-Fallback". Solange der Fallback existiert, schützt eine `CRON_KEY`-Rotation nicht, wenn `API_KEY` geleakt ist. |
| W6 | Single Point of Failure IONOS | Hosting, MariaDB, Cron und Mail-Versand hängen an einem IONOS-Vertrag („Homepage Perfect"). Fällt IONOS aus: kein Plan-Abruf (außer SW-Cache), keine Notizen, keine Wochenmail. Kein dokumentiertes Backup der `session_notes`-Tabelle im Repo. |
| W7 | `sw.js`-PRECACHE muss mit realen Dateien synchron bleiben | `caches.addAll(PRECACHE)` schlägt komplett fehl, wenn **eine** gelistete Datei 404 liefert → Service-Worker-Install bricht ab, Offline-Fähigkeit weg. Aktuell gelistet und vorhanden: `icon-192/512.png`, `apple-touch-icon.png`, `favicon-32/16.png`. Beim Umbenennen/Löschen von Icons zuerst `sw.js` anpassen (und ggf. Cache-Namen `training-v1` erhöhen). |
| W8 | Erster Sechs-Wochen-Review offen | `state.json` → `systemstatus`: „Erster Sechs-Wochen-Review noch offen." Fällig laut Meso-Plan in W30. Der Review-Prozess (`coach/reviews/`) ist also noch nie durchlaufen worden — erwarte dort keine Vorlagen aus der Praxis. |
| W9 | `decisions.md` erwähnt einen Obsidian-Vault | „obsidian-challenge aktuell im Aufbau, **noch nicht produktiv**" (Eintrag 2026-06-30). Nicht als Datenquelle behandeln, nichts dorthin schreiben, keine Pfade daraus ableiten. |

## 5. Bevor du X änderst, wisse Y

| Bevor du … änderst | … musst du wissen |
|---|---|
| Feldnamen in `data.js` (`id`, `isoDate`, `days`, `dateFrom/dateTo`, …) | Drei Konsumenten: (1) Render-Code in `index.html` (liest `d.isoDate`, `d.day`, `d.date`, `d.type`, `d.focus`, `w.dateFrom/dateTo` …), (2) Deploy-Verifier-`sed` in `deploy.yml` — er matcht **exakt** `id: "…",` mit führendem Whitespace und schließendem Komma; schon `id:"…"` ohne Leerzeichen bricht die Extraktion und damit jeden Deploy, (3) Notes-Join über `isoDate` (I4). |
| `website/.htaccess` | IONOS nutzt teils nicht-standardisierte interne Pfade (`coach/architecture.md`): falscher `AuthUserFile`-Pfad erzeugte am 2026-06-21 HTTP 500 auf der ganzen Seite → Auto-Revert `cd6083f`. Außerdem: `config.php`-Denial (I5) und No-Cache-Header (Design-Entscheidung 3) nicht anfassen. Rewrite-Rules sind teils verwaist (W1). |
| `.github/workflows/deploy.yml` | Auto-Revert-Logik hängt am Prefix „Revert" der Commit-Message; die `--exclude-glob config.php`-Zeilen sind Schutzschicht 2 von I5; `mirror` ohne `--delete` ist bewusst/riskant (W3); Verify greppt die **erste** Wochen-ID (I3). |
| Reihenfolge oder Anzahl der Wochen in `weeks[]` | Neueste Woche muss **vorn** stehen (I3), maximal 4 Wochen (`instructions.md`). Beim Einfügen alte fünfte Woche entfernen. |
| Icons unter `website/icons/` | `sw.js`-PRECACHE (W7), `manifest.json`, `<link>`-Tags in `index.html` und die verwaisten `.htaccess`-Rewrites (W1) referenzieren Icon-Dateien. Alle vier Stellen abgleichen. |
| `sw.js` (Cache-Strategie oder PRECACHE) | Network-first ist die dokumentierte Absicht (Plan muss sofort frisch sein); Cache-Name `training-v1` steuert die Alt-Cache-Räumung im `activate`-Handler. Bei inhaltlichen Änderungen an gecachten Assets Cache-Namen hochzählen. |
| Notes-API (`get_notes.php`, `save_note.php`) | `get_notes.php` erzwingt `?from=YYYY-MM-DD&to=YYYY-MM-DD` (sonst HTTP 400); `index.html` und `cron_summary.php` lesen dieselbe Tabelle `session_notes`; `save_note.php` schreibt `session_key`/`note_date` = `isoDate`. Schema-Änderungen treffen drei Konsumenten. |
| `coach/state.json`-Struktur | Pflichtstart jeder Session parst diese Datei (CLAUDE.md §Pflichtstart). Felder wie `akute_hinweise`, `load_references`, `aktuelle_woche` werden vom Coaching-Workflow direkt referenziert (`instructions.md`). Kein Umbau ohne ausdrücklichen Auftrag (Auftragsdisziplin, `instructions.md` §6). |
| `cron_summary.php` | Läuft nur, wenn IONOS-Cron die URL mit gültigem `cron_key` aufruft — der Cron-Eintrag lebt bei IONOS, nicht im Repo. `config.php`-Konstanten (`CRON_KEY`, `SUMMARY_FROM/TO`, `DB_*`) existieren nur auf dem Server; `config.template.php` zeigt die erwartete Form. |

## Wann diese Skill NICHT die richtige ist

| Anliegen | Richtige Skill |
|---|---|
| Deploy/Publish konkret durchführen oder überwachen | `trainer-publish-and-deploy` |
| Akutes Problem eingrenzen (Site down, Notes kaputt, Deploy rot) | `trainer-debugging-playbook` |
| Vollständige Incident-Geschichten und Lessons Learned | `trainer-failure-archaeology` |
| Feld-für-Feld-Schemas von `data.js`/`state.json`/`profile.json` und Stilregeln | `trainer-schemas-and-style` |
| Freigabe-Gates: was darf wann committet werden | `trainer-change-control` |

## Provenanz und Wartung

Alle Fakten am 2026-07-11 gegen den Repo-Stand verifiziert. Re-Verifikation:

| Fakt | Prüfkommando |
|---|---|
| Deploy-Ablauf, Verifier-`sed`, Auto-Revert, config-Excludes | `cat .github/workflows/deploy.yml` |
| Auto-Revert feuerte 2× am 2026-06-21 | `git show --no-patch --format="%h %an %ad %s" 0b53b9b cd6083f` |
| Basic-Auth-Entscheidung (iOS Standalone) | `git show 840903d` |
| Icon-`.php`-Löschung, verwaiste Rewrites | `git show --stat 4b429fc` und `head -7 website/.htaccess` |
| `data.js`: 4 Wochen, neueste vorn, isoDate-Pflicht | `head -12 website/data.js && grep -n 'id: "' website/data.js` |
| isoDate-Join in der UI | `grep -n 'isoDate\|note_date' website/index.html` |
| config.php-Schutz (3 Schichten) | `cat .gitignore && grep -n exclude .github/workflows/deploy.yml && grep -n -A2 config.php website/.htaccess` |
| Mo–So-Woche im Cron, API_KEY-Fallback | `sed -n '8,18p' website/cron_summary.php` |
| SW-Strategie und PRECACHE vs. reale Icons | `cat website/sw.js && ls website/icons/` |
| `pfad.php` noch da / noch deployt | `cat website/pfad.php && git log --oneline -- website/pfad.php` |
| Apex-Hierarchie, Mo–So, Committen-Trigger, Rohdaten-Verbot | `grep -n 'Priorität\|Montag bis Sonntag\|Committen\|Rohdaten' coach/instructions.md` |
| Sechs-Wochen-Review offen | `grep systemstatus coach/state.json` |
| Obsidian-Vault nicht produktiv | `tail -5 coach/decisions.md` |

Wartung: Nach jeder Änderung an `deploy.yml`, `.htaccess`, `sw.js` oder der
`data.js`-Struktur die betroffene Tabellenzeile hier aktualisieren und das
„Stand:"-Datum anheben. Schwachstellen (W1–W9) beim Beheben streichen, nicht
kommentarlos stehen lassen.
