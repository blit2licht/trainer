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
              rows:[ ["Squat Snatch","7 × 1||aufsteigend","40 · 45 · 50 · 52,5 · 55 · 57,5 · 60 kg","≤8","explosiv","E1:30-2:00","Ceiling 60 zum zweiten Mal in Folge reproduzieren. 62,5 nur bei perfektem Lockout als 8. Single, kein Zwang."] ] },
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
    {
      id: "2026-W32",
      label: "Woche 1 · 3.–9. August 2026",
      meso: "Meso 3 · Woche 1",
      phase: "Meso-3-Start / Gymnastics-Test / C&J-Reclaim / Defizit-Start",
      dateFrom: "2026-08-03",
      dateTo:   "2026-08-09",
      days: [
        { day:"Montag",    date:"03.08.", isoDate:"2026-08-03", type:"box",  einheit:"Intervall-Chipper (40 min)", sub:"Every 2:00 × 4 Rd: 25/18 Cal · Max Burpees to Target · 200m Run + Sit-ups · Farmer Carry · 1× Cindy", rx:"<span class='rv'>L2 — Farmer 24/16 kg</span>", rpe:"RPE ~7, gleichmäßig", note:"Wiedereinstieg nach Urlaubsdeload — Engine-Reiz ohne Barbell-Kollision. Score nicht jagen, gleichmäßiges Tempo über alle 4 Runden. Last/Level am Tag selbst nach aktueller Recovery." },
        { day:"Dienstag",  date:"04.08.", isoDate:"2026-08-04", type:"box",  einheit:"Snatch Singles + Power-Snatch-RFT", sub:"Snatch 7 × 1 → 10 RFT: 100m Run · 3 Power Snatch · 5 Pull-ups", rx:"Snatch bis <span class='rv'>~57,5-60 kg</span> RPE-gated · WOD <span class='rv'>L2 42,5 kg</span>, C2B wenn frisch", rpe:"RPE ≤8 (Snatch) · Cap 17 min", note:"Bedient den Snatch-Fokus strukturell: Singles Richtung 60 antesten (Ceiling 57,5, 2× bestätigt W30), aufsteigend z. B. 40-45-50-52,5-55-57,5-60. L3-Bar (52,5) im RFT zu schwer für 30 Reps Engine — L2 hält es beim Engine-Reiz." },
        { day:"Mittwoch",  date:"05.08.", isoDate:"2026-08-05", type:"rest", einheit:"—", rx:"—", note:"Morgens Termin — kein Training (fix)." },
        { day:"Donnerstag",date:"06.08.", isoDate:"2026-08-06", type:"ride", einheit:"Lockere Radtour mit der Box (abends)", rx:"<span class='rv'>Z1/Z2</span>", note:"Sozialer Ride, erfahrungsgemäß entspannt — Z1/Z2 halten, kein Strain-Stacking vor dem Fr-Testtag. Morgens kein Training (Termin)." },
        { day:"Freitag",   date:"07.08.", isoDate:"2026-08-07", type:"own",  focus:"B", einheit:"Gymnastics-Testtag + WPU + Layer", sub:"Testsätze BMU · T2B · Strict HSPU (max unbroken) · Weighted Pull-up 3×4 · 15-min-Layer Brust/Trizeps", rx:"Auf Anfrage", rpe:"Tests frisch · Rest RPE ≤8", note:"Frischester Slot der Woche (Ruhe Mi + lockerer Ride Do). Seit W30 fälliger Testblock — Ergebnisse setzen die Profil-Zielstände neu. Hero „DEL“ (Box) bewusst verworfen: dupliziert weighted PU/HSPU/C2B in ermüdeter WOD-Qualität am Testtag." },
        { day:"Samstag",   date:"08.08.", isoDate:"2026-08-08", type:"own",  focus:"A", einheit:"Clean & Jerk Komplex-Reclaim + Layer", sub:"Clean Pull + Hang Power Clean · Squat Clean + Push Jerk Komplex · Core · 15-min-Layer Delts/Bizeps", rx:"Komplex-Ceiling <span class='rv'>80 kg</span>", rpe:"RPE ≤8 cap", note:"C&J seit W29 offen — Referenz 78 kg @7 (W28). 80 nur bei sauberem Jerk-Timing, kein Max-Test. Box-Couplet (Push Press + PC/FS) verworfen: der Komplex bedient denselben Reiz gezielter." },
        { day:"Sonntag",   date:"09.08.", isoDate:"2026-08-09", type:"box",  einheit:"Deficit Back Rack Lunge + DB-Bench/T2B-EMOM", sub:"E2:15 × 5: 4/4 Deficit Back Rack Lunge + 15 Pull-Aparts → EMOM 15: 9 DB Bench + 7 T2B · Max Cal · Rest", rx:"Lunge RPE-only · <span class='rv'>DB L2 20 kg</span>", rpe:"RPE ≤7-8", note:"Moderater Abschluss — Lunges diese Woche noch unbedient, T2B als Zweitkontakt nach Fr-Test unkritisch. Kein Score-Jagen; Sonntagslast-Regel gilt für Mo der W33." }
      ],
      focusDays: {
        B: {
          title:"Focus-Tag B", date:"Freitag · 07.08.2026",
          sub:"Gymnastics-Testtag · BMU/T2B/HSPU max unbroken · Weighted Pull-up 3×4 · Hypertrophie-Layer",
          intro:"Seit W30 fälliger Testblock auf voll erholtem System. Testsätze frisch als jeweils erster Arbeitssatz, danach reduziertes Volumen. WPU ist kein Test — Stufe 3×4 @ +5 kg nach dem Urlaub sauber wiederholen, dann 3×5. Ab heute läuft der 15-min-Hypertrophie-Layer (Meso-3-Rekomposition).",
          dauer:{ kern:"~50 min", gesamt:"~70 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          recoveryDay:{
            u50:"Testsätze entfallen und werden um eine Woche geschoben — Testregel: nie auf vorermüdetem System (Recovery unter 50 % oder Grip-/Overhead-Vorlast am Vortag). Weighted Pull-up bleibt auf 3×4, keine Stufensteigerung. Volumen der Blöcke A–C auf je einen Satz reduzieren.",
            u34:"Der gesamte Testblock entfällt und wird geschoben — es bleibt Mobility bis RPE 6, oder Ruhe."
          },
          blocks:[
            { letter:"A", prio:"required", min:10, title:"BMU — Testsatz + Qualität", sub:"Test frisch · Ziel 5 (Stand 3)",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Bar Muscle-Up||Testsatz","1 × max unbroken","BW","—","X","voll erholt","Allererster Arbeitssatz. Ergebnis loggen — setzt den Zielstand neu."],
                ["Bar Muscle-Up||EMOM 5","5 × 1","BW","7","X","Rest of min","Qualitäts-Singles nach dem Test. Doubles-Speed (W28-Flag) beobachten, nicht erzwingen."]
              ] },
            { letter:"B", prio:"required", min:8, title:"T2B — Testsatz + Kapazität", sub:"Test frisch · Ziel 10 (Stand 6)",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Toes-to-Bar||Testsatz","1 × max unbroken","BW","—","X","voll","Rhythmus halten, bei Abriss beenden."],
                ["Toes-to-Bar","2 × 8","BW","7","X","90 sec","Reduziert wegen Testarbeit."]
              ] },
            { letter:"C", prio:"required", min:12, title:"Strict HSPU — Testsatz + Volumen", sub:"Test frisch · Ziel 10 (Stand 6)",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Strict HSPU||Testsatz","1 × max unbroken","BW","—","21X0","voll","Kein Kipping, sauberer Lockout — Abbruch bei Technikverfall."],
                ["Strict HSPU","3 × 5","BW","8","21X0","3 min","Reduziert (statt 4×6) wegen Testsatz."]
              ] },
            { letter:"D", prio:"required", min:8, title:"Weighted Pull-up Density", sub:"Stufe 3×4 bestätigen",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Weighted Pull-up","3 × 4","+5 kg","7–8","30X1","2 min","Saubere Wiederholung der W30-Stufe → nächste Woche 3×5. Bei unsauberem Satz zurück auf 3×3."] ] },
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
            ["Bar Muscle Up","Testsatz max unbroken + 5 × 1 EMOM · BW · Testergebnis loggen"],
            ["Toes to Bar","Testsatz max unbroken + 2 × 8 · BW · Testergebnis loggen"],
            ["Handstand Push Up","Testsatz max unbroken + 3 × 5 strict · BW · Testergebnis loggen"],
            ["Pull Up (Weighted)","3 × 4 · +5 kg · RPE 7–8"],
            ["Dumbbell Bench Press","3 × 10–12 · Layer"]
          ]
        },
        A: {
          title:"Focus-Tag A", date:"Samstag · 08.08.2026",
          sub:"Clean & Jerk Komplex-Reclaim · Core · Hypertrophie-Layer Delts/Bizeps",
          intro:"C&J seit W29 nicht mehr als Komplex trainiert — letzte Referenz 78 kg @ RPE 7 (W28). Heute Reclaim mit Ceiling 80, kein Max-Test. Kein Lunge-/Quad-Zusatz — der So-Box-Tag bringt Deficit Lunges.",
          dauer:{ kern:"~40 min", gesamt:"~60 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          recoveryDay:{
            u50:"Letzter Steigerungssatz entfällt: Komplex endet bei 77,5 kg statt 80 kg, der Ceiling-Versuch entfällt. Clean Pull + Hang Power Clean enden bei 65 kg statt 70 kg. Load-RPE-Cap 7.",
            u34:"Komplex entfällt — Technik mit leichter Stange und Mobility bis RPE 6, oder Ruhe."
          },
          blocks:[
            { letter:"A", prio:"required", min:10, title:"Clean Pull + Hang Power Clean", sub:"4 Sätze aufsteigend · Position wecken",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Clean Pull||+ Hang Power Clean","4 × (1+1)","50 → 60 → 65 → 70 kg","≤7","explosiv","2 min","Zug/Position nach 3 Wochen Pause, kein Quad-Fokus."] ] },
            { letter:"B", prio:"required", min:12, title:"Squat Clean + Push Jerk Komplex", sub:"Every 2:00 · 6 Sätze · Ceiling 80 kg",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Squat Clean||+ Push Jerk","6 × (1+1)||build","60 → 65 → 70 → 75 → 77,5 → 80 kg","≤8","X","Restliche 2:00","W28-Referenz 78 @7. 80 nur bei sauberem Fang + Jerk-Lockout — sonst auf letztem sauberen Gewicht ausfahren. Topgewicht loggen."] ] },
            { letter:"C", prio:"required", min:5, title:"Core", sub:"Leicht",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] },
            { letter:"D", prio:"optional", min:15, title:"Hypertrophie-Layer — Delts/Bizeps", sub:"~15 min · Rekomposition",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["DB Lateral Raise","3 × 12–15","RPE-kalibriert","7","kontrolliert","60 sec","Leicht, sauber — Schulter ist von Jerks vorbelastet."],
                ["DB Curl","3 × 12","RPE-kalibriert","7","kontrolliert","60 sec","Keine Failure-Sätze."]
              ] },
            { letter:"E", prio:"optional", min:8, title:"Mobility", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Front-Rack-Stretch","2 min","Ellbogen hoch, Handgelenke lösen."],
                ["Hüftbeuger-Stretch","2 × 45 sec/Seite","Nach Squat Cleans."],
                ["Thorakale Extension","1–2 min","Foam Roller · Jerk-Overhead nacharbeiten."]
              ] }
          ],
          whoop:[
            ["Clean Pull","4 × 1 · build 50→70 kg"],
            ["Power Clean (Hang)","4 × 1 · build 50→70 kg"],
            ["Squat Clean","6 × 1 · build 60→80 kg · Topgewicht loggen"],
            ["Push Jerk","6 × 1 · build 60→80 kg"],
            ["Hollow Body Hold","3 × 30 sec · BW"],
            ["Dumbbell Lateral Raise","3 × 12–15 · Layer"],
            ["Dumbbell Curl","3 × 12 · Layer"]
          ]
        }
      }
    },
    {
      id: "2026-W31",
      label: "Urlaubswoche · 27. Juli – 2. August 2026",
      meso: "Übergang · nach Meso 2",
      phase: "Urlaub Griechenland / Erhalt / struktureller Deload",
      dateFrom: "2026-07-27",
      dateTo:   "2026-08-02",
      days: [
        { day:"Montag",    date:"27.07.", isoDate:"2026-07-27", type:"own",  focus:"A", einheit:"Strength-Circuit Push/Beine", sub:"Wall Strict HSPU · Tempo Push-up · Bulgarian Split Squat · Band Face-Pull · Hollow Hold", rx:"BW/Band", rpe:"RPE ≤7", note:"Einziger direkter Fokus-Erhalt der Woche: Strict HSPU an der Wand, 4×5 — ein Rep unter Stand (4×6), Erhalt statt Push. ~40 min." },
        { day:"Dienstag",  date:"28.07.", isoDate:"2026-07-28", type:"rest", einheit:"—", rx:"—", note:"Frei — Strand und Schwimmen zählen als Bewegung." },
        { day:"Mittwoch",  date:"29.07.", isoDate:"2026-07-29", type:"own",  focus:"B", einheit:"Springseil-Conditioning + BW-AMRAP", sub:"6 × (40 sec / 40 sec) Springseil · AMRAP 10 min: 8 Burpees · 12 Air Squats · 10 V-Ups", rx:"BW", rpe:"RPE ≤7", note:"Kurz gehalten (~30 min) — Burpee/V-Up-Muster treibt ohnehin in Zone 4. Zügig, aber nicht ins Limit; kein Testcharakter." },
        { day:"Donnerstag",date:"30.07.", isoDate:"2026-07-30", type:"rest", einheit:"—", rx:"—", note:"Frei." },
        { day:"Freitag",   date:"31.07.", isoDate:"2026-07-31", type:"own",  focus:"C", einheit:"Strength-Circuit Pull/Posterior + Handstand", sub:"Band Row schwer · Single-Leg RDL · Wall Handstand Hold · Band Pull-Apart · Side Plank/Arch", rx:"BW/Band", rpe:"RPE ≤7", note:"Einzige Zugarbeit der Woche — Band Row entsprechend priorisiert. Handstand Hold als Overhead-Reiz ohne Pressvolumen. ~40 min." },
        { day:"Samstag",   date:"01.08.", isoDate:"2026-08-01", type:"rest", einheit:"—", rx:"—", note:"Frei." },
        { day:"Sonntag",   date:"02.08.", isoDate:"2026-08-02", type:"rest", einheit:"— (optional locker)", rx:"—", note:"Optional 15 min Springseil locker + Mobility-Flow — nur bei Lust, kein Plansoll. Tage der Woche sind verschiebbar, solange zwischen den Sessions je ein Tag Luft bleibt." }
      ],
      focusDays: {
        A: {
          title:"Session 1 — Push/Beine", date:"Montag · 27.07.2026",
          sub:"Wall Strict HSPU · Tempo Push-up · Bulgarian Split Squat · Band Face-Pull · Core",
          intro:"Urlaubswoche = struktureller Deload nach Meso 2. Erhalt statt Aufbau, RPE-Deckel 7. HSPU ist der einzige Fokus, der ohne Bar trainierbar bleibt — bewusst 4×5 statt 4×6.",
          dauer:{ kern:"~35 min", gesamt:"~40 min", warmup:"~5 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          blocks:[
            { letter:"A", prio:"required", min:12, title:"Wall Strict HSPU", sub:"4 Sätze · Erhalt",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Wall Strict HSPU","4 × 5","BW","7","21X0","2-3 min","Ein Rep unter Stand (4×6) — Erhalt, kein Push. Keine geeignete Wand → Pike Push-up mit erhöhten Füßen (Stuhl/Mauer)."] ] },
            { letter:"B", prio:"required", min:15, title:"Push + Beine", sub:"3 Runden · kontrolliert",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Push-up Tempo","3 × 12-15","BW","6-7","21X0","60 sec","Sauberes Tempo statt Reps jagen."],
                ["Bulgarian Split Squat","3 × 10/Bein","BW","6-7","kontrolliert","60 sec","Quad/Hüfte, keine Sprungbelastung."],
                ["Band Face-Pull + Außenrotation","3 × 15","Band","6","kontrolliert","60 sec","Schultergesundheit gegen das Push-Volumen."]
              ] },
            { letter:"C", prio:"required", min:4, title:"Core", sub:"Leicht",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] },
            { letter:"D", prio:"optional", min:5, title:"Mobility", sub:"~5 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Hüftbeuger-Stretch","2 × 45 sec/Seite","Nach Split Squats."],
                ["Lat-Stretch (Band-unterstützt)","2 × 45 sec","Overhead-Enge lösen."]
              ] }
          ],
          whoop:[
            ["Handstand Push Up","4 × 5 strict · BW · Wand"],
            ["Push Up","3 × 12-15 · BW · Tempo"],
            ["Walking Lunge","3 × 10/Bein · BW (als Bulgarian Split Squat ausgeführt)"],
            ["Hollow Body Hold","3 × 30 sec · BW"]
          ]
        },
        B: {
          title:"Session 2 — Conditioning", date:"Mittwoch · 29.07.2026",
          sub:"Springseil-Intervalle · Bodyweight-AMRAP · ~30 min",
          intro:"Einziger Engine-Reiz der Woche, bewusst kurz. Burpee/V-Up-Muster treibt zuverlässig in Zone 4 — zügig arbeiten, aber nicht ins Limit. Kein Testcharakter.",
          dauer:{ kern:"~25 min", gesamt:"~30 min", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          blocks:[
            { letter:"A", prio:"required", min:5, title:"Warm-up", sub:"~5 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Springseil locker","3 min","Puls hochbringen."],
                ["Arm-/Hip-Circles","2 min","Voller Bewegungsradius."]
              ] },
            { letter:"B", prio:"required", min:8, title:"Springseil-Intervalle", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[ ["Springseil Intervalle","6 × (40 sec Arbeit / 40 sec Pause)","Single- oder Double-Unders — keine Crossover-DUs (laut Profil ausgeschlossen)."] ] },
            { letter:"C", prio:"required", min:10, title:"AMRAP", sub:"10 min · RPE ≤7",
              wod:{
                struktur:"AMRAP 10 min",
                format:"AMRAP",
                cap:"10 min",
                bewegungen:[
                  { reps:"8",  name:"Burpees",    detail:"BW" },
                  { reps:"12", name:"Air Squats", detail:"BW" },
                  { reps:"10", name:"V-Ups",      detail:"BW" }
                ],
                gesamt:"Zügiges, gleichmäßiges Tempo — Rundenzahl ist egal, kein Score-Jagen"
              },
              note:"Deload-Kontext: gleichmäßig durchziehen, letzte 2 min nicht eskalieren." },
            { letter:"D", prio:"optional", min:5, title:"Cool-down", sub:"~5 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Gehen","3-5 min","Puls runter."],
                ["Hüftbeuger-Stretch","2 × 45 sec/Seite","Nach Burpees/Squats."]
              ] }
          ],
          whoop:[
            ["Jump Rope","6 × 40 sec Intervalle"],
            ["Burpee","AMRAP 10 · 8/Runde · BW"],
            ["Air Squat","AMRAP 10 · 12/Runde · BW"],
            ["V-Up","AMRAP 10 · 10/Runde · BW"]
          ]
        },
        C: {
          title:"Session 3 — Pull/Posterior", date:"Freitag · 31.07.2026",
          sub:"Band Row · Single-Leg RDL · Wall Handstand Hold · Pull-Apart · Core",
          intro:"Einzige Zugarbeit der Woche — Band Row entsprechend priorisiert und schwer (stärkstes Band oder doppelt). Handstand Hold hält den Overhead-Reiz ohne zusätzliches Pressvolumen nach Session 1.",
          dauer:{ kern:"~35 min", gesamt:"~40 min", warmup:"~5 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          blocks:[
            { letter:"A", prio:"required", min:8, title:"Band Row", sub:"4 Sätze · schwerste Bandvariante",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Band Row","4 × 12","Band schwer","7","30X1","90 sec","Stärkstes Band oder doppelt genommen — bewusste Spannung, kein Federn."] ] },
            { letter:"B", prio:"required", min:12, title:"Posterior Chain", sub:"3 Runden",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Single-Leg RDL","3 × 10/Bein","BW oder Band","6-7","kontrolliert","60 sec","Hinge-Pattern erhalten, Balance sauber."],
                ["Band Pull-Apart","3 × 20","Band","6","kontrolliert","60 sec","Schulterblatt-Arbeit."]
              ] },
            { letter:"C", prio:"required", min:6, title:"Handstand Hold", sub:"3 Sätze · Overhead-Erhalt",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Wall Handstand Hold","3 × 30-40 sec","BW","6-7","—","90 sec","Aktiv drücken, Rippen geschlossen. Kein Handstand Walk (ausgeschlossen)."] ] },
            { letter:"D", prio:"required", min:6, title:"Core", sub:"Seitlich + Rücken",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Side Plank","3 × 30 sec/Seite","BW","6","—","30 sec","Hüfte oben halten."],
                ["Arch Hold","3 × 20 sec","BW","6","—","60 sec","Gegenspieler zum Hollow aus Session 1."]
              ] },
            { letter:"E", prio:"optional", min:5, title:"Mobility", sub:"~5 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch (Band-unterstützt)","2 × 45 sec","Nach Handstand."],
                ["Hüftbeuger-Stretch","2 × 45 sec/Seite","Nach RDL."]
              ] }
          ],
          whoop:[
            ["Band Row","4 × 12 · Band schwer"],
            ["Single Leg RDL","3 × 10/Bein · BW/Band"],
            ["Handstand Hold","3 × 30-40 sec · Wand"],
            ["Side Plank","3 × 30 sec/Seite · BW"]
          ]
        }
      }
    },
  ]
};
