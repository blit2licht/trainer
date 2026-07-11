---
name: trainer-validation-and-qa
description: Was in diesem Repo als Beweis zählt, Akzeptanzschwellen und Vollständigkeits-Checklisten — "Ziel erreicht?", "ist das belegt?", "Beweis", "bestätigte Daten", "Quellenkonflikt", "Checkliste vor Committen", Deployment-Verifikation. Use for evidence rules, acceptance thresholds, QA, validation, data completeness ("evidence", "acceptance", "QA", "validation", "confirmed data", "source conflict", "pre-commit checklist").
---

# Trainer Validation & QA: Beweislast, Akzeptanzschwellen, Checklisten

Diese Skill definiert, was in Martins Trainings-Repo als **Beleg** gilt, wann ein Ziel oder eine Progressionsstufe als **erreicht/bestätigt** zählt, welche **Mindestdaten** ein Arbeitsmodus braucht und wie **Veröffentlichungen geprüft** werden. Quelle der Wahrheit: `coach/instructions.md` (Kanon), `coach/state.json`, `coach/profile.json`, `.github/workflows/deploy.yml`. Stand: 2026-07-11.

## Wann diese Skill NICHT die richtige ist

| Anliegen | Richtige Skill |
|---|---|
| Daten aus DreamWOD/WHOOP/Notizen/Strava **beschaffen** (Endpunkte, Parsing) | `trainer-data-sources` |
| Der Wochenprozess selbst (Neue Woche, Committen, Wochenreview als Ablauf) | `trainer-weekly-workflow` |
| Fehlgeschlagene Deployments oder kaputte Verbindungen **reparieren** | `trainer-debugging-playbook` |
| Trends, Auswertungen, Analysemethoden | `trainer-analysis-toolkit` |
| Beweislast für **neue** Trainingsideen/externe Methodik | `trainer-research-methodology` |

---

## 1. Die Beweislatte (Kanon, wörtlich zu befolgen)

Alle Regeln aus `coach/instructions.md`; sie haben Vorrang vor Tempo.

### 1.1 Ziel erreicht — die Definition

> „Ein Ziel gilt endgültig als erreicht, wenn das Zielgewicht sauber gehoben wurde. Mehrere eindeutige freie Notizen dürfen als Nachweis gelten."
> — `coach/instructions.md` § „Langfristige Steuerung"

- Keine routinemäßigen 1RM-Tests. Fortschritt wird über technisch saubere Singles, Doubles, RPE, Stabilität und **tatsächliche erfolgreiche Lifts** bewertet.
- Eine **Vermutung ist kein Stand**: In `coach/state.json → load_references.front_squat` vermutet Martin 1RM >105 kg — „Referenz bleibt 105 bis bestätigt". Genau so behandeln: geschätzte Werte nie als Zielstand in `coach/profile.json → leistungsziele[].stand` übernehmen.

### 1.2 Lastempfehlungen nur aus bestätigten Referenzen

