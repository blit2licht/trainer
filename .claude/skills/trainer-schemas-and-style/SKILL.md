---
name: trainer-schemas-and-style
description: >
  Feldkatalog und Hausstil für Martins Trainingscoach-Repo: state.json Feld-Schema,
  profile.json Schema, data.js Struktur (weeks/days/focusDays), logbook Eintrag
  schreiben, decisions.md Format, commit message Konventionen, Hausstil/Ton,
  Ausgabeformat für Fokus-Tage, plattenfreundliche Lasten, Templates und Skeletons
  (Woche eintragen, state-Rollover, akuter Hinweis). Use when you need the exact
  schema of any file of record, a copy-paste template, the house writing style, or
  commit message conventions. Trigger words: "schema", "Feld", "Struktur",
  "template", "Skeleton", "logbook Eintrag", "data.js Struktur", "commit message",
  "Hausstil", "Woche eintragen".
---

# Trainer Schemas & Style — Feldkatalog aller Dateien + Hausstil

Stand: 2026-07-11 (aktuelle Woche 2026-W28, Meso 2 W4, `schema_version` 1 in beiden JSON-Dateien). Alle Feldnamen und Beispiele stammen wörtlich aus den echten Dateien. Bei Widerspruch gilt immer `coach/instructions.md` (Kanon V1.1).

## Wann diese Skill NICHT die richtige ist

| Anliegen | Richtige Skill |
|---|---|
| Der Prozess, der diese Dateien füllt (Neue Woche, Wochenreview, WOD-Anpassung) | `trainer-weekly-workflow` |
| `website/data.js` veröffentlichen, pushen, Deployment prüfen | `trainer-publish-and-deploy` |
| Ob du eine Datei überhaupt ändern darfst (Scope, Freigaben) | `trainer-change-control` |
| Bedeutung der Trainingsbegriffe (RPE, EMOM, Tempo-Codes, Meso) | `sc-coaching-reference` |

## Dateien im Überblick

| Datei | Rolle | Änderungsrhythmus |
|---|---|---|
| `coach/state.json` | Schlanker aktueller Zustand, Lastreferenzen, akute Flags | Wöchentlich (Review) + ad hoc |
| `coach/profile.json` | Stabiles Athletenprofil, Ziele, Ausschlüsse | Nur bei stabilen Änderungen, auf expliziten Auftrag |
| `website/data.js` | Veröffentlichter Plan (max. 4 Wochen) | Wöchentlich bei „Committen" |
| `coach/logbook.md` | Ein verdichteter Eintrag pro Woche | Wöchentlich (Review) |
| `coach/decisions.md` | Retro-Prosa-Notizen, neueste oben | Anlassbezogen |
| `coach/reviews/` | Separate Sechs-Wochen-Reviews | Alle ~6 Wochen |

---

## 1. `coach/state.json` — Schema

