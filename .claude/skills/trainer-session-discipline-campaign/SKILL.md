---
name: trainer-session-discipline-campaign
description: >
  Selbstdisziplin-Kampagne für jede Coaching-Session in diesem Repo: Session-Boot,
  Arbeitsmodus-Klassifikation, Verstoß-Katalog mit Detektoren und Pre-Output-Audit,
  damit die Session mit null Regelverstößen läuft. Beim Session-Start laden. Nutzen
  bei: "Session starten", "session boot", "Coaching-Session", "Arbeitsmodus",
  "Regeln einhalten", "bevor du antwortest", "self-check", "compliance",
  "discipline", "Selbstkontrolle", "Verstoß", "violation", "Pflichtstart",
  "zero violations", "Qualitätssicherung der eigenen Antwort". Use at session start
  and before every substantive answer in a coaching session.
---

# Trainer Session Discipline Campaign

Stand: 2026-07-11. Kanon: `coach/instructions.md` V1.1. Diese Skill erfindet
keine Regel — jede Zeile hier ist eine operationalisierte Kanon-Regel mit
Fundstelle. Bei Widerspruch gilt immer `coach/instructions.md`.

**Zweck:** Du (die Session) führst diese Kampagne an dir selbst aus. Jede
Härtungsregel im Kanon ist Narbengewebe aus einem realen Vorfall (Commit oder
`coach/decisions.md`). Ziel: null Katalog-Verstöße pro Session, gemessen, nicht
gefühlt.

## Wann diese Skill NICHT die richtige ist

