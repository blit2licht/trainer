/* ════════════════════════════════════════════════════════════
   data.js — AI Coach · Martin
   Nur diese Datei wächst pro Woche.
   Neue Woche = neues Objekt VORNE in weeks[] einfügen.
   isoDate-Felder sind Pflicht — werden vom Notes-System genutzt.
════════════════════════════════════════════════════════════ */
const DATA = {
  weeks: [
    {
      id: "2026-W25",
      label: "Woche 1 · 15.–21. Juni 2026",
      meso: "Meso 2 · Woche 1",
      phase: "Reclaim / Kapazität / Robustheit",
      dateFrom: "2026-06-15",
      dateTo:   "2026-06-21",
      days: [
        { day:"Montag",    date:"15.06.", isoDate:"2026-06-15", type:"rest", einheit:"—", rx:"—", note:"Erholung nach Wien. Kein Training — Di sauber starten." },
        { day:"Dienstag",  date:"16.06.", isoDate:"2026-06-16", type:"box",  einheit:"EMOM 32", sub:"Machine · HSPU · Hang C&J · Box Jumps · T2B", rx:"<span class='rv'>L2</span> — 42,5 kg Hang C&J · HSPU + T2B as written", rpe:"RPE ~7", note:"Engine-Wiedereinstieg. Kein L3/BMU — BMU-Budget für Do schonen." },
        { day:"Mittwoch",  date:"17.06.", isoDate:"2026-06-17", type:"box",  einheit:"Oly: Squat Clean + C&J Komplex", sub:"→ Gwen 15-12-9 C&J", rx:"Gwen <span class='rv'>L2 · 52,5 kg</span> (L3 60 kg wenn smooth)", rpe:"RPE 8 cap", note:"Heavy-Barbell-Tag. C&J-Volumen deckt Mi ab — nicht doppeln." },
        { day:"Donnerstag",date:"18.06.", isoDate:"2026-06-18", type:"own",  focus:"B", einheit:"Vertikal-Gymnastics", sub:"BMU-Reclaim · Strict HSPU · Pull/T2B · Mobility", rx:"Auf Anfrage", rpe:"RPE 7–8", note:"Box-Class Do gestrichen. Metabolisch ruhig." },
        { day:"Freitag",   date:"19.06.", isoDate:"2026-06-19", type:"rest", einheit:"Mobility / optionaler Z1–Z2-Spin", rx:"—", note:"Hero gestrichen. Puffer vor Sa-Focus und So-Ride." },
        { day:"Samstag",   date:"20.06.", isoDate:"2026-06-20", type:"own",  focus:"A", einheit:"Snatch-Reclaim + OHS-Stabilität", sub:"Pause OHS · Squat Snatch Komplex · Strict HSPU · GHD", rx:"Ceiling <span class='rv'>52 kg</span> W1", rpe:"RPE 8 cap", note:"Sa-Class gestrichen. Frisch durch Fr-Recovery." },
        { day:"Sonntag",   date:"21.06.", isoDate:"2026-06-21", type:"ride", einheit:"~75 km Z2/Z3", rx:"<span class='rv'>Fix</span> — nie streichen", note:"Bei schweren Sa-Beinen Intensität anpassen, nicht die Session."
          /* nach dem Ride beim Recap befüllen:
          ,strava: { km:"74.6", time:"2h 32m", elev:284, speed:"29.5" } */
        }
      ],
      focusDays: {
        B: {
          title:"🏋️ Focus-Tag B", date:"Donnerstag · 18.06.2026",
          sub:"Vertikal-Gymnastics · BMU-Reclaim · Strict HSPU Volumen · Pull/T2B · Mobility",
          intro:"Metabolisch ruhig — kein Zusatz-Conditioning. Mi-Barbell setzen lassen. Box-Class Do gestrichen.",
          blocks:[
            { letter:"A", title:"BMU Reclaim — EMOM", sub:"Akkumulation · Qualität vor Quantität · 10 min",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Bar Muscle-Up||Min 1–5","5 × 1","BW","7","X","Rest of min","Voller Lockout, kontrollierte Landung. W1 = 1 Rep gesetzt."],
                ["Bar Muscle-Up||Min 6–10","5 × 1–2","BW","7–8","X","Rest of min","2 Reps nur wenn Min 1–5 sauber. Bei Positionsverlust → 1."]
              ],
              note:"Ceiling: 10–15 BMU total. Stop bei Technikverfall. Gesamtreps in WHOOP loggen." },
            { letter:"B", title:"Pull + T2B Kapazität", sub:"3 Rounds · 90 sec Rest zwischen Rounds",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[
                ["Kipping Pull-up","3 × 8","BW","7","X","30 sec → T2B","Unbroken anstreben. Falls nötig 6+2."],
                ["Toes-to-Bar","3 × 6","BW","7","X","90 sec → nächste Round","Rhythmus halten. Kein Kip-Verlust."]
              ] },
            { letter:"C", title:"Strict HSPU Volumen", sub:"Hauptarbeit · 4 Sätze · Volumenanker",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × max−1||Ziel W1: 4–5/Satz","BW","8","21X0","3 min","Einen Rep im Tank lassen. Kein Failure, kein Kipping danach."] ],
              note:"Tempo 21X0: 2s descent, 1s Stirn, explosiv hoch, keine Pause oben." },
            { letter:"D", title:"Weighted Pull-up Density", sub:"Kraft-Endurance · Last-Kalibrierung W1",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Weighted Pull-up","3 × 6","RPE-only||kein Referenz-Log","7","30X1","2 min","Last wählen, die bei Rep 6 noch sauber ist. Kg in WHOOP loggen → Referenz ab W2."] ] },
            { letter:"E", title:"Cool-down Mobility", sub:"~5 min · Schulter + Thorax",
              headers:["Übung","Dauer","Note"],
              rows:[
                ["Lat-Stretch hängend","2 × 45 sec","Passive Hängelast, Schulter offen lassen."],
                ["Shoulder CARs","2 × 8/Seite","Kontrolliert, voller Bewegungsradius."],
                ["Thorakale Extension","1–2 min","Foam Roller · 3 Positionen entlang der BWS."]
              ] }
          ],
          whoop:[
            ["Bar Muscle Up","EMOM 10 · 1–2 reps/min · BW · Gesamtreps loggen"],
            ["Pull Up","3 × 8 kipping · BW"],
            ["Toes to Bar","3 × 6 · BW"],
            ["Handstand Push Up","4 × max−1 strict · BW · Ziel 4–5/Satz"],
            ["Pull Up (Weighted)","3 × 6 · kg eintragen (W1-Kalibrierung) · RPE 7"]
          ]
        },
        A: {
          title:"🏋️ Focus-Tag A", date:"Samstag · 20.06.2026",
          sub:"Snatch-Reclaim · OHS-Stabilität · Strict HSPU Volumen · GHD Einführung · Overhead Mobility",
          intro:"Frisch durch Fr-Recovery. Ceiling W1 = 52 kg. Sa-Class gestrichen.",
          blocks:[
            { letter:"A", title:"Pause OHS — Overhead Aktivierung", sub:"4 Sätze aufsteigend · 2-sec Pause am Bottom",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Pause OHS||2-sec Pause Bottom","4 × 3||40 → 44 → 46 → 48 kg","40 / 44 / 46 / 48 kg","6–7","32X1","2 min","Wenn 48 kg instabil → bei 46 bleiben."] ],
              note:"Tempo 32X1: 3s descent, 2s Pause unten (aktiv halten), explosiv hoch, 1s oben." },
            { letter:"B", title:"Squat Snatch Komplex", sub:"Every 2:30 · 5 Sets · Ceiling 52 kg",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Hang Squat Snatch||+ Squat Snatch vom Boden","5 × (1+1)||every 2:30","42 → 46 → 48 → 50 → 52 kg","≤ 8","X","Restliche 2:30","Hang zuerst. Wenn 50 instabil → kein 52."] ],
              note:"Reclaim-Arbeit, kein Max-Test. Ceiling gilt auch wenn es leicht fühlt." },
            { letter:"C", title:"Strict HSPU Volumen", sub:"Identisch Focus-Tag B · Cross-Day-Vergleich",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["Strict HSPU","4 × max−1||Ziel W1: 4–5/Satz","BW","8","21X0","3 min","Reps-Differenz Do↔Sa zeigt wöchentliche Kapazität."] ] },
            { letter:"D", title:"GHD Sit-up — Einführung", sub:"W1 = Gewöhnung · kein Volumen-Push",
              headers:["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"],
              rows:[ ["GHD Sit-up","3 × 10","BW","6","2010","90 sec","Voller ROM, kein Kipping W1. Volumen steigt ab W2."] ] },
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
            ["Handstand Push Up","4 × max−1 strict · BW · Ziel 4–5/Satz"],
            ["GHD Sit Up","3 × 10 · BW · RPE 6"]
          ]
        }
      }
    }
    /* ── nächste Woche hier davor einfügen ── */
  ]
};
