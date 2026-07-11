---
name: trainer-analysis-toolkit
description: >
  Analyse-Rezepte für Martins Trainingscoach: Limit-Diagnose ("warum stagniert
  der Snatch?", plateau, root cause), Plan-vs-Ausführung-Diff, Lastexperimente
  lesen (Load-Pullback), Quellenkonflikte adjudizieren, Kalibrierungs-Delta
  (Entscheidungs-Retro), Progressions-Promotion und Wochenlogik-Konstruktion.
  Use when asked to analysieren, diagnostizieren, ein Review auswerten, ein
  Experiment interpretieren, analyze progress, find the root cause of a plateau,
  oder "was sagen die Daten?". Jedes Rezept mit belegtem Beispiel aus der
  echten Repo-Historie (W25–W28).
---

# Trainer Analysis Toolkit — Analyse-Rezepte mit belegten Beispielen

Diese Skill ist die "Beweisen-statt-Behaupten"-Schicht des Projekts: sieben
Analyse-Methoden, jede als Rezept mit einem **echten, im Repo verifizierten
Beispiel** aus W25–W28 (Stand: 2026-07-11). Sie ergänzt den Kanon in
`coach/instructions.md` — bei Widerspruch gilt immer der Kanon.

Grunddoktrin (aus `coach/instructions.md`, gilt für jedes Rezept):

- **Diagnose vor Verordnung.** Erst Mechanismus verstehen, dann intervenieren.
- **≥90 % Konfidenz oder nachfragen.** Nicht raten; benennen, was zur Klärung fehlt.
- **Quellenkonflikte markieren, nie still auflösen.**
- **Negativbefunde zählen als Evidenz.** "Ceiling nicht erreicht" ist ein Datenpunkt,
  kein Versagen der Analyse.

## Wann diese Skill NICHT die richtige ist

| Anliegen | Richtige Skill |
|---|---|
| Routineablauf: Neue Woche, Wochenreview, Committen, WOD-Adjustment ausführen | `trainer-weekly-workflow` |
| Evidenzstandards, Zahlen-/Quellenvalidierung, QA vor Veröffentlichung | `trainer-validation-and-qa` |
| Einen Analyse-Befund in dauerhafte Kanon-Änderung überführen (instructions.md etc.) | `trainer-research-methodology` |
| Begriffsdefinitionen (RPE, Mesocycle, EMOM, Strain, Recovery-Zonen …) | `sc-coaching-reference` |

Diese Skill beantwortet nur: **Wie werte ich eine Situation methodisch sauber aus,
und wie sieht ein vollständiger Analyse-Durchlauf konkret aus?**

---

## Rezept 1 · Limit-Diagnose (Symptom → Mechanismus → Intervention → Validierung)

Die Flaggschiff-Methode des Projekts für jedes Plateau und jede "warum
klappt X nicht?"-Frage.

**Zweck:** Den tatsächlich limitierenden Mechanismus hinter einer stagnierenden
Leistung finden — statt reflexhaft mehr Last, mehr Volumen oder mehr Wochen
zu verordnen.

**Wann:** Ein Ziel wird wiederholt verfehlt, eine Progression stockt, oder eine
Leistung fällt unter die Referenz trotz gehaltener Bedingungen.

**Inputs:** Freie Notizen der betroffenen Sessions (qualitativ!), `load_references`
in `coach/state.json`, Plan der Woche in `website/data.js`, Logbuch-Einträge.

**Schritte:**

1. **Symptom präzise fassen.** Nicht "Snatch läuft schlecht", sondern: welche Last,
   welches Schema, welcher Abstand zum Ziel, wie oft beobachtet.
2. **Mechanismus-Hypothese aus Notiz-Evidenz bilden.** Die freie Notiz enthält fast
   immer den qualitativen Hinweis (Technik, Speed, Position, Grip …). Kriterium:
   **Ein Mechanismus muss ALLE Beobachtungen erklären.** Erklärt er nur einen Teil,
   ist es der falsche oder ein unvollständiger Mechanismus.
3. **Intervention gezielt auf den Mechanismus richten** — nicht auf das Symptom.
   Wenn Speed limitiert, hilft mehr Last nichts; sie verschlimmert das Problem.
4. **Validierungskriterium VOR der Interventionswoche definieren.** Was genau muss
   passieren, damit die Hypothese als bestätigt gilt? (Zahl + qualitatives Merkmal.)
5. **Nach der Woche prüfen und Status setzen:** bestätigt / widerlegt / offen.
   Ergebnis ins Logbuch, Referenz in `state.json` aktualisieren.

**Belegtes Beispiel — Snatch-Plateau W26 → W27:**

| Phase | Inhalt | Quelle |
|---|---|---|
| Symptom | W26 stoppte bei 50 kg (Doubles), Ceiling 52 nicht erreicht | `coach/logbook.md` W26 |
| Mechanismus | Notiz: Hüftspeed + Drop unter die Bar langsam → **"nicht Last, sondern Speed"** ist das Limit | `coach/logbook.md` W26 |
| Intervention W27 | Snatch Balance 4×2 (Speed-Drill, build 40→48 kg) + Hang Squat Snatch 5×1 **speed-gated** (build 44→52, "Stop, sobald der Turnover langsam wird — Speed vor kg") | `website/data.js` W27 Focus A |
| Validierung | Ceiling sauber erreicht: 52,5 kg (Referenz per Commit `9a9ab70` aufs 1,25-kg-Raster korrigiert), Notiz: "Catch spürbar schneller" | `coach/logbook.md` W27; `coach/state.json` → `load_references.squat_snatch_ceiling` |
| Status | **Aufgelöst** ("Snatch-Speed-Baustelle aus W26 aufgelöst") | `coach/logbook.md` W27 |

Beachte: Beide Teile des Validierungskriteriums wurden erfüllt — die Zahl (Ceiling
erreicht) **und** das qualitative Merkmal (Catch schneller). Nur die Zahl allein hätte
auch "an einem guten Tag durchgemogelt" bedeuten können.

**Failure Modes:**

- Symptom behandeln statt Mechanismus (mehr kg auf einen Speed-Defekt legen).
- Mechanismus erst nach der Intervention "rückwirkend" formulieren — dann ist jede
  Intervention scheinbar ein Treffer (Hindsight-Fit).
- Zwei Mechanismen gleichzeitig intervenieren → Validierung kann nichts zuordnen.
- Validierungskriterium ohne qualitatives Merkmal → falsch-positive Bestätigung.
- Mechanismus-Hypothese ohne Notiz-Evidenz aus Plausibilität raten (verstößt gegen
  Quellendisziplin Punkt 3).

---

## Rezept 2 · Plan-vs-Ausführung-Diff

Das Rückgrat jedes Wochenreviews.

**Zweck:** Geplant und tatsächlich Ausgeführt sauber gegenüberstellen und daraus
**nur die entscheidungsrelevanten** Abweichungen ableiten.

**Wann:** Jeder Wochenreview ("Weekly Recap"), außerdem vor jeder Neue-Woche-Planung,
wenn der Vorwochen-Review noch offen ist.

**Inputs:** `website/data.js` (geplante Woche), Website-Notizen (`get_notes.php`
mit Datumsbereich), WHOOP-Wochenreview, Martins Bestätigung ("Plan befolgt?"),
optional Strava.

**Schritte:**

1. Geplante Woche aus `website/data.js` rekonstruieren (Tag → Typ → Einheit).
2. Ausführung aus Notizen + WHOOP + Bestätigung belegen. Bei Unklarheit die
   geschlossene Frage stellen: **"Plan befolgt?"**
3. Diff bilden: pro Tag ✓ / abgewichen / ausgefallen.
4. **Nur entscheidungsrelevante Abweichungen listen** — Abweichungen, die eine
   Konsequenz für Planung, Referenzen oder Flags haben. Kosmetik weglassen.
5. Für jede relevante Abweichung eine Konsequenz formulieren und festhalten
   (Logbuch, `state.json`-Flag oder nächster Wochenplan).

**Belegte Beispiele:**

- **W25 (Abweichung mit Struktur-Konsequenz):** Sa Focus A (Snatch-Reclaim)
  **ausgefallen — vom TeamWOD gefressen** (Strain 19,4). Konsequenz: W26 bekommt
  Focus A auf Montag als **geschützten Slot**, zweiter Anlauf.
  (`coach/logbook.md` W25; umgesetzt in `website/data.js` W26 Mo:
  "Geschützter Slot — frisch, nichts davor.")
- **W27 (fast deckungsgleich):** Logbuch beginnt mit **"Plan befolgt."** Einzige
  gelistete Abweichung: So Social-Ride 2×, **zweite Ausfahrt bis Z4/Z5 statt sozial
  Z1/Z2** — gelistet, weil der Plan explizit "Z1/Z2 halten — nicht mit Strain
  überlagern" vorgab. (`coach/logbook.md` W27; `website/data.js` W27 So)

Der Kontrast zeigt die Methode: In W27 wird nicht jeder Satz nacherzählt, sondern
genau die eine Abweichung, die gegen eine Planvorgabe verstößt. In W25 löst die
Abweichung eine Strukturänderung der Folgewoche aus.

**Failure Modes:**

- Vollprotokoll statt Diff — der Review ertrinkt in bestätigten Plan-Items.
- Abweichung notieren, aber keine Konsequenz ableiten (dann war sie nicht
  entscheidungsrelevant — oder die Analyse ist unfertig).
- Ausführung aus Plausibilität rekonstruieren statt aus Notizen/WHOOP/Bestätigung.
- Teilauswertung: nur WHOOP oder nur Notizen prüfen (Quellendisziplin Punkt 2
  verlangt alle Quellen des Zeitraums).

---

## Rezept 3 · Lastexperiment lesen (Load-Pullback)

**Zweck:** Eine bewusste Veränderung **eines** aggregierten Inputs (z. B.
Wochen-Strain) auswerten, während die Leistungskriterien gehalten werden —
und die Richtung des Effekts lesen.

**Wann:** Nach einer Woche mit gezieltem Pullback/Push, oder wenn entschieden
werden muss, ob eine Laständerung "sich ausgezahlt" hat.

**Inputs:** WHOOP-Wochenaggregat (Strain, Recovery Ø), Topleistungen der Woche
aus Notizen, Vorwochenwerte als Baseline (`coach/logbook.md`).

**Schritte:**

1. **Den einen veränderten Input benennen und beziffern** (relativ zur Vorwoche).
2. **Die Leistungskriterien festhalten**, die trotz Änderung erreicht werden
   sollten (Topgewichte, Rep-Ceilings, Progressionsstufen).
3. Störgrößen offenlegen, die die Lesart erschweren oder schärfen (Recovery-Niveau,
   Schlaf, Termine).
4. Richtung lesen: Input runter + Leistung gehalten/gestiegen = Pullback hat
   gezahlt. Input runter + Leistung gefallen = zu viel weggenommen oder anderer
   Faktor. Nur die **Richtung** interpretieren, keine Kausal-Feinmechanik.
5. Schlussfolgerung mit Konfidenz-Check (≥90 %?) ins Logbuch.

**Belegtes Beispiel — W27-Pullback:**

| Element | Wert | Quelle |
|---|---|---|
| Veränderter Input | Strain gesamt 69,9 = **−22 %** ggü. W26 (bewusst runtergefahren) | `coach/logbook.md` W27 |
| Gehaltene/gestiegene Leistung | FS 100 kg @ RPE 8 glatt (Block Wk 1/3) · BMU 15 total (Bestwert, W26 = 13) · Snatch-Ceiling 52,5 erreicht · WPU +5 kg 3×3 zweite Woche | `coach/logbook.md` W27; `coach/state.json` `load_references` |
| Störgröße (verschärft die Lesart) | Recovery Ø 57 % (2 rot/3 gelb/2 grün) — **niedriger** als W26 (Ø 65 %) | `coach/logbook.md` W27/W26 |
| Schluss | "Pullback hat sich ausgezahlt trotz niedrigerer Recovery als W26" | `coach/logbook.md` W27 |

Die Störgröße macht das Ergebnis **stärker**, nicht schwächer: Topleistungen bei
weniger Last **und** schlechterer Tagesform-Basis → die Richtung ist eindeutig.

**Failure Modes:**

- Mehrere Inputs gleichzeitig ändern (Last UND Übungsauswahl UND Sequenz) —
  das Ergebnis ist dann nicht mehr zuordenbar.
- Leistungskriterien nachträglich wählen ("was gut lief, war das Kriterium").
- Aus einer Ein-Wochen-Beobachtung eine Dosis-Wirkungs-Kurve ableiten — erlaubt
  ist nur die Richtung.
- Recovery-Historie als Prognose für kommende Wochen missbrauchen (explizit
  verboten, Commit `4bd6e0a` / `coach/instructions.md`).

---

## Rezept 4 · Quellenkonflikt-Adjudikation

**Zweck:** Divergierende Werte aus verschiedenen Quellen erkennen, nach Autorität
ranken, **sichtbar markieren** und die Entscheidung dokumentieren.

**Wann:** Immer, wenn zwei Quellen für dieselbe Größe verschiedene Werte liefern
(typisch: WHOOP-Auto-Log vs. Martins freie Notiz).

**Autoritätsrangfolge** (aus `coach/instructions.md`, "WHOOP-Auto-Log vs. freie
Notiz"): **Martins expliziter Satz-/Last-Log in der freien Notiz > WHOOPs
automatische Zählung/Labels.** Zusätzlich: WHOOP rundet Gewichte auf ganze kg —
krumme Ganzzahlen aufs nächste 1,25-kg-Vielfache zurücklesen (Commit `48bdb1c`).

**Schritte:**

1. Divergenz explizit benennen: Größe, Wert A (Quelle), Wert B (Quelle).
2. Rangfolge anwenden. Gibt es eine explizite Notiz von Martin, gewinnt sie.
3. Prüfen, ob die Divergenz ein bekannter systematischer Fehler ist
   (WHOOP-Rundung, Auto-Label-Fehler) — dann kurz als solcher erklären.
4. **Im Review markieren** — auch wenn entschieden wurde. Der Konflikt bleibt
   sichtbar dokumentiert, mit der gewählten Auflösung.
5. Ist keine Quelle klar autoritativ: Konflikt **offen markiert stehen lassen**,
   keinen Wert erfinden.

**Belegte Beispiele (alle `coach/logbook.md`):**

| Konflikt | Adjudikation | Quelle |
|---|---|---|
| W26 BMU: Notiz 13 total vs. WHOOP-Auto 12 | Notiz zählt → Referenz 13 ("WHOOP-Auto zählte 12 — Notiz zählt") | Logbuch W26 |
| W27 Front Squat: WHOOP-Auto-Log labelte als "Back Squat" und zeigte 95 kg statt 100 kg Top | Tracking-Fehler, Martin bestätigt → Notiz/Martins Aussage zählt, Referenz 100 kg | Logbuch W27; `state.json` `front_squat.tempo_top_w27` |
| W26 Pause OHS: "48–49" | **Als Konflikt markiert stehen gelassen** ("Quellenkonflikt Notiz/WHOOP") — kein Wert erfunden | Logbuch W26 |

**Anti-Pattern (verboten):** Stille Auflösung — einfach einen Wert übernehmen,
ohne die Divergenz zu dokumentieren. Quellendisziplin Punkt 8: "Quellenkonflikte
werden markiert, nicht still aufgelöst."

**Failure Modes:**

- WHOOP-Zahl übernehmen, weil sie "präziser aussieht" (Auto-Logs sind gerundet
  und fehl-labelbar — siehe beide W27-Beispiele).
- Konflikt per Mittelwert "lösen" (48,5 gibt es weder als Notiz noch als Platte).
- Adjudikation treffen, aber nicht dokumentieren → beim nächsten Review beginnt
  dieselbe Debatte von vorn.

---

## Rezept 5 · Kalibrierungs-Delta (Entscheidungs-Retro)

**Zweck:** Nach einer korrigierten Entscheidung die **eigene Fehlervorhersage**
gegen das tatsächliche Feedback stellen. Das Delta — was man an sich selbst
NICHT vorhergesagt hat — ist der eigentliche Befund.

**Wann:** Nach jeder Entscheidung, die Martin korrigiert hat oder die sich als
falsch herausstellte. Besonders wertvoll bei Prozess-Fehlern (falsche Reihenfolge,
fehlende Abfrage), nicht nur Sach-Fehlern.

**Schritte:**

1. **BEVOR das Feedback/die Korrektur im Detail gelesen wird:** eigene
   Fehler-Hypothesen schriftlich festhalten. ("Was habe ich vermutlich falsch
   gemacht?") — Das ist der Kern; ohne diese Vorab-Vorhersage gibt es kein Delta.
2. Feedback lesen und die tatsächlichen Fehler listen.
3. Delta bilden: (a) korrekt vorhergesagt, (b) vorhergesagt aber nicht
   eingetreten, (c) **eingetreten aber nicht vorhergesagt** — Kategorie (c) ist
   der Befund, denn dort ist das eigene Modell blind.
4. Für jeden (c)-Befund eine konkrete Maßnahme ableiten (meist eine
   Kanon-Präzisierung — via `trainer-research-methodology` /
   `trainer-change-control` einbringen).
5. Retro als Prosa-Eintrag in `coach/decisions.md` (neueste oben) festhalten.

**Belegtes Beispiel — Retro "Tausch Di/Fr (Focus A/B), W27" vom 2026-06-30
(`coach/decisions.md`):**

- **Korrekt selbst vorhergesagt (a):** Kernfehler = fehlende Recovery-Abfrage vor
  der Argumentation.
- **Nicht erkannt (c) → der eigentliche Befund:** der **Sequenz-Fehler** —
  Rückfrage **nach** statt **vor** der inhaltlichen Argumentation gestellt.
- **Maßnahmen (beide in `coach/instructions.md` gelandet):**
  1. Ad-hoc-Änderung: Grund + Recovery **vor** dem Urteil erfragen.
  2. Unbestätigte physiologische Einschätzungen als **Frage** formulieren,
     nicht als Behauptung.

**Failure Modes:**

- Vorhersage erst nach dem Feedback aufschreiben — dann ist sie kontaminiert
  und das Delta wertlos (dieselbe Hindsight-Falle wie in Rezept 1).
- Nur Sach-Fehler betrachten, Prozess-/Sequenz-Fehler übersehen (genau die
  Kategorie, die im Beispiel das Delta war).
- Retro ohne Maßnahme: ein Befund ohne Kanon- oder Verhaltensänderung
  wiederholt sich.

---

## Rezept 6 · Progression-Promotion-Analyse

**Zweck:** Entscheiden, ob eine Progressionsstufe (Leiter/Treppe) diese Woche
angehoben wird — unter Berücksichtigung der **gesamten Wochen-Kollisionslast**,
nicht nur der Leiter selbst.

**Wann:** Bei jeder Wochenplanung für jedes Ziel mit Progressionstreppe
(BMU, T2B, Weighted Pull-up, Strict HSPU — Treppen in `coach/profile.json` →
`gymnastics_testprotokoll.progressionstreppen`).

**Regeln der Treppe** (aus `coach/profile.json`, Commit `411590f`):

- **Pro Woche höchstens eine Stufe pro Ziel.**
- Stufe gilt erst als **bestätigt, wenn alle Sätze sauber** (kein Failure,
  Technik hält). Bei unsauberem letzten Satz eine Stufe zurück, nicht erzwingen.
- Testsatz nie auf vorermüdetem System (Recovery <50 % oder Grip-/Overhead-Vorlast
  am Vortag) — dann Test um eine Woche schieben.

**Schritte:**

1. Stufenstatus prüfen: Ist die aktuelle Stufe bestätigt (alle Sätze sauber,
   ggf. mehrfach)?
2. **Die ganze Woche auf Kollisionslast scannen** — Box-Tage, WODs, Achsen aus
   `coach/instructions.md` (Grip/Pulling, Overhead, Hinge, Knie/Quad,
   hochvolumige Gymnastics).
3. Entscheiden: promoten / halten / zurückstufen. Halten ist eine aktive
   Entscheidung mit Begründung, kein Versäumnis.
4. Entscheidung mit Begründung in `state.json` (`load_references.*.note`)
   festhalten — inklusive des geplanten Zeitpunkts der nächsten Promotion.

**Belegtes Beispiel — Weighted-Pull-up-Entscheidung 2026-07-06
(Commit `411590f`, `coach/state.json` → `load_references.weighted_pull_up`):**

- Status: +5 kg 3×3 in W27 **zweite Woche in Folge sauber bestätigt** →
  Promotion auf 3×4 wäre nach der Treppe (3×3→3×4→3×5→Testsatz) fällig.
- Kollisions-Scan W28: **Mi-Chipper bringt 20 Burpee-Pull-ups Grip-Last**
  (`website/data.js` W28 Mi), dazu Sa DB Hang Snatch (ebenfalls Grip,
  siehe W28 Fr Focus-B-Note).
- Entscheidung: **W28 bleibt 3×3** (bewusst gehalten), **ab W30 fest 3×4**
  (W29 = Bangkok/De-facto-Deload, `state.json` → `mesocycle_plan.wochenrollen`).

Das Muster: Die Leiter allein hätte "promoten" gesagt — die Wochen-Gesamtlast
kippt die Entscheidung. Und die Entscheidung ist terminiert (W30), nicht vertagt.

**Failure Modes:**

- Nur die Leiter anschauen, die Box-Woche ignorieren (der Chipper hätte die
  3×4-Sätze unsauber gemacht → Stufe wäre "gescheitert" ohne echten Befund).
- Zwei Stufen auf einmal springen, weil eine Woche stark war.
- "Halten" nicht dokumentieren → nächste Session interpretiert es als Stagnation.
- Promotion auf einem vorermüdeten Testtag bewerten.

---

## Rezept 7 · Wochenlogik-Konstruktion

**Zweck:** Eine Woche aus Constraints heraus **konstruieren** statt Übungen auf
Tage zu verteilen — mit schriftlichem Ablehnungsgrund für jede verworfene
Alternative.

**Wann:** Modus "Neue Woche" (Ausführung siehe `trainer-weekly-workflow`;
dieses Rezept liefert die Konstruktions-Denkweise dahinter).

**Schritte:**

1. **Fixe Constraints zuerst** setzen: Termine, Reisen, harte Ruhetage
   (`state.json` → `akute_hinweise`, Martins Angaben).
2. **Schlüssel-Slot schützen:** Die wichtigste CNS-/Speed-Einheit auf den
   frischesten realistischen Tag — geschützt heißt "frisch und passend", nicht
   "fixer Wochentag" (Kanon, Commit `437f9bb`).
3. **Fokus-Rotation prüfen:** Was ist offen (`state.json` → `fokus_rotation.offen`)?
   Offenes bekommt Vorrang beim Fokus-Tag; verdrängte Foki werden anderswo bedient.
4. **Um Kollisionsachsen herum sequenzieren** (Grip/Pulling, Overhead, Hinge,
   Knie/Quad, Gymnastics-Volumen): Abstände schaffen oder Volumen halten.
5. **Jede Auswahl-Entscheidung trägt einen Ablehnungsgrund** für die verworfene
   Alternative — direkt in die Plan-Notes (`data.js`), damit die nächste Session
   die Logik nicht rekonstruieren muss.

**Belegtes Beispiel — Konstruktion der W28 (`website/data.js` W28,
`coach/state.json`):**

| Schritt | W28-Umsetzung | Beleg |
|---|---|---|
| 1. Fixe Constraints | Mo 06.07. kein Training (fix, Martins Vorgabe); So 12.07. Abreise Bangkok → beide `type:"rest"` | `state.json` `akute_hinweise`; `data.js` W28 Mo/So |
| 2./3. Fokus-Slot + Rotation | Focus A = **C&J-Reclaim** (Do), weil Rotation-Flag offen: "seit W25 nicht direkt trainiert" → geschützter Slot fällig | `state.json` `fokus_rotation.offen`; `data.js` W28 Do |
| Rotationsfolge | Snatch wird trotzdem bedient — über die Sa-Box: "Bedient Snatch diese Woche, da Fokus A auf C&J liegt" | `data.js` W28 Sa Note |
| 4. Kollisionsachse Overhead/Pull | Mi-Chipper = 50 HSPU + 20 Burpee-Pull-ups → Focus B erst **Fr** ("Fokus B liegt deshalb erst Fr, nicht direkt danach"), Volumen **gehalten statt gesteigert** (HSPU bleibt 4×6, BMU-Ceiling gehalten 14–15, WPU 3×3) | `data.js` W28 Mi/Fr Notes, Focus B intro |
| 4. Kollisionsachse Quad/FS | Di = FS-Block Wk 2/3 → Do Focus A explizit "kein zusätzliches Front-Squat-Volumen" (Clean Pull/Position statt Squat-Volumen) | `data.js` W28 Di/Do Notes, Focus A Block A |
| 5. Ablehnungsgrund | Mi: "L3 (Burpee BMU statt Pull-up) bewusst nicht gewählt — dupliziert Fokus B" | `data.js` W28 Mi Note |

**Failure Modes:**

- Mit den Wunsch-Einheiten starten und Constraints hinterher "einpassen" —
  endet mit Schlüssel-Einheit auf müdem System.
- Schlüssel-Slot an einen Kalendertag ketten statt an Frische.
- Kollisionsachsen pro Tag prüfen statt über die Wochen-Sequenz (der Mi-Chipper
  kollidiert mit dem Fr, nicht mit dem Mi).
- Alternativen verwerfen ohne notierten Grund — die nächste Session (oder Martin)
  stellt dieselbe Frage erneut.
- Wochenstruktur aus erwarteter Recovery bauen (verboten — Struktur kommt aus
  Trainingslogik, Last-Entscheidungen fallen am Ausführungstag).

---

## Methoden-Auswahltabelle

| Situation | Rezept |
|---|---|
| "Warum stagniert X?" / Ziel wiederholt verfehlt / Plateau | 1 · Limit-Diagnose |
| Wochenreview: Was ist wirklich passiert und was folgt daraus? | 2 · Plan-vs-Ausführung-Diff |
| "Hat sich der Pullback / die Mehrlast gelohnt?" | 3 · Lastexperiment lesen |
| Zwei Quellen, zwei Werte (WHOOP vs. Notiz) | 4 · Quellenkonflikt-Adjudikation |
| Eine Entscheidung wurde korrigiert — was lernen wir über uns? | 5 · Kalibrierungs-Delta |
| "Diese Woche eine Stufe hoch oder halten?" | 6 · Progression-Promotion-Analyse |
| Neue Woche bauen / "warum liegt X am Tag Y?" | 7 · Wochenlogik-Konstruktion |

Kombinationen sind normal: Ein Wochenreview läuft als Rezept 2, findet dabei
einen Quellenkonflikt (Rezept 4), liest ein Lastexperiment aus (Rezept 3) und
speist Promotion-Entscheidungen der Folgewoche (Rezept 6). W27 im Logbuch ist
genau so ein kombinierter Durchlauf.

## Doktrin-Erinnerungen (gelten über allen Rezepten)

1. **Vorhersagen vor Daten.** Validierungskriterien (Rezept 1), Leistungskriterien
   (Rezept 3) und Fehler-Selbstvorhersagen (Rezept 5) werden festgelegt, BEVOR
   die auswertenden Daten gelesen werden. Nachträglich formulierte Kriterien
   sind Hindsight, keine Analyse.
2. **Negativbefunde zählen als Evidenz.** "Ceiling 52 nicht erreicht" (W26) war
   der Datenpunkt, der die gesamte Speed-Diagnose trug. Ausgefallene Einheiten,
   gescheiterte Sätze und gehaltene Stufen werden dokumentiert wie Erfolge.
3. **Dokumentieren nach Change-Control:** Wochenbefunde → `coach/logbook.md`;
   Entscheidungs-Retros → `coach/decisions.md`; bestätigte Referenzen und
   Begründungen → `coach/state.json` `load_references.*.note`; Kanon-Änderungen
   nur über den Prozess in `trainer-change-control` / `trainer-research-methodology`.
   Eine Analyse, die nirgends landet, existiert für die nächste Session nicht.
4. **≥90 % Konfidenz, sonst fragen.** Und pro Runde höchstens eine
   entscheidungsrelevante Frage (`coach/instructions.md`, Ton).

## Provenanz und Wartung

Alle Beispielzahlen verifiziert am 2026-07-11 gegen den Repo-Stand
(HEAD-Nähe: `411590f`). Re-Verifikation pro Rezept:

- Rezept 1: `grep -n "Speed" coach/logbook.md` und `grep -n "squat_snatch_ceiling" -A4 coach/state.json`
- Rezept 2: `grep -n "Plan befolgt\|ausgefallen\|Z4/Z5" coach/logbook.md`
- Rezept 3: `grep -n "69,9\|−22\|Pullback" coach/logbook.md`
- Rezept 4: `grep -n "Quellenkonflikt\|Notiz zählt\|Back Squat" coach/logbook.md coach/instructions.md`
- Rezept 5: `sed -n '1,20p' coach/decisions.md`
- Rezept 6: `git show 411590f -- coach/profile.json coach/state.json` und `grep -n "weighted_pull_up" -A4 coach/state.json`
- Rezept 7: `grep -n "bewusst nicht gewählt\|erst Fr\|Bedient Snatch" website/data.js` und `grep -n "akute_hinweise" -A8 coach/state.json`

Wartung: Wenn W25–W28 aus `website/data.js` herausrotieren (max. vier Wochen)
oder ein Sechs-Wochen-Review die Referenzen neu setzt, Beispiele gegen
`coach/logbook.md` (bleibt vollständig) und die Commit-Historie
(`9a9ab70`, `411590f`, `4bd6e0a`, `437f9bb`) neu belegen — Zahlen nie aus dem
Gedächtnis fortschreiben.
