---
name: sc-coaching-reference
description: Strength-&-Conditioning-Domänenreferenz für dieses Repo — CrossFit-Glossar (was ist ein EMOM, AMRAP, WOD, Chipper, DreamWOD-Level, unbroken, Ceiling, Reclaim), die zwei RPE-Skalen (Load-RPE vs. rpe_feel — nie verwechseln), WHOOP-Konzepte (Recovery, Strain, Kappungsregeln), Autoregulations-Doktrin, Kollisionsachsen, Conditioning-Einschätzung, Progressionsmethodik (keine 1RM-Tests, Gymnastics-Treppen, Plattenmathematik) und Mesocycle-Logik. Nutzen bei "was bedeutet", "was ist ein", "CrossFit Begriff", "RPE", "WHOOP Recovery", "Strain", "Mesocycle", "Deload", "Snatch", "BMU", "Ceiling", "wie funktioniert die Progression", "strength and conditioning theory", "Kollision", "Autoregulation".
---

# S&C-Coaching-Referenz: Domänensprache und Theorie dieses Projekts

Diese Skill erklärt die Fachsprache und die Trainings-Theorie, **wie sie in diesem Repo verwendet wird** — kein allgemeines Lehrbuch. Quellen der Wahrheit: `coach/instructions.md` (Kanon), `coach/profile.json` (Ziele, Ausschlüsse, Testprotokoll), `coach/state.json` (aktueller Zustand), `coach/logbook.md` (gelebte Beispiele W25–W27), `website/data.js` (wie Programmierung real geschrieben wird). Stand aller volatilen Zahlen: 2026-07-11 (state.json aktualisiert 2026-07-06).

## Wann diese Skill NICHT die richtige ist

| Frage | Richtige Skill |
|---|---|
| Wochenprozess ausführen (Neue Woche, Committen, Review) | `trainer-weekly-workflow` |
| Daten ziehen (DreamWOD-Fetch, WHOOP, Notizen, Strava) | `trainer-data-sources` |
| Analysemethoden auf die Daten anwenden | `trainer-analysis-toolkit` |
| Dateischemata und Schreibstil (data.js, state.json …) | `trainer-schemas-and-style` |

Hier steht nur: **was die Begriffe bedeuten und nach welcher Logik entschieden wird.**

---

## 1. Glossar (wie hier verwendet)

### Formate und Setting

