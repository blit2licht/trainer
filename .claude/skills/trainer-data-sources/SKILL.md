---
name: trainer-data-sources
description: Katalog aller externen Datenquellen des Trainer-Repos — DreamWOD laden / fetch box programming (CrossFit Munich admin-ajax), WHOOP Daten interpretieren (Recovery-Skala, kg-Rundung, Auto-Log-Konflikte), Notizen lesen/schreiben (get_notes, save_note, session_notes, rpe_feel), Strava rides via MCP aggregieren, wodwell-Verifikation, Drive-Status. Nutzen bei "data sources", "Quellen", "DreamWOD ziehen", "WHOOP Detailprompt", "Notizen laden", "get_notes", "Strava rides", "Quellenkonflikt", "Autoritätsreihenfolge".
---

# Trainer-Datenquellen: Katalog, Zugriff, Fehlerbilder, Autorität

Runbook für jede externe Datenquelle des Coaching-Systems. Zero-Context tauglich: Endpunkte, Parsing, Fehlermodi und wer bei Widerspruch gewinnt. Quelle der Wahrheit für diese Regeln: `coach/instructions.md` (Abschnitte „Datenmodell und Wahrheit", „Quellen- und Verbindungsdisziplin", „Referenzen"), `coach/architecture.md`, `coach/state.json` → `datenquellen`. Stand: 2026-07-11.

## Quellen-Überblick

| Quelle | Zugriff | Liefert | Fallback |
|---|---|---|---|
| DreamWOD (CrossFit Munich) | POST admin-ajax (siehe unten) | *programmiertes* Box-Wochenprogramm | Screenshot von Martin |
| WHOOP | nur manueller Paste | Weekly Review, Recovery, Auto-Workout-Logs | kopierfertigen Detailprompt schreiben |
| Website-Notizen | GET `get_notes.php` / POST `save_note.php` | Tagesnotizen + `rpe_feel` (MariaDB `session_notes`) | Martin fragen |
| Strava | MCP `list_activities` mit Datumsbereich | Radfahrten | erst nach leerem Pull fragen |
| Drive | **stillgelegt** | nichts | — |
| wodwell.com | Web-Verifikation | exakte Benchmark-WOD-Formate | keiner — ohne Verifikation nicht beraten |

---

## 1. DreamWOD (Box-Programm, CrossFit Munich)

### Endpunkt-Anatomie (exakt nach `coach/instructions.md` → „Referenzen")

- `POST https://crossfitmunich.com/wp-admin/admin-ajax.php`
- Parameter: `action=your_ajax`, `fn=run_shortcode_function`, `some_needed_value=YYYY-MM-DD&to=YYYY-MM-DD` (Mo–So).
- **Achtung: das `&to=…` ist Teil des *einen* Werts** — das Widget baut den String per `from + '&to=' + bis` zusammen. Nicht als zweiten Parameter behandeln.

```bash
# Eine Woche (Mo–So). NIE im Batch, ~30 s Abstand zwischen Requests.
curl -s 'https://crossfitmunich.com/wp-admin/admin-ajax.php' \
  -d 'action=your_ajax' \
  -d 'fn=run_shortcode_function' \
  -d 'some_needed_value=2026-07-06&to=2026-07-12'
```

### Parsing

Antwort ist ein JSON-String (**doppelt kodiert**): erst dekodieren, dann `workouts[]` nach `scheduledAt` + `sortOrder` sortiert lesen. Felder: `title`, `subTitle`, `description`, `scheduledAt`. Track = CrossFit (`workoutTrackId` a995d011…, Affiliate 0ebb327a…).

```bash
python3 -c '
import json, sys
raw = sys.stdin.read()
data = json.loads(json.loads(raw))          # doppelt dekodieren
ws = sorted(data["workouts"], key=lambda w: (w["scheduledAt"], w["sortOrder"]))
for w in ws:
    print(w["scheduledAt"], "|", w["title"], "|", w.get("subTitle",""))
' < response.txt
```

### Regeln und Fehlerbilder

| Befund | Bedeutung | Aktion |
|---|---|---|
| Daten kommen | OK — aber: **Fetch liefert das *programmierte* WOD, nicht das im Kurs tatsächlich Gelaufene** | Coach-Modifikationen kommen erst beim Review über Notizen/WHOOP |
| `false` oder leeres `workouts[]` bei HTTP 200 | **Mehrdeutig**: Soft-Block (Drosselung schneller Serien) *oder* von der Box noch nicht veröffentlicht. Kein Defekt. | Disambiguieren: eine **bekannt veröffentlichte Vergangenheitswoche** nachziehen. Auch leer → Drosselung (kurz warten, einzeln wiederholen). Vergangenheit voll, Zielwoche leer → Programm hängt noch nicht → später erneut ziehen oder Martin fragen/Screenshot. |
| HTTP ≠ 200 oder Parse-/Nicht-JSON-Fehler | **Hart kaputt** — nur dann | Debuggen (Statuscode, Ursache); bleibt es kaputt → Martin um Screenshot bitten. Nicht raten. |

- **Nicht im Batch ziehen** — eine Woche pro Request, ~30 s Abstand. Die Seite drosselt schnelle Serien.
- Fallback ist immer der manuelle Screenshot (`state.json` → `datenquellen.dreamwod`).
- DreamWOD-Programm nie ungeprüft übernehmen — immer gegen Apex, Wochenlogik und aktuellen Zustand einordnen (Quellen-Disziplin Regel 7).

---

## 2. WHOOP

**Kein API-Zugriff.** Ausschließlich manuell eingefügte Daten: der Wochenreview plus gezielte Detailabfragen. Fehlen Last- oder Satzhistorien → **präzise, kopierfertige WHOOP-Detailprompts** für Martin erstellen. Nie raten, nie rekonstruieren.

### Recovery-Skala und Kappung

| Bereich | Farbe | Konsequenz |
|---|---|---|
| 0–33 % | rot | nur Technik/Mobility bis RPE 6 — oder Ruhe |
| 34–66 % | gelb | unter 50 %: Kappungsregel — Load-RPE-Cap 7, kein neues Top-Gewicht, letzter Steigerungssatz entfällt |
| 67–100 % | grün | normal |

Details zur Anwendung: „Daily WOD Adjustment" in `coach/instructions.md`. Recovery ist Tagesform-Input zur Autoregulation, **nie** Strukturinput für die Wochenplanung.

### Falle: kg-Rundung

WHOOP rundet geloggte Gewichte auf ganze kg (47,5 → 48; 42,5 → 43). **Krumme Ganzzahlen aus WHOOP nie wörtlich nehmen**, sondern auf das nächste 1,25-kg-Vielfache zurücklesen — Martin lädt real immer 1,25-Vielfache (kleinster Gesamtsprung 2,5 kg), nie die kleinen Oly-Scheiben. Beispiel: WHOOP „48 kg" ⇒ real 47,5 kg.

### Autorität und Konflikte

Bei Konflikt zählt **Martins expliziter Satz-/Last-Log in der freien Notiz mehr als WHOOPs automatische Zählung**. Konflikte im Review **markieren, nie still auflösen**. Reale Beispiele aus `coach/logbook.md`:

- **W26:** BMU 13 total laut Notiz, WHOOP-Auto zählte 12 → Notiz zählt.
- **W27:** WHOOP-Auto-Log labelte Front Squat als „Back Squat" und zeigte 95 kg statt 100 kg Top (Tracking-Fehler, Martin bestätigt) → Notiz/Martins Aussage zählt.

Keine WHOOP-Rohdaten nach GitHub committen — nur verdichtete Erkenntnisse und bestätigte Arbeitswerte.

---

## 3. Website-Notizen (`session_notes`, MariaDB auf IONOS)

### Lesen: `GET get_notes.php` — Datumsbereich Pflicht

Verifiziert am PHP-Quelltext (`website/get_notes.php`, Stand 2026-07-11): `from` **und** `to` müssen exakt `YYYY-MM-DD` matchen (`/^\d{4}-\d{2}-\d{2}$/`), sonst **HTTP 400** mit `{"error":"Invalid date range. Use ?from=YYYY-MM-DD&to=YYYY-MM-DD"}`. Query: `WHERE note_date BETWEEN :from AND :to ORDER BY note_date ASC`.

```bash
curl -s 'https://training.martinwitte.de/get_notes.php?from=2026-07-06&to=2026-07-12'
```

Antwort:

```json
{"notes":[{"session_key":"…","note_date":"YYYY-MM-DD","rpe_feel":4,"note_text":"…","updated_at":"…"}]}
```

| HTTP | Ursache (aus dem PHP-Code) |
|---|---|
| 400 | `from`/`to` fehlt oder falsches Format |
| 405 | falsche Methode (nur GET erlaubt) |
| 503 | `config.php` fehlt/ungültig/unvollständig oder DB nicht erreichbar (`{"error":"Database unavailable"}`) |

### Schreiben: `POST save_note.php` (JSON-Body, Upsert)

Verifiziert am PHP-Quelltext (`website/save_note.php`): nur POST (sonst 405); Pflichtfelder `session_key` und `note_date` (sonst 400); `note_date` muss `YYYY-MM-DD` sein (sonst 400); `rpe_feel` wird serverseitig auf 0–5 geklemmt; `INSERT … ON DUPLICATE KEY UPDATE` → wiederholtes Speichern desselben Schlüssels aktualisiert `rpe_feel`, `note_text`, `updated_at`.

```bash
curl -s -X POST 'https://training.martinwitte.de/save_note.php' \
  -H 'Content-Type: application/json' \
  -d '{"session_key":"2026-07-09-focus-a","note_date":"2026-07-09","rpe_feel":4,"note_text":"…"}'
# Erfolg: {"success":true}
```

### Interpretation

- `rpe_feel` = **subjektive Sessionqualität 1–5, höher = besser** (Emoji-Skala). **NIE mit Load-RPE verwechseln** (dort: höher = näher am Limit).
- Notizen entstehen per **iOS-Voice-Input** → mit Diktier-Artefakten rechnen (verhörte Zahlen, Übungsnamen, fehlende Interpunktion). Bei zweifelhaften Werten nachfragen statt interpretieren.
- Der Wochenreview schreibt **keine erfundenen oder nicht zugänglichen Rohdaten** in die Datenbank.

---

## 4. Strava (MCP)

- Radfahrten immer über den Strava-MCP ziehen: `list_activities` **mit Datumsbereich**. Nicht durch Nachfragen ersetzen — **erst fragen, wenn der Pull keine Daten liefert.**
- **Sonntags-Ride aggregieren:** Eine Ausfahrt erscheint oft als mehrere Segmente/Aktivitäten. Für korrekte Distanz, Zeit und Höhenmeter **alle Segmente des Tages summieren**, nicht nur das erste nehmen.
- Keine Strava-Rohdaten nach GitHub committen — nur verdichtete Ergebnisse (z. B. „74,5 km, 2:35 h, 263 hm").

---

## 5. Drive

**Stillgelegt. Nicht lesen, nicht schreiben.** Keine Ausnahmen, auch nicht „nur zum Nachschauen".

---

## 6. wodwell.com (Benchmark-Verifikation)

Vor **jeder** Beratung zu Benchmark-WODs (Girls, Hero, Open) das exakte Format auf wodwell.com verifizieren: Bewegungen, Reps, Reihenfolge, Rest-/Zeitregeln und RX-Standard. **Nicht aus dem Gedächtnis rekonstruieren.**

---

## 7. Übergreifende Quellen-Disziplin (Pflicht, vor Tempo)

Aus `coach/instructions.md` → „Quellen- und Verbindungsdisziplin":

1. **Erst Quelle lesen, dann handeln** — vor Nutzung einer Schnittstelle/Datei/eines Tools die zugehörige Quelle prüfen (z. B. bei Parameter-Unsicherheit zuerst `website/get_notes.php` im Repo lesen).
2. **Alle relevanten Quellen prüfen, nicht nur die nächstbeste.** Wochenreview heißt mindestens: alle Notizen des Zeitraums via `from/to`, Strava-MCP für Rides, `state.json`-Flags, DreamWOD und WHOOP-Recap.
3. **Fehlt eine Quelle → nachfragen.** Nichts erfinden, nichts aus Plausibilität rekonstruieren.
4. **Klemmt eine Verbindung → debuggen:** Statuscode und Ursache feststellen, korrigieren, erneut versuchen. Keine ungefragten Umweg-Workarounds.
5. **Bleibt es kaputt → melden:** was nicht geht, welcher Fehler, was als Nächstes nötig wäre.
6. **Externe Quellen nach Güte gewichten:** offizielle/etablierte/methodisch saubere Quellen vor Blogs, Foren, oberflächlichen Listen.
7. **Keine Rohdaten committen:** keine WHOOP-, Strava- oder Satz-Rohdaten nach GitHub — nur verdichtete Erkenntnisse, bestätigte Arbeitswerte, Zielstände, akute Hinweise, Steuerungsentscheidungen.
8. **Nur mit ≥90 % Sicherheit ausgeben;** darunter benennen, was zur Klärung fehlt, und gezielt nachfragen.

---

## 8. Autoritätsreihenfolge bei Quellenkonflikten

| Rang | Quelle | Begründung |
|---|---|---|
| 1 | Martins aktuelle Aussage im Chat | direkteste, frischeste Bestätigung |
| 2 | Explizite freie Notiz (Satz-/Last-Log in `session_notes`) | bewusster manueller Log, schlägt Auto-Tracking |
| 3 | WHOOP-Auto-Zählung/-Label | fehleranfällig (Rundung, falsche Übungslabels, Rep-Zählung) |
| 4 | Plan (`website/data.js`), alte `akute_hinweise`, frühere Chat-Aussagen | nur Warnflags — nie alleiniger Konfliktbeweis; ein Konflikt gilt erst als real, wenn aktuell belegt (Datei, Datum, Einheit oder Nutzeraussage) |

Konflikte immer **markieren** (Quelle A sagt X, Quelle B sagt Y, gewertet wurde Z), nie still auflösen.

---

## Wann diese Skill NICHT die richtige ist

- **trainer-weekly-workflow** — wann im Wochenzyklus welche Daten angefordert werden (Reihenfolge Neue Woche, Review-Ablauf). Hier steht nur *wie* man an die Daten kommt.
- **trainer-debugging-playbook** — Triage, wenn eine Quelle sich falsch verhält (systematisches Debugging über die Fehlertabellen hier hinaus).
- **trainer-validation-and-qa** — was als bestätigter Nachweis für Ziele/Referenzen zählt.
- **sc-coaching-reference** — Interpretation der Zahlen (Recovery-Steuerung, RPE, Progressionslogik) im Coaching-Kontext.

---

## Provenanz und Wartung

| Fakt in dieser Skill | Quelle | Re-Verifikation |
|---|---|---|
| DreamWOD-Endpunkt, Parameter, Doppel-Dekodierung, Track-IDs, Drossel-/Ambiguitätsregeln | `coach/instructions.md` → „Referenzen" | `grep -n -A 8 'DreamWOD-Programm' coach/instructions.md` |
| WHOOP-Skala, Kappungsregel, kg-Rundung, Auto-Log-Autorität | `coach/instructions.md` → „Quellen- und Verbindungsdisziplin", „Daily WOD Adjustment", „Lasten und RPE" | `grep -n 'WHOOP' coach/instructions.md` |
| Konflikt-Beispiele W26 (BMU 13 vs. 12) und W27 (FS „Back Squat" 95 vs. 100 kg) | `coach/logbook.md` | `grep -n 'WHOOP' coach/logbook.md` |
| get_notes: Pflicht-Datumsbereich, Regex, Felder, 400/405/503 | `website/get_notes.php` (Code gelesen) | `sed -n '27,60p' website/get_notes.php` |
| save_note: POST-JSON, Pflichtfelder, rpe_feel-Clamp 0–5, Upsert | `website/save_note.php` (Code gelesen) | `sed -n '27,80p' website/save_note.php` |
| rpe_feel-Bedeutung, iOS-Voice-Input, MariaDB/IONOS | `coach/architecture.md` → „Tagesnotizen & RPE" | `grep -n -A 4 'Tagesnotizen' coach/architecture.md` |
| Strava-Aggregation, Drive stillgelegt, manuelle Quellenmodi | `coach/instructions.md` → „Datenmodell", `coach/architecture.md`, `coach/state.json` → `datenquellen` | `python3 -c "import json;print(json.load(open('coach/state.json'))['datenquellen'])"` |
| wodwell-Pflichtverifikation | `coach/instructions.md` → „Referenzen" | `grep -n 'wodwell' coach/instructions.md` |