**Grundsatz: state.json ist SCHLANKER aktueller Zustand, keine Historie.** Historie gehört ins Logbuch; Rohdaten bleiben in WHOOP/Strava/Website-DB (`coach/instructions.md`, „Datenmodell und Wahrheit").

Top-Level-Keys (verifiziert 2026-07-11):

| Key | Typ | Bedeutung | Beispiel aus der Datei |
|---|---|---|---|
| `schema_version` | number | Schemaversion | `1` |
| `aktualisiert_am` | string (ISO-Datum) | Letztes Update | `"2026-07-06"` |
| `aktuelle_woche` | object | Aktive Kalenderwoche | s. unten |
| `mesocycle_plan` | object | Laufender Meso-Bogen | s. unten |
| `aktuelle_foki` | object | Fokus-Listen `gymnastics[]` und `weightlifting[]` | `"gymnastics": ["Bar Muscle-up", "Weighted Pull-up", "Strict HSPU", "Toes-to-Bar"]` |
| `fokus_rotation` | object | Schutz gegen wegrutschende Foki | s. unten |
| `load_references` | object | Arbeitszahlen pro Übung | s. unten |
| `akute_hinweise` | array | Kurzlebige Flags | s. unten |
| `hinweis_ablauf` | string | Ablaufregel für Flags | `"Beim Wochenreview neu bewerten; spätestens nach 7 Tagen entfernen, wenn nicht erneut bestätigt."` |
| `datenquellen` | object | Woher Daten kommen (`dreamwod`, `whoop`, `notizen`, `strava`) | `"notizen": "Website-Datenbank über get_notes.php"` |
| `naechster_zielreview` | string | Review-Fälligkeit als Text | `"Nach sechs Trainingswochen; Schwerpunkt darf begründet verlängert werden."` |
| `systemstatus` | string | Systemzustand als Freitext | `"V1.0 produktiv; Wochenreviews W25, W26 und W27 im Logbuch abgeschlossen. Erster Sechs-Wochen-Review noch offen."` |
| `migration` | object | `{version, abgeschlossen_am}` | `{"version": "1.0", "abgeschlossen_am": "2026-06-15"}` |

### `aktuelle_woche`

| Feld | Typ | Beispiel |
|---|---|---|
| `id` | string, `YYYY-Wnn` | `"2026-W28"` |
| `von` / `bis` | ISO-Datum, immer Mo–So | `"2026-07-06"` / `"2026-07-12"` |
| `mesocycle` | string | `"Meso 2"` |
| `woche_im_fokus` | number (Woche im Meso) | `4` |
| `phase` | string | `"Reclaim / Kapazität / Robustheit"` |
| `veroeffentlichter_plan` | string (Pfad) | `"website/data.js"` |

### `mesocycle_plan`

| Feld | Typ | Beispiel |
|---|---|---|
| `id` | string | `"Meso 2"` |
| `zeitraum` | string | `"2026-W25 bis 2026-W30"` |
| `phase` | string | `"Reclaim / Kapazität / Robustheit"` |
| `wochenrollen` | object, Key `Wnn` → Rollentext; abgeschlossene Wochen mit Suffix „— abgeschlossen" | `"W27": "Load-Pullback (−22 %) + Snatch-Speed-Reclaim — abgeschlossen"` |
| `deload_trigger` | array of strings | `"rpe_feel ≤2 in zwei aufeinanderfolgenden Einheiten"` |
| `hinweis` | string | „Trigger lösen keinen starren Deload-Rhythmus aus, sondern eine sofortige Wochenkorrektur …" |

### `fokus_rotation`

| Feld | Typ | Beispiel |
|---|---|---|
| `hinweis` | string | „Verhindert, dass ein Fokus über Wochen wegrutscht. …" |
| `zuletzt_bedient` | object, Key = Übung (snake_case) → Wochen-Label | `"clean_jerk": "W25"`, `"front_squat": "W27 (Box-Block-Start)"` |
| `offen` | array of strings (überfällige Foki mit Begründung + Pfeil zur Konsequenz) | `"Clean & Jerk — seit W25 nicht direkt trainiert, in W27 zugunsten Snatch zurückgestellt → W28 nachholen"` |

### `load_references`

Objekt mit `hinweis` („Arbeitszahlen aus letzten bestätigten Sessions. Beim Wochenreview aus WHOOP auffrischen.") plus ein Objekt pro Übung (snake_case-Key). Felder sind **nicht uniform** — nur das verwenden, was belegt ist:

| Feld | Typ | Vorkommen/Beispiel |
|---|---|---|
| `kg` | number oder string | `50` (pause_ohs), `"+5"` (weighted_pull_up = Zusatzlast) |
| `schema` | string Satzschema | `"4x3"`, `"3x3"` |
| `rpe` | number | `7` (clean_jerk_komplex) |
| `note` | string | s. unten |
| ad-hoc-Felder | je nach Übung | `erreicht_w27: 52.5` (squat_snatch_ceiling), `kg_1rm_geschaetzt: 105` + `tempo_top_w27: 100` (front_squat), `reps_total: 15` (bmu) |

**Konvention: `note` trägt Entscheidung + nächstes Ziel.** Muster aus der echten Datei: bestätigter Ist-Wert mit Quelle/Woche → getroffene Entscheidung → nächster Schritt. Beispiel (`weighted_pull_up.note`): „W27 zweite Woche in Folge +5 kg 3×3 sauber bestätigt. Entscheidung 06.07.: W28 bleibt 3×3 …, ab W30 fest 3×4 nach V5-Progressionstreppe (3×3→3×4→3×5→Testsatz)." Beispiel (`pause_ohs.note`): „W27-Top 50 kg sauber erreicht … Nächstes Ziel 52,5."

### `akute_hinweise`

Array von Objekten:

```json
{
  "datum": "2026-07-06",
  "betrifft": "Terminlage W28",
  "hinweis": "Mo 06.07. kein Training (fix, Martins Vorgabe). So 12.07. kein Training — ab So 1 Woche Bangkok (Arbeit). W29 braucht flexible Planung, Ausstattung vor Ort noch unklar."
}
```

**7-Tage-Regel** (`hinweis_ablauf` + Kanon): Beim Wochenreview jeden Hinweis neu bewerten; spätestens nach 7 Tagen entfernen, wenn nicht erneut bestätigt. Alte Hinweise sind Warnflags, nie alleiniger Konfliktbeweis (Auftragsdisziplin Regel 3).

---

## 2. `coach/profile.json` — Schema

**Nur für STABILE Änderungen und nur auf expliziten Auftrag ändern** (Kanon: „`coach/profile.json` nur bei stabilen Änderungen aktualisieren" + Auftragsdisziplin Regel 6).

| Key | Typ | Inhalt (Beispiele aus der Datei) |
|---|---|---|
| `schema_version` | number | `1` |
| `athlet` | object | `name` „Martin", `alter` 45, `groesse_cm` 184, `gewicht_kg` 80, `trainingserfahrung_jahre` „13+", `gesundheit` (Freitext) |
| `zielbild` | object | `apex`: „Lange gesund, fit und robust leben und im CrossFit auf Masters-Niveau leistungsfähig bleiben." · `rx_standard`: „DreamWOD Level 2 sicher; Level 3 regelmäßig situationsabhängig, aber nicht dauerhaft verpflichtend." |
| `wochenmodell` | object | `standard` {`box_tage`: 3, `fokus_tage`: 2, `radfahrt`: „Sonntag, optionales Socializing"}, `prioritaet_bei_zeitmangel` [„Fokus-Tage", „Box", „Radfahrt"], `bei_nur_drei_einheiten`, `fokus_dauer_min` „60-90", `ausstattung` |
| `leistungsziele` | array | s. unten |
| `ausgeschlossen` | array | **Nie programmieren:** `"Ring Muscle-ups"`, `"Handstand Walks"`, `"Crossover Double-Unders"` (verifiziert — exakt diese drei) |
| `gymnastics_testprotokoll` | object | s. unten |
| `review_rhythmus_wochen` | number | `6` |
| `neue_ziele` | string | „Martin schlägt neue Ziele beim Review vor." |

### `leistungsziele[]`

```json
{ "id": "snatch", "ziel": "65 kg sauber gehoben", "stand": "55 kg", "typ": "1RM-Ziel ohne geplanten Test" }
{ "id": "bar-muscle-up", "ziel": "5 unbroken", "stand": "3 unbroken", "typ": "Gymnastics" }
```

- `id` ist kebab-case (`bar-muscle-up`, `toes-to-bar`, `weighted-pull-up`, `strict-hspu`, `snatch`, `clean-and-jerk`, `front-squat`, `overhead-squat`).
- `typ` observed: `"Gymnastics"` oder `"1RM-Ziel ohne geplanten Test"`.
- **Erreicht-Regel** (Kanon): Ein Ziel gilt endgültig als erreicht, wenn das Zielgewicht **sauber gehoben** wurde (mehrere eindeutige freie Notizen dürfen als Nachweis gelten); keine routinemäßigen 1RM-Tests. Gymnastics-Zielstände aktualisiert der Max-Unbroken-Testsatz aus dem Testprotokoll.

### `gymnastics_testprotokoll`

Felder: `hinweis` (Testsatz frisch, als erster Arbeitssatz des Fokus-Tags, ersetzt den regulären ersten Satz; Ergebnis aktualisiert `leistungsziele`-Stand), `testfrequenz_wochen` `"3-4"`, `naechster_test` `"2026-W30"`, `progressionstreppen` (Key = Ziel-`id` → Treppe als String, z. B. weighted-pull-up: `"3×3 → 3×4 → 3×5 @ +5 kg → Testsatz 6 Reps @ +5 kg"`), `regeln[]` (max. eine Stufe/Woche, Stufe erst bestätigt wenn alle Sätze sauber; bei unsauberem letzten Satz eine Stufe zurück; Testsatz nie vorermüdet — Recovery <50 % oder Grip-/Overhead-Vorlast am Vortag → Test eine Woche schieben).

---

## 3. `website/data.js` — Schema

Eine Datei, ein Objekt: `const DATA = { weeks: [...] };`

**Regeln (Header-Kommentar der Datei + Kanon):** Neue Woche als neues Objekt **VORNE** in `weeks[]` (neueste zuerst) · **maximal 4 Wochen** behalten · **`isoDate` ist Pflicht** — Join-Key des Notes-Systems (Website-Notizen/`rpe_feel` hängen daran).

### Wochen-Objekt

| Feld | Typ | Beispiel (W28) |
|---|---|---|
| `id` | string `YYYY-Wnn` | `"2026-W28"` |
| `label` | string | `"Woche 4 · 6.–12. Juli 2026"` |
| `meso` | string | `"Meso 2 · Woche 4"` |
| `phase` | string | `"Reclaim / Kapazität / Robustheit"` |
| `dateFrom` / `dateTo` | ISO-Datum (Mo/So) | `"2026-07-06"` / `"2026-07-12"` |
| `days` | array, immer Mo–So, 7 Einträge | s. unten |
| `focusDays` | object mit Keys `A` und/oder `B` | s. unten |

### Tages-Objekt (`days[]`)

| Feld | Typ | Pflicht | Beispiel |
|---|---|---|---|
| `day` | string | ja | `"Dienstag"` |
| `date` | string `TT.MM.` | ja | `"07.07."` |
| `isoDate` | string ISO | **ja — Notes-Join-Key** | `"2026-07-07"` |
| `type` | string, observed: `box` \| `own` \| `rest` \| `ride` | ja | `"box"` |
| `einheit` | string (bei rest oft `"—"` oder z. B. `"Mobility + Nap"`) | ja | `"Front Squat (Wk 2/3) + Row/Wall Ball/Devils Press"` |
| `sub` | string (Detail-Zeile) | nur Trainingstage | `"FS E2:00×5 (70→92-95 %) → 6 Rd …"` |
| `rx` | string, **darf HTML enthalten**: `<span class='rv'>…</span>` hebt Werte hervor | ja (bei rest `"—"`) | `"FS bis <span class='rv'>~97,5–100 kg</span> · WOD L2: DB 20 kg + WB 9 kg"` |
| `rpe` | string | Trainingstage | `"RPE ≤8 (Topsatz)"`, `"Cap 16 min"` |
| `note` | string (Coaching-Hinweis/Begründung) | ja | `"Setzt den FS-Block von letzter Woche fort …"` |
| `focus` | string `"A"`/`"B"` | nur `type:"own"` | `"A"` |
| `strava` | object `{km, time, elev, speed}` (km/time/speed strings, elev number) | optional, retro nach Review (observed: W25 So) | `{ km:"74.5", time:"2h 35m", elev:263, speed:"28.8" }` |

### `focusDays.A` / `focusDays.B`

| Feld | Typ | Beispiel |
|---|---|---|
| `title` | string | `"🏋️ Focus-Tag A"` |
| `date` | string | `"Donnerstag · 09.07.2026"` |
| `sub` | string (Themen mit `·` getrennt) | `"Clean & Jerk Reclaim · Positionsarbeit · Front-Rack-Stabilität"` |
| `intro` | string (Kontext: warum dieser Tag so aussieht, letzte bestätigte Werte) | „Seit W25 nicht direkt trainiert … Letzter bestätigter Wert: 75 kg @ RPE 7 …" |
| `blocks` | array | s. unten |
| `whoop` | array of 2er-Arrays | s. unten |

**Block-Objekt** `{letter, title, sub, headers, rows, note?}`:

- `letter`: `"A"`, `"B"`, … · `title`: Blockname · `sub`: Schema-Zeile (z. B. `"Every 2:00 · 6 Sätze · Reclaim nach 3 Wochen Pause"`).
- `headers`: Spaltennamen. Hauptblöcke: `["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"]`. Mobility-Blöcke: `["Übung","Dauer","Note"]`.
- `rows`: Array von String-Arrays, positionsgleich zu `headers`. **`||` in einer Zelle** trennt Haupttext von Subtext — die Website rendert alles nach `||` als `<small>` (index.html, `splitMain()`). Beispiel-Row: `["Squat Clean||+ Push Jerk","6 × (1+1)||build","55 → 60 → 65 → 70 → 75 → 77,5 kg","≤8","X","Restliche 2:00","W25-Wert war 75 kg @7. …"]`
- `note` (optional): Block-Fußnote, z. B. Tempo-Erklärung („Tempo 21X0: 2s descent, 1s Stirn, explosiv hoch, keine Pause oben.") oder Logging-Auftrag („Topgewicht in WHOOP loggen.").

**`whoop[]`**: Paare `["Übungsname aus der WHOOP-Bibliothek", "Verordnung"]`, z. B. `["Pull Up (Weighted)","3 × 3 · +5 kg · RPE 7–8"]`, `["Snatch – Barbell","5 × 1 Hang Squat Snatch · build 44→52 kg · speed-gated · Topgewicht loggen"]`. Nur echte Library-Namen verwenden, keine erfinden (Kanon „WHOOP-Block"). Observed Namen: Bar Muscle Up, Pull Up, Pull Up (Weighted), Toes to Bar, Handstand Push Up, Overhead Squat, Snatch – Barbell, Snatch Balance, GHD Sit Up, Clean Pull, Power Clean (Hang), Squat Clean, Push Jerk, Walking Lunge (Front Rack).

---

## 4. `coach/logbook.md` — Eintragsformat

Ein verdichteter Eintrag pro Woche, **neueste oben** (W27 steht vor W26). Rohdaten bleiben in WHOOP/Strava/Website-DB (Kopfzeile der Datei).

Format, abgeleitet aus den realen Einträgen W25–W27:

1. **Heading**: `## 2026-Wnn · <Datumsbereich> · Meso <n> W<n>` — real: `## 2026-W27 · 29. Juni–5. Juli · Meso 2 W3`, `## 2026-W25 · 15.–21. Juni · Meso 2 W1`.
2. **Ausführungszeile**: beginnt mit `**Plan befolgt.**` (bzw. `**Plan befolgt — alles durchgezogen.**`; W25 abweichend `**Ausgeführt:**`), dann Tag-für-Tag mit `·` getrennt und `✓` je bestätigter Einheit, danach Wochenkennzahlen (Recovery Ø, Strain, Schlaf).
3. **`**Kernbefunde:**`** — Bullets, der zentrale Befund pro Bullet **gefettet vorangestellt** (z. B. „**Snatch-Speed-Baustelle aus W26 aufgelöst:** …").
4. Abschluss: `**Offen für Wnn:**` (offene Punkte für die Folgewoche) und/oder `**Wnn-Antwort:**` (wie die Folgewoche auf die Befunde antwortet). Optional `**Flag aufgelöst:**` (W26).

### Kopierfertiges Skeleton

```markdown
## 2026-Wnn · <T.>–<T.> <Monat> · Meso <n> W<n>

**Plan befolgt.** Mo <Einheit> ✓ · Di <Einheit> ✓ · Mi <…> ✓ · Do <…> ✓ · Fr <…> ✓ · Sa <…> ✓ · So <…>. Recovery Ø <n> % (<x> rot/<y> gelb/<z> grün), Strain gesamt <n>, Schlaf <Befund>.

**Kernbefunde:**
- **<Befund gefettet>:** <Beleg mit kg/Reps/Quelle, ggf. Konsequenz>.
- **<Befund>:** <…>.
- <kleinere Befunde ohne Fettung>.

**Offen für Wnn+1:** <Rotation-Flags, anstehende Progressionen, Termine>.
```

Abweichungen vom Plan nicht verstecken: real wird z. B. „**Sa Focus A ausgefallen → TeamWOD**" gefettet notiert; Quellenkonflikte (WHOOP-Auto-Log vs. Notiz) werden markiert, nicht still aufgelöst.

---

## 5. `coach/decisions.md` und `coach/reviews/`

**`coach/decisions.md`**: „Fortlaufende Prosa-Notizen aus Retrospektiven. Neueste Einträge oben." Einträge mit `---` getrennt, Heading `## YYYY-MM-DD — <Titel>`, danach freie Prosa (real: Kalibrierungs-Delta, nummerierte Maßnahmen, offene Frage). Kein starres Schema — Retro-Prosa, kein Zustandsspeicher.

**`coach/reviews/`**: separate Sechs-Wochen-Reviews. Stand 2026-07-11: **noch keins abgeschlossen** (README: „Noch kein Review abgeschlossen."), erster Review fällig **W30** (`state.json` `mesocycle_plan.wochenrollen.W30`: „Sechs-Wochen-Zielreview fällig"). Ein Dateinamens-/Formatstandard existiert noch nicht — beim ersten Review festlegen.

---

## 6. Hausstil

Quelle: `coach/instructions.md` „Ton", „Auftragsdisziplin" Regel 7, „Ausgabeformate", „Lasten und RPE" + gelebte Praxis in data.js/logbook.

- **Deutsch, direkt, ehrlich, präzise.** Keine Sycophancy, keine Motivationsposter, keine Vorträge über Basics. Keine pauschalen Alters-Caveats.
- **Diagnose vor Verordnung. Outcome vor Übung. Entscheidung zuerst** — bei Änderungsaufträgen: Entscheidung, betroffene Dateien/Felder, kurze Begründung, Commit-Message, nur bei Bedarf knapper Patch-Plan. Keine langen Herleitungen.
- **Pro Runde höchstens eine entscheidungsrelevante Frage.** Reichen die Daten, keine Frage stellen.
- **Ausgabeformat Fokus-Tag-Übung** (Pflichtfelder pro Übung): Name · Sätze × Reps oder Dauer · Kilogramm **oder** RPE-Kalibrierung (ohne bestätigte Referenz nie kg raten) · Load-RPE · Tempo · Pause · kurze Block-Notiz.
- **Load-RPE ≠ `rpe_feel`** — nie verwechseln: Load-RPE = Intensität pro Satz (höher = näher am Limit); `rpe_feel` = subjektive Sessionqualität 1–5 (höher = besser).
- **Plattenfreundliche Lasten:** nur Vielfache von 1,25 kg — 42,5 / 45 / 47,5 / 50 / 52,5, **nie** 42 / 46 / 48. WHOOP rundet auf ganze kg (47,5 → 48) — krumme WHOOP-Ganzzahlen aufs nächste 1,25-Vielfache zurücklesen.
- Gelebte Mikro-Typografie in data.js/logbook: `·` als Trenner, `→` für Build-Folgen und Konsequenzen, `—` für Einschübe, kg mit Komma (77,5 kg).

---

## 7. Commit-Message-Konventionen

Empirisch aus `git log --oneline --all` (Stand 2026-07-11): **deutscher, imperativer/nominaler Betreff, Inhalt zuerst**, häufig mit Bereichs-Präfix. Observed Präfixe: `coach:` (Kanon/Steuerung), `docs:` (instructions/Doku), `feat:` / `fix:` (Website-Funktionalität u. a.), `web:` (Website-Pakete), `data:` (data.js-Korrektur), `state:` (state.json). Wochen-Meilensteine auch ohne Präfix (`W28-Plan veröffentlichen (06.–12.07.)`, `Wochenreview W27 abschließen`).

Drei reale Beispiele:

```
feat: Wochenreview W26 + Plan W27 (Meso 2 W3)
state: W2-Snatch-Sequenz-Hinweis, obsoleten 06-19-Hinweis entfernt
docs: Recovery-Historie als Prognosequelle ausschließen
```

---

## 8. Templates

### Rollover-Checkliste `state.json` (neue Woche / Wochenreview)

Felder, die sich wöchentlich ändern — alles andere nur bei echtem Anlass:

- [ ] `aktualisiert_am` → heutiges Datum
- [ ] `aktuelle_woche`: `id`, `von`, `bis` (Mo–So), `woche_im_fokus` hochzählen; `mesocycle`/`phase` nur bei Meso-Wechsel
- [ ] `mesocycle_plan.wochenrollen`: abgeschlossene Woche mit „— abgeschlossen" markieren
- [ ] `fokus_rotation.zuletzt_bedient`: alle diese Woche direkt bedienten Foki auf `"Wnn"` setzen
- [ ] `fokus_rotation.offen`: bediente Flags entfernen, neue überfällige mit Begründung + `→`-Konsequenz eintragen
- [ ] `load_references`: bestätigte Werte aus WHOOP/Notizen auffrischen; `note` = Ist-Wert + Entscheidung + nächstes Ziel
- [ ] `akute_hinweise`: jeden Eintrag neu bewerten, >7 Tage alte unbestätigte entfernen, neue eintragen
- [ ] `systemstatus`: abgeschlossene Reviews nachführen
- [ ] `naechster_zielreview` / `gymnastics_testprotokoll.naechster_test` (profile) prüfen — profile nur auf expliziten Auftrag ändern

### Skeleton akuter Hinweis

```json
{
  "datum": "YYYY-MM-DD",
  "betrifft": "<Woche/Thema, z. B. Terminlage W28>",
  "hinweis": "<konkreter Fakt + Konsequenz für die Planung>"
}
```

### Logbook-Skeleton

Siehe Abschnitt 4 (kopierfertig).

---

## Provenanz und Wartung

Alle Angaben verifiziert am 2026-07-11 gegen den Repo-Stand. Re-Verifikation — jedes Kommando ist getestet und läuft aus dem Repo-Root:

```bash
# state.json Top-Level-Keys
python3 -c "import json;print(sorted(json.load(open('coach/state.json')).keys()))"

# profile.json Top-Level-Keys
python3 -c "import json;print(sorted(json.load(open('coach/profile.json')).keys()))"

# Ausschlüsse (nie programmieren)
python3 -c "import json;print(json.load(open('coach/profile.json'))['ausgeschlossen'])"

# data.js Wochen-IDs (max 4, neueste zuerst)
node -e "eval(require('fs').readFileSync('website/data.js','utf8')+';globalThis.D=DATA');console.log(D.weeks.map(w=>w.id).join(' '))"

# data.js type-Werte zählen
grep -oE 'type:"[a-z]+"' website/data.js | sort | uniq -c

# Logbook-Eintragsformat (Heading + Ausführungszeile)
head -20 coach/logbook.md

# Commit-Konventionen
git log --oneline --all | head -30

# ||-Rendering als <small> in der Website
grep -nF "split('||')" website/index.html
```

Bei Abweichung: Datei gewinnt, Skill aktualisieren. Kanon-Konflikte immer zugunsten `coach/instructions.md` auflösen.
