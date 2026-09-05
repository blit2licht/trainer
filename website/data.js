/* GENERIERT von scripts/build_payload.py — nicht von Hand editieren.
   Quelle: coach/plan/<id>.json + coach/exercises.json (datenmodell.md §5). */
const DATA = {
  "week": {
    "id": "2026-W36",
    "label": "Woche 5 · 31. August – 6. September 2026",
    "meso": "Meso 3 · Woche 5",
    "von": "2026-08-31",
    "bis": "2026-09-06",
    "days": [
      {
        "iso_date": "2026-08-31",
        "day_type": "rest",
        "warum": "Ruhetag nach der Sonntagslast. Nur wenn die Recovery ≥70 ist UND die Beine sich frisch anfühlen, ist ein gedeckeltes Box-WOD drin — RPE ≤7, Push Jerk höchstens 60-65, kein Sprint-Finish. Der Dienstag-Snatch bleibt die Schlüssel-Einheit der Woche."
      },
      {
        "iso_date": "2026-09-01",
        "day_type": "own",
        "focus": "A",
        "focus_label": "Weightlifting-Fokus",
        "kurzform": "Snatch, FS, OHS, Core",
        "blocks": [
          {
            "block_id": "A",
            "prio": "required",
            "title": "Squat Snatch",
            "min": 18,
            "superset": false,
            "exercises": [
              {
                "ex_id": "snatch",
                "kurz": "Snatch",
                "name": "Squat Snatch",
                "class": "technical",
                "target": {
                  "mode": "kg",
                  "sets": 7,
                  "reps": 1,
                  "kg": 60,
                  "ramp": [
                    40,
                    45,
                    50,
                    52.5,
                    55,
                    57.5,
                    60
                  ],
                  "rpe_cap": 8,
                  "tempo": "explosiv",
                  "rest": "E1:30-2:00"
                },
                "whoop": "Snatch",
                "warum": "Sieben aufsteigende Einzelversuche bis zur Ceiling 60 — die soll nach dem W34-Slip (zweimal 57,5) wieder stehen. Den 57,5er und den 60er seitlich filmen, Bar-Path-App, normale Geschwindigkeit: damit prüfen wir, ob die tiefe Empfangsposition unter schwerer Last wirklich wackelt. Kein 62,5 heute."
              }
            ]
          },
          {
            "block_id": "B",
            "prio": "required",
            "title": "Front Squat",
            "min": 14,
            "superset": false,
            "exercises": [
              {
                "ex_id": "front_squat",
                "kurz": "FS",
                "name": "Front Squat",
                "class": "technical",
                "target": {
                  "mode": "kg",
                  "sets": 4,
                  "reps": "2/2/1/1",
                  "kg": 100,
                  "ramp": [
                    85,
                    92.5,
                    97.5,
                    100
                  ],
                  "rpe_cap": 8,
                  "tempo": "31X1",
                  "rest": "2-3 min"
                },
                "whoop": "Front Squat",
                "warum": "Zwei Doubles, dann zwei Einzel — Aufbau über den Block-Stand 95×3. Ein sauberer 100er ist das Wochenziel; 102,5 nur, wenn er sich wie höchstens 8 von 10 anfühlt und die Rack-Position steht. Der Korridor 105-107,5 kommt erst in der Testwoche."
              }
            ]
          },
          {
            "block_id": "C",
            "prio": "required",
            "title": "Pause OHS",
            "min": 8,
            "superset": false,
            "exercises": [
              {
                "ex_id": "ohs",
                "kurz": "OHS",
                "name": "Overhead Squat",
                "class": "technical",
                "target": {
                  "mode": "kg",
                  "sets": 3,
                  "reps": 2,
                  "kg": 55,
                  "ramp": [
                    52.5,
                    55
                  ],
                  "rpe_cap": 7,
                  "tempo": "32X1",
                  "rest": "2 min"
                },
                "whoop": "Overhead Squat",
                "warum": "Zwei Sekunden unten halten, dann sauber hoch. Kein Lastaufbau heute — der Topwert 55 steht bereits. Zweck ist die Position selbst: genau die tiefe Empfangsposition, die im Snatch unter schwerer Last wackelt."
              }
            ]
          },
          {
            "block_id": "D",
            "prio": "required",
            "title": "Core",
            "min": 5,
            "superset": false,
            "exercises": [
              {
                "ex_id": "hollow_hold",
                "kurz": "Core",
                "name": "Hollow Body Hold",
                "class": "generic",
                "target": {
                  "mode": "time",
                  "sets": 3,
                  "sec": 30,
                  "rpe_cap": 6,
                  "rest": "60 sec"
                },
                "whoop": "Hollow Hold",
                "warum": "Unterer Rücken bleibt fest am Boden, Spannung aus der Körpermitte, ruhig atmen. Bewusst leicht gehalten."
              }
            ]
          },
          {
            "block_id": "E",
            "prio": "optional",
            "title": "Strength: Delts / Bizeps",
            "min": 15,
            "superset": false,
            "exercises": [
              {
                "ex_id": "lateral_raise",
                "kurz": "Lateral Raise",
                "name": "DB Lateral Raise",
                "class": "loadable",
                "target": {
                  "mode": "kg",
                  "sets": 3,
                  "reps": 12,
                  "kg": 6,
                  "rpe_cap": 7,
                  "tempo": "kontrolliert",
                  "rest": "60 sec"
                },
                "whoop": "Lateral Raise",
                "warum": "Zwei Kurzhanteln à 6 kg, höchstens 7 von 10, kein Versagen. Zweck: Muskelschutz im Kaloriendefizit."
              },
              {
                "ex_id": "biceps_curl",
                "kurz": "Curl",
                "name": "DB Curl",
                "class": "loadable",
                "target": {
                  "mode": "kg",
                  "sets": 3,
                  "reps": 12,
                  "kg": 10,
                  "rpe_cap": 7,
                  "tempo": "kontrolliert",
                  "rest": "60 sec"
                },
                "whoop": "Biceps Curl",
                "warum": "Zwei Kurzhanteln à 10 kg, kontrolliert, keine Failure-Sätze. Zweck: Muskelschutz im Kaloriendefizit."
              }
            ],
            "verdict_ex_id": "layer_delts_bizeps",
            "verdict_class": "generic"
          },
          {
            "block_id": "F",
            "prio": "optional",
            "title": "Mobility",
            "min": 8,
            "superset": false,
            "exercises": [
              {
                "ex_id": "mob_lat_stretch",
                "kurz": "Lat-Stretch hängend",
                "name": "Lat-Stretch hängend",
                "class": null,
                "target": {
                  "mode": "time",
                  "sets": 2,
                  "sec": 45
                },
                "warum": "Overhead-Enge nach Snatch und OHS lösen."
              },
              {
                "ex_id": "mob_hipflexor",
                "kurz": "Hüftbeuger-Stretch je Seite",
                "name": "Hüftbeuger-Stretch je Seite",
                "class": null,
                "target": {
                  "mode": "time",
                  "sets": 2,
                  "sec": 45
                },
                "warum": "Nach dem Squat-Volumen."
              },
              {
                "ex_id": "mob_thoracic",
                "kurz": "Thorakale Extension am Foam Roller",
                "name": "Thorakale Extension am Foam Roller",
                "class": null,
                "target": {
                  "mode": "time",
                  "sec": 120
                }
              }
            ],
            "verdict_ex_id": "mobility",
            "verdict_class": "generic"
          }
        ],
        "last_spanne": [
          40,
          100
        ],
        "zeit_spanne": [
          45,
          68
        ],
        "recovery_day": {
          "u50": "Letzter Steigerungssatz entfällt: Snatch endet bei 55 (kein Video-Pflichtprogramm, verschiebt sich), FS endet bei 95, Pause OHS entfällt. Load-RPE-Cap 7.",
          "u34": "Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
        }
      },
      {
        "iso_date": "2026-09-02",
        "day_type": "rest",
        "warum": "Termin am Morgen — kein Training. Passt gut: der Tag trennt den Barbell-Griff vom Dienstag und den Gymnastics-Griff am Donnerstag."
      },
      {
        "iso_date": "2026-09-03",
        "day_type": "own",
        "focus": "B",
        "focus_label": "Gymnastics-Fokus",
        "kurzform": "Drill, T2B, HSPU, PU",
        "blocks": [
          {
            "block_id": "A",
            "prio": "required",
            "title": "BMU",
            "min": 15,
            "superset": false,
            "exercises": [
              {
                "ex_id": "bmu_drill",
                "kurz": "Drill",
                "name": "Descent & Hip-Pop Drill",
                "class": "generic",
                "target": {
                  "mode": "bw",
                  "sets": 4,
                  "reps": 3,
                  "rpe_cap": 6,
                  "tempo": "kontrolliert",
                  "rest": "60 sec"
                },
                "whoop": "BMU Drill",
                "warum": "Aufwärm-Primer vor den Arbeitssätzen: den Abgang kontrolliert und nah an der Stange führen, dann den Hüft-Impuls im richtigen Moment setzen — genau die zwei Punkte, die die Video-Analyse als Engpass zeigt."
              },
              {
                "ex_id": "bmu",
                "kurz": "BMU",
                "name": "Bar Muscle-up",
                "class": "skill",
                "target": {
                  "mode": "bw",
                  "sets": 5,
                  "reps": 2,
                  "unbroken": true,
                  "rpe_cap": 8,
                  "rest": "2-3 min"
                },
                "whoop": "Muscle Ups",
                "warum": "Fünf verbundene Doubles — die Arbeitsstufe bleibt. Steht der Dreier im ERSTEN Satz stabil, darfst du auf 4 × 3 wechseln; steht er nicht, bleibt es bei den Doubles. Nicht erzwingen, der Test kommt in zwei Wochen."
              }
            ],
            "verdict_ex_id": "bmu",
            "verdict_class": "skill"
          },
          {
            "block_id": "B",
            "prio": "required",
            "title": "T2B",
            "min": 8,
            "superset": false,
            "exercises": [
              {
                "ex_id": "t2b",
                "kurz": "T2B",
                "name": "Toes-to-Bar",
                "class": "skill",
                "target": {
                  "mode": "bw",
                  "sets": 3,
                  "reps": 10,
                  "rpe_cap": 7,
                  "rest": "90 sec"
                },
                "whoop": "Hanging Toes to Bar",
                "warum": "3 × 10 kontrolliert, Zehen bewusst zur Stange — deutlich unter dem Testwert von 16 am Stück. Halten statt steigern, das neue Ziel kommt beim Review."
              }
            ]
          },
          {
            "block_id": "C",
            "prio": "required",
            "title": "Strict HSPU",
            "min": 15,
            "superset": false,
            "exercises": [
              {
                "ex_id": "hspu_strict",
                "kurz": "HSPU",
                "name": "Strict Handstand Push-up",
                "class": "skill",
                "target": {
                  "mode": "bw",
                  "sets": 4,
                  "reps": 8,
                  "rpe_cap": 8,
                  "tempo": "21X0",
                  "rest": "3 min"
                },
                "whoop": "Handstand Push-Ups",
                "warum": "Tempo 21X0: 2 Sekunden runter, explosiv hoch, oben nicht ausruhen. Die Stufe ist zweifach bestätigt — heute nur halten, der Max-Test kommt in zwei Wochen."
              }
            ]
          },
          {
            "block_id": "D",
            "prio": "required",
            "title": "Weighted Pull-up",
            "min": 10,
            "superset": false,
            "exercises": [
              {
                "ex_id": "wpu",
                "kurz": "PU",
                "name": "Weighted Pull-up",
                "class": "skill",
                "target": {
                  "mode": "bw_plus",
                  "sets": 3,
                  "reps": 5,
                  "kg": 5,
                  "rpe_cap": 8,
                  "tempo": "30X1",
                  "rest": "2-2,5 min"
                },
                "whoop": "Weighted Pull Ups",
                "warum": "Der 3 × 5-Versuch kommt zurück, nachdem 3 × 4 mit +5 kg sauber stand. Reißt der dritte Satz wie in W34 (5/5/3), bleibst du bei 3 × 4 und schreibst in die Notiz, woran es lag — Griff oder Kraft."
              }
            ]
          },
          {
            "block_id": "E",
            "prio": "optional",
            "title": "Strength: Brust / Trizeps",
            "min": 15,
            "superset": false,
            "exercises": [
              {
                "ex_id": "db_bench",
                "kurz": "DB Bench",
                "name": "DB Bench Press",
                "class": "loadable",
                "target": {
                  "mode": "kg",
                  "sets": 3,
                  "reps": 12,
                  "kg": 20,
                  "rpe_cap": 7,
                  "tempo": "kontrolliert",
                  "rest": "60 sec"
                },
                "whoop": "DB Bench Press",
                "warum": "Zwei Kurzhanteln à 20 kg — die W35-Kalibrierung übernehmen, höchstens 7 von 10. Streichkandidat, weil die Samstags-Box schon Bankdrücken hat."
              },
              {
                "ex_id": "triceps_ext",
                "kurz": "Triceps",
                "name": "Triceps Extension",
                "class": "generic",
                "target": {
                  "mode": "band",
                  "band": "rotes Band",
                  "sets": 3,
                  "reps": 15,
                  "rpe_cap": 7,
                  "rest": "60 sec"
                },
                "whoop": "Triceps Extension",
                "warum": "Konstante Bandspannung, kontrolliert, kein Versagen. Zweck: Muskelschutz im Kaloriendefizit."
              }
            ],
            "verdict_ex_id": "layer_brust_trizeps",
            "verdict_class": "generic"
          },
          {
            "block_id": "F",
            "prio": "optional",
            "title": "Mobility",
            "min": 5,
            "superset": false,
            "exercises": [
              {
                "ex_id": "mob_lat_stretch",
                "kurz": "Lat-Stretch hängend",
                "name": "Lat-Stretch hängend",
                "class": null,
                "target": {
                  "mode": "time",
                  "sets": 2,
                  "sec": 45
                },
                "warum": "Cool-down nach Pull-Volumen."
              },
              {
                "ex_id": "mob_shoulder_cars",
                "kurz": "Shoulder CARs je Seite",
                "name": "Shoulder CARs je Seite",
                "class": null,
                "target": {
                  "mode": "bw",
                  "sets": 2,
                  "reps": 8
                }
              },
              {
                "ex_id": "mob_thoracic",
                "kurz": "Thorakale Extension am Foam Roller",
                "name": "Thorakale Extension am Foam Roller",
                "class": null,
                "target": {
                  "mode": "time",
                  "sec": 120
                }
              }
            ],
            "verdict_ex_id": "mobility",
            "verdict_class": "generic"
          }
        ],
        "zeit_spanne": [
          48,
          68
        ],
        "recovery_day": {
          "u50": "WPU-Retry entfällt (bleibt 3×4), HSPU zurück auf 4×7, BMU nur 5 × 1 Qualitäts-Singles, T2B 3×8. Load-RPE-Cap 7.",
          "u34": "Session entfällt — Mobility bis RPE 6, oder Ruhe."
        }
      },
      {
        "iso_date": "2026-09-04",
        "day_type": "rest",
        "warum": "Termin am Morgen — kein Training. Der Team-Benchmark „LGOP“ entfällt dadurch; er wäre direkt nach dem Gymnastics-Tag ohnehin eine Griff-Kollision gewesen."
      },
      {
        "iso_date": "2026-09-05",
        "day_type": "rest",
        "warum": "Ausgefallen. Der geplante Press- und Engine-Tag wird nicht nachgeholt; die Woche läuft mit Dienstag, Donnerstag und dem Sonntags-Team-WOD."
      },
      {
        "iso_date": "2026-09-06",
        "day_type": "box",
        "einheit": "Team-WOD „FFR + South + West“",
        "sub": "Teams of 2 · 12 Rd (4 je AMRAP) à 2:30 + 30 s Rest · Score Total Cals",
        "wod": [
          {
            "struktur": "AMRAP 2:30 · 4 Runden",
            "bewegungen": [
              {
                "reps": "20",
                "name": "Burpee Pull-ups",
                "detail": "kipping, 5er-Splits"
              },
              {
                "reps": "Max",
                "name": "Cal any Machine",
                "detail": "Rower/Bike Erg"
              }
            ]
          },
          {
            "struktur": "AMRAP 2:30 · 4 Runden",
            "bewegungen": [
              {
                "reps": "40",
                "name": "Wallball Shots",
                "detail": "9 kg · 10er-Splits"
              },
              {
                "reps": "Max",
                "name": "Cal any Machine",
                "detail": "Rower/Bike Erg"
              }
            ]
          },
          {
            "struktur": "AMRAP 2:30 · 4 Runden",
            "bewegungen": [
              {
                "reps": "60",
                "name": "KB Swings",
                "detail": "24 kg · 15er-Splits"
              },
              {
                "reps": "Max",
                "name": "Cal any Machine",
                "detail": "30 s Rest zwischen allen Runden"
              }
            ]
          }
        ],
        "warum": "Team-WOD statt Ride. RX-Lasten sind unkritisch, die Last steckt in der Struktur: Cals gleichmäßig, RPE höchstens 8, kein Score-Jagen in der letzten Runde. Burpee-Pull-ups in 5ern kipping, Wallballs in 10ern, Swings in 15ern, Cals auf Rower oder Bike Erg. Montag der W37 bleibt Ruhetag."
      }
    ]
  },
  "weeks": [
    {
      "id": "2026-W36",
      "label": "Woche 5 · 31. August – 6. September 2026",
      "meso": "Meso 3 · Woche 5",
      "von": "2026-08-31",
      "bis": "2026-09-06",
      "days": [
        {
          "iso_date": "2026-08-31",
          "day_type": "rest",
          "warum": "Ruhetag nach der Sonntagslast. Nur wenn die Recovery ≥70 ist UND die Beine sich frisch anfühlen, ist ein gedeckeltes Box-WOD drin — RPE ≤7, Push Jerk höchstens 60-65, kein Sprint-Finish. Der Dienstag-Snatch bleibt die Schlüssel-Einheit der Woche."
        },
        {
          "iso_date": "2026-09-01",
          "day_type": "own",
          "focus": "A",
          "focus_label": "Weightlifting-Fokus",
          "kurzform": "Snatch, FS, OHS, Core",
          "blocks": [
            {
              "block_id": "A",
              "prio": "required",
              "title": "Squat Snatch",
              "min": 18,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "snatch",
                  "kurz": "Snatch",
                  "name": "Squat Snatch",
                  "class": "technical",
                  "target": {
                    "mode": "kg",
                    "sets": 7,
                    "reps": 1,
                    "kg": 60,
                    "ramp": [
                      40,
                      45,
                      50,
                      52.5,
                      55,
                      57.5,
                      60
                    ],
                    "rpe_cap": 8,
                    "tempo": "explosiv",
                    "rest": "E1:30-2:00"
                  },
                  "whoop": "Snatch",
                  "warum": "Sieben aufsteigende Einzelversuche bis zur Ceiling 60 — die soll nach dem W34-Slip (zweimal 57,5) wieder stehen. Den 57,5er und den 60er seitlich filmen, Bar-Path-App, normale Geschwindigkeit: damit prüfen wir, ob die tiefe Empfangsposition unter schwerer Last wirklich wackelt. Kein 62,5 heute."
                }
              ]
            },
            {
              "block_id": "B",
              "prio": "required",
              "title": "Front Squat",
              "min": 14,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "front_squat",
                  "kurz": "FS",
                  "name": "Front Squat",
                  "class": "technical",
                  "target": {
                    "mode": "kg",
                    "sets": 4,
                    "reps": "2/2/1/1",
                    "kg": 100,
                    "ramp": [
                      85,
                      92.5,
                      97.5,
                      100
                    ],
                    "rpe_cap": 8,
                    "tempo": "31X1",
                    "rest": "2-3 min"
                  },
                  "whoop": "Front Squat",
                  "warum": "Zwei Doubles, dann zwei Einzel — Aufbau über den Block-Stand 95×3. Ein sauberer 100er ist das Wochenziel; 102,5 nur, wenn er sich wie höchstens 8 von 10 anfühlt und die Rack-Position steht. Der Korridor 105-107,5 kommt erst in der Testwoche."
                }
              ]
            },
            {
              "block_id": "C",
              "prio": "required",
              "title": "Pause OHS",
              "min": 8,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "ohs",
                  "kurz": "OHS",
                  "name": "Overhead Squat",
                  "class": "technical",
                  "target": {
                    "mode": "kg",
                    "sets": 3,
                    "reps": 2,
                    "kg": 55,
                    "ramp": [
                      52.5,
                      55
                    ],
                    "rpe_cap": 7,
                    "tempo": "32X1",
                    "rest": "2 min"
                  },
                  "whoop": "Overhead Squat",
                  "warum": "Zwei Sekunden unten halten, dann sauber hoch. Kein Lastaufbau heute — der Topwert 55 steht bereits. Zweck ist die Position selbst: genau die tiefe Empfangsposition, die im Snatch unter schwerer Last wackelt."
                }
              ]
            },
            {
              "block_id": "D",
              "prio": "required",
              "title": "Core",
              "min": 5,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "hollow_hold",
                  "kurz": "Core",
                  "name": "Hollow Body Hold",
                  "class": "generic",
                  "target": {
                    "mode": "time",
                    "sets": 3,
                    "sec": 30,
                    "rpe_cap": 6,
                    "rest": "60 sec"
                  },
                  "whoop": "Hollow Hold",
                  "warum": "Unterer Rücken bleibt fest am Boden, Spannung aus der Körpermitte, ruhig atmen. Bewusst leicht gehalten."
                }
              ]
            },
            {
              "block_id": "E",
              "prio": "optional",
              "title": "Strength: Delts / Bizeps",
              "min": 15,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "lateral_raise",
                  "kurz": "Lateral Raise",
                  "name": "DB Lateral Raise",
                  "class": "loadable",
                  "target": {
                    "mode": "kg",
                    "sets": 3,
                    "reps": 12,
                    "kg": 6,
                    "rpe_cap": 7,
                    "tempo": "kontrolliert",
                    "rest": "60 sec"
                  },
                  "whoop": "Lateral Raise",
                  "warum": "Zwei Kurzhanteln à 6 kg, höchstens 7 von 10, kein Versagen. Zweck: Muskelschutz im Kaloriendefizit."
                },
                {
                  "ex_id": "biceps_curl",
                  "kurz": "Curl",
                  "name": "DB Curl",
                  "class": "loadable",
                  "target": {
                    "mode": "kg",
                    "sets": 3,
                    "reps": 12,
                    "kg": 10,
                    "rpe_cap": 7,
                    "tempo": "kontrolliert",
                    "rest": "60 sec"
                  },
                  "whoop": "Biceps Curl",
                  "warum": "Zwei Kurzhanteln à 10 kg, kontrolliert, keine Failure-Sätze. Zweck: Muskelschutz im Kaloriendefizit."
                }
              ],
              "verdict_ex_id": "layer_delts_bizeps",
              "verdict_class": "generic"
            },
            {
              "block_id": "F",
              "prio": "optional",
              "title": "Mobility",
              "min": 8,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "mob_lat_stretch",
                  "kurz": "Lat-Stretch hängend",
                  "name": "Lat-Stretch hängend",
                  "class": null,
                  "target": {
                    "mode": "time",
                    "sets": 2,
                    "sec": 45
                  },
                  "warum": "Overhead-Enge nach Snatch und OHS lösen."
                },
                {
                  "ex_id": "mob_hipflexor",
                  "kurz": "Hüftbeuger-Stretch je Seite",
                  "name": "Hüftbeuger-Stretch je Seite",
                  "class": null,
                  "target": {
                    "mode": "time",
                    "sets": 2,
                    "sec": 45
                  },
                  "warum": "Nach dem Squat-Volumen."
                },
                {
                  "ex_id": "mob_thoracic",
                  "kurz": "Thorakale Extension am Foam Roller",
                  "name": "Thorakale Extension am Foam Roller",
                  "class": null,
                  "target": {
                    "mode": "time",
                    "sec": 120
                  }
                }
              ],
              "verdict_ex_id": "mobility",
              "verdict_class": "generic"
            }
          ],
          "last_spanne": [
            40,
            100
          ],
          "zeit_spanne": [
            45,
            68
          ],
          "recovery_day": {
            "u50": "Letzter Steigerungssatz entfällt: Snatch endet bei 55 (kein Video-Pflichtprogramm, verschiebt sich), FS endet bei 95, Pause OHS entfällt. Load-RPE-Cap 7.",
            "u34": "Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
          }
        },
        {
          "iso_date": "2026-09-02",
          "day_type": "rest",
          "warum": "Termin am Morgen — kein Training. Passt gut: der Tag trennt den Barbell-Griff vom Dienstag und den Gymnastics-Griff am Donnerstag."
        },
        {
          "iso_date": "2026-09-03",
          "day_type": "own",
          "focus": "B",
          "focus_label": "Gymnastics-Fokus",
          "kurzform": "Drill, T2B, HSPU, PU",
          "blocks": [
            {
              "block_id": "A",
              "prio": "required",
              "title": "BMU",
              "min": 15,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "bmu_drill",
                  "kurz": "Drill",
                  "name": "Descent & Hip-Pop Drill",
                  "class": "generic",
                  "target": {
                    "mode": "bw",
                    "sets": 4,
                    "reps": 3,
                    "rpe_cap": 6,
                    "tempo": "kontrolliert",
                    "rest": "60 sec"
                  },
                  "whoop": "BMU Drill",
                  "warum": "Aufwärm-Primer vor den Arbeitssätzen: den Abgang kontrolliert und nah an der Stange führen, dann den Hüft-Impuls im richtigen Moment setzen — genau die zwei Punkte, die die Video-Analyse als Engpass zeigt."
                },
                {
                  "ex_id": "bmu",
                  "kurz": "BMU",
                  "name": "Bar Muscle-up",
                  "class": "skill",
                  "target": {
                    "mode": "bw",
                    "sets": 5,
                    "reps": 2,
                    "unbroken": true,
                    "rpe_cap": 8,
                    "rest": "2-3 min"
                  },
                  "whoop": "Muscle Ups",
                  "warum": "Fünf verbundene Doubles — die Arbeitsstufe bleibt. Steht der Dreier im ERSTEN Satz stabil, darfst du auf 4 × 3 wechseln; steht er nicht, bleibt es bei den Doubles. Nicht erzwingen, der Test kommt in zwei Wochen."
                }
              ],
              "verdict_ex_id": "bmu",
              "verdict_class": "skill"
            },
            {
              "block_id": "B",
              "prio": "required",
              "title": "T2B",
              "min": 8,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "t2b",
                  "kurz": "T2B",
                  "name": "Toes-to-Bar",
                  "class": "skill",
                  "target": {
                    "mode": "bw",
                    "sets": 3,
                    "reps": 10,
                    "rpe_cap": 7,
                    "rest": "90 sec"
                  },
                  "whoop": "Hanging Toes to Bar",
                  "warum": "3 × 10 kontrolliert, Zehen bewusst zur Stange — deutlich unter dem Testwert von 16 am Stück. Halten statt steigern, das neue Ziel kommt beim Review."
                }
              ]
            },
            {
              "block_id": "C",
              "prio": "required",
              "title": "Strict HSPU",
              "min": 15,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "hspu_strict",
                  "kurz": "HSPU",
                  "name": "Strict Handstand Push-up",
                  "class": "skill",
                  "target": {
                    "mode": "bw",
                    "sets": 4,
                    "reps": 8,
                    "rpe_cap": 8,
                    "tempo": "21X0",
                    "rest": "3 min"
                  },
                  "whoop": "Handstand Push-Ups",
                  "warum": "Tempo 21X0: 2 Sekunden runter, explosiv hoch, oben nicht ausruhen. Die Stufe ist zweifach bestätigt — heute nur halten, der Max-Test kommt in zwei Wochen."
                }
              ]
            },
            {
              "block_id": "D",
              "prio": "required",
              "title": "Weighted Pull-up",
              "min": 10,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "wpu",
                  "kurz": "PU",
                  "name": "Weighted Pull-up",
                  "class": "skill",
                  "target": {
                    "mode": "bw_plus",
                    "sets": 3,
                    "reps": 5,
                    "kg": 5,
                    "rpe_cap": 8,
                    "tempo": "30X1",
                    "rest": "2-2,5 min"
                  },
                  "whoop": "Weighted Pull Ups",
                  "warum": "Der 3 × 5-Versuch kommt zurück, nachdem 3 × 4 mit +5 kg sauber stand. Reißt der dritte Satz wie in W34 (5/5/3), bleibst du bei 3 × 4 und schreibst in die Notiz, woran es lag — Griff oder Kraft."
                }
              ]
            },
            {
              "block_id": "E",
              "prio": "optional",
              "title": "Strength: Brust / Trizeps",
              "min": 15,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "db_bench",
                  "kurz": "DB Bench",
                  "name": "DB Bench Press",
                  "class": "loadable",
                  "target": {
                    "mode": "kg",
                    "sets": 3,
                    "reps": 12,
                    "kg": 20,
                    "rpe_cap": 7,
                    "tempo": "kontrolliert",
                    "rest": "60 sec"
                  },
                  "whoop": "DB Bench Press",
                  "warum": "Zwei Kurzhanteln à 20 kg — die W35-Kalibrierung übernehmen, höchstens 7 von 10. Streichkandidat, weil die Samstags-Box schon Bankdrücken hat."
                },
                {
                  "ex_id": "triceps_ext",
                  "kurz": "Triceps",
                  "name": "Triceps Extension",
                  "class": "generic",
                  "target": {
                    "mode": "band",
                    "band": "rotes Band",
                    "sets": 3,
                    "reps": 15,
                    "rpe_cap": 7,
                    "rest": "60 sec"
                  },
                  "whoop": "Triceps Extension",
                  "warum": "Konstante Bandspannung, kontrolliert, kein Versagen. Zweck: Muskelschutz im Kaloriendefizit."
                }
              ],
              "verdict_ex_id": "layer_brust_trizeps",
              "verdict_class": "generic"
            },
            {
              "block_id": "F",
              "prio": "optional",
              "title": "Mobility",
              "min": 5,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "mob_lat_stretch",
                  "kurz": "Lat-Stretch hängend",
                  "name": "Lat-Stretch hängend",
                  "class": null,
                  "target": {
                    "mode": "time",
                    "sets": 2,
                    "sec": 45
                  },
                  "warum": "Cool-down nach Pull-Volumen."
                },
                {
                  "ex_id": "mob_shoulder_cars",
                  "kurz": "Shoulder CARs je Seite",
                  "name": "Shoulder CARs je Seite",
                  "class": null,
                  "target": {
                    "mode": "bw",
                    "sets": 2,
                    "reps": 8
                  }
                },
                {
                  "ex_id": "mob_thoracic",
                  "kurz": "Thorakale Extension am Foam Roller",
                  "name": "Thorakale Extension am Foam Roller",
                  "class": null,
                  "target": {
                    "mode": "time",
                    "sec": 120
                  }
                }
              ],
              "verdict_ex_id": "mobility",
              "verdict_class": "generic"
            }
          ],
          "zeit_spanne": [
            48,
            68
          ],
          "recovery_day": {
            "u50": "WPU-Retry entfällt (bleibt 3×4), HSPU zurück auf 4×7, BMU nur 5 × 1 Qualitäts-Singles, T2B 3×8. Load-RPE-Cap 7.",
            "u34": "Session entfällt — Mobility bis RPE 6, oder Ruhe."
          }
        },
        {
          "iso_date": "2026-09-04",
          "day_type": "rest",
          "warum": "Termin am Morgen — kein Training. Der Team-Benchmark „LGOP“ entfällt dadurch; er wäre direkt nach dem Gymnastics-Tag ohnehin eine Griff-Kollision gewesen."
        },
        {
          "iso_date": "2026-09-05",
          "day_type": "rest",
          "warum": "Ausgefallen. Der geplante Press- und Engine-Tag wird nicht nachgeholt; die Woche läuft mit Dienstag, Donnerstag und dem Sonntags-Team-WOD."
        },
        {
          "iso_date": "2026-09-06",
          "day_type": "box",
          "einheit": "Team-WOD „FFR + South + West“",
          "sub": "Teams of 2 · 12 Rd (4 je AMRAP) à 2:30 + 30 s Rest · Score Total Cals",
          "wod": [
            {
              "struktur": "AMRAP 2:30 · 4 Runden",
              "bewegungen": [
                {
                  "reps": "20",
                  "name": "Burpee Pull-ups",
                  "detail": "kipping, 5er-Splits"
                },
                {
                  "reps": "Max",
                  "name": "Cal any Machine",
                  "detail": "Rower/Bike Erg"
                }
              ]
            },
            {
              "struktur": "AMRAP 2:30 · 4 Runden",
              "bewegungen": [
                {
                  "reps": "40",
                  "name": "Wallball Shots",
                  "detail": "9 kg · 10er-Splits"
                },
                {
                  "reps": "Max",
                  "name": "Cal any Machine",
                  "detail": "Rower/Bike Erg"
                }
              ]
            },
            {
              "struktur": "AMRAP 2:30 · 4 Runden",
              "bewegungen": [
                {
                  "reps": "60",
                  "name": "KB Swings",
                  "detail": "24 kg · 15er-Splits"
                },
                {
                  "reps": "Max",
                  "name": "Cal any Machine",
                  "detail": "30 s Rest zwischen allen Runden"
                }
              ]
            }
          ],
          "warum": "Team-WOD statt Ride. RX-Lasten sind unkritisch, die Last steckt in der Struktur: Cals gleichmäßig, RPE höchstens 8, kein Score-Jagen in der letzten Runde. Burpee-Pull-ups in 5ern kipping, Wallballs in 10ern, Swings in 15ern, Cals auf Rower oder Bike Erg. Montag der W37 bleibt Ruhetag."
        }
      ]
    }
  ]
};
