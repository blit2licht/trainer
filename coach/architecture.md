# System-Architektur (Referenz)

Technischer Überblick des Coaching-Systems. Reine Referenz — die Coaching-Wahrheit steht in `instructions.md`, `profile.json`, `state.json`. Dieses Dokument ersetzt seit dem 30.09.2026 die Entwurfsdokumente des früheren Ordners `V3.0/` (gelöscht, in der Git-Historie bis Commit `9f34da6`).

## Was das System tut

Zwei Aufgaben, mehr nicht:

1. **Plan ausliefern.** Der freigegebene Wochenplan geht als generierter Payload ans Handy.
2. **Rückmeldung erfassen.** Verdict je Block im Open Gym, Tagesnotiz an allen Tagen.

Lasten, Ceilings und Ziele pflegt der Coach von Hand in `state.json` und `profile.json`. Eine Engine, die aus Verdicts automatisch Lasten ableitet (`derive_state.py`, `derived.json`), war geplant und ist am 30.09.2026 eingestellt worden: Bei zwei Technik-Zielen und einer eigenen Einheit pro Woche gibt es nichts zu rechnen. Ebenfalls verworfen: die Werkstatt am Desktop.

## Hosting und Deployment

- **Website:** training.martinwitte.de, gehostet auf **IONOS** (Homepage Perfect). Stack: PHP + **MariaDB**, Upload via **SFTP**.
- **Deployment:** GitHub Actions (`.github/workflows/deploy.yml`) bei jedem Push auf `main`, der `website/`, den Workflow oder `.github/scripts/` ändert → lädt `website/` per `lftp` zu IONOS (ohne `config.php`, `config.template.php` und `CLAUDE.md`). Reine Coaching-Commits deployen nicht. Der Workflow liest die erste Wochen-ID aus `website/data.js` und verifiziert sie nach dem Upload.
- **Schlägt die Prüfung fehl,** revertet der Workflow den obersten Commit, lädt den reverteten Stand im selben Lauf wieder hoch und prüft erneut. Das ist nötig, weil der Revert-Push mit dem GITHUB_TOKEN läuft und keinen neuen Workflow startet. Der Lauf endet in jedem Fehlerfall rot und meldet, ob der Rückbau geklappt hat. Grenzen: Revertet wird nur der oberste Commit — liegt die kaputte App-Änderung in einem früheren Commit desselben Pushs, stellt der Rückbau nichts wieder her. Dateien, die der kaputte Commit neu angelegt hat, bleiben auf dem Server liegen (der Upload löscht nie).
- Upload und Live-Prüfung stehen in `.github/scripts/deploy.sh` und `.github/scripts/verify_live.sh`; der Workflow ruft beide für Deployment und Rückbau auf.
- **Veröffentlicht wird nur `website/`.** Ein Deployment gilt erst als erfolgreich, wenn die Seite erreichbar ist und die aktuelle Wochen-ID ausliefert.
- `website/config.php` existiert nur auf dem Server und wird beim Deployment weder überschrieben noch gelöscht. Endpoints mit Schreibzugriff tragen ein Shared Secret.
- IONOS nutzt teils nicht-standardisierte interne Pfade (z. B. AuthUserFile für Basic Auth) — vor `.htaccess`-Änderungen den tatsächlichen Pfad bestätigen, sonst HTTP 500.

## Dateien und Pipeline

```
coach/plan/<jahr>-W<nr>.json   Planquelle je Woche — von Hand bzw. vom Coach geschrieben
coach/exercises.json           Übungs-Registry — handgepflegt
scripts/build_payload.py       Planquelle + Registry → website/data.js, setzt den Cache-Stempel
website/data.js                Handy-Payload — generiert, nie von Hand editieren
website/index.html             die App (Trainer 3.0), eine HTML-Datei ohne Build-Schritt
```

Prinzip: **Die Quelle speichert einmal, der Payload leitet ab.** Kurzformen und Lastspannen berechnet der Generator, sie stehen nie redundant in der Planquelle.

- `build_payload.py` nimmt jede Planwoche auf, deren `bis` am Bautag noch nicht vorbei ist — praktisch die laufende und die nächste Woche. Vergangene Wochen bleiben draußen (keine Wochenrückschau am Handy). Welche Woche die App zeigt, entscheidet sie zur Anzeigezeit.
- Der Cache-Stempel `?v=<hash>` in `index.html` deckt Payload und Schale ab; ohne ihn hält Safari am iPhone alte Stände fest.
- Der Vorgänger 2.0 liegt nur noch in der Git-Historie (`archive/2.0/` bis Commit `9f34da6`). `website/sw.js` ist ein Kill-Switch: 3.0 registriert keinen Service Worker, der alte 2.0-Worker meldet sich auf installierten Geräten selbst ab.

