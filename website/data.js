/* ════════════════════════════════════════════════════════════
   data.js — AI Coach · Martin
   Nur diese Datei wächst pro Woche.
   Neue Woche = neues Objekt VORNE in weeks[] einfügen.
   isoDate-Felder sind Pflicht — werden vom Notes-System genutzt.
   Tage mit `wod`: keine Einheiten-Überschrift nötig (wird nicht gerendert), und
   Skalierungsstufe (`level`), RPE-Deckel (`rpe`) und Zeitcap (`cap`) gehören in
   das wod-Objekt, zu dem sie gelten — nicht in `rx`. Die Lastzeile der
   Wochenkarte gibt es nicht mehr; bei Ride-Tagen steht `rx` neben der Einheit.
   Fokus-Blöcke: `kurz` ist die Kurzform für die Blockliste der Wochenkarte.
════════════════════════════════════════════════════════════ */
const DATA = {

  /* ── Regeln: wortgetreu aus coach/instructions.md bzw. coach/profile.json.
     Werden in der UI hinter benannten Aufklapp-Elementen gezeigt. Hier steht
     die allgemeine Fassung; tagesspezifische Konkretisierungen stehen als
     focusDay.recoveryDay am jeweiligen Fokus-Tag. ── */
  regeln: {
    recovery: {
      titel: "Recovery-Anpassung am Trainingstag",
      skala: "WHOOP-Recovery-Skala: 0–33 % rot · 34–66 % gelb · 67–100 % grün",
      stufen: [
        { schwelle: "Recovery unter 50 %", ton: "gelb", punkte: [
          "Load-RPE-Cap 7",
          "kein neues Top-Gewicht",
          "der letzte Steigerungssatz entfällt"
        ] },
        { schwelle: "Recovery unter 34 % (rot)", ton: "rot", punkte: [
          "nur Technik- und Mobility-Arbeit bis RPE 6 — oder Ruhe"
        ] }
      ],
      geltung: "Die Kappung gilt am Trainingstag selbst und wird für die nächsten 24–48 Stunden berücksichtigt. Nicht mechanisch Tag 3 und später darauf programmieren.",
      quelle: "coach/instructions.md · Daily WOD Adjustment"
    },
    ausfall: {
      titel: "Wenn eine Einheit ausfällt",
      punkte: [
        "Bei Zeitmangel gilt: Fokus-Tage vor Box vor Radfahrt.",
        "Sind nur drei Einheiten möglich, werden standardmäßig beide Fokus-Tage und der wertvollste Box-Tag geplant.",
        "Ruhetage sind harte Ruhetage. Wenn ein Tag als Pause geplant ist, bleibt er Pause."
      ],
      innerhalb: "Innerhalb einer Einheit gilt dieselbe Reihenfolge: zuerst fallen die als optional markierten Blöcke (Hypertrophie-Layer, Cool-down/Mobility), danach erst Kernblöcke.",
      quelle: "coach/instructions.md · Trainingsmodell und Ruhetage-Regel"
    },
    /* typ = Name des Tages (Badge), chip = Rang aus der Ausfall-Regel.
       Beide Beschriftungen kommen aus dieser einen Stelle, damit ein Tagestyp
       nirgends zwei Namen bekommt. */
    prio: {
      own:  { rang: 1,    typ: "Focus",   chip: "Prio 1/3" },
      box:  { rang: 2,    typ: "Box",     chip: "Prio 2/3" },
      ride: { rang: 3,    typ: "Ride",    chip: "Prio 3/3" },
      rest: { rang: null, typ: "Ruhetag", chip: "Bleibt Pause" }
    }
  },

  /* ── Glossar: nur Begriffe, die im Plan tatsächlich vorkommen. ── */
  glossar: {
    "L2": {
      term: "L2 — DreamWOD Level 2",
      def: "Skalierungsstufe des Box-Programms. Zielstandard: Level 2 jederzeit sicher.",
      quelle: "coach/instructions.md · Apex und Entscheidungshierarchie"
    },
    "L3": {
      term: "L3 — DreamWOD Level 3",
      def: "Nächsthöhere Skalierungsstufe: regelmäßig und situationsabhängig. Kein Elite- oder dauerhafter Level-3-Anspruch.",
      quelle: "coach/instructions.md · Apex und Entscheidungshierarchie"
    },
    "RPE-gated": {
      term: "RPE-gated",
      def: "Die Lastangabe ist eine Obergrenze, kein Soll. Gesteigert wird nur, solange der Load-RPE-Cap des Tages gehalten wird und die Technik steht — sonst auf dem letzten sauberen Gewicht ausfahren. Load RPE 8 ≈ zwei Wiederholungen in Reserve.",
      quelle: "coach/instructions.md · Lasten und RPE"
    },
    "Ceiling": {
      term: "Ceiling",
      def: "Oberste Last der Einheit. Sie wird nur bei sauberer Ausführung angesteuert und ist ausdrücklich kein Max-Test — routinemäßige 1RM-Tests finden nicht statt.",
      quelle: "coach/instructions.md · Langfristige Steuerung"
    },
    "E2:15": {
      term: "E2:15",
      def: "Intervallnotation: alle 2:15 Minuten beginnt ein neuer Satz, die Restzeit des Intervalls ist Pause. Gleiche Logik wie E1:30, E2:00 oder EMOM.",
      quelle: "Notation im Wochenplan"
    },
    "Sonntagslast-Regel": {
      term: "Sonntagslast-Regel",
      def: "Trägt der Sonntag eine harte Einheit (Ride, Team-WOD, Strain ≳ 15), wird der Montag standardmäßig als Ruhe- oder Low-CNS-Tag geplant und nie als Schlüsselslot angesetzt. Upgrade nur in eine Richtung: Zeigt die Montag-Recovery grün, darf spontan hochgestuft werden — aber keine Schlüssel-Einheit auf einen erhofften guten Montag planen.",
      quelle: "coach/instructions.md · Quellen- und Verbindungsdisziplin"
    },
    "Session-Feel": {
      term: "Session-Feel",
      def: "Wie die Einheit lief, Skala 1–5, höher = besser (1 Mies · 2 Zäh · 3 Okay · 4 Gut · 5 Stark). Martin setzt den Wert nach der Einheit. Misst ausdrücklich keine Anstrengung — das tut Load RPE.",
      quelle: "coach/instructions.md · Lasten und RPE"
    }
  },

  weeks: [
    /* ── neue Woche als nächstes Objekt HIER (oben) einfügen ── */
    {
      id: "2026-W36",
      label: "Woche 5 · 31. August – 6. September 2026",
      meso: "Meso 3 · Woche 5",
      phase: "Konsolidierung vor dem W37-Testblock / Snatch-Video 57,5-60 / FS-Korridor-Aufbau / WPU-3×5-Retry",
      dateFrom: "2026-08-31",
      dateTo:   "2026-09-06",
      days: [
        { day:"Montag",    date:"31.08.", isoDate:"2026-08-31", type:"rest", einheit:"—", rx:"—", note:"Sonntagslast nach dem ~75-km-Ride (30.08.) — Standard-Ruhetag. Upgrade nur einbahnig bei Recovery ≥70 UND frischen Beinen (Martin-Entscheid 30.08.): dann Mo-Box-WOD gedeckelt — RPE ≤7, Push Jerk moderat bis ~60-65 (kein schwerer Overhead-Tag, Di ist der Oly-Slot), For-Time-Stück L2 ohne Sprint-Finish. Trade-off bewusst: Run/WB/Burpees sind auch gedeckelt Zone 4+ — der Di-Snatch bleibt die Schlüssel-Einheit." },
        { day:"Dienstag",  date:"01.09.", isoDate:"2026-09-01", type:"own", focus:"A", einheit:"Snatch (Video 57,5/60) + FS-Korridor-Aufbau + Pause OHS", sub:"Squat Snatch Singles build → 60 (57,5 + 60 filmen) · Front Squat 2×2 + Singles Richtung 100 · Pause OHS 3×2 klein · Core · Layer Delts/Bizeps", rx:"Snatch <span class='rv'>bis 60 kg</span> RPE-gated · FS <span class='rv'>Single 100 (102,5 optional)</span> RPE-gated", rpe:"RPE ≤8", note:"Schlüssel-Einheit der Woche. Snatch-Ceiling 60 nach dem W34-Slip (57,5) reproduzieren — Top-Singles 57,5 und 60 mit Bar-Path-App seitlich filmen, NORMALGESCHWINDIGKEIT (kein Slo-mo): Bestätigung des Empfangs-Befunds vom 20.08. an schwerer Last. Danach FS-Korridor-Aufbau (Block-Stand 95×3): sauberer 100er-Single = Wochenziel, 102,5 optional — 105-107,5 erst W37. Pause OHS klein als Positionsreiz, erster Streichkandidat." },
        { day:"Mittwoch",  date:"02.09.", isoDate:"2026-09-02", type:"rest", einheit:"—", rx:"—", note:"Termin (fix, früh) — kein Training. Trennt zugleich Barbell-Grip (Di) von Gymnastics-Grip (Do)." },
        { day:"Donnerstag",date:"03.09.", isoDate:"2026-09-03", type:"own", focus:"B", einheit:"BMU 5×2 (+3er-Option) + T2B + Strict HSPU 4×8 + WPU 3×5-Retry + Layer", sub:"Descent-/Hip-Pop-Drill · BMU Linked 5×2 (Wechsel auf 4×3 nur bei stabilem 3er) · T2B 3×10 · Strict HSPU 4×8 (halten) · Weighted Pull-up 3×5-Retry · Layer Brust/Trizeps optional", rx:"Gymnastics auf Anfrage", rpe:"RPE ≤8", note:"Arbeitsstufe bleibt 5×2 — Wechsel auf 4×3 nur, wenn der 3er im ersten Satz stabil steht (W35-Kriterium: 3er war 'fast möglich, nicht stabil'). Cues: 'Fall Into Pike' + 'Feet in a Bucket'. WPU 3×5-Retry nach zementiertem 3×4 — reißt Satz 3, bei 3×4 bleiben und Grip-Ursache notieren. HSPU 4×8 nur halten, Testreife W37. Do-DreamWOD (Hang Squat Snatch + Snatch-RFT) bewusst verworfen: Oly-Redundanz zum Di-Fokus." },
        { day:"Freitag",   date:"04.09.", isoDate:"2026-09-04", type:"rest", einheit:"—", rx:"—", note:"Termin (vermutlich, früh) — kein Training. DreamWOD-Benchmark 'LGOP' (Team) entfällt damit; wäre ohnehin Grip-Kollision (Pull-ups/Power Cleans) direkt nach Fokus B gewesen." },
        { day:"Samstag",   date:"05.09.", isoDate:"2026-09-05", type:"box",  einheit:"Upper-Strength + Step-up/Bench-EMOM",
          wod:[
            { struktur:"Superset 3 Runden", format:"for weight", level:"RPE-kalibriert",
              bewegungen:[
                { reps:"8/8", name:"Alternating Seated DB Press", detail:"" },
                { reps:"10",  name:"Bent Over Reverse Flys",      detail:"" },
                { reps:"15",  name:"Banded Face Pulls",           detail:"1 min Rest zwischen Sets" }
              ] },
            { struktur:"EMOM 18 (6 Runden à 3 min)", format:"Score: Total Cals", level:"L2 · Bench 42,5 kg", rpe:"RPE ≤7-8",
              bewegungen:[
                { reps:"16", name:"Alt Goblet Hold Step Ups", detail:"8/Seite · DB 20 kg" },
                { reps:"9",  name:"Bench Press + Max Cal",    detail:"42,5 kg · Rest der Minute Cals" },
                { reps:"—",  name:"Minute 3: Rest",           detail:"" }
              ] }
          ],
          sub:"Superset 3 Rd: 8/8 Seated DB Press · 10 Reverse Flys · 15 Face Pulls → EMOM 18: 16 Goblet Step-ups @ 20 · 9 Bench @ 42,5 + Max Cal · Rest", rx:"—", note:"Moderater Press-/Engine-Tag, kein Grip-Konflikt zu Do (Fr-Ruhe dazwischen). Bench L2 42,5 reicht — Brust/Trizeps hatte ggf. schon der Do-Layer. Cals gleichmäßig, kein Score-Jagen." },
        { day:"Sonntag",   date:"06.09.", isoDate:"2026-09-06", type:"ride", einheit:"Ride (sozial, wetterabhängig)", rx:"<span class='rv'>Z1/Z2</span>", note:"Wetter gut → Standard-Sonntagsride Z1/Z2. Wetter schlecht → So-Box als Alternative brauchbar (Back Squat no-lockout 8-8-6-6-4 moderat + 5×2:00-Intervalle Power Clean/Pull-up/BJO, L2 60 kg, RPE ≤7-8 — 2 Tage nach Fokus B unkritisch). Sonntagslast → Mo der W37 Standard-Ruhe, in beiden Fällen." }
      ],
      focusDays: {
        A: {
          title:"Focus-Tag A", date:"Dienstag · 01.09.2026",
          sub:"Squat Snatch Singles (Video 57,5/60) · Front Squat Korridor-Aufbau · Pause OHS klein · Core · Hypertrophie-Layer Delts/Bizeps",
          intro:"Schlüssel-Einheit der Woche auf dem frischesten Slot. Snatch zuerst: Ceiling 60 nach dem W34-Slip reproduzieren, Top-Singles 57,5 und 60 seitlich mit der Bar-Path-App filmen (Normalgeschwindigkeit, kein Slo-mo) — Bestätigung des Empfangs-Befunds an schwerer Last, Übungswahl folgt erst nach der Diagnose. Danach Front Squat: Korridor-Aufbau über dem Block-Stand 95×3 — sauberer 100er-Single ist das Wochenziel, 102,5 optional bei RPE ≤8; der Korridor 105-107,5 kommt W37. Pause OHS bleibt klein (Topwert 55 steht) und ist erster Streichkandidat bei Zeitdruck.",
          dauer:{ kern:"~55 min", gesamt:"~80 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          recoveryDay:{
            u50:"Letzter Steigerungssatz entfällt: Snatch endet bei 55 (kein Video-Pflichtprogramm, verschiebt sich), FS endet bei 95, Pause OHS entfällt. Load-RPE-Cap 7.",
            u34:"Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
          },
          blocks:[
            { letter:"A", prio:"required", min:18, title:"Squat Snatch — Singles + Video", kurz:"Squat Snatch", sub:"7 Sätze aufsteigend · Ceiling 60 · 57,5 + 60 filmen",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Squat Snatch","7 × 1||aufsteigend","40 · 45 · 50 · 52,5 · 55 · 57,5 · 60 kg","≤8","explosiv","E1:30-2:00","Ceiling 60 reproduzieren (W34-Slip: 2× 57,5). 57,5er und 60er FILMEN: Bar-Path-App, seitlich, Normalgeschwindigkeit — Empfangs-Befund (Wackeln in der tiefen Position bei 87-95 %) an schwerer Last bestätigen. Kein 62,5 heute."] ] },
            { letter:"B", prio:"required", min:14, title:"Front Squat — Korridor-Aufbau", kurz:"Front Squat", sub:"2×2 + 2×1 · Ziel 100",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Front Squat","2 × 2 + 2 × 1","85×2 · 92,5×2 · 97,5×1 · 100×1","≤8","31X1","2-3 min","Korridor-Aufbau über Block-Stand 95×3. Sauberer 100er = Wochenziel; 102,5 optional NUR bei RPE ≤8 und sauberer Rack-Position. 105-107,5 erst W37."] ] },
            { letter:"C", prio:"required", min:8, title:"Pause OHS — Positionsreiz", kurz:"Pause OHS", sub:"3 × 2 klein",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Pause OHS||2-sec Pause Bottom","3 × 2","52,5 – 55 kg","≤7","32X1","2 min","Positionsreiz für die tiefe Empfangsposition — kein Lastaufbau heute (Topwert 55 steht). Erster Streichkandidat bei Zeitdruck."] ] },
            { letter:"D", prio:"required", min:5, title:"Core", kurz:"Core", sub:"Leicht",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] },
            { letter:"E", prio:"optional", min:15, title:"Hypertrophie-Layer — Delts/Bizeps", sub:"~15 min · Rekomposition",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["DB Lateral Raise","3 × 12","2 × 6 kg","7","kontrolliert","60 sec","RPE-Deckel 7 strikt."],
                ["DB Curl","3 × 10-12","2 × 10 kg","7","kontrolliert","60 sec","RPE-Deckel 7 strikt, keine Failure-Sätze."]
              ] },
            { letter:"F", prio:"optional", min:8, title:"Mobility", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Overhead-Enge nach Snatch/OHS lösen."],
                ["Hüftbeuger-Stretch","2 × 45 sec/Seite","Nach Squat-Volumen."],
                ["Thorakale Extension","1-2 min","Foam Roller."]
              ] }
          ],
          whoop:[
            ["Snatch","7 × 1 · build 40→60 kg · Topgewicht loggen"],
            ["Front Squat","2×2 + 2×1 · build 85→100 kg · Topgewicht loggen"],
            ["Overhead Squat","3 × 2 Pause · 52,5-55 kg"],
            ["Hollow Body Hold","3 × 30 sec · BW"],
            ["Dumbbell Lateral Raise","3 × 12 · 2×6 kg · Layer"],
            ["Dumbbell Curl","3 × 10-12 · Layer"]
          ]
        },
        B: {
          title:"Focus-Tag B", date:"Donnerstag · 03.09.2026",
          sub:"BMU Linked 5×2 (+3er-Option) · T2B · Strict HSPU 4×8 (halten) · Weighted Pull-up 3×5-Retry · Hypertrophie-Layer Brust/Trizeps",
          intro:"Konsolidierung Richtung W37-Testblock. BMU bleibt auf der Arbeitsstufe 5×2 — der Wechsel auf 4×3 passiert nur, wenn der 3er im ersten Satz stabil steht (W35: 'fast möglich, aber nicht stabil'). Cues unverändert: 'Fall Into Pike' für die Stütz-Pause, 'Feet in a Bucket' für den Descent. WPU geht in den 3×5-Retry nach dem sauber zementierten 3×4; reißt Satz 3, bleibt die Stufe 3×4 und die Grip-Ursache wird notiert. HSPU 4×8 nur halten — Max-Test kommt W37, nicht heute.",
          dauer:{ kern:"~40 min", gesamt:"~65 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          recoveryDay:{
            u50:"WPU-Retry entfällt (bleibt 3×4), HSPU zurück auf 4×7, BMU nur 5 × 1 Qualitäts-Singles, T2B 3×8. Load-RPE-Cap 7.",
            u34:"Session entfällt — Mobility bis RPE 6, oder Ruhe."
          },
          blocks:[
            { letter:"A", prio:"required", min:15, title:"BMU — Linked (Arbeitsstufe 5×2)", kurz:"BMU Linked", sub:"Drill + 5 × 2 unbroken · 4×3 nur bei stabilem 3er",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Descent-Kontrolle + Hip-Pop-Timing||Drill","2 × 3 + 2 × 3","BW","6","kontrolliert","60 sec","'Feet in a Bucket': Füße in den imaginären Eimer vor dem Körper, Kip-Momentum erhalten. ~5 min primen."],
                ["Bar Muscle-Up||Linked","5 × 2 unbroken","BW","7–8","X","2–3 min","Arbeitsstufe 5×2. Steht der 3er im ERSTEN Satz stabil → auf 4×3 wechseln (W35-Kriterium). Cues: 'Fall Into Pike' + 'Feet in a Bucket'. Nicht erzwingen."]
              ] },
            { letter:"B", prio:"required", min:8, title:"T2B — Kapazität", kurz:"T2B", sub:"3 Sätze · gehalten",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Toes-to-Bar","3 × 10","BW","7","X","90 sec","Gehalten, kein Test — Zielneusetzung W37."] ] },
            { letter:"C", prio:"required", min:15, title:"Strict HSPU — halten", kurz:"Strict HSPU", sub:"4 × 8 · Testreife W37",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × 8","BW","8","21X0","3 min","Zweifach bestätigte Stufe nur halten — Max-Test W37. Reißt der letzte Satz → 4×7, kein Drama."] ] },
            { letter:"D", prio:"required", min:10, title:"Weighted Pull-up — 3×5-Retry", kurz:"Weighted Pull-up", sub:"3 × 5 @ +5",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Weighted Pull-up","3 × 5","+5 kg","8","30X1","2-2,5 min","Retry nach zementiertem 3×4 (W35). Reißt Satz 3 (wie W34: 5/5/3) → bei 3×4 bleiben und Grip-Ursache in die Notiz."] ] },
            { letter:"E", prio:"optional", min:15, title:"Hypertrophie-Layer — Brust/Trizeps", sub:"~15 min · Rekomposition",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["DB Bench Press","3 × 10–12","2 × 20 kg","7","kontrolliert","60 sec","W35-Kalibrierung (2×20 @ 6-7/10) übernehmen. Streichkandidat — Sa-Box hat Bench."],
                ["Band/Cable Triceps Extension","3 × 15","Band","7","kontrolliert","60 sec","Konstante Spannung."]
              ] },
            { letter:"F", prio:"optional", min:5, title:"Cool-down Mobility", sub:"~5 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Nach Pull-Volumen."],
                ["Shoulder CARs","2 × 8/Seite","Kontrolliert, voller Bewegungsradius."],
                ["Thorakale Extension","1–2 min","Foam Roller."]
              ] }
          ],
          whoop:[
            ["Bar Muscle Up","5 × 2 unbroken · BW · 4×3 nur bei stabilem 3er"],
            ["Toes to Bar","3 × 10 · BW"],
            ["Handstand Push Up","4 × 8 strict · BW · halten"],
            ["Pull Up (Weighted)","3 × 5 · +5 kg · Retry"],
            ["Dumbbell Bench Press","3 × 10–12 · 2×20 kg · Layer"]
          ]
        }
      }
    },
    {
      id: "2026-W35",
      label: "Woche 4 · 24.–30. August 2026",
      meso: "Meso 3 · Woche 4",
      phase: "FS-Block Teil 2 (Start) / C&J-Reclaim 82,5 / Gymnastics Richtung W37-Test",
      dateFrom: "2026-08-24",
      dateTo:   "2026-08-30",
      days: [
        { day:"Montag",    date:"24.08.", isoDate:"2026-08-24", type:"rest", einheit:"—", rx:"—", note:"Sonntagslast nach dem Fischmeister-Ride (23.08.) — Standard-Ruhetag, kein Schlüsselslot. Upgrade nur bei grüner Mo-Recovery am Tag selbst." },
        { day:"Dienstag",  date:"25.08.", isoDate:"2026-08-25", type:"own", focus:"A", einheit:"C&J-Komplex-Reclaim (82,5) + FS-Block Teil 2 + Core + Layer", sub:"Squat Clean + Push/Split Jerk build → 82,5 · Front Squat 5×3 build 80→95 · Core · 15-min-Layer Delts/Bizeps", rx:"C&J <span class='rv'>bis 82,5 kg</span> RPE-gated · FS <span class='rv'>Topsatz 95×3</span> RPE-gated", rpe:"RPE ≤8", note:"Front-Rack-Doppel: C&J zuerst frisch (Reclaim über die W32-Ceiling 80), dann FS-Block-Start. FS bewusst auf 95×3 gedeckelt (RPE ≤8 nach der C&J-Vorermüdung, Defizit-Dip-Woche) — Korridor 105-107,5 kommt W36/W37, kein 105-Versuch heute. Meso W4 = Defizit-Dip, Sub-Ziel-Miss zählt nicht als Stall." },
        { day:"Mittwoch",  date:"26.08.", isoDate:"2026-08-26", type:"box",  einheit:"Barbell RDL (Tempo) + S2O/Air-Squat-Intervalle",
          wod:[
            { struktur:"Every 2:30 × 4", format:"Intervall", level:"RDL RPE-kalibriert",
              bewegungen:[
                { reps:"8",       name:"Tempo Barbell RDL",       detail:"3-sec-Descent, moderat" },
                { reps:"10/Seite", name:"Monster Band Side Steps", detail:"" }
              ] },
            { struktur:"8 × (1 min Arbeit / 1 min Pause)", format:"Score: Total Air Squats", level:"L2", rpe:"RPE ≤7-8",
              bewegungen:[
                { reps:"9/7", name:"Cal beliebige Maschine",  detail:"" },
                { reps:"6",   name:"Shoulder-to-Overhead",    detail:"42,5 kg" },
                { reps:"Max", name:"Air Squats",              detail:"Restzeit der Minute" }
              ] }
          ],
          sub:"Every 2:30 × 4: 8 Tempo RDL (3-sec-Descent) + 10/Seite Monster Band Side Steps → 8 × (1/1 min): 9/7 Cal · 6 S2O @ 42,5 · Max Air Squats", rx:"—", note:"Hinge/Engine, kollisionsarm zur Fokus-Woche. Day-after Focus A: RDL wirklich moderat/Tempo (kein Load jagen), Air Squats bei Quad-DOMS aus Di nicht auf Max — Dreifach-Kompound-Tag (RDL/Overhead/Squat), strikt autoregulieren." },
        { day:"Donnerstag",date:"27.08.", isoDate:"2026-08-27", type:"rest", einheit:"—", rx:"—", note:"Harter Ruhetag — schützt die Fr-Gymnastics-Frische (Grip/Pull) und dient der Defizit-Erholung. Do-DreamWOD (Cal/Core/Plate-G2OH/Strict-Chin-up) bewusst verworfen: 25 strict Chin-ups würden Pull/Grip vor Fr vorermüden." },
        { day:"Freitag",   date:"28.08.", isoDate:"2026-08-28", type:"own", focus:"B", einheit:"BMU Linked 4×3 + T2B + Strict HSPU 4×8 + Weighted Pull-up 3×4 + Layer", sub:"Descent-/Hip-Pop-Drill · BMU Linked 4×3 (Cues) · T2B 3×10 · Strict HSPU 4×8 (konsolidieren) · Weighted Pull-up 3×4 (zementieren) · 15-min-Layer Brust/Trizeps", rx:"Gymnastics auf Anfrage", rpe:"RPE ≤8", note:"BMU-Stufe hoch auf 4×3 (W34: 5×2 feel 3 + einmal 3er) mit Cues aus dem Whiteboard-Buch, Fallback 5×2. HSPU 4×8 konsolidieren (W34 am Limit), nicht 4×9. WPU zurück auf 3×4 zementieren — 3×5 in W34 verfehlt (5/5/3), Stufe-zurück-Regel; 3×5-Retry erst W36. T2B gehalten." },
        { day:"Samstag",   date:"29.08.", isoDate:"2026-08-29", type:"box",  einheit:"Hang Squat Clean + Burpee-Box-Jump-Over/DL-WOD",
          wod:[
            { struktur:"Kraft: 3-3-2-2-1-1", format:"Aufsteigend", level:"moderat/Technik",
              bewegungen:[
                { reps:"3·3·2·2·1·1", name:"Hang Squat Clean", detail:"Oly-Touch, NICHT Max (C&J war Di) — Hook-Grip" }
              ] },
            { struktur:"2 Runden auf Zeit (1 min Pause dazwischen)", format:"Score: Gesamtzeit inkl. Pause", level:"L2 · 85 kg", cap:"16 min", rpe:"RPE ≤7-8",
              bewegungen:[
                { reps:"10",    name:"Burpee Box Jump Overs",   detail:"60/50 cm" },
                { reps:"15/12", name:"Cal beliebige Maschine",  detail:"" },
                { reps:"20",    name:"Deadlifts",               detail:"85 kg · Singles, kein Touch-and-Go" },
                { reps:"15/12", name:"Cal beliebige Maschine",  detail:"" },
                { reps:"10",    name:"Burpee Box Jump Overs",   detail:"60/50 cm" }
              ] }
          ],
          sub:"Hang Squat Clean 3-3-2-2-1-1 (moderat, Hook-Grip) → 2 Rd auf Zeit (16-min-Cap): 10 BBJO 60/50 · 15/12 Cal · 20 DL @85 · 15/12 Cal · 10 BBJO, 1 min Pause zwischen den Runden", rx:"—", note:"Grip-Schongang — Fr war der Grip-Peak (BMU/T2B/WPU). Hang Cleans mit Hook-Grip, von oben ablassen (kein Grinden im Hang); DL als Singles, bei Grip-Ermüdung die 40 DL scalen. Oly-Touch, nicht schwer (C&J war Di)." },
        { day:"Sonntag",   date:"30.08.", isoDate:"2026-08-30", type:"box", einheit:"Team-WOD „Waterfall“ (FFR + South + West)", rx:"<span class='rv'>Teams of 3 · sozial</span>", note:"Martin-Info, Box-Event FFR+South+West — NICHT aus dem DreamWOD-Pull (der reguläre DreamWOD-So wäre DB-Bench-Strength + 14-min-AMRAP, davon verdrängt). 30-min-AMRAP Teams of 3, Waterfall-Versatz: 12/9 Cal Row · 12 Burpees · 12/9 Cal Bike · 12 Alt DB Hang Snatch 22,5 · 12/9 Push-ups. Sozialer Slot; Ride wetterabhängig zusätzlich. Sonntagslast → Mo (W36) Standard-Ruhe." }
      ],
      focusDays: {
        A: {
          title:"Focus-Tag A", date:"Dienstag · 25.08.2026",
          sub:"Clean & Jerk Komplex-Reclaim (82,5) · Front Squat Block Teil 2 (Start) · Core · Hypertrophie-Layer Delts/Bizeps",
          intro:"Front-Rack-Doppeltag: C&J und FS teilen sich das Thema (der Squat Clean endet im Front Squat). C&J zuerst frisch — Reclaim über die W32-Ceiling 80, 82,5 nur bei sauberem Fang + Jerk-Lockout. Danach FS-Block Teil 2, Woche 1: bewusst auf Topsatz 95×3 gedeckelt (RPE ≤8 nach der C&J-Vorermüdung in der Defizit-Dip-Woche) — der Korridor 105-107,5 wird über W36/W37 mit Singles/Doubles angefahren, kein 105-Versuch heute.",
          dauer:{ kern:"~50 min", gesamt:"~75 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          recoveryDay:{
            u50:"Letzter Steigerungssatz entfällt: C&J endet bei 77,5 kg (kein 80er-/82,5er-Versuch), FS endet bei 90 kg (kein 92,5/95). Load-RPE-Cap 7.",
            u34:"Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
          },
          blocks:[
            { letter:"A", prio:"required", min:16, title:"Clean & Jerk Komplex — Reclaim 82,5", kurz:"Clean & Jerk", sub:"6 Sätze aufsteigend · Ceiling 82,5",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Squat Clean||+ Push/Split Jerk","6 × (1+1)||build","65 · 70 · 75 · 77,5 · 80 · 82,5 kg","≤8","explosiv","E2:00-2:30","W32-Referenz 80 @ feel 5. 82,5 nur bei sauberem Fang + Jerk-Lockout — sonst auf letztem sauberen Gewicht ausfahren. Topgewicht loggen. Warm-up-Singles unter 65 nicht als Arbeitssätze zählen."] ] },
            { letter:"B", prio:"required", min:16, title:"Front Squat — Block Teil 2 (Woche 1)", kurz:"Front Squat", sub:"5 Sätze · Topsatz 95",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Front Squat","5 × 3","80 · 85 · 90 · 92,5 · 95 kg","≤8","31X1","2-3 min","Block-Start, RPE-gated: Topsatz 95×3 nur bei sauberem RPE ≤8 nach dem C&J — sonst bei 92,5 bleiben. Kein 105-Single heute (Korridor W36/W37)."] ] },
            { letter:"C", prio:"required", min:5, title:"Core", kurz:"Core", sub:"Leicht",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] },
            { letter:"D", prio:"optional", min:15, title:"Hypertrophie-Layer — Delts/Bizeps", sub:"~15 min · Rekomposition",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["DB Lateral Raise","3 × 12","2 × 6 kg","7","kontrolliert","60 sec","RPE-Deckel 7 strikt — Layer lief zwei Wochen heiß."],
                ["DB Curl","3 × 10-12","2 × 10-12 kg","7","kontrolliert","60 sec","RPE-Deckel 7 strikt, keine Failure-Sätze."]
              ] },
            { letter:"E", prio:"optional", min:8, title:"Mobility", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Front-Rack-Stretch","2 min","Ellbogen hoch, Handgelenke lösen — nach C&J/FS."],
                ["Hüftbeuger-Stretch","2 × 45 sec/Seite","Nach Squat-Volumen."],
                ["Thorakale Extension","1-2 min","Foam Roller."]
              ] }
          ],
          whoop:[
            ["Squat Clean","6 × 1 · build 65→82,5 kg · Topgewicht loggen"],
            ["Push Jerk","6 × 1 · build 65→82,5 kg"],
            ["Front Squat","5 × 3 · build 80→95 kg · Topgewicht loggen"],
            ["Hollow Body Hold","3 × 30 sec · BW"],
            ["Dumbbell Lateral Raise","3 × 12 · 2×6 kg · Layer"],
            ["Dumbbell Curl","3 × 10-12 · Layer"]
          ]
        },
        B: {
          title:"Focus-Tag B", date:"Freitag · 28.08.2026",
          sub:"BMU Linked 4×3 (Cues) · T2B · Strict HSPU 4×8 (konsolidieren) · Weighted Pull-up 3×4 (zementieren) · Hypertrophie-Layer Brust/Trizeps",
          intro:"BMU-Stufe hoch auf 4×3: W34 lief 5×2 mit feel 3 und einmal 3 am Stück — der Aufstieg ist gerechtfertigt, Fokus bleibt Rhythmus, nicht Volumen. Cues aus dem Whiteboard-Buch: „Fall Into Pike“ für die Stütz-Pause, „Feet in a Bucket“ für den Descent; Fallback 5×2, wenn das Linking reißt. HSPU auf der obersten Leiterstufe 4×8 konsolidieren (W34 am Limit) statt steigern — Testreife für W37. WPU zurück auf 3×4: die Stufe 3×5 wurde in W34 verfehlt (5/5/3), Stufe-zurück-Regel — 3×5-Retry erst W36.",
          dauer:{ kern:"~40 min", gesamt:"~65 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          recoveryDay:{
            u50:"Letzte Progressionsstufe entfällt: HSPU zurück auf 4×7, WPU auf 3×3, BMU nur 5 × 1 Qualitäts-Singles statt Linked Triples, T2B 3×8. Load-RPE-Cap 7.",
            u34:"Session entfällt — Mobility bis RPE 6, oder Ruhe."
          },
          blocks:[
            { letter:"A", prio:"required", min:15, title:"BMU — Linked Triples (Stufe hoch)", kurz:"BMU Linked", sub:"Drill + 4 × 3 unbroken · Cues",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Descent-Kontrolle + Hip-Pop-Timing||Drill","2 × 3 + 2 × 3","BW","6","kontrolliert","60 sec","„Feet in a Bucket“: Füße in einen imaginären Eimer vor dem Körper führen, Kip-Momentum erhalten. ~5 min primen."],
                ["Bar Muscle-Up||Linked 4×3","4 × 3 unbroken","BW","7–8","X","2–3 min","Stufe hoch von 5×2. Cues: „Fall Into Pike“ (Stütz-Pause: press tall, in die Pike fallen, Arch-Spannung, press down and around) + „Feet in a Bucket“ (Descent eng). Reißt das Linking → auf 5×2 zurück, nicht erzwingen. Optional 2-3 Reps filmen (Stütz-Pause + Descent gegen die 22.08.-Baseline)."]
              ] },
            { letter:"B", prio:"required", min:8, title:"T2B — Kapazität", kurz:"T2B", sub:"3 Sätze · gehalten",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Toes-to-Bar","3 × 10","BW","7","X","90 sec","Gehalten, kein Test — nächster Test W37."] ] },
            { letter:"C", prio:"required", min:15, title:"Strict HSPU — konsolidieren", kurz:"Strict HSPU", sub:"4 × 8 · Stufe halten",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × 8","BW","8","21X0","3 min","Oberste Leiterstufe — konsolidieren, sauberer als W34 (da letzter Satz am Limit). NICHT auf 4×9. Reißt der letzte Satz → 4×7, kein Stall (Dip-Woche)."] ] },
            { letter:"D", prio:"required", min:8, title:"Weighted Pull-up — zementieren", kurz:"Weighted Pull-up", sub:"3 × 4 @ +5",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Weighted Pull-up","3 × 4","+5 kg","7–8","30X1","2 min","Stufe zurück nach dem 3×5-Miss in W34 (5/5/3). 3×4 sauber zementieren — alle Sätze voll. 3×5-Retry erst W36."] ] },
            { letter:"E", prio:"optional", min:15, title:"Hypertrophie-Layer — Brust/Trizeps", sub:"~15 min · Rekomposition",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["DB Bench Press","3 × 10–12","RPE-kalibriert","7","kontrolliert","60 sec","RPE-Deckel 7 strikt — lief zwei Wochen heiß (W34 RPE 8-9). Keine Failure-Sätze."],
                ["Band/Cable Triceps Extension","3 × 15","Band","7","kontrolliert","60 sec","Konstante Spannung."]
              ] },
            { letter:"F", prio:"optional", min:5, title:"Cool-down Mobility", sub:"~5 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Nach Pull-Volumen."],
                ["Shoulder CARs","2 × 8/Seite","Kontrolliert, voller Bewegungsradius."],
                ["Thorakale Extension","1–2 min","Foam Roller."]
              ] }
          ],
          whoop:[
            ["Bar Muscle Up","4 × 3 unbroken · BW · Linked-Triples, Stufe hoch"],
            ["Toes to Bar","3 × 10 · BW"],
            ["Handstand Push Up","4 × 8 strict · BW · konsolidieren"],
            ["Pull Up (Weighted)","3 × 4 · +5 kg · RPE 7–8 · zementieren"],
            ["Dumbbell Bench Press","3 × 10–12 · Layer"]
          ]
        }
      }
    },
    {
      id: "2026-W34",
      label: "Woche 3 · 17.–23. August 2026",
      meso: "Meso 3 · Woche 3",
      phase: "Italien-Reise (Mo/Di) / OHS-Lastaufbau Richtung 52,5 / HSPU 4×8 / WPU 3×5 / BMU-Stufe wiederholt",
      dateFrom: "2026-08-17",
      dateTo:   "2026-08-23",
      days: [
        { day:"Montag",    date:"17.08.", isoDate:"2026-08-17", type:"ride", einheit:"Italien — Bike", rx:"—", note:"Reisewoche: Mo/Di in Italien, unstrukturiert. Laut Wellness-Pull ~40 km gefahren." },
        { day:"Dienstag",  date:"18.08.", isoDate:"2026-08-18", type:"ride", einheit:"Italien — Bike", rx:"—", note:"Zweiter Bike-Tag in Italien vor der strukturierten Wochenhälfte." },
        { day:"Mittwoch",  date:"19.08.", isoDate:"2026-08-19", type:"own",  focus:"A", einheit:"BMU-Primer + Snatch (Ceiling 60) + OHS-Lastaufbau + Layer", sub:"5-min-BMU-Primer · Snatch Singles build · Pause OHS 5×3 Richtung 52,5 · Core · 15-min-Layer Delts/Bizeps", rx:"Snatch <span class='rv'>bis 60 kg</span> RPE-gated · OHS <span class='rv'>bis 52,5 (55 optional)</span>", rpe:"RPE ≤8 (Snatch) / ≤7-8 (OHS)", note:"Erster strukturierter Tag nach zwei Italien-Bike-Tagen. Snatch-Ceiling 60 zum zweiten Mal in Folge reproduzieren, 62,5 nur bei perfektem Lockout. OHS-Lastaufbau zweite Runde: letzte Woche bei 50 gehalten (52,5 nicht angesteuert), diesmal 52,5 als Zielsatz." },
        { day:"Donnerstag",date:"20.08.", isoDate:"2026-08-20", type:"box",  einheit:"Barbell RDL + DB Shoulder-to-Overhead/DU/Burpee Box Jump Overs",
          wod:[
            { struktur:"Every 2:30 × 4", format:"Intervall", level:"RDL RPE-kalibriert",
              bewegungen:[
                { reps:"8",  name:"Barbell RDL",            detail:"kontrollierter Abstieg" },
                { reps:"20", name:"Banded Hamstring Curls", detail:"" }
              ] },
            { struktur:"E2:00 × 8", format:"Score: langsamste Runde", level:"L2", rpe:"RPE ≤7-8",
              bewegungen:[
                { reps:"10", name:"DB Shoulder-to-Overhead", detail:"2 × 20 kg" },
                { reps:"30", name:"Double Unders",           detail:"oder 45 Singles" },
                { reps:"5",  name:"Burpee Box Jump Overs",   detail:"" }
              ] }
          ],
          sub:"Every 2:30 × 4: 8 Barbell RDL (kontrollierter Abstieg) + 20 banded Hamstring Curls → E2:00 × 8 (Score: langsamste Runde): 10 DB Shoulder-to-Overhead · 30 DU/45 Singles · 5 Burpee Box Jump Overs", rx:"—", note:"Hinge-fokussiert — kollidiert nicht mit Mi (Squat/Overhead) oder Sa (Pull/Press). Sauberer Lückenfüller in der Wochenmitte." },
        { day:"Freitag",   date:"21.08.", isoDate:"2026-08-21", type:"rest", einheit:"—", rx:"—", note:"Puffer vor Fokus B. DreamWOD (Power Clean & Jerk + Benchmark „Grace“, 30 C&J @61/43kg for time) bewusst verworfen: unkontrollierter Benchmark-Test mit falschem Reiz für die Konsolidierungsphase, würde außerdem die Sa-Freshness für BMU/HSPU kosten." },
        { day:"Samstag",   date:"22.08.", isoDate:"2026-08-22", type:"own", focus:"B", einheit:"BMU Linked Doubles (Stufe wiederholt) + T2B + Strict HSPU 4×8 + Weighted Pull-up 3×5 + Layer", sub:"Descent-/Hip-Pop-Drill · BMU Linked Doubles 5×2 (Stufe wiederholt) · T2B 3×10 · Strict HSPU 4×8 (neue Stufe) · Weighted Pull-up 3×5 (neue Stufe) · 15-min-Layer Brust/Trizeps", rx:"Gymnastics auf Anfrage", rpe:"RPE ≤8", note:"BMU-Stufe wird wiederholt, nicht auf 4×3 gesteigert — Sa 15.08 lief nicht sauber (feel 2), ohne Linked-Double-Videoclip fehlt die Diagnose. HSPU nach 'easy' bestätigtem 4×7 auf 4×8, WPU nach Martins Entscheid vom 09.08. auf 3×5. T2B gehalten bei 3×10 (nächster Test erst W37)." },
        { day:"Sonntag",   date:"23.08.", isoDate:"2026-08-23", type:"ride", einheit:"Ride (sozial)", rx:"<span class='rv'>Z1/Z2</span>", note:"Standard-Sonntagsride." }
      ],
      focusDays: {
        A: {
          title:"Focus-Tag A", date:"Mittwoch · 19.08.2026",
          sub:"BMU-Primer · Snatch Singles (Ceiling 60) · Pause-OHS-Lastaufbau · Core · Hypertrophie-Layer Delts/Bizeps",
          intro:"Erster strukturierter Tag nach zwei Italien-Bike-Tagen. BMU-Primer vorweg wie gewohnt (2. Wochenkontakt). Snatch-Ceiling 60 zum zweiten Mal in Folge sauber reproduzieren — 62,5 nur bei perfektem Lockout. OHS-Lastaufbau geht in die zweite Runde: letzte Woche bei 50 gehalten, diesmal 52,5 als Zielsatz, 55 optional bei sauberem 52,5er.",
          dauer:{ kern:"~45 min", gesamt:"~70 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          recoveryDay:{
            u50:"Letzter Steigerungssatz entfällt: Snatch endet bei 57,5 kg (kein 60er-/62,5er-Versuch), OHS endet bei 50 kg (kein 52,5er-Versuch). Load-RPE-Cap 7.",
            u34:"Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
          },
          blocks:[
            { letter:"A", prio:"required", min:5, title:"BMU-Primer", kurz:"BMU-Primer", sub:"~5 min · zweiter Wochenkontakt · Frequenz, kein Volumen",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Bar Muscle-Up||Primer","4 × 1–2","BW","≤7","X","60-90 sec","Frisch nach dem Warm-up, nie bis zur Ermüdung — reine Skill-Frequenz (BMU-Protokoll). Bei Recovery <50 % nur Singles."] ] },
            { letter:"B", prio:"required", min:16, title:"Squat Snatch — Singles", kurz:"Squat Snatch", sub:"7 Sätze aufsteigend · Ceiling 60 · 62,5 optional",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Squat Snatch","7 × 1||aufsteigend","40 · 45 · 50 · 52,5 · 55 · 57,5 · 60 kg","≤8","explosiv","E1:30-2:00","Ceiling 60 zum zweiten Mal in Folge reproduzieren. 62,5 nur bei perfektem Lockout als 8. Single, kein Zwang. Nachtrag 20.08.: Bar-Path-Video-Diagnose (3 Clips) — Triple Extension sauber (Hüfte 175–177°, Knie 167–173°, Timing exakt am Peak). Ein zunächst gemeldeter Kniestreckungs-Mangel war ein Analyse-Artefakt (von Martin am Einzelbild erkannt, Pipeline gefixt). Kein Technik-Handlungsbedarf."] ] },
            { letter:"C", prio:"required", min:14, title:"Pause OHS — Lastaufbau", kurz:"Pause OHS", sub:"5 Sätze · Zielsatz 52,5",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Pause OHS||2-sec Pause Bottom","5 × 3","42,5 → 45 → 47,5 → 50 → 52,5 kg","≤7-8","32X1","2-3 min","Letzte Woche bei 50 gehalten (52,5 nicht angesteuert) — heute 52,5 als Zielsatz. Bei sauberem 52,5er optional 6. Satz 55."] ] },
            { letter:"D", prio:"required", min:5, title:"Core", kurz:"Core", sub:"Leicht",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] },
            { letter:"E", prio:"optional", min:15, title:"Hypertrophie-Layer — Delts/Bizeps", sub:"~15 min · Rekomposition",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["DB Lateral Raise","3 × 12","2 × 6 kg","7","kontrolliert","60 sec","Unverändert ggü. W33 — RPE-Deckel 7 strikt halten."],
                ["DB Curl","3 × 10-12","2 × 10-12 kg","7","kontrolliert","60 sec","Unverändert ggü. W33 — RPE-Deckel 7 strikt halten."]
              ] },
            { letter:"F", prio:"optional", min:8, title:"Mobility", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Overhead-Enge nach Snatch/OHS lösen."],
                ["Hüftbeuger-Stretch","2 × 45 sec/Seite","Nach Squat-Volumen."],
                ["Thorakale Extension","1-2 min","Foam Roller."]
              ] }
          ],
          whoop:[
            ["Bar Muscle Up","4 × 1–2 · BW · Primer"],
            ["Snatch","7 × 1 · build 40→60 kg · Topgewicht loggen"],
            ["Overhead Squat","5 × 3 Pause · 42,5→52,5 kg · Topgewicht loggen"],
            ["Hollow Body Hold","3 × 30 sec · BW"],
            ["Dumbbell Lateral Raise","3 × 12 · 2×6 kg · Layer"],
            ["Dumbbell Curl","3 × 10-12 · Layer"]
          ]
        },
        B: {
          title:"Focus-Tag B", date:"Samstag · 22.08.2026",
          sub:"BMU Linked Doubles (Stufe wiederholt) · T2B · Strict HSPU 4×8 (neue Stufe) · Weighted Pull-up 3×5 (neue Stufe) · Hypertrophie-Layer Brust/Trizeps",
          intro:"BMU-Treppenstufe wird wiederholt, nicht gesteigert — Sa 15.08 lief nicht sauber (session_feel 2), und ohne Linked-Double-Videoclip fehlt die Diagnose für die eigentliche Rhythmus-Frage. HSPU geht nach dem als 'easy' bestätigten 4×7 auf 4×8, WPU nach Martins Entscheid vom 09.08. auf 3×5. T2B bleibt bei 3×10 — nächster Test erst W37.",
          dauer:{ kern:"~40 min", gesamt:"~65 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          recoveryDay:{
            u50:"Letzte Progressionsstufe entfällt: HSPU zurück auf 4×7, WPU bleibt bei 3×4 (keine neue Stufe). BMU nur Drill + 5 × 1 Qualitäts-Singles statt Linked Doubles, T2B 3×8. Load-RPE-Cap 7.",
            u34:"Session entfällt — Mobility bis RPE 6, oder Ruhe."
          },
          blocks:[
            { letter:"A", prio:"required", min:15, title:"BMU — Linked Doubles (Stufe wiederholt)", kurz:"BMU Linked Doubles", sub:"Drill + 5 × 2 unbroken · Stufe nicht gesteigert",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Descent-Kontrolle + Hip-Pop-Timing||Drill","2 × 3 + 2 × 3","BW","6","kontrolliert","60 sec","Kontrollierter Abgang eng an der Bar, dann Hip-Pop bis Brusthöhe ohne Turnover — Rhythmus primen (~5 min)."],
                ["Bar Muscle-Up||Linked Doubles","5 × 2 unbroken","BW","7–8","X","2–3 min","Stufe wird wiederholt (nicht auf 4×3 gesteigert) — Sa 15.08 nicht sauber gelinkt. Wenn möglich diesmal einen Videoclip aufnehmen, dann läuft er durch die Analyse-Pipeline. Reißt das Linking ab → Satz beenden, nicht erzwingen."]
              ] },
            { letter:"B", prio:"required", min:8, title:"T2B — Kapazität", kurz:"T2B", sub:"3 Sätze · gehalten",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Toes-to-Bar","3 × 10","BW","7","X","90 sec","Gehalten, kein Test — nächster Test laut Protokoll erst W37."] ] },
            { letter:"C", prio:"required", min:15, title:"Strict HSPU — neue Stufe", kurz:"Strict HSPU", sub:"4 × 8",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × 8","BW","8","21X0","3 min","Stufe hoch — 4×7 letzte Woche laut Notiz 'easy'. Bei unsauberem letzten Satz zurück auf 4×7."] ] },
            { letter:"D", prio:"required", min:8, title:"Weighted Pull-up Density — neue Stufe", kurz:"Weighted Pull-up", sub:"3 × 5",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Weighted Pull-up","3 × 5","+5 kg","7–8","30X1","2 min","Stufe hoch nach Martins Entscheid vom 09.08. Bei unsauberem Satz 5 zurück auf 3×4."] ] },
            { letter:"E", prio:"optional", min:15, title:"Hypertrophie-Layer — Brust/Trizeps", sub:"~15 min · Rekomposition",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["DB Bench Press","3 × 10–12","RPE-kalibriert","7","kontrolliert","60 sec","Sa 15.08 mit 2×22,5 kg 12/12/10 gelaufen, RPE an dem Tag nicht geloggt — heute wieder RPE-kalibriert statt fixer Vorgabe, keine Failure-Sätze."],
                ["Band/Cable Triceps Extension","3 × 15","Band","7","kontrolliert","60 sec","Konstante Spannung."]
              ] },
            { letter:"F", prio:"optional", min:5, title:"Cool-down Mobility", sub:"~5 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Nach Pull-Volumen."],
                ["Shoulder CARs","2 × 8/Seite","Kontrolliert, voller Bewegungsradius."],
                ["Thorakale Extension","1–2 min","Foam Roller."]
              ] }
          ],
          whoop:[
            ["Bar Muscle Up","5 × 2 unbroken · BW · Linked-Doubles-Protokoll, Stufe wiederholt"],
            ["Toes to Bar","3 × 10 · BW"],
            ["Handstand Push Up","4 × 8 strict · BW · neue Stufe"],
            ["Pull Up (Weighted)","3 × 5 · +5 kg · RPE 7–8 · neue Stufe"],
            ["Dumbbell Bench Press","3 × 10–12 · Layer"]
          ]
        }
      }
    },
    {
      id: "2026-W33",
      label: "Woche 2 · 10.–16. August 2026",
      meso: "Meso 3 · Woche 2",
      phase: "Progression aus Testständen / OHS-Lastaufbau / Snatch-60- & C&J-80-Konsolidierung",
      dateFrom: "2026-08-10",
      dateTo:   "2026-08-16",
      days: [
        { day:"Montag",    date:"10.08.", isoDate:"2026-08-10", type:"rest", einheit:"—", rx:"—", note:"Sonntagslast-Regel nach dem Doppelride vom 09.08. (~73 km) — Standard-Ruhetag, kein Schlüsselslot. Upgrade auf das Mo-DreamWOD nur bei grüner Recovery am Tag selbst." },
        { day:"Dienstag",  date:"11.08.", isoDate:"2026-08-11", type:"box",  einheit:"Hang Power Clean + Wall-Ball/DB-Push-Press/Pull-up-WOD", sub:"E1:15 × 8: 1 Hang Power Clean → For Time: 42-30-18 Wall Balls · 21-15-9 DB Push Press · Pull-ups", rx:"HPC <span class='rv'>Speed-Fokus, bis ~72,5 kg</span> RPE-gated · WOD <span class='rv'>L2 — WB 9 kg, DB 2×20 kg</span>", rpe:"RPE ≤8 (HPC) · Cap 17 min", note:"HPC im Speed-Fokus (C&J-Konsolidierung: jede Rep aggressiv-schnell, kein Grinder, kein Top-Versuch — morgen Fokus A). L3 (22,5-kg-DB + C2B) verworfen: Grip-/Pull-Volumen vor Mi/Fr moderat halten." },
        { day:"Mittwoch",  date:"12.08.", isoDate:"2026-08-12", type:"own",  focus:"A", einheit:"BMU-Primer + Snatch (Ceiling 60) + OHS-Lastaufbau + Layer", sub:"5-min-BMU-Primer · Snatch Singles build · Pause OHS 5×3 Richtung 50/52,5 · Core · 15-min-Layer Delts/Bizeps", rx:"Snatch <span class='rv'>bis 60 kg</span> RPE-gated · OHS <span class='rv'>bis 50 (52,5 optional)</span>", rpe:"RPE ≤8 (Snatch) / ≤7-8 (OHS)", note:"Neu: 5-min-BMU-Primer (4 × 1-2 frisch, RPE ≤7) direkt nach dem Warm-up — zweiter Wochenkontakt laut BMU-Protokoll. Snatch-Ceiling 60 (W32) sauber reproduzieren, 62,5 nur bei perfektem Lockout. OHS nach dem Reclaim (W30) erster echter Lastaufbau seit W27 — Meso-Rolle W33. Mi-DreamWOD (Back Squat + Deadlift/HPC/S2O/T2B-EMOM) verworfen: zu viele Kollisionen mit Di-Box und Fr-Gymnastics." },
        { day:"Donnerstag",date:"13.08.", isoDate:"2026-08-13", type:"box",  einheit:"Push Press + Farmer-Lunge/DB-Push-Press/DU-AMRAP", sub:"Every 3:00 × 5: 5 Push Press + 8/8 Incline DB Row + 12 Face Pulls → AMRAP 13: 10 Farmers-Hold Walking Lunges · 12 DB Push Press · 50 DU", rx:"Push Press <span class='rv'>bis ~65 kg</span> RPE-gated (Basis 82,5) · WOD <span class='rv'>L2 — DB 2×20 kg</span>", rpe:"RPE ≤7-8", note:"Overhead-Volumen moderat halten — Fr folgt die HSPU-Stufensteigerung. Double-Unders normal (keine Crossover). Lunges diese Woche nur hier, keine Kollision." },
        { day:"Freitag",   date:"14.08.", isoDate:"2026-08-14", type:"rest", einheit:"—", rx:"—", note:"Harter Ruhetag. Gymnastics auf Sa vorgezogen (Martin-Entscheid 13.08.) — schafft einen vollen Erholungstag zwischen dem Do-Box-Overhead-Volumen und der HSPU-Stufensteigerung, und liefert frische BMU Linked Doubles (Qualitätsprotokoll, braucht Frische)." },
        { day:"Samstag",   date:"15.08.", isoDate:"2026-08-15", type:"own", focus:"B", einheit:"Gymnastics-Progression + Layer → danach Ride Fischmeister (sozial)", sub:"BMU Linked Doubles 5×2 · T2B 3×10 · Strict HSPU 4×7 (neue Stufe) · Weighted Pull-up 3×4 · 15-min-Layer Brust/Trizeps · dann ~70 km Z1/Z2", rx:"Gymnastics auf Anfrage · Ride <span class='rv'>Z1/Z2</span>", rpe:"RPE ≤8 (Gym)", note:"Reihenfolge fix: Gymnastics ZUERST, dann Ride — nach 70 km ist Grip-/Pull-Qualität weg. Layer Brust/Trizeps ist erster Streichkandidat bei Zeitdruck vor der Abfahrt. BMU Linked-Doubles-Protokoll (coach/bmu-entwicklungsplan.md), HSPU steigt nach 9er-Test auf 4×7, WPU bewusst zweite Runde 3×4 @ +5 kg. Ride: gleiche Runde wie 09.08. (~70 km), sozial, Z2-Deckel wo möglich." },
        { day:"Sonntag",   date:"16.08.", isoDate:"2026-08-16", type:"rest", einheit:"—", rx:"—", note:"Reisetag — Autofahrt nach Italien (Eugen). Kein Training. W34: Mo/Di Italien mit Bike (Rides, evtl. Box-Drop-in), strukturierte Woche ab Mi." }
      ],
      focusDays: {
        A: {
          title:"Focus-Tag A", date:"Mittwoch · 12.08.2026",
          sub:"BMU-Primer · Snatch Singles (Ceiling 60) · Pause-OHS-Lastaufbau · Core · Hypertrophie-Layer Delts/Bizeps",
          intro:"Neu vorweg: 5-min-BMU-Primer (4 × 1-2 frisch) — zweiter Wochenkontakt laut BMU-Protokoll (Frequenz schlägt Session-Volumen, coach/bmu-entwicklungsplan.md). Danach Snatch — Speed vor Kraft, das Snatch-Volumen wärmt das OHS-Pattern gleich mit auf. Ceiling 60 (W32, Form 7/10) heute sauber reproduzieren; 62,5 ist Option, kein Ziel. Danach OHS: nach dem Reclaim (W30) der erste echte Lastaufbau seit W27 — Richtung 50/52,5 (Meso-Rolle W33).",
          dauer:{ kern:"~45 min", gesamt:"~70 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          recoveryDay:{
            u50:"Letzter Steigerungssatz entfällt: Snatch endet bei 57,5 kg (kein 60er-/62,5er-Versuch), OHS endet bei 47,5 kg. Load-RPE-Cap 7.",
            u34:"Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
          },
          blocks:[
            { letter:"A", prio:"required", min:5, title:"BMU-Primer", sub:"~5 min · zweiter Wochenkontakt · Frequenz, kein Volumen",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Bar Muscle-Up||Primer","4 × 1–2","BW","≤7","X","60-90 sec","Frisch nach dem Warm-up, nie bis zur Ermüdung — reine Skill-Frequenz (BMU-Protokoll). Bei Recovery <50 % nur Singles."] ] },
            { letter:"B", prio:"required", min:16, title:"Squat Snatch — Singles", sub:"7 Sätze aufsteigend · Ceiling 60 · 62,5 optional",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Squat Snatch","7 × 1||aufsteigend","40 · 45 · 50 · 52,5 · 55 · 57,5 · 60 kg","≤8","explosiv","E1:30-2:00","Ceiling 60 (W32) reproduzieren — Form war 7/10, heute zählt Qualität. 62,5 nur bei perfektem Lockout als 8. Single, kein Zwang."] ] },
            { letter:"C", prio:"required", min:14, title:"Pause OHS — Lastaufbau", sub:"5 Sätze · Richtung 50/52,5",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Pause OHS||2-sec Pause Bottom","5 × 3","40 → 42,5 → 45 → 47,5 → 50 kg","≤7-8","32X1","2-3 min","Erster Lastaufbau seit W27 (Topwert 50). Bei sauberem 50er optional 6. Satz 52,5 — sonst nächste Woche."] ] },
            { letter:"D", prio:"required", min:5, title:"Core", sub:"Leicht",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] },
            { letter:"E", prio:"optional", min:15, title:"Hypertrophie-Layer — Delts/Bizeps", sub:"~15 min · Rekomposition",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["DB Lateral Raise","3 × 12","2 × 6 kg","7","kontrolliert","60 sec","Sa 08.08. war 3×15 @ RPE 8-9 — Reps runter auf 12, Layer bleibt bei RPE 7, keine Failure-Sätze."],
                ["DB Curl","3 × 10-12","2 × 10-12 kg","7","kontrolliert","60 sec","Sa 08.08. war 12 kg @ RPE 8-9 — ggf. 10 kg nehmen, RPE 7 halten."]
              ] },
            { letter:"F", prio:"optional", min:8, title:"Mobility", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Overhead-Enge nach Snatch/OHS lösen."],
                ["Hüftbeuger-Stretch","2 × 45 sec/Seite","Nach Squat-Volumen."],
                ["Thorakale Extension","1-2 min","Foam Roller."]
              ] }
          ],
          whoop:[
            ["Bar Muscle Up","4 × 1–2 · BW · Primer"],
            ["Snatch","7 × 1 · build 40→60 kg · Topgewicht loggen"],
            ["Overhead Squat","5 × 3 Pause · 40→50 kg · Topgewicht loggen"],
            ["Hollow Body Hold","3 × 30 sec · BW"],
            ["Dumbbell Lateral Raise","3 × 12 · 2×6 kg · Layer"],
            ["Dumbbell Curl","3 × 10-12 · Layer"]
          ]
        },
        B: {
          title:"Focus-Tag B", date:"Samstag · 15.08.2026",
          sub:"BMU Linked Doubles · T2B · Strict HSPU 4×7 (neue Stufe) · Weighted Pull-up 3×4 · Hypertrophie-Layer Brust/Trizeps",
          intro:"Progression aus den Testständen vom 07.08. — und Protokollwechsel beim BMU: Linking ist ein Rhythmus-, kein Kraftproblem (Recherche 09.08., coach/bmu-entwicklungsplan.md). Statt EMOM-Singles jetzt echte verknüpfte Doubles mit voller Pause plus Descent-/Timing-Drill; der zweite Wochenkontakt ist der Mi-Primer. HSPU steigt nach dem 9er-Test auf 4×7, T2B geht nach dem 16er auf moderates 3×10-Volumen (Zielneusetzung folgt beim Review). WPU bewusst zweite Runde 3×4 @ +5 kg — 3×5 ab W34.",
          dauer:{ kern:"~40 min", gesamt:"~65 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          recoveryDay:{
            u50:"Letzte Progressionsstufe entfällt: HSPU zurück auf 4×6, BMU keine Linked Doubles — nur 5 × 1 Qualitäts-Singles, T2B 3×8. Load-RPE-Cap 7.",
            u34:"Session entfällt — Mobility bis RPE 6, oder Ruhe."
          },
          blocks:[
            { letter:"A", prio:"required", min:15, title:"BMU — Linked Doubles (Protokoll neu)", sub:"Drill + 5 × 2 unbroken · Rhythmus vor Volumen",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Descent-Kontrolle + Hip-Pop-Timing||Drill","2 × 3 + 2 × 3","BW","6","kontrolliert","60 sec","Kontrollierter Abgang eng an der Bar, dann Hip-Pop bis Brusthöhe ohne Turnover — Rhythmus primen (~5 min)."],
                ["Bar Muscle-Up||Linked Doubles","5 × 2 unbroken","BW","7–8","X","2–3 min","Stufe 1 der neuen Treppe (5×2 → 4×3 → 3×3+max → Test). Nach Rep 1: Descent eng, Arch bewusst neu aufbauen, leichter Grip mit aktiver Schulter. Reißt das Linking ab → Satz beenden, nicht erzwingen."]
              ] },
            { letter:"B", prio:"required", min:8, title:"T2B — Kapazität", sub:"3 Sätze",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Toes-to-Bar","3 × 10","BW","7","X","90 sec","Nach dem 16er-Test moderates Volumen — kein erneuter Test, Zielneusetzung beim Review."] ] },
            { letter:"C", prio:"required", min:14, title:"Strict HSPU — neue Stufe", sub:"4 × 7",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × 7","BW","8","21X0","3 min","Stufe hoch nach 9 unbroken im Test. Bei unsauberem letzten Satz zurück auf 4×6."] ] },
            { letter:"D", prio:"required", min:8, title:"Weighted Pull-up Density", sub:"3 × 4 · bewusste Wiederholung",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Weighted Pull-up","3 × 4","+5 kg","7–8","30X1","2 min","Sauber bestätigt (07.08.), bewusst zweite Runde — 3×5 ab W34."] ] },
            { letter:"E", prio:"optional", min:15, title:"Hypertrophie-Layer — Brust/Trizeps", sub:"~15 min · Rekomposition",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["DB Bench Press","3 × 10–12","RPE-kalibriert","7","kontrolliert","60 sec","Keine Failure-Sätze — Layer, kein Hauptreiz."],
                ["Band/Cable Triceps Extension","3 × 15","Band","7","kontrolliert","60 sec","Konstante Spannung."]
              ] },
            { letter:"F", prio:"optional", min:5, title:"Cool-down Mobility", sub:"~5 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Nach Pull-Volumen."],
                ["Shoulder CARs","2 × 8/Seite","Kontrolliert, voller Bewegungsradius."],
                ["Thorakale Extension","1–2 min","Foam Roller."]
              ] }
          ],
          whoop:[
            ["Bar Muscle Up","5 × 2 unbroken · BW · Linked-Doubles-Protokoll"],
            ["Toes to Bar","3 × 10 · BW"],
            ["Handstand Push Up","4 × 7 strict · BW · neue Stufe"],
            ["Pull Up (Weighted)","3 × 4 · +5 kg · RPE 7–8"],
            ["Dumbbell Bench Press","3 × 10–12 · Layer"]
          ]
        }
      }
    },
  ]
};