| Begriff | Bedeutung in diesem Projekt |
|---|---|
| **CrossFit Box** | CrossFit-Gym. Martins Box: CrossFit Munich. Zuhause zusätzlich „vollständige CrossFit-Box"-Ausstattung (profile.json → wochenmodell). |
| **WOD** | „Workout of the Day" — die programmierte Trainingseinheit der Box. |
| **DreamWOD** | Die Programmier-Plattform/das Wochenprogramm von CrossFit Munich. WODs sind in Levels skaliert; im Repo relevant: **L2** (Martins Standard — „jederzeit sicher") und **L3** (schwerste Ausbaustufe — „regelmäßig, situationsabhängig, kein Dauerkanspruch"); L1 ist die leichteste Stufe (allgemeine Skalierungslogik, im Kanon nicht separat geregelt). Quelle: profile.json → zielbild.rx_standard. |
| **AMRAP** | „As Many Rounds/Reps As Possible" in fester Zeit (z. B. „16 Min AMRAP", data.js W26 Mi). |
| **EMOM** | „Every Minute On the Minute" — jede Minute startet ein definierter Arbeitsblock, Rest = Rest der Minute (z. B. „EMOM 32", data.js W25 Di; BMU-EMOM in allen Focus-B-Tagen). |
| **E1:30 / E2:00 / E2:15 / Every 2:30** | EMOM-Variante mit anderem Intervall: alle N Minuten ein Satz (z. B. „FS E2:15×5" = 5 Sätze Front Squat, alle 2:15 min einer; data.js W27 Mi). |
| **For Time** | Feste Arbeit, so schnell wie sauber möglich; oft mit Time Cap (z. B. „Cap 16 min", data.js W28 Mi). |
| **Chipper** | For-Time-Format, das eine lange Liste „abgearbeitet" wird (z. B. „HSPU-Run-Chipper", data.js W28 Mi). |
| **RFT** | „Rounds For Time" — feste Rundenzahl auf Zeit (z. B. Team-WOD „10 RFT · 40 Min Cap", data.js W26 So). |
| **Buy-in / Cash-out** | Einmalige Arbeit vor bzw. nach dem Hauptteil (z. B. „Buy-in 30 Alt. DB Box Step-ups … Cash-out 30", data.js W28 Sa). |
| **Girls / Hero / Open WODs** | Benannte Benchmark-WODs (z. B. „Gwen", data.js W25 Mi). **Kanon-Pflicht:** Format vor jeder Beratung auf wodwell.com verifizieren — Bewegungen, Reps, Reihenfolge, Rest-/Zeitregeln, RX-Standard. **Nie aus dem Gedächtnis** (instructions.md → Referenzen). |
| **Scaling / RX** | RX = WOD wie vorgeschrieben; Scaling = angepasste Last/Bewegung. Hier über DreamWOD-Level plus konkrete kg-Angaben gesteuert (z. B. „Gwen L2 · 52,5 kg (L3 60 kg wenn smooth)"). |
| **unbroken** | Reps ohne Absetzen/Pause am Stück. Maßeinheit der Gymnastics-Ziele (z. B. „T2B 10 unbroken", profile.json). |
| **Team-WOD** | Partner-WOD, meist Sonntag; Standard-Alternative bei abgesagtem Ride (instructions.md → Neue Woche). |

### Steuerungsbegriffe

| Begriff | Bedeutung in diesem Projekt |
|---|---|
| **Mesocycle (Meso)** | Mehrwochen-Trainingsblock mit Phase und Wochenrollen. Aktuell „Meso 2", 2026-W25 bis W30, Phase „Reclaim / Kapazität / Robustheit" (state.json). |
| **Deload** | Entlastungswoche/-korrektur. **Kein starrer Rhythmus** — trigger-gesteuert (siehe Abschnitt 8). W29 (Bangkok) zählt „de facto als Deload" (state.json). |
| **1RM** | One-Rep-Max. Hier fast nur als Ziel- oder Schätzgröße („1RM-Ziel ohne geplanten Test", profile.json; „kg_1rm_geschaetzt: 105" FS, state.json). **Keine routinemäßigen 1RM-Tests** (instructions.md). |
| **Ceiling** | Obergrenze eines Aufbau-Blocks: das höchste saubere Single im Build, **kein Max-Test**. „Ceiling gilt auch wenn es leicht fühlt" (data.js W25/W26 Focus A). Beispiel: squat_snatch_ceiling 52,5 kg (state.json). |
| **Reclaim** | Wiedererlangen einer früher vorhandenen Kapazität nach Pause — kein Neuaufbau, kein Test. Phasenname von Meso 2; Beispiele: „Snatch-Reclaim" (W25–W27), „C&J-Reclaim" (W28, data.js: „Reclaim nach 3 Wochen Pause … kein Max-Test"). |
| **CNS-Last** | Belastung des Nervensystems durch schnelle/schwere Arbeit. Steuerbegriff: „speed-/CNS-lastige Einheit" braucht ein frisches System; Gegenpol „Low-CNS-Tag" (instructions.md → geschützte Slots, Sonntagslast). |
| **Geschützter Slot** | Schlüssel-Einheit, die ein frisches System braucht — siehe Abschnitt 4. |
| **Hinge** | Hüftdominantes Bewegungsmuster (Deadlift, Clean-Zug etc.); „schwere Hinge-Belastungen" sind eine Kollisionsachse (instructions.md). |
| **Front Rack** | Hantelablage auf Schultern/Schlüsselbein (Clean-Catch, Front Squat, Front Rack Lunges — data.js W28 Focus A). |
| **Kipping vs. Strict** | Kipping = mit Schwung/Hüftimpuls (Kipping Pull-up); Strict = ohne Schwung, reine Kraft (Strict HSPU). Im Projekt strikt getrennt programmiert; bei Strict-Arbeit gilt „kein Failure, kein Kipping danach" (data.js Focus B). |

### Bewegungen (wie im Repo programmiert)

| Bewegung | Kurzdefinition + Projektkontext |
|---|---|
| **Snatch** | Reißen: Hantel in einem Zug vom Boden über Kopf. Varianten hier: **Hang** (Start oberhalb Boden), **Power** (Catch über Parallele), **Squat** (Catch in tiefer Hocke), Kombis wie „Power Snatch + Squat Snatch" (data.js W28 Sa). Ziel: 65 kg; Stand 55 kg (profile.json). |
| **Snatch Balance** | Speed-Drill: aus dem Nacken schnell unter die Hantel in den Overhead-Squat droppen. Hier gezielt als Antwort auf die Speed-Baustelle W26 eingesetzt (data.js W27 Focus A, Block B). |
| **Clean & Jerk (C&J)** | Umsetzen + Ausstoßen. Hier meist als **Komplex** (z. B. „Squat Clean + Push Jerk", 75 kg @ RPE 7, state.json). Ziel: 85 kg; Stand 80 kg (profile.json). |
| **Front Squat (FS)** | Kniebeuge mit Hantel im Front Rack. Ziel: 115 kg; Stand 100 kg; 1RM geschätzt 105 (nicht getestet). Läuft als 3-Wochen-Box-Block (W27–W30, state.json). |
| **Overhead Squat (OHS)** | Kniebeuge mit Hantel über Kopf. **Pause OHS** = mit 2-s-Pause am tiefsten Punkt (Tempo 32X1, data.js). Ziel: ≥65 kg; Stand 55 kg; Pause-OHS-Arbeitswert 50 kg 4×3 (state.json). |
| **Bar Muscle-up (BMU)** | Vom Hang an der Stange in den Stütz über die Stange. Ziel: 5 unbroken; Stand 3 unbroken (profile.json). Aktuelle Akkumulation: 15 total (5×1+5×2, W27; state.json). |
| **Weighted Pull-up (WPU)** | Klimmzug mit Zusatzgewicht. Ziel: 6 Reps @ +5 kg; Stand 3 Reps @ +5 kg (profile.json); aktuell 3×3 @ +5 kg bestätigt (state.json). |
| **Strict HSPU** | Strikter Handstand-Push-up an der Wand. Ziel: 10 unbroken; Stand 6 unbroken (profile.json); aktuell 4×6 (state.json). |
| **Toes-to-Bar (T2B)** | Hängend Zehen an die Stange. Ziel: 10 unbroken; Stand 6 unbroken (profile.json). |
| **GHD** | Glute-Ham-Developer-Gerät; hier GHD Sit-ups als Core-Arbeit (data.js Focus A, 3×10→3×12). |
| **Devils Press** | Burpee + beidarmiger Kurzhantel-Snatch über Kopf in einer Bewegung (data.js W28 Di). |
| **Wall Ball** | Medizinball-Squat mit Wurf an Zielmarke (data.js W28 Di: WB 9 kg auf L2). |
| **Gorilla Row** | Vorgebeugtes, alternierendes Kurzhantel-Rudern aus breitem Stand (data.js W28 Mi). |

**Ausgeschlossene Skills — nie programmieren:** Ring Muscle-ups, Handstand Walks, Crossover Double-Unders (profile.json → ausgeschlossen).

---

## 2. Die zwei RPE-Skalen — niemals verwechseln

Kanon-Regel (instructions.md → „Lasten und RPE"):

| Skala | Was sie misst | Richtung | Wo sie steht |
|---|---|---|---|
| **Load-RPE** | Trainingsintensität **pro Satz** (Rate of Perceived Exertion, ~Nähe zum Limit) | **Höher = näher am Limit.** Caps wie „RPE ≤8", „RPE 8 cap", „≤7" begrenzen die Last nach oben | Pläne: data.js (`rpe`-Felder, Blocktabellen), state.json (load_references) |
| **`rpe_feel`** | Subjektive **Sessionqualität** 1–5 aus Martins Tagesnotiz | **Höher = besser!** | Website-Datenbank `session_notes` (via get_notes.php) |

`rpe_feel`-Emoji-Skala, verifiziert in `website/cron_summary.php` (Zeile 45):

| Wert | Label |
|---|---|
| 1 | 😵 Brutal |
| 2 | 😮‍💨 Schwer |
| 3 | 😐 Okay |
| 4 | 💪 Gut |
| 5 | 🔥 Stark |

Merksatz: **Load-RPE 8 ist hart und gewollt; rpe_feel 2 ist ein Warnsignal.** `rpe_feel ≤2` in zwei aufeinanderfolgenden Einheiten ist ein Deload-Trigger (state.json).

---

## 3. WHOOP-Konzepte, wie hier genutzt

- **Recovery %** (0–100): Tagesform-Ampel. Skala per Kanon (instructions.md): **0–33 % rot · 34–66 % gelb · 67–100 % grün.**
- **Strain**: WHOOPs Belastungsmaß, als Tages- und Wochensumme gelesen (z. B. W27 Wochenstrain 69,9, −22 % ggü. W26; Tagesbeispiel Team-WOD Strain 15,7 — logbook.md). „Harte Sonntagseinheit" ≈ Strain ≳ 15 (instructions.md).
- **Schlafdefizit**: chronischer **Umweltfaktor** (Hitze/Helligkeit/Lärm), ~20 h Defizit dokumentiert (logbook.md W27). Kanon: Kontext, **kein Coaching-Thema** — nicht analysieren oder belehren, drumherum autoregulieren; einziger zulässiger Hebel-Vorschlag: konkret umsetzbar (z. B. Nap).

**Kappungsregel** (instructions.md → „Daily WOD Adjustment"):

| Recovery am Trainingstag | Konsequenz |
|---|---|
| **< 50 %** | Load-RPE-Cap 7 · kein neues Top-Gewicht · letzter Steigerungssatz entfällt |
| **< 34 % (rot)** | nur Technik- und Mobility-Arbeit bis RPE 6 — oder Ruhe |

Gültigkeit: am Trainingstag selbst, berücksichtigt für die nächsten **24–48 h**. Nicht mechanisch auf Tag 3+ weiterprogrammieren.

---

## 4. Autoregulations-Doktrin (Kerntheorie des Projekts)

Alles aus instructions.md → „Quellen- und Verbindungsdisziplin" (Schlussabsätze):

1. **Recovery ist ein Tagesform-Input, nie ein Strukturinput.** Sie autoreguliert die Last am Ausführungstag (RPE-Caps, „wenn instabil → zurück"). Recovery-Historie ist **keine Prognosequelle**; existiert ein aktueller Wert, sind ältere für die Tagesentscheidung irrelevant.
2. **Struktur kommt aus Trainingslogik**: Sequenz, Kollisionen, Lastverteilung, Termine — nie aus erwarteter oder vergangener Recovery.
3. **Geschützte Slots = frisches System, kein fester Wochentag.** Eine speed-/CNS-lastige Schlüssel-Einheit darf an den frischesten Tag verschoben werden, statt sie auf ein müdes System zu zwingen. (Gelebt: Focus A W27 von Fr auf Di vorgezogen, data.js W27.)
4. **Kein Stacking-Dogma.** Harte Wochenend-Last ist mit einem Ruhetag danach vom Rest der Woche entkoppelt; relevant ist nur der akute Übertrag in die unmittelbar nächste Einheit — gelöst per Recovery-Abfrage, nicht per Pauschalverbot.
5. **Sonntagslast → Montag-Standard.** Nach harter Sonntagseinheit (Ride, Team-WOD, Strain ≳ 15) ist Montag standardmäßig Ruhe/Low-CNS, nie Schlüsselslot. **Upgrade nur in eine Richtung**: grüne Montag-Recovery darf spontan hochstufen; nie eine Schlüssel-Einheit auf einen erhofften guten Montag planen.
6. **Ruhetage sind harte Ruhetage** — kein „optional, je nach WHOOP".

---

## 5. Kollisionsachsen (Box + Fokus-Überschneidung)

Überschneidung ist erlaubt und wird über **Volumen, Intensität, Übungsauswahl und Sequenz** gesteuert — keine Pauschalverbote (instructions.md → Fokus-Tage). Zu managende Achsen:

1. schwere Hinge-Belastungen
2. Overhead- und Oly-Volumen
3. Grip und Pulling
4. Knie- und Quad-Stress
5. hochvolumige Gymnastics-Arbeit

**Gelebtes Beispiel (data.js W28):** Mi-Chipper bringt 50 HSPU total + 20 Burpee Pull-ups (Overhead + Grip/Pull). Antwort: Focus B am Fr wird im **Volumen gehalten, nicht gesteigert** — „HSPU bleibt 4×6, kein Push auf 4×6-7", BMU-Ceiling gehalten bei 14–15, WPU bleibt 3×3. Zusätzlich Sequenz: Focus B „liegt deshalb erst Fr, nicht direkt danach". Und Selektion: L3 am Mi (Burpee BMU) bewusst nicht gewählt, weil es Focus B dupliziert.

---

## 6. Conditioning-Reiz einschätzen

Kanon (instructions.md → „Lasten und RPE"): **Nach Bewegungsmuster + Puls beurteilen, nicht nach Last.** Ein Mixed-Modal-Stück mit Laufen, T2B oder kurzen, schnellen Bewegungszyklen ist **nie „moderat"**, auch bei leichtem Gewicht — es treibt zuverlässig in Zone 4+ und zählt als harte Einheit in der Wochenlast. Leichte Last ≠ leichter Reiz. Bei AMRAPs/Intervallen mit solchen Mustern von High-Intensity-Cardio ausgehen.

Wenn eine Belastungseinschätzung nicht aus state.json oder bestätigten Daten ableitbar ist: als **Frage an Martin** stellen, nicht als Coaching-Aussage behaupten.

---

## 7. Progressionsmethodik

### Weightlifting

- **Keine routinemäßigen 1RM-Tests** (instructions.md). Fortschritt über technisch saubere Singles/Doubles, RPE, Stabilität und tatsächliche erfolgreiche Lifts. Ein Ziel gilt endgültig als erreicht, wenn das Zielgewicht **sauber gehoben** wurde; mehrere eindeutige freie Notizen dürfen als Nachweis gelten.
- Vor jeder Lastempfehlung: load_references in state.json prüfen; ohne Referenz Martin fragen oder RPE-Kalibrierung planen. Nur bestätigte Daten.
- **Plattenmathematik** (instructions.md): Lasten nur in **Vielfachen von 1,25 kg**. Verfügbare Scheiben 1,25 / 2,5 / 5 / 10 / 15 / 20 / 25 kg; symmetrische Ladung → **kleinster Gesamtsprung 2,5 kg**. Also 42,5 / 45 / 47,5 / 50 — nie 42 / 46 / 48.
- **WHOOP-Rundungsfalle**: WHOOP rundet auf ganze kg (47,5 → 48, 42,5 → 43). Krumme Ganzzahlen aus WHOOP auf das nächste 1,25-Vielfache zurücklesen.
- Kurzhanteln, die eindeutig als Gesamtgewicht geloggt sind: Gesamtgewicht ÷ 2 = kg pro Hand; bei Unklarheit RPE statt kg.

### Gymnastics (profile.json → gymnastics_testprotokoll)

Alle 3–4 Wochen ersetzt ein **Max-Unbroken-Testsatz** (frisch, als erster Arbeitssatz des Fokus-Tags) den regulären ersten Satz; Ergebnis aktualisiert den Zielstand. **Nächster Test: 2026-W30** (Stand: 2026-07-11).

Progressionstreppen (wörtlich aus profile.json):

| Ziel | Treppe |
|---|---|
| bar-muscle-up | EMOM-Akkumulation: 10×1 → 5×1+5×2 → 10×2 → 2er/3er-Cluster → Testsatz max unbroken (Ziel 5) |
| toes-to-bar | 3×7 → 3×8 → 3×9 → 3×10 → Testsatz max unbroken (Ziel 10) |
| weighted-pull-up | 3×3 → 3×4 → 3×5 @ +5 kg → Testsatz 6 Reps @ +5 kg |
| strict-hspu | 4×5 → 4×6 → 4×7 → 4×8 → Testsatz max unbroken (Ziel 10) |

Regeln (profile.json):
1. Pro Woche höchstens **eine Stufe pro Ziel**; Stufe gilt erst als bestätigt, wenn alle Sätze sauber (kein Failure, Technik hält).
2. Bei unsauberem letzten Satz **eine Stufe zurück**, nicht wiederholt erzwingen.
3. Testsatz **nie auf vorermüdetem System** (Recovery <50 % oder Grip-/Overhead-Vorlast am Vortag) — dann Test um eine Woche schieben.

### Aktuelle Arbeitswerte (Stand: 2026-07-11, aus state.json → load_references)

Pause OHS 50 kg 4×3 (nächstes Ziel 52,5) · Squat-Snatch-Ceiling 52,5 kg erreicht W27 · FS 1RM geschätzt 105 (Top 100 @ RPE 8, Block W2/3 in W28) · C&J-Komplex 75 kg @ RPE 7 (W25) · WPU +5 kg 3×3 (ab W30 fest 3×4) · Strict HSPU 4×6 · BMU 15 total · Push-Press-Basis 82,5 kg.

---

## 8. Mesocycle-Logik, wie praktiziert

**Meso 2** (state.json → mesocycle_plan): 2026-W25 bis 2026-W30, Phase „Reclaim / Kapazität / Robustheit". Wochenrollen:

| Woche | Rolle |
|---|---|
| W25 | Wiedereinstieg nach Wien — abgeschlossen |
| W26 | Kapazität/Progression, voll durchgezogen — abgeschlossen |
| W27 | Load-Pullback (−22 %) + Snatch-Speed-Reclaim — abgeschlossen |
| W28 | Letzte volle Belastungswoche: C&J-Reclaim, FS-Block Wk 2/3, Gymnastics gehalten |
| W29 | Bangkok (Arbeitsreise) — Erhalt/Improvisation nach Ausstattung; zählt de facto als Deload |
| W30 | Rückkehr: FS-Block Wk 3/3 abschließen, WPU-Progression 3×4 starten, Sechs-Wochen-Zielreview fällig |

**Deload-Trigger** (wörtlich, state.json):
1. Recovery an ≥3 aufeinanderfolgenden Tagen rot (<34 %)
2. `rpe_feel` ≤2 in zwei aufeinanderfolgenden Einheiten
3. Leistungsabfall bei gehaltener Last (Reps/kg unter Vorwochen-Referenz trotz RPE-Cap)

Hinweis aus state.json: Trigger lösen **keinen starren Deload-Rhythmus** aus, sondern eine **sofortige Wochenkorrektur — Volumen zuerst, dann Intensität**. W29 ist der natürliche Deload dieses Bogens.

**Review-Rhythmus**: alle 6 Wochen Zielreview (profile.json → review_rhythmus_wochen). Das ist ein Bewertungsrhythmus, **kein erzwungenes Mesocycle-Ende** — ein Schwerpunkt darf begründet verlängert werden; Martin schlägt neue Ziele im Review vor (instructions.md). Erster Sechs-Wochen-Review noch offen, fällig W30 (state.json).

---

## 9. Gelebtes Denkmuster: der Snatch-Fall W26→W27 („Diagnose vor Verordnung")

Modellfall dafür, wie hier gecoacht wird (logbook.md W26/W27, data.js W27):

1. **Befund (W26):** Snatch stoppte bei 50 kg (Doubles), Ceiling 52 nicht erreicht. Notiz: Hüftspeed + Drop unter die Bar langsam.
2. **Diagnose:** **Nicht Last, sondern Speed ist das Limit.** (Also wäre „mehr Gewicht draufpacken" oder „Ceiling senken" beides falsch.)
3. **Verordnung (W27):** Speed-Bias-Intervention statt Lastprogression — **Snatch Balance** als Speed-Drill („Aggressiver, schneller Drop. Das ist die Baustelle — Geschwindigkeit, nicht Last") + **speed-gated Hang Squat Snatch** („Stop, sobald der Turnover langsam wird — Speed vor kg"; Ceiling 52 gilt nur bei schnellem Drop).
4. **Ergebnis (W27):** Volle Ceiling 52,5 kg sauber erreicht, Catch laut Notiz spürbar schneller — „Speed-Baustelle aus W26 aufgelöst" (logbook.md, state.json).
5. **Konsequenz (W28):** Ceiling-Anhebung (z. B. 55 kg) prüfen — erst nach gelöster Ursache wird die Last wieder Thema.

Lehre: Zuerst die **limitierende Größe identifizieren** (Speed, Stabilität, Grip, Volumen …), dann die Intervention exakt darauf richten, mit einem messbaren Gate — nie reflexhaft an der Last drehen. „Diagnose vor Verordnung. Outcome vor Übung." (instructions.md → Ton).

---

## Provenanz und Wartung

| Fakt in dieser Skill | Quelle | Re-Verifikation |
|---|---|---|
| RPE-Doppelskala, Kappungsregeln, Recovery-Skala, Autoregulations-Doktrin, Kollisionsachsen, Conditioning-Regel, Plattenmathematik, wodwell-Pflicht, 1RM-Politik | `coach/instructions.md` | `grep -n "RPE\|Recovery\|Kollision\|1,25\|wodwell" coach/instructions.md` |
| rpe_feel-Emoji-Labels (Brutal…Stark) | `website/cron_summary.php` Z. 45 | `grep -n "rpe_label" website/cron_summary.php` |
| Ziele, Stände, Ausschlüsse, Gymnastics-Testprotokoll + Treppen, Review-Rhythmus 6 Wo, nächster Test W30 | `coach/profile.json` | `cat coach/profile.json` |
| Meso-2-Plan W25–W30, Wochenrollen, Deload-Trigger, load_references, Fokus-Rotation | `coach/state.json` | `cat coach/state.json` |
| Strain 69,9 (W27), Snatch-Fall W26→W27, Schlafdefizit ~20 h | `coach/logbook.md` | `grep -n "69,9\|Speed\|Defizit" coach/logbook.md` |
| W28-Chipper-Beispiel, Formate (EMOM/E2:00/Chipper/Buy-in), Ceiling-/Reclaim-Verwendung | `website/data.js` | `grep -n "Chipper\|Ceiling\|Reclaim\|Buy-in" website/data.js` |
| Volatil (bei jedem Wochenreview neu prüfen) | state.json → `aktualisiert_am` | `grep -n "aktualisiert_am\|aktuelle_woche" coach/state.json` |

Volatile Fakten (Arbeitswerte, Wochenrollen, „nächster Test W30", „erster Sechs-Wochen-Review offen") tragen den Stempel **Stand: 2026-07-11** und müssen nach jedem Wochenreview gegen `coach/state.json` neu gelesen werden — diese Skill nie als Ersatz für den Pflichtstart (state.json + data.js lesen) verwenden.