## Planquelle `coach/plan/<jahr>-W<nr>.json`

Kopf: `schema_version`, `id`, `label`, `meso`, `von`, `bis`, `phase`, optional `_hinweis` (Coach-Notiz, erreicht das Handy nie). Dazu `days[]`, ein Eintrag je Kalendertag Montag bis Sonntag.

Drei Tagestypen, es gibt kein „offen":

| `day_type` | Bedeutung | Felder |
|---|---|---|
| `rest` | Ruhetag, entschieden | `plan_note`, `warum` |
| `box` | Box-Tag (auch Ride) | `einheit`, `sub`, `wod[]`, `plan_note`, `warum` |
| `own` | Open Gym (bisher „eigene Einheit“; in App und Code „Fokus-Tag“) | `focus`, `focus_label`, `blocks[]`, `plan_note`, optional `recovery_day` |

- `plan_note` ist Coach-Prosa und wird gestrippt. `warum` wandert mit und ist am Handy unter „Begründung" ausklappbar.
- **Box-Tag:** `wod[]` ist eine Liste von Teilen mit `struktur`, optional `format`, und `bewegungen[]` (`reps`, `name`, `detail`). Keine `ex_id`, keine Targets, kein Verdict-Button. Die zielbezogene Ansage an Tagen mit Zielkontakt steht in `warum`.
- **Eigene Einheit:** `blocks[]` mit `block_id`, `prio` (`required` oder optional), `min`, `title`, `superset`, `exercises[]`. Jede Übung trägt `ex_id` (aus der Registry), `target` und `warum`. `title` ist nur der Übungs- oder Blockname; Zusätze gehören in `note` oder `warum` (der Build warnt bei Klammern oder Gedankenstrich im Titel). Ein Block mit mehreren nur angezeigten Bewegungen bekommt über `verdict_ex_id` genau ein Verdict.

### `target`-Modi

Explizites `mode`-Feld, der Generator rät nie. Gemeinsame Felder: `sets`, `reps` (Zahl oder `[min,max]`), `rpe_cap`, `tempo`, `rest`, `unbroken`, `interval`.

| `mode` | Pflichtfeld | Anzeige am Handy |
|---|---|---|
| `kg` | `kg` oder `ramp[]` (mindestens zwei Stufen); optional `optional_top` | „7 × 1 @ 60 kg", Teststreifen aus `ramp` |
| `bw` | — | „5 × 2 @ BW" |
| `bw_plus` | `kg` = Zusatzlast | „3 × 5 @ +5 kg" |
| `time` | `sec` je Satz | „3 × 30 sec" |
| `band` | `band` (freier Text) | „3 × 15 @ rotes Band" |
| `rpe` | `rpe_cap` | „3 × 12 · RPE-kalibriert" |

`build_payload.py` prüft jeden Modus gegen seine Pflichtfelder und meldet Verstöße als Lint-Warnung. EMOM oder Intervall ist kein Modus, sondern `interval` plus beliebiger Modus.

## Registry `coach/exercises.json`

Ein Eintrag je Übung: `ex_id`, `name`, `kurz` (Kurzname für die Wochenliste), `aliases` (der erste Eintrag ist der exakte WHOOP-Library-Name für den Kopier-Knopf), `class`, `note`.

`class` steuert nur noch eines: Bei `technical` fragt die App nach einem Fail „Technik oder Last?". Die Werte `loadable`, `skill` und `generic` verhalten sich in der App gleich. Einträge für nicht mehr geplante Übungen bleiben stehen, damit alte Verdicts und Planquellen lesbar bleiben.

Treppen und Zielstände stehen nicht in der Registry, sondern in `profile.json`.

## Verdict-Kanal

Tabelle `verdicts` (Schema: `scripts/verdicts_schema.sql`): `iso_date`, `ex_id`, `verdict` (`hit` oder `miss`), `miss_reason` (`technik` oder `last`, nur bei `technical`), `source`, `updated_at`. Primärschlüssel `(iso_date, ex_id)`, letzter Schreibvorgang gewinnt.

