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
      id: "2026-W29",
      label: "Woche 5 · 13.–19. Juli 2026",
      meso: "Meso 2 · Woche 5",
      phase: "Bangkok-Erhalt / De-facto-Deload",
      dateFrom: "2026-07-13",
      dateTo:   "2026-07-19",
      days: [
        { day:"Montag",    date:"13.07.", isoDate:"2026-07-13", type:"rest", einheit:"—", rx:"—", note:"Ankunft Bangkok, Jetlag — kein Training (fix)." },
        { day:"Dienstag",  date:"14.07.", isoDate:"2026-07-14", type:"own",  focus:"A", einheit:"Erhalt A — Pull/Gymnastics + DB Front Squat", sub:"Strict Pull-up · Toes-to-Bar · DB Front Rack Squat · Hollow Hold", rx:"Auf Anfrage — Hotel-Gym", rpe:"RPE ≤7", note:"Vormittags-Fenster (45-60 min). Kein Langhantel-Zugang — DB-Ersatz für Front Squat, kein Last-Fokus." },
        { day:"Mittwoch",  date:"15.07.", isoDate:"2026-07-15", type:"own",  focus:"B", einheit:"Erhalt B — DB Snatch-Pattern + Strict HSPU", sub:"DB Single-Arm Snatch · Strict HSPU · DB Goblet Reverse Lunge · Mobility", rx:"Auf Anfrage — Hotel-Gym", rpe:"RPE ≤7-8", note:"Vormittags-Fenster (45-60 min). Snatch-Pattern erhalten, kein Last-Fokus." },
        { day:"Donnerstag",date:"16.07.", isoDate:"2026-07-16", type:"own",  focus:"Recovery", einheit:"Recovery — Mobility (Hotel-Gym)", sub:"Hüftbeuger-Mobility · BWS-Rotation · Schulter-Mobility (kein Press) · Dead Bug · Foam Roll/Stretch", rx:"RPE ≤4", note:"Ersetzt Box-Drop-in. Nach voller Muster-Coverage Mi (Squat/Hinge/Push/Pull/Overhead bei 34% Recovery) bewusst ohne Reizaufbau vor Sa/So-Belastung in München. Kein Press/Squat/Hinge/Row — alles Mi bereits bedient." },
        { day:"Freitag",   date:"17.07.", isoDate:"2026-07-17", type:"rest", einheit:"—", rx:"—", note:"Rückflug Bangkok → München — kein Training (Reisetag)." },
        { day:"Samstag",   date:"18.07.", isoDate:"2026-07-18", type:"box",  einheit:"Accessory Strength + AMRAP Engine", sub:"E3:00×3: 8-10 Dips + DB Lateral/Front Raise + 20 sec/Seite Side Plank → 5 Runden (5 min): 15 Push-ups · 30 Air Squats · 15 V-ups · AMRAP Cal Restzeit", rx:"RPE-only", rpe:"RPE ~6-7", note:"Landetag nach Nachtflug — bewusst leichter Accessory/Engine-Tag, kein Lastfokus." },
        { day:"Sonntag",   date:"19.07.", isoDate:"2026-07-19", type:"box",  einheit:"Clean & Jerk Singles + Box Jump/Pull-up/S2O", sub:"E1:30×8: 1 Clean & Jerk (Woche 1/2) → 8 Runden For Time: 4 Box Jumps · 5 Pull-ups · 6 Shoulder to Overhead", rx:"C&J RPE-gated, keine PR jagen · WOD <span class='rv'>L3 — Bar 60 kg, Box 70 cm, C2B</span>", rpe:"RPE ≤8 (C&J), Cap 15 min (WOD)", note:"Technik/Position erhalten, kein Max-Test — zwei Tage nach dem 78-kg-Erfolg (W28) und nach Zeitzonenwechsel. Level am Trainingstag nach aktueller Recovery entscheiden." }
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
        }
      }
    },
    /* ── W28 ─────────────────────────────────── */
    {
      id: "2026-W28",
      label: "Woche 4 · 6.–12. Juli 2026",
      meso: "Meso 2 · Woche 4",
      phase: "Reclaim / Kapazität / Robustheit",
      dateFrom: "2026-07-06",
      dateTo:   "2026-07-12",
      days: [
        { day:"Montag",    date:"06.07.", isoDate:"2026-07-06", type:"rest", einheit:"—", rx:"—", note:"Kein Training (fix, Martins Vorgabe)." },
        { day:"Dienstag",  date:"07.07.", isoDate:"2026-07-07", type:"box",  einheit:"Front Squat (Wk 2/3) + Row/Wall Ball/Devils Press", sub:"FS E2:00×5 (70→92-95 %) → 6 Rd (2' Work/1' Rest): 15/12 Cal Row · 15 Wall Balls · AMAP Devils Press", rx:"FS bis <span class='rv'>~97,5–100 kg</span> · WOD L2: DB 20 kg + WB 9 kg", rpe:"RPE ≤8 (Topsatz)", note:"Setzt den FS-Block von letzter Woche fort (W1/3 Top 100 kg → W2/3). L3 (DB 22,5 kg) situativ, wenn frisch." },
        { day:"Mittwoch",  date:"08.07.", isoDate:"2026-07-08", type:"box",  einheit:"Seated Press/Gorilla Row + HSPU-Run-Chipper", sub:"E1:30×6 (Wk1/4): 10 Seated Barbell Press · 16 Alt. Gorilla Row → For Time: 25 HSPU · 200m Run · 10 Burpee Pull-up · 200m Run · 10 Burpee Pull-up · 200m Run · 25 HSPU", rx:"<span class='rv'>L2 — Abmat HSPU</span>, Press/Row RPE-only", rpe:"Cap 16 min", note:"Hohes Overhead-/Pull-Volumen (50 HSPU total) — Fokus B liegt deshalb erst Fr, nicht direkt danach. L3 (Burpee BMU statt Pull-up) bewusst nicht gewählt — dupliziert Fokus B." },
        { day:"Donnerstag",date:"09.07.", isoDate:"2026-07-09", type:"own",  focus:"A", einheit:"Clean & Jerk Reclaim", sub:"Clean Pull + Hang Power Clean · Squat Clean + Push Jerk Komplex · Front Rack Reverse Lunge · Hollow Hold", rx:"Komplex-Ziel <span class='rv'>77,5 kg</span>", rpe:"RPE ≤8 cap", note:"Nachholtermin — seit W25 nicht direkt trainiert (letzter Wert 75 kg @7). Technik vor Last, kein zusätzliches Front-Squat-Volumen." },
        { day:"Freitag",   date:"10.07.", isoDate:"2026-07-10", type:"own",  focus:"B", einheit:"Vertikal-Gymnastics", sub:"BMU · Pull/T2B · Strict HSPU · Weighted Pull-up · Mobility", rx:"Auf Anfrage", rpe:"RPE 7–8", note:"Volumen gehalten (nicht gesteigert) wegen Mi-Overhead-Last. HSPU bleibt 4×6, kein Push auf 4×6-7." },
        { day:"Samstag",   date:"11.07.", isoDate:"2026-07-11", type:"box",  einheit:"Squat Snatch Complex + DB Hang Snatch/Step-ups", sub:"E1:45×6: 1 Power Snatch + 1 Squat Snatch → For Time: Buy-in 30 Alt. DB Box Step-ups · 5 Rd (6 DB Hang Snatch re · 6 DB Hang Snatch li · 12/9 Cal) · Cash-out 30 Alt. DB Box Step-ups", rx:"Complex RPE-gated <span class='rv'>~42,5–47,5 kg</span> · WOD L2: DB 22,5 kg", rpe:"RPE ≤7 (Complex)", note:"Bedient Snatch diese Woche, da Fokus A auf C&J liegt. Cap 16 min." },
        { day:"Sonntag",   date:"12.07.", isoDate:"2026-07-12", type:"rest", einheit:"—", rx:"—", note:"Abreise Bangkok (1 Woche Arbeit) — kein Training." }
      ],
      focusDays: {
        A: {
          title:"🏋️ Focus-Tag A", date:"Donnerstag · 09.07.2026",
          sub:"Clean & Jerk Reclaim · Positionsarbeit · Front-Rack-Stabilität",
          intro:"Seit W25 nicht direkt trainiert (W27 zugunsten Snatch zurückgestellt) — geschützter Slot fällig. Letzter bestätigter Wert: 75 kg @ RPE 7 (Squat Clean + Push Jerk Komplex, W25). Technik vor Last, kein zusätzliches Front-Squat-Volumen (Di schon bedient).",
          blocks:[
            { letter:"A", title:"Clean Pull + Hang Power Clean", sub:"5 Sätze aufsteigend · Positionsarbeit statt Squat-Volumen",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Clean Pull||+ Hang Power Clean","5 × (1+1)","50 → 60 → 65 → 67,5 → 70 kg","≤7","explosiv","2 min","Front Squat ist schon Di bedient — hier Zug/Position, kein Quad-Fokus."] ] },
            { letter:"B", title:"Squat Clean + Push Jerk Komplex", sub:"Every 2:00 · 6 Sätze · Reclaim nach 3 Wochen Pause",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Squat Clean||+ Push Jerk","6 × (1+1)||build","55 → 60 → 65 → 70 → 75 → 77,5 kg","≤8","X","Restliche 2:00","W25-Wert war 75 kg @7. Ceiling 77,5–80 kg nur bei sauberem Split-/Jerk-Timing."] ],
              note:"Reclaim-Arbeit, kein Max-Test. Topgewicht in WHOOP loggen." },
            { letter:"C", title:"Front Rack Reverse Lunge", sub:"Stabilität · kein Overhead-Zusatz",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Front Rack Reverse Lunge","3 × 8/Bein","RPE-only","6–7","kontrolliert","90 sec","Front-Rack-Position stabilisieren, keine zusätzliche Schulterlast."] ] },
            { letter:"D", title:"Core", sub:"Leicht · kein Zusatz-Conditioning",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hollow Body Hold","3 × 30 sec","BW","6","—","60 sec","Ruhig atmen, unterer Rücken am Boden."] ] },
            { letter:"E", title:"Ankle/Hip & Thorax Mobility", sub:"~8 min",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Ankle/Hip CARs","2 × 8/Seite","Catch-Tiefe für Squat Clean."],
                ["Thorakale Extension","1–2 min","Foam Roller · Jerk-Overhead vorbereiten."],
                ["Lat-Stretch hängend","2 × 45 sec","Overhead-Enge lösen."]
              ] }
          ],
          whoop:[
            ["Clean Pull","5 × 1 · build 50→70 kg"],
            ["Power Clean (Hang)","5 × 1 · build 50→70 kg"],
            ["Squat Clean","6 × 1 · build 55→77,5 kg · Topgewicht loggen"],
            ["Push Jerk","6 × 1 · build 55→77,5 kg"],
            ["Walking Lunge (Front Rack)","3 × 8/Bein · RPE 6-7"]
          ]
        },
        B: {
          title:"🏋️ Focus-Tag B", date:"Freitag · 10.07.2026",
          sub:"Vertikal-Gymnastics · BMU-Progression · Strict HSPU · Pull/T2B · Weighted Pull-up · Mobility",
          intro:"Volumen bewusst gehalten, nicht gesteigert — Mi hat mit 50 HSPU + 20 Burpee-Pull-ups schon erhebliches Overhead-/Pull-Volumen gebracht. Zwei Tage Puffer zu Mi.",
          blocks:[
            { letter:"A", title:"BMU Progression — EMOM", sub:"Akkumulation · Ziel gehalten auf W27-Niveau · 10 min",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Bar Muscle-Up||Min 1–5","5 × 1–2","BW","7","X","Rest of min","Kein weiterer Push — W27 war 15 total (5×1+5×2)."],
                ["Bar Muscle-Up||Min 6–10","5 × 2","BW","7–8","X","Rest of min","Doubles wenn sauber, sonst Single."]
              ],
              note:"Ceiling gehalten bei 14–15 total. Fokus auf Qualität, keine weitere Steigerung diese Woche." },
            { letter:"B", title:"Pull + T2B Kapazität", sub:"3 Rounds · 90 sec Rest zwischen Rounds",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Kipping Pull-up","3 × 8","BW","7","X","30 sec → T2B","Gehalten wie W27."],
                ["Toes-to-Bar","3 × 8","BW","7","X","90 sec → nächste Round","Gehalten wie W27."]
              ] },
            { letter:"C", title:"Strict HSPU Volumen", sub:"Hauptarbeit · 4 Sätze · gehalten",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × 6||gehalten, nicht gesteigert","BW","8","21X0","3 min","Mi hat schon 50 Reps Volumen gebracht — kein Push auf 4×6-7 diese Woche."] ] },
            { letter:"D", title:"Weighted Pull-up Density", sub:"Letzte Woche auf Stufe 3×3",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Weighted Pull-up","3 × 3||bewusst gehalten","+5 kg","7–8","30X1","2 min","Grip auch durch Mi (Burpee-PU) und Sa (DB Hang Snatch) beansprucht — 3×3 sauber bestätigen. Ab W30 fest 3×4 (Treppe Richtung 6 @ +5 kg)."] ] },
            { letter:"E", title:"Cool-down Mobility", sub:"~5 min · Schulter + Thorax",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Passive Hängelast, Schulter offen lassen."],
                ["Shoulder CARs","2 × 8/Seite","Kontrolliert, voller Bewegungsradius."],
                ["Thorakale Extension","1–2 min","Foam Roller · 3 Positionen entlang der BWS."]
              ] }
          ],
          whoop:[
            ["Bar Muscle Up","EMOM 10 · 1–2 reps/min · BW · Ziel gehalten 14–15 total"],
            ["Pull Up","3 × 8 kipping · BW"],
            ["Toes to Bar","3 × 8 · BW"],
            ["Handstand Push Up","4 × 6 strict · BW"],
            ["Pull Up (Weighted)","3 × 3 · +5 kg · RPE 7–8"]
          ]
        }
      }
    },
    /* ── W27 ─────────────────────────────────── */
    {
      id: "2026-W27",
      label: "Woche 3 · 29. Juni – 5. Juli 2026",
      meso: "Meso 2 · Woche 3",
      phase: "Reclaim / Kapazität / Robustheit",
      dateFrom: "2026-06-29",
      dateTo:   "2026-07-05",
      days: [
        { day:"Montag",    date:"29.06.", isoDate:"2026-06-29", type:"rest", einheit:"Mobility + Nap", rx:"—", note:"32 % rote Recovery nach So (Strain 19,6). Harter Ruhetag — kein Erzwingen. Wenn möglich 60–90 min Nap am frühen Nachmittag (dunkel/kühl)." },
        { day:"Dienstag",  date:"30.06.", isoDate:"2026-06-30", type:"own",  focus:"A", einheit:"Snatch-Speed-Reclaim + OHS", sub:"Pause OHS · Snatch Balance · Hang Squat Snatch · Strict HSPU · GHD", rx:"Ceiling <span class='rv'>52 kg</span> · Speed-Bias", rpe:"RPE 8 cap", note:"Vorgezogen von Fr — Zeit und Tagesform sprachen am Di für Snatch. Speed vor kg — bei langsamem Turnover stoppen. W26 erreichte nur 50, Hüft-/Drop-Speed ist die Baustelle." },
        { day:"Mittwoch",  date:"01.07.", isoDate:"2026-07-01", type:"box",  einheit:"Front Squat Wk1/3 + Intervalle", sub:"FS E2:15×5 (70→90 %) → 4×(3' Work/1' Rest): 200m Run · 10 DL · 5 Burpee o/Bar · Rest-AMRAP Cal", rx:"FS bis <span class='rv'>~92,5–95 kg</span> · DL <span class='rv'>L2 80 kg</span>", rpe:"RPE ≤8", note:"FS-Block-Start (1RM ~105). Letzter Satz im roten Wochenkontext nicht prügeln." },
        { day:"Donnerstag",date:"02.07.", isoDate:"2026-07-02", type:"rest", einheit:"—", rx:"—", note:"Termin 7:00 — kein Training." },
        { day:"Freitag",   date:"03.07.", isoDate:"2026-07-03", type:"rest", einheit:"—", rx:"—", note:"Snatch bereits Di erledigt. Restday." },
        { day:"Samstag",   date:"04.07.", isoDate:"2026-07-04", type:"own",  focus:"B", einheit:"Vertikal-Gymnastics W3", sub:"BMU · Pull/T2B · Strict HSPU · Weighted Pull-up · Mobility", rx:"Auf Anfrage", rpe:"RPE 7–8", note:"Nachgezogen von Di. Zwei Ruhetage davor (Do+Fr) → frisch für Grip/Pull. Kein Konflikt mit Mi-FS (Beine) oder So-Ride." },
        { day:"Sonntag",   date:"05.07.", isoDate:"2026-07-05", type:"ride", einheit:"Social-Ride Z1/Z2", rx:"<span class='rv'>optional</span>", note:"Sozial, Z1/Z2 halten — nicht mit Strain überlagern (zuletzt das Problem)." }
      ],
      focusDays: {
        A: {
          title:"🏋️ Focus-Tag A", date:"Dienstag · 30.06.2026",
          sub:"Snatch-Speed-Reclaim · OHS-Progression · Strict HSPU Volumen · GHD · Overhead Mobility",
          intro:"Vorgezogen von Fr auf Di — Zeit und Tagesform sprachen am Di für Snatch. W26 stoppte bei 50 kg, Hüft-/Drop-Speed war langsam. Diese Woche Speed jagen, nicht Last. Ceiling 52 bleibt, gilt aber nur bei schnellem Turnover.",
          blocks:[
            { letter:"A", title:"Pause OHS — Overhead Aktivierung", sub:"4 Sätze aufsteigend · 2-sec Pause am Bottom",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Pause OHS||2-sec Pause Bottom","4 × 3||42 → 46 → 48 → 50 kg","42 / 46 / 48 / 50 kg","6–7","32X1","2 min","W26-Top war 48–49 sauber → heute 50 anvisieren, wenn stabil."] ],
              note:"Tempo 32X1: 3s descent, 2s Pause unten (aktiv halten), explosiv hoch, 1s oben." },
            { letter:"B", title:"Snatch Balance — Speed-Drill", sub:"4 Sätze · schneller Drop unter die Bar",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Snatch Balance","4 × 2||40 → 44 → 46 → 48 kg","40 / 44 / 46 / 48 kg","≤7","schnell unter","90 sec","Aggressiver, schneller Drop. Das ist die Baustelle — Geschwindigkeit, nicht Last."] ] },
            { letter:"C", title:"Hang Squat Snatch", sub:"Every 2:00 · 5 Sets · Ceiling 52 kg (speed-gated)",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hang Squat Snatch","5 × 1||build","44 → 46 → 48 → 50 → 52 kg","≤8","explosiv","Restliche 2:00","Stop, sobald der Turnover langsam wird — Speed vor kg. Topgewicht in WHOOP loggen."] ],
              note:"Reclaim mit Speed-Bias, kein Max-Test. Ceiling 52 gilt nur, wenn der Drop schnell bleibt." },
            { letter:"D", title:"Strict HSPU Volumen", sub:"Hauptarbeit · 4 Sätze · Volumenanker",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × 5–6||W26 war 4×5","BW","8","21X0","3 min","Einen Rep im Tank lassen. Kein Failure, kein Kipping danach."] ] },
            { letter:"E", title:"GHD Sit-up", sub:"W3 = Volumen leicht hoch",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["GHD Sit-up","3 × 12","BW","6","2010","90 sec","Voller ROM, kein Kipping. W26 war 3×10."] ] },
            { letter:"F", title:"Overhead & Hip Mobility", sub:"~8 min · Longevity-Faden",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Overhead-Enge nach Snatch auflösen."],
                ["Wrist CARs","2 × 10/Seite","Voller Kreisbogen, langsam."],
                ["Thorakale Extension","1–2 min","Foam Roller · 3 Positionen BWS."],
                ["Hip-Flexor-Stretch","2 × 45 sec/Seite","90/90 oder Kniestand."]
              ] }
          ],
          whoop:[
            ["Overhead Squat","4 × 3 Pause · 42 / 46 / 48 / 50 kg · RPE 6–7"],
            ["Snatch Balance","4 × 2 · build 40→48 kg · Speed-Drill"],
            ["Snatch – Barbell","5 × 1 Hang Squat Snatch · build 44→52 kg · speed-gated · Topgewicht loggen"],
            ["Handstand Push Up","4 × 5–6 strict · BW"],
            ["GHD Sit Up","3 × 12 · BW · RPE 6"]
          ]
        },
        B: {
          title:"🏋️ Focus-Tag B", date:"Samstag · 04.07.2026",
          sub:"Vertikal-Gymnastics · BMU-Progression · Strict HSPU · Pull/T2B · Weighted Pull-up · Mobility",
          intro:"Nachgezogen von Di auf Sa (Snatch war am Di dran). Grip isoliert: Mi = Beine (Front Squat), Do+Fr = Ruhe davor. W3-Progression aus geloggter W2-Leistung (BMU 13 total, WPU +5 kg).",
          blocks:[
            { letter:"A", title:"BMU Progression — EMOM", sub:"Akkumulation · Qualität vor Quantität · 10 min",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Bar Muscle-Up||Min 1–5","5 × 1–2","BW","7","X","Rest of min","Voller Lockout, kontrollierte Landung. W2 = 13 total."],
                ["Bar Muscle-Up||Min 6–10","5 × 2","BW","7–8","X","Rest of min","Doubles wenn sauber. Bei Positionsverlust → Single."]
              ],
              note:"Ceiling W3: 14–15 BMU total (W2 = 13). Stop bei Technikverfall. Gesamtreps in WHOOP loggen." },
            { letter:"B", title:"Pull + T2B Kapazität", sub:"3 Rounds · 90 sec Rest zwischen Rounds",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Kipping Pull-up","3 × 8","BW","7","X","30 sec → T2B","Unbroken anstreben."],
                ["Toes-to-Bar","3 × 8","BW","7","X","90 sec → nächste Round","W2 war 3×7 — ein Rep mehr. Rhythmus halten."]
              ] },
            { letter:"C", title:"Strict HSPU Volumen", sub:"Hauptarbeit · 4 Sätze · Volumenanker",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × 6||W2 war 4×5","BW","8","21X0","3 min","Obere Kante des W2-Korridors. Einen Rep im Tank lassen."] ],
              note:"Tempo 21X0: 2s descent, 1s Stirn, explosiv hoch, keine Pause oben." },
            { letter:"D", title:"Weighted Pull-up Density", sub:"Kraft-Endurance · Last-Progression W3",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Weighted Pull-up","3 × 3","+5 kg||W2 bestätigt","7–8","30X1","2 min","Richtung Ziel 6 Reps @ +5 kg. Wenn Rep 3 unsauber → zurück auf +4 kg. Kg loggen."] ] },
            { letter:"E", title:"Cool-down Mobility", sub:"~5 min · Schulter + Thorax",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Passive Hängelast, Schulter offen lassen."],
                ["Shoulder CARs","2 × 8/Seite","Kontrolliert, voller Bewegungsradius."],
                ["Thorakale Extension","1–2 min","Foam Roller · 3 Positionen entlang der BWS."]
              ] }
          ],
          whoop:[
            ["Bar Muscle Up","EMOM 10 · 1–2 reps/min · BW · Ziel 14–15 total · Gesamtreps loggen"],
            ["Pull Up","3 × 8 kipping · BW"],
            ["Toes to Bar","3 × 8 · BW"],
            ["Handstand Push Up","4 × 6 strict · BW"],
            ["Pull Up (Weighted)","3 × 3 · +5 kg · RPE 7–8"]
          ]
        }
      }
    },
    /* ── W26 ─────────────────────────────────── */
    {
      id: "2026-W26",
      label: "Woche 2 · 22.–28. Juni 2026",
      meso: "Meso 2 · Woche 2",
      phase: "Reclaim / Kapazität / Robustheit",
      dateFrom: "2026-06-22",
      dateTo:   "2026-06-28",
      days: [
        { day:"Montag",    date:"22.06.", isoDate:"2026-06-22", type:"own",  focus:"A", einheit:"Snatch-Reclaim + OHS-Stabilität", sub:"Pause OHS · Squat Snatch Komplex · Strict HSPU · GHD", rx:"Ceiling <span class='rv'>52 kg</span> W2", rpe:"RPE 8 cap", note:"Geschützter Slot — frisch, nichts davor. Snatch-Reclaim sauber landen (W25 ausgefallen, jetzt zweiter Anlauf). Tagesform regelt die Last über RPE-Caps." },
        { day:"Dienstag",  date:"23.06.", isoDate:"2026-06-23", type:"rest", einheit:"Mobility", rx:"—", note:"Box-Di = Snatch → würde mit Mo kollidieren. Bewusst frei." },
        { day:"Mittwoch",  date:"24.06.", isoDate:"2026-06-24", type:"box",  einheit:"Accessory + 16 Min AMRAP", sub:"Goblet Lunges · DB Row · Reverse Fly → AMRAP: STO · FR Reverse Lunges · T2B · Run", rx:"<span class='rv'>L2</span> — Last moderat, AMRAP gleichmäßig", rpe:"RPE ~7", note:"Mixed-Engine, 1 Tag Abstand zu Focus A. Kein Snatch-Overlap." },
        { day:"Donnerstag",date:"25.06.", isoDate:"2026-06-25", type:"box",  einheit:"Tempo Front Squat + For Time", sub:"5×3 @ 72–77 % (2–3s ab) → 21-15-9 DB Front Squat + Burpee over DB, Run buy-in/cash-out", rx:"Tempo FS submaximal · DB FS <span class='rv'>L2</span>", rpe:"RPE 7–8", note:"Bein-Tag ohne Grip — schirmt Focus B (Fr) ab. Tempo-FS bei 72–77 %, kein Max." },
        { day:"Freitag",   date:"26.06.", isoDate:"2026-06-26", type:"own",  focus:"B", einheit:"Vertikal-Gymnastics W2", sub:"BMU · Strict HSPU · Pull/T2B · Weighted Pull-up · Mobility", rx:"Auf Anfrage", rpe:"RPE 7–8", note:"Grip isoliert: Do = Beine (kein Grip), Sa = frei. W2-Progression aus geloggter W1-Leistung." },
        { day:"Samstag",   date:"27.06.", isoDate:"2026-06-27", type:"rest", einheit:"—", rx:"—", note:"Fix: kein Training möglich." },
        { day:"Sonntag",   date:"28.06.", isoDate:"2026-06-28", type:"box",  einheit:"Team-WOD (2er) · 10 RFT · 40 Min Cap", sub:"je Runde: 10 DB Snatch alt. · 10 T2B · 10 Box Jumps 60 cm · 10 DB Goblet Lunges alt. · 10 Pull-up · 10 Burpee over DB · 10 DB Box Step-up — split as you like", rx:"<span class='rv'>RX · DB 22,5 kg · Box 60 cm</span> — sozial, nicht ans Cap reden", rpe:"RPE 7", note:"Sonntagvormittag (kein Ride). Grip + Beine deutlich höher als der ursprünglich geplante FS-Reiz. Split: nach Focus-B-Grip (Fr) Partner mehr T2B/Pull-up, du DB-/Step-/Jump-Pieces. Sa = Vollrest puffert den Grip. Über den Cap pacen, nicht redlinen." }
      ],
      focusDays: {
        A: {
          title:"🏋️ Focus-Tag A", date:"Montag · 22.06.2026",
          sub:"Snatch-Reclaim · OHS-Stabilität · Strict HSPU Volumen · GHD · Overhead Mobility",
          intro:"Geschützter Slot zum Wochenstart — frisch, nichts davor. Ceiling W2 = 52 kg. Erste echte Ausführung (W1 ausgefallen).",
          blocks:[
            { letter:"A", title:"Pause OHS — Overhead Aktivierung", sub:"4 Sätze aufsteigend · 2-sec Pause am Bottom",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Pause OHS||2-sec Pause Bottom","4 × 3||40 → 44 → 46 → 48 kg","40 / 44 / 46 / 48 kg","6–7","32X1","2 min","Wenn 48 kg instabil → bei 46 bleiben."] ],
              note:"Tempo 32X1: 3s descent, 2s Pause unten (aktiv halten), explosiv hoch, 1s oben." },
            { letter:"B", title:"Squat Snatch Komplex", sub:"Every 2:30 · 5 Sets · Ceiling 52 kg",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hang Squat Snatch||+ Squat Snatch vom Boden","5 × (1+1)||every 2:30","42 → 46 → 48 → 50 → 52 kg","≤ 8","X","Restliche 2:30","Hang zuerst. Wenn 50 instabil → kein 52."] ],
              note:"Reclaim-Arbeit, kein Max-Test. Ceiling gilt auch wenn es leicht fühlt. Topgewicht in WHOOP loggen." },
            { letter:"C", title:"Strict HSPU Volumen", sub:"Hauptarbeit · 4 Sätze · Volumenanker",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × max−1||W1 war 4×5","BW","8","21X0","3 min","Einen Rep im Tank lassen. Kein Failure, kein Kipping danach."] ] },
            { letter:"D", title:"GHD Sit-up", sub:"W2 = Gewöhnung fortsetzen · kein Volumen-Push",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["GHD Sit-up","3 × 10","BW","6","2010","90 sec","Voller ROM, kein Kipping. Volumen steigt ab W3."] ] },
            { letter:"E", title:"Overhead & Hip Mobility", sub:"~8 min · Longevity-Faden",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Overhead-Enge nach Snatch auflösen."],
                ["Wrist CARs","2 × 10/Seite","Voller Kreisbogen, langsam."],
                ["Thorakale Extension","1–2 min","Foam Roller · 3 Positionen BWS."],
                ["Hip-Flexor-Stretch","2 × 45 sec/Seite","90/90 oder Kniestand."]
              ] }
          ],
          whoop:[
            ["Overhead Squat","4 × 3 Pause · 40 / 44 / 46 / 48 kg · RPE 6–7"],
            ["Snatch – Barbell","5 × (1+1) every 2:30 · build 42→52 kg · Topgewicht loggen"],
            ["Handstand Push Up","4 × max−1 strict · BW · W1 war 4×5"],
            ["GHD Sit Up","3 × 10 · BW · RPE 6"]
          ]
        },
        B: {
          title:"🏋️ Focus-Tag B", date:"Freitag · 26.06.2026",
          sub:"Vertikal-Gymnastics · BMU-Progression · Strict HSPU · Pull/T2B · Weighted Pull-up · Mobility",
          intro:"Metabolisch ruhig. Grip isoliert (Do = Beine, Sa = frei). W2-Progression aus geloggter W1-Leistung — du hast Do alle Ziele am oberen Ende getroffen.",
          blocks:[
            { letter:"A", title:"BMU Progression — EMOM", sub:"Akkumulation · Qualität vor Quantität · 10 min",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Bar Muscle-Up||Min 1–5","5 × 1–2","BW","7","X","Rest of min","Voller Lockout, kontrollierte Landung. W1 = 10×1 sauber."],
                ["Bar Muscle-Up||Min 6–10","5 × 2","BW","7–8","X","Rest of min","Doubles wenn sauber. Bei Positionsverlust → Single."]
              ],
              note:"Ceiling W2: 12–15 BMU total (W1 = 10). Stop bei Technikverfall. Gesamtreps in WHOOP loggen." },
            { letter:"B", title:"Pull + T2B Kapazität", sub:"3 Rounds · 90 sec Rest zwischen Rounds",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Kipping Pull-up","3 × 8","BW","7","X","30 sec → T2B","Unbroken anstreben."],
                ["Toes-to-Bar","3 × 7","BW","7","X","90 sec → nächste Round","W1 war 3×6 — ein Rep mehr. Rhythmus halten."]
              ] },
            { letter:"C", title:"Strict HSPU Volumen", sub:"Hauptarbeit · 4 Sätze · Volumenanker",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × 5–6||W1 war 4×5 (auf gelb)","BW","8","21X0","3 min","Einen Rep im Tank lassen. Kein Failure, kein Kipping danach."] ],
              note:"Tempo 21X0: 2s descent, 1s Stirn, explosiv hoch, keine Pause oben." },
            { letter:"D", title:"Weighted Pull-up Density", sub:"Kraft-Endurance · Last-Progression W2",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Weighted Pull-up","3 × 3","+5 kg||W1 war +4 kg","7–8","30X1","2 min","Richtung Ziel 6 Reps @ +5 kg. Wenn Rep 3 unsauber → zurück auf +4 kg. Kg loggen."] ] },
            { letter:"E", title:"Cool-down Mobility", sub:"~5 min · Schulter + Thorax",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Passive Hängelast, Schulter offen lassen."],
                ["Shoulder CARs","2 × 8/Seite","Kontrolliert, voller Bewegungsradius."],
                ["Thorakale Extension","1–2 min","Foam Roller · 3 Positionen entlang der BWS."]
              ] }
          ],
          whoop:[
            ["Bar Muscle Up","EMOM 10 · 1–2 reps/min · BW · Ziel 12–15 total · Gesamtreps loggen"],
            ["Pull Up","3 × 8 kipping · BW"],
            ["Toes to Bar","3 × 7 · BW"],
            ["Handstand Push Up","4 × 5–6 strict · BW"],
            ["Pull Up (Weighted)","3 × 3 · +5 kg · RPE 7–8"]
          ]
        }
      }
    }
  ]
};
