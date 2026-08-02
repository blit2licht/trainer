/* ════════════════════════════════════════════════════════════
   data.js — AI Coach · Martin
   Nur diese Datei wächst pro Woche.
   Neue Woche = neues Objekt VORNE in weeks[] einfügen.
   isoDate-Felder sind Pflicht — werden vom Notes-System genutzt.
════════════════════════════════════════════════════════════ */
const DATA = {
  weeks: [
    /* ── neue Woche als nächstes Objekt HIER (oben) einfügen ── */
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
          blocks:[
            { letter:"A", title:"BMU — Testsatz + Qualität", sub:"Test frisch · Ziel 5 (Stand 3)",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Bar Muscle-Up||Testsatz","1 × max unbroken","BW","—","X","voll erholt","Allererster Arbeitssatz. Ergebnis loggen — setzt den Zielstand neu."],
                ["Bar Muscle-Up||EMOM 5","5 × 1","BW","7","X","Rest of min","Qualitäts-Singles nach dem Test. Doubles-Speed (W28-Flag) beobachten, nicht erzwingen."]
              ] },
            { letter:"B", title:"T2B — Testsatz + Kapazität", sub:"Test frisch · Ziel 10 (Stand 6)",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Toes-to-Bar||Testsatz","1 × max unbroken","BW","—","X","voll","Rhythmus halten, bei Abriss beenden."],
                ["Toes-to-Bar","2 × 8","BW","7","X","90 sec","Reduziert wegen Testarbeit."]
              ] },
            { letter:"C", title:"Strict HSPU — Testsatz + Volumen", sub:"Test frisch · Ziel 10 (Stand 6)",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Strict HSPU||Testsatz","1 × max unbroken","BW","—","21X0","voll","Kein Kipping, sauberer Lockout — Abbruch bei Technikverfall."],
                ["Strict HSPU","3 × 5","BW","8","21X0","3 min","Reduziert (statt 4×6) wegen Testsatz."]
              ] },
            { letter:"D", title:"Weighted Pull-up Density", sub:"Stufe 3×4 bestätigen",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Weighted Pull-up","3 × 4","+5 kg","7–8","30X1","2 min","Saubere Wiederholung der W30-Stufe → nächste Woche 3×5. Bei unsauberem Satz zurück auf 3×3."] ] },
            { letter:"E", title:"Hypertrophie-Layer — Brust/Trizeps", sub:"~15 min · Rekomposition",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["DB Bench Press","3 × 10–12","RPE-kalibriert","7","kontrolliert","60 sec","Keine Failure-Sätze — Layer, kein Hauptreiz."],
                ["Band/Cable Triceps Extension","3 × 15","Band","7","kontrolliert","60 sec","Konstante Spannung."]
              ] },
            { letter:"F", title:"Cool-down Mobility", sub:"~5 min",
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
          blocks:[
            { letter:"A", title:"Clean Pull + Hang Power Clean", sub:"4 Sätze aufsteigend · Position wecken",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Clean Pull||+ Hang Power Clean","4 × (1+1)","50 → 60 → 65 → 70 kg","≤7","explosiv","2 min","Zug/Position nach 3 Wochen Pause, kein Quad-Fokus."] ] },
            { letter:"B", title:"Squat Clean + Push Jerk Komplex", sub:"Every 2:00 · 6 Sätze · Ceiling 80 kg",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Squat Clean||+ Push Jerk","6 × (1+1)||build","60 → 65 → 70 → 75 → 77,5 → 80 kg","≤8","X","Restliche 2:00","W28-Referenz 78 @7. 80 nur bei sauberem Fang + Jerk-Lockout — sonst auf letztem sauberen Gewicht ausfahren. Topgewicht loggen."] ] },
            { letter:"C", title:"Core", sub:"Leicht",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] },
            { letter:"D", title:"Hypertrophie-Layer — Delts/Bizeps", sub:"~15 min · Rekomposition",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["DB Lateral Raise","3 × 12–15","RPE-kalibriert","7","kontrolliert","60 sec","Leicht, sauber — Schulter ist von Jerks vorbelastet."],
                ["DB Curl","3 × 12","RPE-kalibriert","7","kontrolliert","60 sec","Keine Failure-Sätze."]
              ] },
            { letter:"E", title:"Mobility", sub:"~8 min",
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
          blocks:[
            { letter:"A", title:"Wall Strict HSPU", sub:"4 Sätze · Erhalt",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Wall Strict HSPU","4 × 5","BW","7","21X0","2-3 min","Ein Rep unter Stand (4×6) — Erhalt, kein Push. Keine geeignete Wand → Pike Push-up mit erhöhten Füßen (Stuhl/Mauer)."] ] },
            { letter:"B", title:"Push + Beine", sub:"3 Runden · kontrolliert",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Push-up Tempo","3 × 12-15","BW","6-7","21X0","60 sec","Sauberes Tempo statt Reps jagen."],
                ["Bulgarian Split Squat","3 × 10/Bein","BW","6-7","kontrolliert","60 sec","Quad/Hüfte, keine Sprungbelastung."],
                ["Band Face-Pull + Außenrotation","3 × 15","Band","6","kontrolliert","60 sec","Schultergesundheit gegen das Push-Volumen."]
              ] },
            { letter:"C", title:"Core", sub:"Leicht",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] },
            { letter:"D", title:"Mobility", sub:"~5 min",
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
          blocks:[
            { letter:"A", title:"Warm-up", sub:"~5 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Springseil locker","3 min","Puls hochbringen."],
                ["Arm-/Hip-Circles","2 min","Voller Bewegungsradius."]
              ] },
            { letter:"B", title:"Springseil-Intervalle", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[ ["Springseil Intervalle","6 × (40 sec Arbeit / 40 sec Pause)","Single- oder Double-Unders — keine Crossover-DUs (laut Profil ausgeschlossen)."] ] },
            { letter:"C", title:"AMRAP", sub:"10 min · RPE ≤7",
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
            { letter:"D", title:"Cool-down", sub:"~5 min",
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
          blocks:[
            { letter:"A", title:"Band Row", sub:"4 Sätze · schwerste Bandvariante",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Band Row","4 × 12","Band schwer","7","30X1","90 sec","Stärkstes Band oder doppelt genommen — bewusste Spannung, kein Federn."] ] },
            { letter:"B", title:"Posterior Chain", sub:"3 Runden",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Single-Leg RDL","3 × 10/Bein","BW oder Band","6-7","kontrolliert","60 sec","Hinge-Pattern erhalten, Balance sauber."],
                ["Band Pull-Apart","3 × 20","Band","6","kontrolliert","60 sec","Schulterblatt-Arbeit."]
              ] },
            { letter:"C", title:"Handstand Hold", sub:"3 Sätze · Overhead-Erhalt",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Wall Handstand Hold","3 × 30-40 sec","BW","6-7","—","90 sec","Aktiv drücken, Rippen geschlossen. Kein Handstand Walk (ausgeschlossen)."] ] },
            { letter:"D", title:"Core", sub:"Seitlich + Rücken",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Side Plank","3 × 30 sec/Seite","BW","6","—","30 sec","Hüfte oben halten."],
                ["Arch Hold","3 × 20 sec","BW","6","—","60 sec","Gegenspieler zum Hollow aus Session 1."]
              ] },
            { letter:"E", title:"Mobility", sub:"~5 min",
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
          blocks:[
            { letter:"A", title:"Front Squat", sub:"Aufsteigende Einzelsätze · finale Blockwoche",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Front Squat","5-3-2-1-1||aufsteigend","75 · 85 · 92,5 · 97,5 · 102,5 kg","≤8","kontrolliert","2-3 min","Stop, sobald Tiefe oder Technik nachlässt — kein Zwang auf 102,5 kg."] ] },
            { letter:"B", title:"Pause OHS", sub:"3 Sätze · reine Reaktivierung",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Pause OHS||2-sec Pause Bottom","3 × 3","40 → 42,5 → 45 kg","≤7","32X1","2 min","Letzter Wert 50 kg (W27) — heute nicht Ziel, Pattern vor Last."] ] },
            { letter:"C", title:"Core", sub:"Leicht",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] },
            { letter:"D", title:"Mobility", sub:"~8 min",
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
          blocks:[
            { letter:"A", title:"BMU Progression — EMOM", sub:"Akkumulation · Qualität vor Quantität · 10 min",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Bar Muscle-Up||Min 1–5","5 × 1–2","BW","7","X","Rest of min","Ceiling gehalten bei 14–15 total."],
                ["Bar Muscle-Up||Min 6–10","5 × 2","BW","7–8","X","Rest of min","Doubles wenn sauber — W28-Notiz zu unsauberen Doubles im Blick behalten, bei Speedverlust auf Single zurück."]
              ],
              note:"Kein weiterer Push diese Woche — Qualität vor Quantität nach der Reiseunterbrechung." },
            { letter:"B", title:"Pull + T2B Kapazität", sub:"3 Rounds · 90 sec Rest zwischen Rounds",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Kipping Pull-up","3 × 8","BW","7","X","30 sec → T2B","Gehalten."],
                ["Toes-to-Bar","3 × 8","BW","7","X","90 sec → nächste Round","Reclaim nach Bangkok-Ausfall — Progression auf 3×9 erst nächste Woche bei sauberer Bestätigung."]
              ] },
            { letter:"C", title:"Strict HSPU Volumen", sub:"Hauptarbeit · 4 Sätze · Reclaim",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × 6","BW","8","21X0","3 min","Reclaim — gehalten wie letzter bestätigter Stand (W28), kein Push auf 4×7 diese Woche."] ] },
            { letter:"D", title:"Weighted Pull-up Density", sub:"Neue Stufe 3×4",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Weighted Pull-up","3 × 4||neue Stufe","+5 kg","7–8","30X1","2 min","Progressionstreppe: 3×3 → 3×4 → 3×5 → Testsatz. Bei unsauberem Satz 4 zurück auf 3×3."] ] },
            { letter:"E", title:"Cool-down Mobility", sub:"~5 min · Schulter + Thorax",
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
          blocks:[
            { letter:"A", title:"Warm-up", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Springseil locker","3 min","Puls hochbringen."],
                ["Band Pull-Apart","2 × 15","Schulter aktivieren."],
                ["Arm-/Hip-Circles","2 min","Voller Bewegungsradius."]
              ] },
            { letter:"B", title:"Strength-Circuit", sub:"3 Runden · minimal Rest zwischen Übungen",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Liegestütz-Variante","3 × 12-15","BW","6-7","kontrolliert","—","Push-Pattern erhalten."],
                ["Band Row","3 × 15","Band","6-7","kontrolliert","—","Zug-Pattern gegen Pull-up-Volumen tauschen."],
                ["Bulgarian Split Squat","3 × 10/Bein","BW","6-7","kontrolliert","—","Quad/Hüfte, keine Sprungbelastung."],
                ["Band Face-Pull/Außenrotation","3 × 15","Band","6","kontrolliert","—","Schulter-Gesundheit."],
                ["Hollow Body Hold","3 × 30 sec","BW","6","—","—","Ruhig atmen."]
              ],
              note:"~60-90 sec Pause zwischen Runden." },
            { letter:"C", title:"Springseil-Conditioning", sub:"~10 min",
              headers:["Übung","Dauer","Note"],
              rows:[ ["Springseil Intervalle","8 × (30 sec max / 30 sec Pause)","Single- oder Double-Unders — keine Crossover-DUs (laut Profil ausgeschlossen)."] ] },
            { letter:"D", title:"Cool-down Mobility", sub:"~8 min",
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
    {
      id: "2026-W29",
      label: "Woche 5 · 13.–19. Juli 2026",
      meso: "Meso 2 · Woche 5",
      phase: "Bangkok-Erhalt / De-facto-Deload",
      dateFrom: "2026-07-13",
      dateTo:   "2026-07-19",
      days: [
        { day:"Montag",    date:"13.07.", isoDate:"2026-07-13", type:"rest", einheit:"—", rx:"—", note:"Ankunft Bangkok, Jetlag — kein Training (fix)." },
        { day:"Dienstag",  date:"14.07.", isoDate:"2026-07-14", type:"own",  focus:"A", einheit:"Erhalt A — Pull/Gymnastics + DB Front Squat", sub:"Strict Pull-up · Toes-to-Bar · DB Front Rack Squat · Hollow Hold", rx:"Auf Anfrage — Hotel-Gym", rpe:"RPE ≤7", note:"Vormittags-Fenster (45-60 min). Kein Langhantel-Zugang — DB-Ersatz für Front Squat, kein Last-Fokus." },
        { day:"Mittwoch",  date:"15.07.", isoDate:"2026-07-15", type:"own",  focus:"B", einheit:"Ist: Full-Body-DB-Session (Hotel-Gym) — statt geplantem Erhalt B", sub:"Squat · Hinge · horizontales Push/Pull · vertikales Push · Core (DB, WHOOP-Session-Builder)", rx:"RPE-only, moderat", note:"Abweichung vom Plan (DB Snatch-Pattern + Strict HSPU) — WHOOP-Builder ohne Wochenkontext genutzt, dadurch volle Muster-Coverage bei 34% Recovery. Snatch-Pattern/Strict HSPU bleiben offen, kein Nachholversuch diese Woche — Reclaim wartet auf W30." },
        { day:"Donnerstag",date:"16.07.", isoDate:"2026-07-16", type:"own",  focus:"Recovery", einheit:"Recovery — Mobility (Hotel-Gym)", sub:"Hüftbeuger-Mobility · BWS-Rotation · Schulter-Mobility (kein Press) · Dead Bug · Foam Roll/Stretch", rx:"RPE ≤4", note:"Ersetzt Box-Drop-in. Nach voller Muster-Coverage Mi (Squat/Hinge/Push/Pull/Overhead bei 34% Recovery) bewusst ohne Reizaufbau vor Sa/So-Belastung in München. Kein Press/Squat/Hinge/Row — alles Mi bereits bedient. Zusätzlich realistisch: Sternerestaurant-Dinner Mi-Abend (spätes/schweres Essen, vsl. Alkohol) dämpft die Recovery Do vermutlich zusätzlich — bewusst kein Reizaufbau versucht." },
        { day:"Freitag",   date:"17.07.", isoDate:"2026-07-17", type:"rest", einheit:"—", rx:"—", note:"Rückflug Bangkok → München — kein Training (Reisetag)." },
        { day:"Samstag",   date:"18.07.", isoDate:"2026-07-18", type:"box",  einheit:"Accessory Strength + AMRAP Engine", sub:"E3:00×3: 8-10 Dips + DB Lateral/Front Raise + 20 sec/Seite Side Plank → 5 Runden (5 min): 15 Push-ups · 30 Air Squats · 15 V-ups · AMRAP Cal Restzeit", rx:"RPE-only", rpe:"RPE ~6-7", note:"Landetag nach Nachtflug — bewusst leichter Accessory/Engine-Tag, kein Lastfokus." },
        { day:"Sonntag",   date:"19.07.", isoDate:"2026-07-19", type:"own",  focus:"C", einheit:"Opengym — C&J Singles + kurzer WOD", sub:"E1:30×8: 1 Clean &amp; Jerk (Woche 1/2) → 8 Runden For Time: 4 Box Jumps · 5 C2B · 6 Shoulder to Overhead", rx:"C&J bis 75 kg RPE-gated · WOD <span class='rv'>L3-Standards, Bar 52,5 kg, Box 70 cm, C2B</span>", rpe:"RPE ≤8 (C&J), Cap 15 min (WOD)", note:"Kein Kursplatz bekommen → Opengym statt Team-WOD. Recovery 54 % (gelb) bei gutem Schlaf, erst 2. Trainingstag der Woche — keine Kappungsregel, aber kein Test. Bar im WOD von 60 auf 52,5 kg reduziert (60 kg ≈ 73 % der Push-Press-Basis, bei 8×6 sonst Kraftausdauer statt Engine). Team-WOD verworfen: 10 BMU nach 80 T2B + 20 C2B wäre Technik-Rückschritt beim aktuellen Fokus, und der C&J-Block würde ersatzlos ausfallen." }
      ],
      focusDays: {
        A: {
          title:"🧳 Erhalt-Tag A", date:"Dienstag · 14.07.2026",
          sub:"Pull/Gymnastics-Erhalt · DB Front Squat · Hotel-Gym Bangkok",
          intro:"Kein Langhantel-Zugang in Bangkok — Weightlifting wird zu DB-Positionsarbeit ohne Last-Fokus. Gymnastics bleibt über die Klimmzugstange trainierbar. BMU fällt diese Woche bewusst raus — ein fest montierter Hotel-Gym-Bar hat meist zu wenig Schwungraum für sicheres Kipping.",
          blocks:[
            { letter:"A", title:"Strict Pull-up", sub:"4 Sätze · BMU-Ersatz",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict Pull-up","4 × 6-8","BW","7","X","90 sec","Kein Kipping/Schwung nötig — sicherer als BMU-Versuch am Hotel-Gym-Bar."] ] },
            { letter:"B", title:"Toes-to-Bar", sub:"3 Sätze · gehalten wie W28",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Toes-to-Bar","3 × 8","BW","7","X","90 sec","Gehalten wie W28."] ] },
            { letter:"C", title:"DB Front Rack Squat", sub:"Front-Squat-Pattern-Ersatz",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["DB Front Rack Squat","4 × 8","20-22,5 kg","7","kontrolliert","2 min","Kein Barbell verfügbar — Pattern erhalten, kein Last-Fokus."] ] },
            { letter:"D", title:"Core", sub:"Leicht",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] }
          ],
          whoop:[
            ["Pull Up","4 × 6-8 strict · BW"],
            ["Toes to Bar","3 × 8 · BW"],
            ["Dumbbell Front Squat","4 × 8 · 20-22,5 kg"],
            ["Hollow Body Hold","3 × 30 sec · BW"]
          ]
        },
        B: {
          title:"🧳 Erhalt-Tag B", date:"Mittwoch · 15.07.2026",
          sub:"DB Snatch-Pattern · Strict HSPU · Hotel-Gym Bangkok",
          intro:"Snatch-Pattern über DB Single-Arm Snatch erhalten (kein Last-Fokus, kein Ceiling-Push). HSPU wie gewohnt, falls Wandfläche vorhanden.",
          blocks:[
            { letter:"A", title:"DB Single-Arm Snatch", sub:"5 Sätze · Snatch-Pattern-Erhalt",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["DB Single-Arm Snatch","5 × 6/Seite","20-22,5 kg","7","explosiv","90 sec","Bewegungsmuster erhalten, kein Last-Fokus."] ] },
            { letter:"B", title:"Strict HSPU", sub:"4 Sätze · wie W28 gehalten",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × 6","BW","7-8","21X0","3 min","Falls keine Wandfläche vorhanden: DB Seated Press als Ersatz."] ] },
            { letter:"C", title:"DB Goblet Reverse Lunge", sub:"3 Sätze · Stabilität",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["DB Goblet Reverse Lunge","3 × 10/Bein","20-22,5 kg","6-7","kontrolliert","90 sec","Front-Rack-Stabilität, Hüfte."] ] },
            { letter:"D", title:"Mobility", sub:"~8 min · Schulter + Thorax + Hüfte",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Overhead-Enge lösen."],
                ["Thorakale Extension","1-2 min","Falls Foam Roller verfügbar."],
                ["Hip-Flexor-Stretch","2 × 45 sec/Seite","90/90 oder Kniestand."]
              ] }
          ],
          whoop:[
            ["Dumbbell Snatch (Single Arm)","5 × 6/Seite · 20-22,5 kg"],
            ["Handstand Push Up","4 × 6 strict · BW"],
            ["Dumbbell Lunge (Reverse)","3 × 10/Bein · 20-22,5 kg"]
          ]
        },
        C: {
          title:"🏋️ Opengym-Session", date:"Sonntag · 19.07.2026",
          sub:"Clean &amp; Jerk Singles (Woche 1/2) · kurzer WOD · CrossFit Munich Opengym",
          intro:"Kein Kursplatz bekommen — statt Team-WOD individuelle Opengym-Session, damit der C&amp;J-Block startet. Recovery 54 % (gelb) bei gutem Schlaf, erst 2. Trainingstag der Woche: keine Kappungsregel (die greift &lt;50 %), aber ausdrücklich kein Max-Test. Referenz ist der 78-kg-<em>Komplex</em> aus W28 (Squat Clean + Push Jerk @ RPE 7) — heute sind es Singles, also nicht daran messen. Gesamtdauer ~60-75 min.",
          blocks:[
            { letter:"A", title:"Warm-up", sub:"~10 min · Front-Rack + Overhead öffnen",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Allgemein (Row/Bike + Mobility)","5 min","Locker, Puls hochbringen."],
                ["Barbell-Komplex leere Stange","2-3 Durchgänge","Muscle Clean · Front Squat · Push Jerk · Overhead Hold — Positionen wecken."],
                ["Front-Rack + Lat-Stretch","2 min","Ellbogen hoch, Overhead-Enge lösen."]
              ] },
            { letter:"B", title:"Clean &amp; Jerk — Singles", sub:"E1:30 × 8 (12 min) · Woche 1/2",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Clean &amp; Jerk","8 × 1","60 · 62,5 · 65 · 67,5 · 70 · 72,5 · 75 · 75 kg","≤8","zügig","E1:30","Kein neues Top. Steigerung stoppt, sobald Fang-Position oder Jerk-Lockout unsauber wird — dann auf dem letzten sauberen Gewicht ausfahren."] ] },
            { letter:"C", title:"WOD", sub:"Metcon zum Abschluss · L3-Standards, Bar reduziert",
              wod:{
                struktur:"8 Runden auf Zeit",
                format:"For Time",
                cap:"Cap 15 min",
                bewegungen:[
                  { reps:"4", name:"Box Jumps",            detail:"70 cm" },
                  { reps:"5", name:"Chest-to-Bar Pull-up", detail:"BW" },
                  { reps:"6", name:"Shoulder to Overhead", detail:"52,5 kg" }
                ],
                gesamt:"32 Box Jumps · 40 Chest-to-Bar · 48 Shoulder to Overhead"
              },
              note:"Bar von publizierten 60 auf 52,5 kg reduziert — bei 8 × 6 wären 60 kg ≈ 73 % der Push-Press-Basis (82,5 kg), das kippt von Engine in Kraftausdauer. C2B und Box-Höhe bleiben auf L3: Zug-Qualität ist der Punkt, nicht Volumen. Unbroken-Sätze anstreben, bei Grip-Verlust früh in 3/2 teilen statt zu reißen." },
            { letter:"D", title:"Cool-down", sub:"5-10 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Hüftbeuger-Stretch","2 × 45 sec/Seite","Nach Box Jumps + Cleans."],
                ["Thorakale Extension","1-2 min","Foam Roller."],
                ["Lat-Stretch hängend","2 × 45 sec","Nach C2B-Volumen."]
              ] }
          ],
          whoop:[
            ["Clean and Jerk","8 × 1 · 60-75 kg"],
            ["Box Jump","8 × 4 · 70 cm"],
            ["Chest to Bar Pull Up","8 × 5 · BW"],
            ["Shoulder to Overhead","8 × 6 · 52,5 kg"]
          ]
        }
      }
    },
  ]
};