- `website/save_verdict.php`: Schreiben mit Shared Secret. Antwort ist der gespeicherte Zeilenstand, die App zeigt den Serverstand und nie eine Tap-Annahme. `verdict: 'clear'` löscht die Zeile (Rücknahme eines Fehltaps).
- `website/get_verdicts.php?from=YYYY-MM-DD&to=YYYY-MM-DD`: Lesen.
- Eine fehlende Zeile heißt „kein Verdict" und ist nie ein Miss.
- Verdicts gibt es nur im Open Gym. An Box-Tagen mit Zielkontakt steht die Rückmeldung als ein Satz in der Tagesnotiz; ein Verdict-Button dort ist Teil des offenen App-Pakets (`coach/auftraege/app-paket-box-tag.md`).

## Tagesnotizen

- Notizen werden per iOS-Voice-Input erfasst und in MariaDB gespeichert (`session_notes`).
- Lesen: `website/get_notes.php?from=YYYY-MM-DD&to=YYYY-MM-DD` (Datumsbereich Pflicht, sonst HTTP 400). Schreiben: `website/save_note.php`.
- IONOS-Cron stößt sonntags 20:00 `website/cron_summary.php` an und verschickt die Wochen-Zusammenfassung per Mail.

## Bekannte Altlasten (bewusst nicht angefasst)

- **Spalten `session_feel` und `blocks_done` in `session_notes`.** Die Session-Feel-Skala ist seit dem 31.08.2026 abgeschafft, der Erledigt-Rückkanal `blocks_done` wurde nie gebaut (Verdicts haben ihn ersetzt). `website/notes_db.php` erkennt zur Laufzeit, ob die Feel-Spalte `session_feel` oder noch `rpe_feel` heißt und ob `blocks_done` existiert; `save_note.php` und `get_notes.php` bedienen beides weiter. Das läuft fehlerfrei und bleibt so: Ein Aufräumen bräuchte ein `ALTER TABLE` auf dem Live-Server ohne Nutzen für das Training.
- Die SQL-Datei zur Umbenennung `rpe_feel` → `session_feel` vom 19.07.2026 liegt nur noch in der Git-Historie (`migrations/`). Ob sie auf dem Server gelaufen ist, ist wegen der Laufzeiterkennung unerheblich.
- **Begriff „Fokus-Tag"** in `index.html`, `DESIGN.md` und `design/`: meint den Open-Gym-Tag (`day_type: own`).

## Datenquellen (extern)

- **intervals.icu (WHOOP-Bridge):** Recovery, HRV, RHR, Schlaf über `scripts/pull_wellness.py` → `coach/wellness.json`. Recovery-Skala: 0–33 rot / 34–66 gelb / 67–100 grün. Der aktuelle Tag ist am Vormittag oft noch unvollständig.
- **Withings:** Gewicht über `scripts/pull_weight.py` → `coach/weight.json`, auf 0,1 kg gerundet. Der Körperfettwert wird ignoriert.
- **WHOOP direkt:** nur gezielte Detailabfragen per kopierfertigem Prompt, kein Wochen-Paste.
- **DreamWOD (CrossFit Munich):** Wochenprogramm per Schnittstelle (Aufruf in `instructions.md`, Abschnitt Referenzen), Screenshot nur als Fallback.
- **Strava:** Radfahrten über MCP (`list_activities`). Sonntags-Ride oft in mehreren Segmenten → aggregieren.
- **Drive:** stillgelegt — nicht lesen oder schreiben.

## Ein Repo, zwei Arbeitsweisen

Coaching und App liegen bewusst im selben Repo (Entscheid 30.09.2026): Planquelle, Generator, Cache-Stempel und Deployment sind ein Vorgang. Getrennt sind die Arbeitsweisen. Wochenpläne gehen direkt auf `main`; App-Arbeit läuft auf einem Zweig nach den Regeln in `website/CLAUDE.md`. Eine Trennung in zwei Repos wird erst sinnvoll, wenn die App öffentlich werden oder eine zweite Person bedienen soll — dann dürfen die Gesundheitsdaten aus `coach/` nicht im selben Repo liegen. Die Schnittstelle dafür ist der Payload `data.js`.

## Werkzeuge

- `scripts/analyze_video.py` (+ `requirements-video.txt`): lokale Video-Diagnose, nur für konkrete Technikfragen. Rohdaten bleiben in `coach/video_analysis/` (nicht versioniert).
- `scripts/build_icons.py`: erzeugt die App-Icons.
- `design/`: die gelockte Designwelt als Referenz (`dunkelkammer.html`, zwei PDFs) und die Icon-Quelle `icon.svg`. Gültige Gestaltungsregeln stehen in `DESIGN.md`.
- `personas/`: fünf Review-Linsen für Design-Kritiken; verbindlich ist nur Martin (04).