Vor **jeder** konkreten Lastempfehlung (`coach/instructions.md` § „Lasten und RPE"):

1. Lastreferenzen in `coach/state.json → load_references` prüfen.
2. Falls unzureichend: gezielten WHOOP-Detailprompt für die relevante Übung erstellen.
3. **Nur bestätigte Daten verwenden.**
4. Ohne Referenz: entweder Martin fragen **oder** eine RPE-basierte Kalibrierung planen.

Niemals raten. Die `load_references`-Einträge tragen `note`-Felder mit der Bestätigungsherkunft (z. B. `weighted_pull_up`: „W27 zweite Woche in Folge +5 kg 3×3 sauber **bestätigt**") — genau diese Bestätigungsformulierung ist der Standard.

### 1.3 Die 90-%-Regel

> „**Nur mit ≥90 % Sicherheit ausgeben.** Vor jeder Aussage, Zahl, Diagnose oder Empfehlung die eigene Konfidenz prüfen. Liegt sie unter 90 %, nicht raten — sondern benennen, was zur Klärung fehlt, und gezielt nachfragen."
> — `coach/instructions.md` § „Quellen- und Verbindungsdisziplin", Regel 8

### 1.4 Konfliktbehauptungen brauchen eine benannte Quelle

`coach/instructions.md` § „Auftragsdisziplin und reale Konflikte", Regeln 3–5:

- Alte `akute_hinweise`, Plan-Notizen oder frühere Chat-Aussagen sind **nie alleiniger Konfliktbeweis** — nur Warnflags. Ein Konflikt ist erst real, wenn er im aktuellen `website/data.js`, aktuellen `coach/state.json` oder durch Martins aktuelle Aussage belegt ist.
- Wer eine Kollision/einen Konflikt behauptet, **muss die Quelle direkt nennen: Datei, Datum, Einheit oder aktueller Nutzerhinweis.** Ohne Quelle keine Konfliktbehauptung.
- Vor jeder Konfliktentscheidung prüfen: real, aktuell, entscheidungsrelevant? Wenn nein: nicht diskutieren. Wenn unklar: eine kurze konkrete Frage.

### 1.5 Quellenkonflikte: markieren, nie still auflösen

> „Quellenkonflikte werden markiert, nicht still aufgelöst." — § „Quellen- und Verbindungsdisziplin", Regel 8

Autoritätsordnung bei Widerspruch: **Martins expliziter Satz-/Last-Log in der freien Notiz > WHOOP-Auto-Log** (§ „Referenzen", „WHOOP-Auto-Log vs. freie Notiz"). Konflikt im Review markieren.

Reale Beispiele aus `coach/logbook.md` (so sieht korrektes Handling aus):

| Woche | Konflikt | Handling |
|---|---|---|
| W26 | Pause OHS: Notiz vs. WHOOP zeigen 48–49 kg | Als „(Quellenkonflikt Notiz/WHOOP)" **markiert**, kein Wert erfunden |
| W26 | BMU: WHOOP-Auto zählte 12, Notiz 13 | „Notiz zählt" — explizit vermerkt |
| W27 | WHOOP labelte Front Squat als „Back Squat", 95 statt 100 kg | Als Tracking-Fehler dokumentiert, Martin bestätigte, „Notiz/Martins Aussage zählt" |

Merke außerdem (§ „Lasten und RPE"): WHOOP rundet auf ganze kg (47,5 → 48) — krumme Ganzzahlen aus WHOOP auf das nächste 1,25-kg-Vielfache zurücklesen, nicht wörtlich nehmen.

---

## 2. Akzeptanzschwellen im System (Stand: 2026-07-11)

### 2.1 Gymnastics-Progressionstreppe (`coach/profile.json → gymnastics_testprotokoll.regeln`)

Eine Stufe (z. B. WPU 3×3 → 3×4) gilt als **bestätigt**, nur wenn:

- [ ] **alle Sätze sauber** — kein Failure, Technik hält;
- [ ] höchstens **eine Stufe pro Woche pro Ziel** gestiegen wird;
- [ ] bei unsauberem letzten Satz: **eine Stufe zurück**, nicht wiederholt erzwingen;
- [ ] **Testsatz nie auf vorermüdetem System**: Recovery <50 % **oder** Grip-/Overhead-Vorlast am Vortag → Test um eine Woche schieben.

Zusatz: Der Max-Unbroken-Testsatz läuft alle 3–4 Wochen **frisch als erster Arbeitssatz** des Fokus-Tags; nur ein Testergebnis aktualisiert den Zielstand in `leistungsziele`. Nächster Test laut Profil: 2026-W30.

### 2.2 Deload-Trigger (`coach/state.json → mesocycle_plan.deload_trigger`)

Sofortige Wochenkorrektur (Volumen zuerst, dann Intensität — kein starrer Deload-Rhythmus), wenn einer greift:

| Trigger | Schwelle |
|---|---|
| Recovery | ≥3 aufeinanderfolgende Tage rot (<34 %) |
| `rpe_feel` | ≤2 in zwei aufeinanderfolgenden Einheiten |
| Leistung | Abfall bei gehaltener Last (Reps/kg unter Vorwochen-Referenz trotz RPE-Cap) |

(`rpe_feel` = Sessionqualität 1–5, höher = besser. Nicht mit Load RPE verwechseln — § „Lasten und RPE".)

### 2.3 Tagesform-Kappung als Prüfmaßstab (§ „Daily WOD Adjustment")

- Recovery <50 %: Load-RPE-Cap 7, kein neues Top-Gewicht, letzter Steigerungssatz entfällt.
- Recovery <34 % (rot): nur Technik/Mobility bis RPE 6 — oder Ruhe.
- WHOOP-Skala: 0–33 % rot, 34–66 % gelb, 67–100 % grün.

---

## 3. Vollständigkeits-Checklisten

### 3.1 Wochenreview — Mindestdaten (§ „Wochenreview")

Keine Teilauswertung. Fehlt etwas Wichtiges: nachfragen und **noch nicht committen**.

- [ ] WHOOP-Wochenreview (manuell eingefügt)
- [ ] Website-Notizen des gesamten Zeitraums — ausschließlich via `get_notes.php?from=…&to=…` (Datumsbereich Pflicht)
- [ ] Bestätigung der tatsächlich absolvierten Einheiten („Plan befolgt?" geschlossen fragen, wenn unklar)
- [ ] optional: Strava-Daten (Rides per MCP ziehen, alle Segmente des Tages summieren)
- [ ] `state.json`-Flags ausgewertet (nicht danach fragen, was dort steht)

### 3.2 Neue Woche — Voraussetzungen (§ „Neue Woche", „Daten vor Plan")

- [ ] Vorwochen-Review geschlossen? (Zustand steht noch auf der alten Woche / Ausführung unbestätigt → **erst Review schließen**, sonst plant man auf veralteten Zahlen)
- [ ] Heutige Tagesform (aktuelle Recovery) bekannt, **bevor** ein Detailplan gebaut wird
- [ ] Danach der Reihe nach: DreamWOD-Programm → WHOOP-Wochenreview → Terminbeschränkungen → nur bei Bedarf WHOOP-Detaildaten
- [ ] Fehlende Last-/Satzhistorien → kopierfertigen WHOOP-Prompt erstellen, nicht raten

### 3.3 Flag-Hygiene (`coach/state.json → akute_hinweise`, § „Datenmodell und Wahrheit")

- [ ] Akute Hinweise beim Wochenreview **neu bewerten**
- [ ] Spätestens nach **7 Tagen entfernen**, sofern nicht erneut bestätigt (`state.json → hinweis_ablauf` sagt dasselbe)
- [ ] Abgelaufene Flags nie als Konfliktbeweis verwenden (siehe 1.4)

---

## 4. Veröffentlichungs-QA

### 4.1 Erfolgsdefinition (Kanon, nichts weniger)

Ein Deployment ist erst erfolgreich, wenn **beides** gilt (§ „Veröffentlichung", `CLAUDE.md`):

1. https://training.martinwitte.de ist erreichbar, **und**
2. die aktuelle Wochen-ID aus `website/data.js` wird ausgeliefert.

Bei Fehlschlag: nachvollziehbaren Revert-Commit erstellen, stoppen, Fehler erklären.

### 4.2 Was der Deploy-Verifier prüft — und was nicht

`.github/workflows/deploy.yml` ist die **einzige automatisierte Prüfung des Projekts**. Ablauf:

- Extrahiert die erste `id: "…"` aus `website/data.js` per `sed` (erwartete Wochen-ID).
- Spiegelt `website/` per SFTP (lftp) nach IONOS, `config.php` ausgeschlossen.
- Verify: bis zu 5 Versuche (12 s Abstand), `curl https://training.martinwitte.de/data.js | grep --fixed-strings "$EXPECTED_WEEK_ID"`.
- Bei Misserfolg: automatischer `git revert` + Push (außer der Commit ist selbst ein Revert) und Fehlermeldung.

**Er prüft NICHT:**

- keine JSON-/JS-Struktur von `data.js` (ein Syntaxfehler, der die Wochen-ID als String noch enthält, ginge durch);
- keine `isoDate`-Konsistenz oder -Vollständigkeit;
- keine Konsistenz zwischen `website/data.js` und `coach/state.json`;
- keine inhaltlichen Regeln (Lasten, Ausschlüsse, Wochenanzahl).

Er greppt genau **einen String**. Alles Weitere muss vor dem Push manuell geprüft werden.

### 4.3 Checkliste vor „Committen"

Vor jedem Push von `website/data.js`:

- [ ] **Maximal vier Wochen** in `weeks[]` (§ „Veröffentlichung"; aktuell W28–W25 = am Limit → beim Einfügen einer neuen Woche die älteste entfernen)
- [ ] **Neueste Woche vorne** (Kopfkommentar in `data.js`: „Neue Woche = neues Objekt VORNE in weeks[] einfügen")
- [ ] **`isoDate` an jedem Tag vorhanden und konsistent** mit `date`/`dateFrom`/`dateTo` („isoDate-Felder sind Pflicht — werden vom Notes-System genutzt")
- [ ] `coach/state.json → aktuelle_woche.id/von/bis` stimmt mit der neuen Woche überein
- [ ] **Plattenfreundliche Lasten**: nur Vielfache von 1,25 kg (42,5 / 45 / 47,5 …, nie 42 / 46 / 48)
- [ ] **Ausgeschlossene Skills abwesend**: Ring Muscle-ups, Handstand Walks, Crossover Double-Unders (`coach/profile.json → ausgeschlossen`)
- [ ] **Beide RPE-Skalen korrekt verwendet**: Load RPE (pro Satz, höher = näher am Limit) vs. `rpe_feel` (1–5, höher = besser) — nie verwechseln
- [ ] WHOOP-Block nutzt nur existierende Library-Namen bzw. bekannte Substitutionen (siehe § 5)
- [ ] Nur ausgewählte Trainingstage erscheinen; Box-Tage kompakt (Einheit, Level/Last/Scaling, kurzer Hinweis)

Die ausführbare Form dieser Checkliste ist `validate_data.py`, ausgeliefert mit der Skill `trainer-debugging-playbook` (unter `.claude/skills/trainer-debugging-playbook/scripts/`) — vor dem Committen laufen lassen, sofern vorhanden. Auffinden: `find .claude/skills scripts -name "validate_data.py" 2>/dev/null`.

---

## 5. Was niemals fabriziert werden darf

Aus § „Quellen- und Verbindungsdisziplin" Regel 3, § „Wochenreview", § „Datenmodell und Wahrheit", § „Ausgabeformate/WHOOP-Block":

- **Keine erfundenen Ereignisse, Wochen, Ausfälle oder Werte** — nichts aus Plausibilität rekonstruieren.
- **Keine erfundenen oder nicht zugänglichen Rohdaten in die Datenbank schreiben** (der Wochenreview schreibt keine erfundenen DB-Zeilen).
- **Keine WHOOP-, Strava- oder Satz-Rohdaten nach GitHub kopieren** — versioniert werden nur verdichtete Erkenntnisse, bestätigte Arbeitswerte, Zielstände, akute Hinweise und Steuerungsentscheidungen.
- **Keine erfundenen WHOOP-Library-Einträge** — nur Namen aus der WHOOP-Übungsbibliothek und bekannte Substitutionen aus Profil oder Zustand.
- Benchmark-WODs nie aus dem Gedächtnis rekonstruieren — Format auf wodwell.com verifizieren.

---

## 6. Kandidaten-Verbesserungen (offen, NICHT vorhanden)

**Kandidat — nicht umgesetzt, Änderung nur über `trainer-change-control`:**

1. **Pre-Push-Strukturcheck für `data.js` in CI**: `node --check` bzw. Parse-Schritt + isoDate-/Wochenanzahl-Validierung als Workflow-Step vor dem SFTP-Mirror. Heute existiert nur der Ein-String-Grep nach dem Deploy (§ 4.2).
2. **State/Data-Konsistenzcheck**: automatischer Abgleich `coach/state.json → aktuelle_woche.id` gegen die erste Wochen-ID in `website/data.js` (in CI oder als lokales Skript).

Beides ist Stand 2026-07-11 **nicht** implementiert; diese Skill beschreibt es nur als Verbesserungsidee.

---

## Provenanz und Wartung

| Aussage in dieser Skill | Quelle | Re-Verifikation |
|---|---|---|
| Ziel-erreicht-Definition, freie Notizen als Nachweis, keine 1RM-Tests | `coach/instructions.md` § „Langfristige Steuerung" | `grep -n "endgültig als erreicht" coach/instructions.md` |
| 4-Schritte-Regel für Lastempfehlungen (nur bestätigte Daten) | `coach/instructions.md` § „Lasten und RPE" | `sed -n '/## Lasten und RPE/,/## Ausgabeformate/p' coach/instructions.md` |
| ≥90-%-Regel, Konflikte markieren statt still auflösen | `coach/instructions.md` § „Quellen- und Verbindungsdisziplin" Regel 8 | `grep -n "90 %" coach/instructions.md` |
| Konfliktbeweis braucht benannte Quelle; alte Flags nie alleiniger Beweis | `coach/instructions.md` § „Auftragsdisziplin" Regeln 3–5 | `grep -n "Konfliktbeweis\|Ohne Quelle" coach/instructions.md` |
| Notiz > WHOOP-Auto-Log | `coach/instructions.md` § „Referenzen", letzter Punkt | `grep -n "WHOOP-Auto-Log" coach/instructions.md` |
| Konflikt-Beispiele W26 (OHS 48–49, BMU 12/13), W27 (Back-Squat-Label, 95/100 kg) | `coach/logbook.md` W26/W27 | `grep -n "Quellenkonflikt\|Notiz zählt\|Back Squat" coach/logbook.md` |
| Gymnastics-Stufenregeln (alle Sätze sauber, 1 Stufe/Woche, Stufe zurück, Test nie vorermüdet <50 %/Vorlast) | `coach/profile.json → gymnastics_testprotokoll.regeln` | `python3 -c "import json;print(json.load(open('coach/profile.json'))['gymnastics_testprotokoll']['regeln'])"` |
| Deload-Trigger (≥3 rote Tage, rpe_feel ≤2 ×2, Leistungsabfall) | `coach/state.json → mesocycle_plan.deload_trigger` | `python3 -c "import json;print(json.load(open('coach/state.json'))['mesocycle_plan']['deload_trigger'])"` |
| Kappungsregeln + WHOOP-Skala | `coach/instructions.md` §§ „Daily WOD Adjustment", „Quellen- und Verbindungsdisziplin" | `grep -n "Kappung\|0–33" coach/instructions.md` |
| Wochenreview-Mindestdaten, kein Commit bei Lücken, keine erfundenen DB-Daten | `coach/instructions.md` § „Wochenreview" | `sed -n '/### Wochenreview/,/## Lasten/p' coach/instructions.md` |
| Neue-Woche-Voraussetzungen (Review geschlossen, heutige Recovery) | `coach/instructions.md` § „Neue Woche" | `grep -n "Daten vor Plan" coach/instructions.md` |
| 7-Tage-Ablauf akuter Hinweise | `coach/instructions.md` § „Datenmodell", `coach/state.json → hinweis_ablauf` | `grep -n "sieben Tagen\|7 Tagen" coach/instructions.md coach/state.json` |
| Deploy-Verifier-Verhalten (sed-Extraktion, 5×-curl-grep, Auto-Revert) | `.github/workflows/deploy.yml` | `cat .github/workflows/deploy.yml` |
| Erfolgsdefinition Deployment (erreichbar + Wochen-ID) | `coach/instructions.md` § „Veröffentlichung", `CLAUDE.md` | `grep -n "erreichbar" coach/instructions.md CLAUDE.md` |
| Max 4 Wochen, neueste vorne, isoDate Pflicht | `coach/instructions.md` § „Veröffentlichung", Kopfkommentar `website/data.js` | `head -10 website/data.js; grep -c isoDate website/data.js` |
| 1,25-kg-Regel, WHOOP-Rundung, Load RPE vs. rpe_feel | `coach/instructions.md` § „Lasten und RPE" | `grep -n "1,25" coach/instructions.md` |
| Ausschlüsse (RMU, HS Walks, Crossover DU) | `coach/profile.json → ausgeschlossen` | `python3 -c "import json;print(json.load(open('coach/profile.json'))['ausgeschlossen'])"` |
| Keine Rohdaten in git, keine erfundenen Library-Einträge | `coach/instructions.md` §§ „Datenmodell", „WHOOP-Block" | `grep -n "Rohdaten\|Erfinde keine" coach/instructions.md` |
| § 6 sind reine Kandidaten (nicht implementiert) | kein CI-Check außer deploy.yml vorhanden | `ls .github/workflows/; ls scripts/ 2>/dev/null` |