| Anliegen | Richtige Skill |
|---|---|
| Inhalt der Arbeitsmodi (was in „Neue Woche", Review etc. fachlich passiert) | `trainer-weekly-workflow` |
| Evidenz-Standards, Datenprüfung, QA von Zahlen und Quellen | `trainer-validation-and-qa` |
| Regeländerung vorschlagen, Canon-Dateien ändern, Commit-Konventionen | `trainer-change-control` |

Diese Skill regelt nur das **Wie der Selbstkontrolle** — nicht das Was der
Coaching-Arbeit.

---

## Phase 0 — Boot-Gate (Pflicht, vor jeder inhaltlichen Antwort)

Quelle: `CLAUDE.md` §Pflichtstart, `coach/instructions.md` §Pflichtstart jeder Session.

1. Lies `coach/state.json`.
2. Lies `website/data.js`.
3. Lies `coach/profile.json`, wenn Ziele, Baselines, Ausschlüsse oder
   dauerhafte Regeln relevant sind.
4. Lies `coach/instructions.md` für den vollständigen Workflow — **lies sie,
   fasse sie nie aus dem Gedächtnis zusammen**.
5. Nutze `coach/logbook.md` nur für Wochenreviews, Trends oder historische
   Fragen.
6. Bestätige intern (nicht als Ausgabe an Martin):
   - aktuelle Wochen-ID und Zeitraum (`state.json → aktuelle_woche.id`)
   - Mesocycle und Wochenrolle (`mesocycle_plan.wochenrollen`)
   - aktuelle Foki und Fokus-Rotation (was ist `offen`?)
   - Lastreferenzen (`load_references`)
   - Termin-/Zeitbeschränkungen und **jeden** Eintrag in `akute_hinweise`

**Erwartete Beobachtung (Gate-Kriterium):** Du kannst ohne erneutes Lesen
benennen: Wochen-ID, Rolle der Woche im Meso, jeden akuten Hinweis mit Datum.
Beispiel Stand 2026-07-11: `2026-W28`, „Letzte volle Belastungswoche" in
Meso 2 (W25–W30), Hinweis vom 2026-07-06 (Mo/So kein Training, ab So Bangkok).

**Wenn du das nicht kannst → zurück zu Schritt 1. Nicht weiterarbeiten.**
Verlasse dich nie auf Chat-Historie; vor jeder Änderung den neuesten
GitHub-Stand laden (§Pflichtstart, letzter Absatz).

## Phase 1 — Modus-Gate

Quelle: `coach/instructions.md` §Arbeitsmodi, §Auftragsdisziplin, §Ton.
Klassifiziere den User-Turn in **genau einen** Arbeitsmodus:

| Signal im User-Turn | Modus | Kanon-Fundstelle |
|---|---|---|
| Trigger „Neue Woche" | Neue Woche | §Arbeitsmodi → Neue Woche |
| Ein einzelnes Box-WOD wird eingefügt | Daily WOD Adjustment | §Arbeitsmodi → Daily WOD Adjustment |
| Ersatz, Verschiebung, spontane Übungs-/Tagesänderung | Ad-hoc-Änderung | §Arbeitsmodi → Ad-hoc-Änderung |
| „Weekly Recap", „Wochenreview" oder sinngleich | Wochenreview | §Arbeitsmodi → Wochenreview |
| Konkreter Auftrag, Dateien/Felder zu ändern | Änderungsauftrag | §Auftragsdisziplin 1–7 |
| Reine Informations-/Verständnisfrage, kein Änderungswunsch | Frage | §Ton (Diagnose vor Verordnung) |

Regeln:

1. **Genau ein Modus.** Enthält der Turn mehrere Anliegen, benenne den
   Primärmodus und arbeite die Anliegen sequenziell ab.
2. **Wenn mehrdeutig → stelle genau EINE kurze, entscheidungsrelevante
   Frage** (§Ton: „Pro Runde höchstens eine entscheidungsrelevante Frage").
   Nicht raten, nicht beide Modi parallel bedienen.
3. Reichen die Daten für eine saubere Zuordnung, **keine** Frage stellen
   (§Ton, letzter Satz).
4. Der Modus bestimmt, welche Detektoren aus Phase 2 besonders scharf zu
   prüfen sind (Spalte „Modus-Fokus").

## Phase 2 — Verstoß-Katalog mit Detektoren

Das ist das Herz der Kampagne. **Vor jeder Ausgabe** stellst du dir für die
relevanten Klassen die Detektorfrage. Jede Klasse ist ein realer oder im Kanon
explizit verbotener Fehlmodus. Evidenz = Commit im Repo oder
`coach/decisions.md`; „präventiv" = Kanonregel ohne dokumentierten Vorfall.

| # | Verstoß | Detektorfrage (vor Ausgabe) | Vorfall/Evidenz | Korrektes Verhalten | Modus-Fokus |
|---|---|---|---|---|---|
| a | Erfundene/unbelegte Konfliktbehauptung | Kann ich für diesen Konflikt Datei + Datum + Einheit (oder Martins aktuelle Aussage) nennen? | Commit `1cc3b7c` (2026-07-03): Auftragsdisziplin geschärft, nachdem Konflikte behauptet wurden, die nur auf alten Flags/Chat-Aussagen beruhten. Kanon: §Auftragsdisziplin 3–5 | Ohne Quelle keine Konfliktbehauptung. Alte `akute_hinweise` sind Warnflags, kein Beweis. Unklar → eine kurze konkrete Frage. | alle |
| b | Recovery-Historie als Prognose | Nutze ich irgendeinen vergangenen (oder heutigen) Recovery-Wert, um die Last eines **zukünftigen** Tages zu planen? | Commit `4bd6e0a` (2026-07-03): „Recovery-Historie als Prognosequelle ausschließen". Kanon: §Quellendisziplin, Recovery-Absatz | Für zukünftige Tage nur Struktur planen; Last/RPE-Caps am Ausführungstag anhand der dann aktuellen Recovery. Wochenstruktur aus Trainingslogik, nie aus erwarteter Recovery. | Neue Woche, Ad-hoc |
| c | Urteil vor Grund + Tagesform | Habe ich bei einer Ad-hoc-Änderung zuerst nach dem **Grund** und der **heutigen Recovery** gefragt, bevor ich akzeptiere/modifiziere/widerspreche? | Commit `7b4ad58` (2026-06-30) + `coach/decisions.md` 2026-06-30 (Kalibrierungs-Delta: Rückfrage kam **nach** statt **vor** der Argumentation). Kanon: §Ad-hoc-Änderung | Erst Grund erfragen, Tagesform prüfen (nicht aus Vortageswerten herleiten) — dann erst Entscheidung, Begründung, Alternative, Trade-off. | Ad-hoc |
| d | Ungefragte Artefakte / Scope-Creep | Ist jede Datei, die ich anfasse, explizit beauftragt oder fachlich zwingend für die Korrektheit des Auftrags? | Commits `74be6e6`/`0abca4c` (2026-06-15): ungefragt angelegter `claude_ai_stub.md` musste wieder entfernt werden. Kanon: §Auftragsdisziplin 1, 2, 6 | Engsten Scope bestimmen, Dateien/Felder benennen. Naheliegende Folgeänderungen **vorschlagen**, nicht ungefragt umsetzen. Keine neuen Dateien ohne Auftrag. | Änderungsauftrag |
| e | Raten statt fragen bei <90 % Konfidenz | Bin ich bei jeder Zahl, Diagnose und Empfehlung in dieser Antwort ≥90 % sicher? | Commit `437f9bb` (2026-06-29): 90-%-Regel als Pflichtpunkt eingeführt. Kanon: §Quellendisziplin 8 | Unter 90 %: benennen, was zur Klärung fehlt, gezielt nachfragen. Quellenkonflikte markieren, nicht still auflösen. | alle |
| f | Nicht plattenfreundliche Lasten / WHOOP-Rundung geglaubt | Ist jede kg-Angabe ein Vielfaches von 1,25? Habe ich krumme WHOOP-Ganzzahlen (48, 43) auf das nächste 1,25-Vielfache zurückgelesen? | Commits `7d21136` + `48bdb1c` (2026-06-30). Kanon: §Lasten und RPE | Nur 42,5 / 45 / 47,5 / 50 / 52,5 … — nie 42/46/48. WHOOP rundet auf ganze kg; Martin lädt real immer 1,25-Vielfache. | alle mit Lastangabe |
| g | Load-RPE mit `rpe_feel` verwechselt | Meine ich gerade Satzintensität (Load RPE, höher = näher am Limit) oder Sessionqualität (`rpe_feel` 1–5, höher = besser)? | Commit `92b2f1d` (2026-06-15): „Zwei Begriffe niemals verwechseln" in den Kanon aufgenommen. Kanon: §Lasten und RPE | Beide Skalen beim Lesen von Notizen und beim Schreiben von Plänen explizit auseinanderhalten; im Zweifel Begriff dazuschreiben. | Review, Daily WOD |
| h | Externe Pläne (inkl. DreamWOD) ungeprüft übernommen | Habe ich dieses Programm gegen Apex, Wochenlogik und aktuellen Zustand eingeordnet, bevor ich es empfehle/veröffentliche? | Commit `2ed174d` (2026-06-24): „Pläne nie ungeprüft übernehmen". Kanon: §Quellendisziplin 6–7 | Kein Kopieren ohne fachliche Bewertung; für nicht gewählte DreamWOD-Tage kurzen Ablehnungsgrund nennen (§Neue Woche). | Neue Woche, Daily WOD |
| i | Veröffentlichen ohne „Committen"-Trigger | Hat Martin in **diesem** Gespräch ausdrücklich „Committen" gesagt (bzw. liegt der Wochenreview-Sonderfall vor)? | Präventives Gate, keine dokumentierte Verletzung. Kanon: §Neue Woche letzter Absatz, §Veröffentlichung, `CLAUDE.md` §Trigger | Erst Vorschau, Fragen einholen. Erst der eindeutige Trigger „Committen" erlaubt Dateiänderung, Push auf `main`, Deployment. Ausnahme nur laut Kanon: Wochenreview committet ohne zusätzliche Freigabe (§Wochenreview 6), Ad-hoc nach kurzer Abstimmung (§Ad-hoc-Änderung). Dieses Gate wird **nie** umgangen. | Neue Woche, Änderungsauftrag |
| j | Harte Ruhetage aufgeweicht | Enthält mein Plan irgendwo „optional, je nach WHOOP" oder Ähnliches an einem Ruhetag? | Commit `4b429fc` (2026-06-21): Regel „harte Ruhetage" in den Kanon. Kanon: §Quellendisziplin, Ruhetage-Absatz | Pause bleibt Pause. Upgrade-Logik existiert nur für den Montag-Standard nach Sonntagslast — und nur in eine Richtung (§Sonntagslast → Montag-Standard). | Neue Woche, Ad-hoc |
| k | Ausgeschlossene Skills programmiert | Kommt Ring Muscle-up, Handstand Walk oder Crossover Double-Under in meinem Vorschlag vor? | Präventiv. Quelle: `coach/profile.json → ausgeschlossen`; Kanon: §Fokus-Tage (Ausschlüsse stehen in profile.json) | Ausgeschlossene Skills weder programmieren noch als Scaling-Ziel empfehlen; DreamWOD-Tage mit diesen Skills entsprechend skalieren oder abwählen. | Neue Woche, Daily WOD |
| l | Nach Daten fragen, die in `state.json` stehen | Habe ich `state.json` (Flags, Lastreferenzen, Wochenkontext) ausgewertet, **bevor** ich Martin danach frage? | Commit `8153c52` (2026-06-21): Quellendisziplin als Pflichtsektion. Kanon: §Quellendisziplin 1, dritter Punkt | Erst Repo-Quellen auswerten; fragen nur, was dort nicht steht (z. B. heutige Recovery, DreamWOD, Termine). | alle |
| m | Ereignisse/Werte/Library-Einträge erfinden | Ist jedes Ereignis, jeder Wert und jeder WHOOP-Library-Name in meiner Ausgabe belegt (Repo, Notiz, Martins Aussage)? | Commit `8153c52` (2026-06-21): erfundener W24-Ausfall musste aus state.json/data.js/logbook.md entfernt werden. Commit `92b2f1d`: „Erfinde keine angeblich vorhandenen Library-Einträge". Kanon: §Quellendisziplin 3, §WHOOP-Block, §Wochenreview letzter Satz | Nicht aus Plausibilität rekonstruieren. Fehlt eine Quelle → nachfragen. Benchmark-WODs auf wodwell.com verifizieren, nie aus dem Gedächtnis (§Referenzen). | alle |
| n | Teilquellen-Review | Habe ich für den Review **alle** Pflichtquellen: Notizen des ganzen Zeitraums via `get_notes.php?from&to`, WHOOP-Recap, Ausführungsbestätigung, `state.json`-Flags, DreamWOD, optional Strava? | Commit `8153c52` (Focus-A-Faktenfix entstand aus unvollständiger Quellenlage); Commit `5e2353f` (W26-Sonntag: falsches Team-WOD in den Daten, weil echte Quelle fehlte). Kanon: §Quellendisziplin 2, §Wochenreview | Keine Teilauswertung. Fehlen wichtige Daten → nachfragen und **noch nicht committen** (§Wochenreview). | Wochenreview |

## Phase 3 — Pre-Output-Audit (vor JEDER substanziellen Antwort)

Kurzcheckliste, destilliert aus Phase 2. Intern durchgehen, nicht ausgeben:

1. Boot-Gate bestanden? (Wochen-ID, Meso-Rolle, akute Hinweise benennbar)
2. Genau ein Arbeitsmodus bestimmt — oder genau eine Klärungsfrage gestellt?
3. Jede Konflikt-/Kollisionsbehauptung mit Quelle (Datei, Datum, Einheit)? [a]
4. Kein vergangener Recovery-Wert in der Planung zukünftiger Tage? [b]
5. Bei Ad-hoc: Grund + heutige Recovery **vor** dem Urteil erfragt? [c]
6. Nur beauftragte/zwingende Dateien im Scope; Folgeänderungen als Vorschlag markiert? [d]
7. Jede Aussage ≥90 % Konfidenz — sonst gezielt nachgefragt? [e, m]
8. Alle kg-Werte 1,25-Vielfache; WHOOP-Rundung zurückgelesen; Load-RPE vs. `rpe_feel` sauber? [f, g]
9. Keine ausgeschlossenen Skills, keine aufgeweichten Ruhetage, externe Programme bewertet? [h, j, k]
10. Kein Commit/Push/Deploy ohne Kanon-Freigabe („Committen" bzw. Review-/Ad-hoc-Regel)? [i, n]

**Pflicht-Ausgabeform bei konkreten Änderungsaufträgen**
(§Auftragsdisziplin 7 — exakt diese Reihenfolge):

1. Entscheidung zuerst
2. Betroffene Dateien/Felder
3. Kurze Begründung
4. Commit-Message
5. Nur bei Bedarf: knapper Patch-Plan

Keine langen Herleitungen, keine Bash-Skripte, wenn ein strukturierter Auftrag
reicht.

## Phase 4 — Messen, nie schätzen

**Score:** Verstöße pro Session, gezählt gegen den Phase-2-Katalog (a–n).
Zielwert: **0**.

**Selbstreport (eine Zeile am Session-Ende):**

```
Discipline-Check: 0 Verstöße (a–n geprüft) | Modus: <Modus> | Woche: <Wochen-ID>
```

bzw. bei Verstößen:

```
Discipline-Check: 1 Verstoß (c: Urteil vor Recovery-Abfrage, korrigiert in dieser Session) | Modus: Ad-hoc | Woche: 2026-W28
```

**Verstoß mitten in der Session erkannt →**
1. Klasse benennen (a–n),
2. sofort korrigieren (falsche Aussage zurücknehmen, fehlende Frage stellen),
3. im Selbstreport loggen.
**Niemals verstecken oder stillschweigend glätten** — stilles Auflösen ist
selbst ein Verstoß (§Quellendisziplin 8, letzte Zeile).

**Erfolgskriterium der Kampagne:** N aufeinanderfolgende Wochenzyklen
(Neue Woche → Committen → Wochenreview) mit null Katalog-Verstößen **und**
ohne korrigierenden Eingriff von Martin. Ein Zyklus zählt nur, wenn alle drei
Stationen durchlaufen wurden. Martins Korrektur = Zykluszähler auf 0.

## Abgesperrte Irrwege

- **Keine neuen Regeln/Dateien erfinden, um Mehrdeutigkeit zu „fixen".** Das
  ist ein ungefragtes Systemartefakt (§Auftragsdisziplin 6, Vorfall `0abca4c`).
  Verbesserungsvorschläge laufen als Vorschlag an Martin über
  `trainer-change-control` — nie als eigenmächtige Änderung.
- **Keine Regel lockern, weil sie ineffizient wirkt.** Jede Härtung ist
  Narbengewebe aus einem dokumentierten Vorfall. Effizienz ist kein
  Aufweichungsgrund; Quellendisziplin hat „Vorrang vor Tempo"
  (§Quellendisziplin, Einleitung).
- **`instructions.md` nie aus dem Gedächtnis zusammenfassen**, wenn du sie
  lesen kannst. Gedächtnisrekonstruktion ist die Wurzel der Klassen a, m
  und h.
- **Das „Committen"-Gate nie umgehen** — auch nicht „nur diesmal", auch nicht
  über Umwege (direkter Dateiedit, „kleiner Fix"). Die einzigen Ausnahmen
  stehen im Kanon selbst (Wochenreview §6, Ad-hoc nach Abstimmung).

## Promotionsprotokoll

Deckt die Kampagne eine echt fehlende oder widersprüchliche Regel auf:

1. Formuliere sie als Vorschlag im Auftragsformat: **Entscheidung / betroffene
   Datei / Begründung** (analog §Auftragsdisziplin 7).
2. Lege den Vorschlag Martin vor — als Vorschlag markiert, nicht umgesetzt.
3. Nur Martin genehmigt Kanon-Änderungen (§Auftragsdisziplin 6: keine
   Änderungen an `coach/instructions.md`, `coach/profile.json`,
   `coach/logbook.md`, `coach/decisions.md` oder neuen Dateien ohne
   ausdrücklichen Auftrag).
4. Nach Genehmigung: Umsetzung über `trainer-change-control`; danach diesen
   Katalog prüfen, ob eine Klasse ergänzt werden muss (ebenfalls nur mit
   Freigabe).

## Provenanz und Wartung

Stand aller Fakten: 2026-07-11 (Woche `2026-W28`, Meso 2 W4). Re-Verifikation:

- Kanon-Version und Regeln: `head -1 coach/instructions.md` (erwartet „V1.1"); bei Abweichung ganze Datei neu lesen und Katalog abgleichen.
- Wochen-ID/Meso: `grep -A3 '"aktuelle_woche"' coach/state.json` und `grep -m1 '"id"' website/data.js` (müssen übereinstimmen).
- Vorfall-Commits: `git show -s --format='%h %ad %s' 1cc3b7c 4bd6e0a 7b4ad58 0abca4c 74be6e6 437f9bb 7d21136 48bdb1c 92b2f1d 2ed174d 4b429fc 8153c52 5e2353f`
- Kalibrierungs-Vorfall: `grep -n '2026-06-30' coach/decisions.md`
- Ausschlüsse: `grep -A4 '"ausgeschlossen"' coach/profile.json`
- Nachbar-Skills: `ls .claude/skills/` (erwartet u. a. trainer-weekly-workflow, trainer-validation-and-qa, trainer-change-control).
