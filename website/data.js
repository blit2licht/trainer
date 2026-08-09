/* ════════════════════════════════════════════════════════════
   data.js — AI Coach · Martin
   Nur diese Datei wächst pro Woche.
   Neue Woche = neues Objekt VORNE in weeks[] einfügen.
   isoDate-Felder sind Pflicht — werden vom Notes-System genutzt.
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
      own:  { rang: 1,    typ: "Focus",   chip: "Prio 1 von 3" },
      box:  { rang: 2,    typ: "Box",     chip: "Prio 2 von 3" },
      ride: { rang: 3,    typ: "Ride",    chip: "Prio 3 von 3" },
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
      id: "2026-W33",
      label: "Woche 2 · 10.–16. August 2026",
      meso: "Meso 3 · Woche 2",
      phase: "Progression aus Testständen / OHS-Lastaufbau / Snatch-60- & C&J-80-Konsolidierung",
      dateFrom: "2026-08-10",
      dateTo:   "2026-08-16",
      days: [
        { day:"Montag",    date:"10.08.", isoDate:"2026-08-10", type:"rest", einheit:"—", rx:"—", note:"Sonntagslast-Regel nach dem Doppelride vom 09.08. (~73 km) — Standard-Ruhetag, kein Schlüsselslot. Upgrade auf das Mo-DreamWOD nur bei grüner Recovery am Tag selbst." },
        { day:"Dienstag",  date:"11.08.", isoDate:"2026-08-11", type:"box",  einheit:"Hang Power Clean + Wall-Ball/DB-Push-Press/Pull-up-WOD", sub:"E1:15 × 8: 1 Hang Power Clean → For Time: 42-30-18 Wall Balls · 21-15-9 DB Push Press · Pull-ups", rx:"HPC <span class='rv'>Speed-Fokus, bis ~72,5 kg</span> RPE-gated · WOD <span class='rv'>L2 — WB 9 kg, DB 2×20 kg</span>", rpe:"RPE ≤8 (HPC) · Cap 17 min", note:"HPC im Speed-Fokus (C&J-Konsolidierung: jede Rep aggressiv-schnell, kein Grinder, kein Top-Versuch — morgen Fokus A). L3 (22,5-kg-DB + C2B) verworfen: Grip-/Pull-Volumen vor Mi/Fr moderat halten." },
        { day:"Mittwoch",  date:"12.08.", isoDate:"2026-08-12", type:"own",  focus:"A", einheit:"Snatch (Ceiling 60) + OHS-Lastaufbau + Layer", sub:"Snatch Singles build · Pause OHS 5×3 Richtung 50/52,5 · Core · 15-min-Layer Delts/Bizeps", rx:"Snatch <span class='rv'>bis 60 kg</span> RPE-gated · OHS <span class='rv'>bis 50 (52,5 optional)</span>", rpe:"RPE ≤8 (Snatch) / ≤7-8 (OHS)", note:"Snatch-Ceiling 60 (W32) sauber reproduzieren, 62,5 nur bei perfektem Lockout. OHS nach dem Reclaim (W30) erster echter Lastaufbau seit W27 — Meso-Rolle W33. Mi-DreamWOD (Back Squat + Deadlift/HPC/S2O/T2B-EMOM) verworfen: zu viele Kollisionen mit Di-Box und Fr-Gymnastics." },
        { day:"Donnerstag",date:"13.08.", isoDate:"2026-08-13", type:"box",  einheit:"Push Press + Farmer-Lunge/DB-Push-Press/DU-AMRAP", sub:"Every 3:00 × 5: 5 Push Press + 8/8 Incline DB Row + 12 Face Pulls → AMRAP 13: 10 Farmers-Hold Walking Lunges · 12 DB Push Press · 50 DU", rx:"Push Press <span class='rv'>bis ~65 kg</span> RPE-gated (Basis 82,5) · WOD <span class='rv'>L2 — DB 2×20 kg</span>", rpe:"RPE ≤7-8", note:"Overhead-Volumen moderat halten — Fr folgt die HSPU-Stufensteigerung. Double-Unders normal (keine Crossover). Lunges diese Woche nur hier, keine Kollision." },
        { day:"Freitag",   date:"14.08.", isoDate:"2026-08-14", type:"own",  focus:"B", einheit:"Gymnastics-Progression + Layer", sub:"BMU EMOM 10 · T2B 3×10 · Strict HSPU 4×7 (neue Stufe) · Weighted Pull-up 3×4 · 15-min-Layer Brust/Trizeps", rx:"Auf Anfrage", rpe:"RPE ≤8", note:"HSPU steigt nach dem 9er-Test auf 4×7. WPU bewusst zweite Runde 3×4 @ +5 kg — 3×5 ab W34. Fr-DreamWOD (Regional-2014-Chipper, ~100 Deadlifts/Wallballs/Box-Overs) verworfen: zu voluminös vor dem Sa-Ride." },
        { day:"Samstag",   date:"15.08.", isoDate:"2026-08-15", type:"ride", einheit:"Ride Fischmeister (sozial)", rx:"<span class='rv'>Z1/Z2</span>", note:"Gleiche Runde wie am 09.08. (~70 km). Sozial, Z2-Deckel wo möglich — vorher kein Box-Training (abgestimmt)." },
        { day:"Sonntag",   date:"16.08.", isoDate:"2026-08-16", type:"rest", einheit:"—", rx:"—", note:"Reisetag — Autofahrt nach Italien (Eugen). Kein Training. W34: Mo/Di Italien mit Bike (Rides, evtl. Box-Drop-in), strukturierte Woche ab Mi." }
      ],
      focusDays: {
        A: {
          title:"🏋️ Focus-Tag A", date:"Mittwoch · 12.08.2026",
          sub:"Snatch Singles (Ceiling 60) · Pause-OHS-Lastaufbau · Core · Hypertrophie-Layer Delts/Bizeps",
          intro:"Snatch zuerst — Speed vor Kraft, und das Snatch-Volumen wärmt das OHS-Pattern gleich mit auf. Ceiling 60 (W32, Form 7/10) heute sauber reproduzieren; 62,5 ist Option, kein Ziel. Danach OHS: nach dem Reclaim (W30) der erste echte Lastaufbau seit W27 — Richtung 50/52,5 (Meso-Rolle W33).",
          dauer:{ kern:"~40 min", gesamt:"~65 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          recoveryDay:{
            u50:"Letzter Steigerungssatz entfällt: Snatch endet bei 57,5 kg (kein 60er-/62,5er-Versuch), OHS endet bei 47,5 kg. Load-RPE-Cap 7.",
            u34:"Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
          },
          blocks:[
            { letter:"A", prio:"required", min:16, title:"Squat Snatch — Singles", sub:"7 Sätze aufsteigend · Ceiling 60 · 62,5 optional",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Squat Snatch","7 × 1||aufsteigend","40 · 45 · 50 · 52,5 · 55 · 57,5 · 60 kg","≤8","explosiv","E1:30-2:00","Ceiling 60 (W32) reproduzieren — Form war 7/10, heute zählt Qualität. 62,5 nur bei perfektem Lockout als 8. Single, kein Zwang."] ] },
            { letter:"B", prio:"required", min:14, title:"Pause OHS — Lastaufbau", sub:"5 Sätze · Richtung 50/52,5",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Pause OHS||2-sec Pause Bottom","5 × 3","40 → 42,5 → 45 → 47,5 → 50 kg","≤7-8","32X1","2-3 min","Erster Lastaufbau seit W27 (Topwert 50). Bei sauberem 50er optional 6. Satz 52,5 — sonst nächste Woche."] ] },
            { letter:"C", prio:"required", min:5, title:"Core", sub:"Leicht",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] },
            { letter:"D", prio:"optional", min:15, title:"Hypertrophie-Layer — Delts/Bizeps", sub:"~15 min · Rekomposition",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["DB Lateral Raise","3 × 12","2 × 6 kg","7","kontrolliert","60 sec","Sa 08.08. war 3×15 @ RPE 8-9 — Reps runter auf 12, Layer bleibt bei RPE 7, keine Failure-Sätze."],
                ["DB Curl","3 × 10-12","2 × 10-12 kg","7","kontrolliert","60 sec","Sa 08.08. war 12 kg @ RPE 8-9 — ggf. 10 kg nehmen, RPE 7 halten."]
              ] },
            { letter:"E", prio:"optional", min:8, title:"Mobility", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Overhead-Enge nach Snatch/OHS lösen."],
                ["Hüftbeuger-Stretch","2 × 45 sec/Seite","Nach Squat-Volumen."],
                ["Thorakale Extension","1-2 min","Foam Roller."]
              ] }
          ],
          whoop:[
            ["Snatch","7 × 1 · build 40→60 kg · Topgewicht loggen"],
            ["Overhead Squat","5 × 3 Pause · 40→50 kg · Topgewicht loggen"],
            ["Hollow Body Hold","3 × 30 sec · BW"],
            ["Dumbbell Lateral Raise","3 × 12 · 2×6 kg · Layer"],
            ["Dumbbell Curl","3 × 10-12 · Layer"]
          ]
        },
        B: {
          title:"🏋️ Focus-Tag B", date:"Freitag · 14.08.2026",
          sub:"BMU EMOM · T2B · Strict HSPU 4×7 (neue Stufe) · Weighted Pull-up 3×4 · Hypertrophie-Layer Brust/Trizeps",
          intro:"Progression aus den Testständen vom 07.08.: HSPU steigt nach dem 9er-Test auf 4×7, T2B geht nach dem 16er auf moderates 3×10-Volumen (Zielneusetzung folgt beim Review), BMU bleibt beim Qualitäts-EMOM — die Methodik-Frage (Volumen/Ausfallzeiten für mehr Unbroken-Reps) wird vor dem nächsten Testblock recherchiert. WPU bewusst zweite Runde 3×4 @ +5 kg (sauber bestätigt, Potenzial ausschöpfen) — 3×5 ab W34.",
          dauer:{ kern:"~40 min", gesamt:"~65 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          recoveryDay:{
            u50:"Letzte Progressionsstufe entfällt: HSPU zurück auf 4×6, BMU nur Singles (10 × 1), T2B 3×8. Load-RPE-Cap 7.",
            u34:"Session entfällt — Mobility bis RPE 6, oder Ruhe."
          },
          blocks:[
            { letter:"A", prio:"required", min:10, title:"BMU — Qualitäts-EMOM", sub:"10 min · Singles/Doubles",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Bar Muscle-Up||Min 1–5","5 × 1–2","BW","7","X","Rest of min","Qualität vor Quantität — Teststand 3 unbroken (07.08.)."],
                ["Bar Muscle-Up||Min 6–10","5 × 2","BW","7–8","X","Rest of min","Doubles nur wenn schnell und sauber — bei Speedverlust auf Singles zurück."]
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
            ["Bar Muscle Up","EMOM 10 · Min 1–5: 1–2 · Min 6–10: 2 · BW"],
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
          title:"🏋️ Focus-Tag B", date:"Freitag · 07.08.2026",
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
          title:"🏋️ Focus-Tag A", date:"Samstag · 08.08.2026",
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
          title:"🏝️ Session 1 — Push/Beine", date:"Montag · 27.07.2026",
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
          title:"🏝️ Session 2 — Conditioning", date:"Mittwoch · 29.07.2026",
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
          title:"🏝️ Session 3 — Pull/Posterior", date:"Freitag · 31.07.2026",
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
    {
      id: "2026-W30",
      label: "Woche 6 · 20.–26. Juli 2026",
      meso: "Meso 2 · Woche 6",
      phase: "Rückkehr / FS-Block Wk3/3 / Griechenland ab Sa",
      dateFrom: "2026-07-20",
      dateTo:   "2026-07-26",
      days: [
        { day:"Montag",    date:"20.07.", isoDate:"2026-07-20", type:"rest", einheit:"—", rx:"—", note:"Default nach Sonntagspeak (Strain 16,7, harte Doppelsession) — Sonntagslast-Regel: Montag kein Schlüsselslot. Upgrade auf DreamWOD (Seated Press/Gorilla Row + T2B/C&J/Burpee-AMRAP) nur bei grüner Recovery am Tag selbst." },
        { day:"Dienstag",  date:"21.07.", isoDate:"2026-07-21", type:"own",  focus:"A", einheit:"Front Squat Block Wk3/3 + Overhead Squat Reclaim", sub:"Front Squat aufsteigend · Pause OHS · Hollow Hold · Mobility", rx:"FS Ziel <span class='rv'>~102,5 kg</span> RPE-gated · OHS 40-45 kg", rpe:"RPE ≤8 (FS) / ≤7 (OHS)", note:"Frischester Slot nach Ruhetag. FS-Block-Abschluss (Wk1/3 und Wk2/3 beide 100 kg bestätigt) — kein Max-Test, Stop bei Technikverfall. OHS reine Pattern-Reaktivierung nach 4 Wochen Pause (letzter Wert 50 kg, W27)." },
        { day:"Mittwoch",  date:"22.07.", isoDate:"2026-07-22", type:"rest", einheit:"—", rx:"—", note:"Termin 7:00 — kein Training (fix). DreamWOD-Boxtag (Matador Dips/T2B-EMOM + Cal/Sit-up-WOD) entfällt." },
        { day:"Donnerstag",date:"23.07.", isoDate:"2026-07-23", type:"box",  einheit:"Snatch Singles + Devils Press/DB Thruster", sub:"E-Build × 8: 1 Snatch → For Time: 10 Devils Press · 400m Run · 20 DB Thruster · 400m Run · 20 DB Thruster · 400m Run · 10 Devils Press", rx:"Snatch bis <span class='rv'>~57,5-60 kg</span> RPE-gated · DB L2 15/12 kg", rpe:"RPE ≤8 (Snatch)", note:"Wertvollster Box-Tag der Woche — deckt den seit W28 unbedienten Snatch-Reclaim strukturell ab. Kein neuer Max, Ceiling 57,5 kg (W28) bestätigen. Cap 18 min." },
        { day:"Freitag",   date:"24.07.", isoDate:"2026-07-24", type:"own",  focus:"B", einheit:"Vertikal-Gymnastics Reclaim + WPU-Progression", sub:"BMU EMOM · Pull/T2B · Strict HSPU · Weighted Pull-up · Mobility", rx:"Auf Anfrage", rpe:"RPE 7-8", note:"Snatch-Pattern/Strict-HSPU/T2B waren diese Woche durch die Bangkok-Ersatzsession unbedient — heute Reclaim statt Steigerung. Ausnahme: Weighted Pull-up geht planmäßig auf die neue Stufe 3×4 @ +5 kg." },
        { day:"Samstag",   date:"25.07.", isoDate:"2026-07-25", type:"rest", einheit:"—", rx:"—", note:"Abflug 8:00 nach Griechenland (Urlaub) — kein Training (Reisetag)." },
        { day:"Sonntag",   date:"26.07.", isoDate:"2026-07-26", type:"own",  focus:"C", einheit:"Griechenland — Bodyweight/Band/Springseil", sub:"Strength-Circuit · Springseil-Conditioning · Mobility", rx:"RPE 6-7", note:"Urlaubskontext, kein Testcharakter. Nur Bodyweight, Gummibänder und Springseil vor Ort verfügbar." }
      ],
      focusDays: {
        A: {
          title:"🏋️ Focus-Tag A", date:"Dienstag · 21.07.2026",
          sub:"Front Squat Block Wk3/3 · Overhead-Squat-Reclaim · Core · Mobility",
          intro:"FS-Block-Abschluss nach Bangkok-Verschiebung — Wk1/3 und Wk2/3 beide bei 100 kg bestätigt, 1RM-Schätzung &gt;105 unbestätigt. Overhead Squat seit W27 nicht direkt trainiert (4 Wochen Pause) — reine Pattern-Reaktivierung, kein Lastfokus.",
          dauer:{ kern:"~40 min", gesamt:"~50 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          blocks:[
            { letter:"A", prio:"required", min:18, title:"Front Squat", sub:"Aufsteigende Einzelsätze · finale Blockwoche",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Front Squat","5-3-2-1-1||aufsteigend","75 · 85 · 92,5 · 97,5 · 102,5 kg","≤8","kontrolliert","2-3 min","Stop, sobald Tiefe oder Technik nachlässt — kein Zwang auf 102,5 kg."] ] },
            { letter:"B", prio:"required", min:9, title:"Pause OHS", sub:"3 Sätze · reine Reaktivierung",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Pause OHS||2-sec Pause Bottom","3 × 3","40 → 42,5 → 45 kg","≤7","32X1","2 min","Letzter Wert 50 kg (W27) — heute nicht Ziel, Pattern vor Last."] ] },
            { letter:"C", prio:"required", min:5, title:"Core", sub:"Leicht",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] },
            { letter:"D", prio:"optional", min:8, title:"Mobility", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Hüftbeuger-Stretch","2 × 45 sec/Seite","Nach Squat-Volumen."],
                ["Thorakale Extension","1-2 min","Foam Roller."],
                ["Lat-Stretch hängend","2 × 45 sec","Overhead-Enge nach OHS lösen."]
              ] }
          ],
          whoop:[
            ["Front Squat","5-3-2-1-1 · build 75→102,5 kg · Topgewicht loggen"],
            ["Overhead Squat","3 × 3 Pause · 40/42,5/45 kg · RPE ≤7"],
            ["Hollow Body Hold","3 × 30 sec · BW"]
          ]
        },
        B: {
          title:"🏋️ Focus-Tag B", date:"Freitag · 24.07.2026",
          sub:"Vertikal-Gymnastics · BMU-Reclaim · Strict HSPU · Pull/T2B · Weighted Pull-up 3×4 · Mobility",
          intro:"Snatch-Pattern, Strict HSPU und Toes-to-Bar waren in W29 durch die Bangkok-Ersatzsession (Mi) unbedient — heute Reclaim statt Steigerung. Ausnahme: Weighted Pull-up geht wie geplant auf die neue Stufe 3×4 @ +5 kg.",
          dauer:{ kern:"~55 min", gesamt:"~60 min", warmup:"~10 min Warm-up (nicht als Block gelistet)", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          blocks:[
            { letter:"A", prio:"required", min:10, title:"BMU Progression — EMOM", sub:"Akkumulation · Qualität vor Quantität · 10 min",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Bar Muscle-Up||Min 1–5","5 × 1–2","BW","7","X","Rest of min","Ceiling gehalten bei 14–15 total."],
                ["Bar Muscle-Up||Min 6–10","5 × 2","BW","7–8","X","Rest of min","Doubles wenn sauber — W28-Notiz zu unsauberen Doubles im Blick behalten, bei Speedverlust auf Single zurück."]
              ],
              note:"Kein weiterer Push diese Woche — Qualität vor Quantität nach der Reiseunterbrechung." },
            { letter:"B", prio:"required", min:12, title:"Pull + T2B Kapazität", sub:"3 Rounds · 90 sec Rest zwischen Rounds",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Kipping Pull-up","3 × 8","BW","7","X","30 sec → T2B","Gehalten."],
                ["Toes-to-Bar","3 × 8","BW","7","X","90 sec → nächste Round","Reclaim nach Bangkok-Ausfall — Progression auf 3×9 erst nächste Woche bei sauberer Bestätigung."]
              ] },
            { letter:"C", prio:"required", min:14, title:"Strict HSPU Volumen", sub:"Hauptarbeit · 4 Sätze · Reclaim",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × 6","BW","8","21X0","3 min","Reclaim — gehalten wie letzter bestätigter Stand (W28), kein Push auf 4×7 diese Woche."] ] },
            { letter:"D", prio:"required", min:8, title:"Weighted Pull-up Density", sub:"Neue Stufe 3×4",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Weighted Pull-up","3 × 4||neue Stufe","+5 kg","7–8","30X1","2 min","Progressionstreppe: 3×3 → 3×4 → 3×5 → Testsatz. Bei unsauberem Satz 4 zurück auf 3×3."] ] },
            { letter:"E", prio:"optional", min:5, title:"Cool-down Mobility", sub:"~5 min · Schulter + Thorax",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Passive Hängelast, Schulter offen lassen."],
                ["Shoulder CARs","2 × 8/Seite","Kontrolliert, voller Bewegungsradius."],
                ["Thorakale Extension","1–2 min","Foam Roller."]
              ] }
          ],
          whoop:[
            ["Bar Muscle Up","EMOM 10 · 1–2 reps/min · BW · Ziel gehalten 14–15 total"],
            ["Pull Up","3 × 8 kipping · BW"],
            ["Toes to Bar","3 × 8 · BW"],
            ["Handstand Push Up","4 × 6 strict · BW"],
            ["Pull Up (Weighted)","3 × 4 · +5 kg · RPE 7–8"]
          ]
        },
        C: {
          title:"🏝️ Griechenland-Session", date:"Sonntag · 26.07.2026",
          sub:"Bodyweight · Band · Springseil · Urlaub Griechenland",
          intro:"Nur Bodyweight, Gummibänder und Springseil vor Ort — kein Barbell/DB-Zugang. Urlaubskontext: moderate Session, kein Testcharakter.",
          dauer:{ kern:"~45 min", gesamt:"~50 min", hinweis:"Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten. Fokus-Tag-Standard: 60–90 min einschließlich Warm-up und Mobility." },
          blocks:[
            { letter:"A", prio:"required", min:8, title:"Warm-up", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Springseil locker","3 min","Puls hochbringen."],
                ["Band Pull-Apart","2 × 15","Schulter aktivieren."],
                ["Arm-/Hip-Circles","2 min","Voller Bewegungsradius."]
              ] },
            { letter:"B", prio:"required", min:25, title:"Strength-Circuit", sub:"3 Runden · minimal Rest zwischen Übungen",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Liegestütz-Variante","3 × 12-15","BW","6-7","kontrolliert","—","Push-Pattern erhalten."],
                ["Band Row","3 × 15","Band","6-7","kontrolliert","—","Zug-Pattern gegen Pull-up-Volumen tauschen."],
                ["Bulgarian Split Squat","3 × 10/Bein","BW","6-7","kontrolliert","—","Quad/Hüfte, keine Sprungbelastung."],
                ["Band Face-Pull/Außenrotation","3 × 15","Band","6","kontrolliert","—","Schulter-Gesundheit."],
                ["Hollow Body Hold","3 × 30 sec","BW","6","—","—","Ruhig atmen."]
              ],
              note:"~60-90 sec Pause zwischen Runden." },
            { letter:"C", prio:"required", min:10, title:"Springseil-Conditioning", sub:"~10 min",
              headers:["Übung","Dauer","Note"],
              rows:[ ["Springseil Intervalle","8 × (30 sec max / 30 sec Pause)","Single- oder Double-Unders — keine Crossover-DUs (laut Profil ausgeschlossen)."] ] },
            { letter:"D", prio:"optional", min:8, title:"Cool-down Mobility", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Hüftbeuger-Stretch","2 × 45 sec/Seite","Nach Split Squats."],
                ["Thorakale Extension","1-2 min","Falls Foam Roller/Handtuch verfügbar."],
                ["Lat-Stretch (Band-unterstützt)","2 × 45 sec","Overhead-Enge lösen."]
              ] }
          ],
          whoop:[
            ["Push Up","3 × 12-15 · BW"],
            ["Walking Lunge","3 × 10/Bein · BW (als Bulgarian Split Squat ausgeführt)"],
            ["Hollow Body Hold","3 × 30 sec · BW"],
            ["Jump Rope","Conditioning-Intervalle 8 × 30 sec"]
          ]
        }
      }
    },
  ]
};
