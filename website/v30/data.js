/* GENERIERT von scripts/build_payload.py — nicht von Hand editieren.
   Quelle: coach/plan/<id>.json + coach/exercises.json (datenmodell.md §5). */
const DATA = {
  "week": {
    "id": "2026-W35",
    "label": "Woche 4 · 24.–30. August 2026",
    "meso": "Meso 3 · Woche 4",
    "von": "2026-08-24",
    "bis": "2026-08-30",
    "days": [
      {
        "iso_date": "2026-08-24",
        "day_type": "rest",
        "warum": "Sonntagslast nach dem Fischmeister-Ride (23.08.) — Standard-Ruhetag, kein Schlüsselslot. Upgrade nur bei grüner Mo-Recovery am Tag selbst."
      },
      {
        "iso_date": "2026-08-25",
        "day_type": "own",
        "focus": "A",
        "focus_label": "Weightlifting-Fokus",
        "kurzform": "C&J, FS, Core",
        "blocks": [
          {
            "block_id": "A",
            "prio": "required",
            "title": "Clean & Jerk Komplex",
            "min": 16,
            "superset": false,
            "exercises": [
              {
                "ex_id": "clean_jerk",
                "kurz": "C&J",
                "name": "Clean & Jerk",
                "class": "technical",
                "target": {
                  "mode": "kg",
                  "sets": 6,
                  "reps": "1+1",
                  "kg": 82.5,
                  "ramp": [
                    65,
                    70,
                    75,
                    77.5,
                    80,
                    82.5
                  ],
                  "rpe_cap": 8,
                  "tempo": "explosiv",
                  "rest": "E2:00-2:30"
                },
                "whoop": "Clean and Split Jerk",
                "warum": "Aufbau 65 → 82,5, jede Stufe 1 Clean + 1 Jerk, dazwischen volle Pause. Die 82,5 nur nehmen, wenn Fang und Lockout sauber sind — sonst auf dem letzten sauberen Gewicht bleiben, nichts erzwingen. Ziel: den Komplex wieder über die alte 80er-Bestmarke bringen."
              }
            ]
          },
          {
            "block_id": "B",
            "prio": "required",
            "title": "Front Squat",
            "min": 16,
            "superset": false,
            "exercises": [
              {
                "ex_id": "front_squat",
                "kurz": "FS",
                "name": "Front Squat",
                "class": "technical",
                "target": {
                  "mode": "kg",
                  "sets": 5,
                  "reps": 3,
                  "kg": 95,
                  "ramp": [
                    80,
                    85,
                    90,
                    92.5,
                    95
                  ],
                  "rpe_cap": 8,
                  "tempo": "31X1",
                  "rest": "2-3 min"
                },
                "whoop": "Front Squat",
                "warum": "Tempo 31X1: 3 Sekunden runter, unten kurz halten, zügig hoch. Den Topsatz 95 × 3 nur fahren, wenn er sich nach dem C&J wie höchstens 8 von 10 anfühlt. Ziel: in 2–3 Wochen 105–107,5 als schwere Einzel — dieses Volumen legt die Basis dafür."
              }
            ]
          },
          {
            "block_id": "C",
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
                  "sec": 30,
                  "sets": 3,
                  "rest": "60 sec"
                },
                "whoop": "Hollow Hold",
                "warum": "Unterer Rücken bleibt fest am Boden, Spannung aus der Körpermitte, ruhig atmen. Diese Spannung trägt Front-Rack und Gymnastics — bewusst leicht gehalten."
              }
            ]
          },
          {
            "block_id": "D",
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
                  "rest": "60 sec"
                },
                "whoop": "Lateral Raise",
                "warum": "Kontrolliert und ohne Schwung, zwei Wiederholungen bleiben im Tank. Zweck: Muskelschutz im Kaloriendefizit — der Deckel ist strikt, der Layer lief zuletzt zu schwer."
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
                  "rest": "60 sec"
                },
                "whoop": "Biceps Curl",
                "warum": "Kontrolliert, kein Muskelversagen, zwei Wiederholungen im Tank. Zweck: Muskelschutz im Kaloriendefizit."
              }
            ]
          },
          {
            "block_id": "E",
            "prio": "optional",
            "title": "Mobility",
            "min": 8,
            "superset": false,
            "exercises": [
              {
                "ex_id": "mob_front_rack",
                "kurz": "Front-Rack-Stretch",
                "name": "Front-Rack-Stretch",
                "class": null,
                "target": {
                  "mode": "time",
                  "sec": 120
                },
                "warum": "Cool-down nach Front-Rack-Volumen."
              },
              {
                "ex_id": "mob_hip_flexor",
                "kurz": "Hüftbeuger-Stretch je Seite",
                "name": "Hüftbeuger-Stretch je Seite",
                "class": null,
                "target": {
                  "mode": "time",
                  "sets": 2,
                  "sec": 45
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
        "last_spanne": [
          65,
          95
        ],
        "zeit_spanne": [
          37,
          60
        ],
        "recovery_day": {
          "u50": "Letzter Steigerungssatz entfällt: C&J endet bei 77,5 kg, FS endet bei 90 kg. Load-RPE-Cap 7.",
          "u34": "Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
        }
      },
      {
        "iso_date": "2026-08-26",
        "day_type": "box",
        "einheit": "Tempo RDL + Intervals",
        "sub": "Every 2:30 × 4: 8 Tempo RDL (3-sec-Descent) + 10/Seite Monster Band Side Steps → 8 × (1/1 min): 9/7 Cal · 6 S2O @ 42,5 · Max Air Squats",
        "wod": [
          {
            "struktur": "Every 2:30 × 4",
            "bewegungen": [
              {
                "reps": "8",
                "name": "Tempo Barbell RDL",
                "detail": "Tempo 3 s · moderate"
              },
              {
                "reps": "10/side",
                "name": "Monster Band Side Steps",
                "detail": ""
              }
            ]
          },
          {
            "struktur": "8 × (1 min on / 1 min off)",
            "format": "Score: total Air Squats",
            "bewegungen": [
              {
                "reps": "9",
                "name": "Cal Machine",
                "detail": ""
              },
              {
                "reps": "6",
                "name": "Shoulder-to-Overhead",
                "detail": "42,5 kg"
              },
              {
                "reps": "Max",
                "name": "Air Squats",
                "detail": ""
              }
            ]
          }
        ]
      },
      {
        "iso_date": "2026-08-27",
        "day_type": "rest",
        "warum": "Harter Ruhetag — schützt die Fr-Gymnastics-Frische (Grip/Pull) und dient der Defizit-Erholung. Do-DreamWOD bewusst verworfen (25 strict Chin-ups würden Pull/Grip vorermüden)."
      },
      {
        "iso_date": "2026-08-28",
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
                  "sets": 4,
                  "reps": 3,
                  "unbroken": true,
                  "rpe_cap": 8,
                  "rest": "2-3 min"
                },
                "whoop": "Muscle Ups",
                "warum": "4 × 3 verbunden, ohne von der Stange zu steigen. Reißt die Verbindung, zurück auf 5 × 2 — nicht erzwingen. Ziel: Schritt für Schritt zum Max-Test in zwei Wochen."
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
                "warum": "3 × 10 kontrolliert, Zehen bewusst zur Stange — deutlich unter dem Testwert von 16 am Stück. Halten statt steigern, das neue Ziel kommt nach dem Test-Review."
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
                "warum": "Tempo 21X0: 2 Sekunden runter, explosiv hoch, oben nicht ausruhen. 4 × 8 sauber bestätigen — bewusst nicht steigern, der Max-Test kommt in zwei Wochen."
              }
            ]
          },
          {
            "block_id": "D",
            "prio": "required",
            "title": "Weighted Pull-up",
            "min": 8,
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
                  "reps": 4,
                  "kg": 5,
                  "rpe_cap": 8,
                  "tempo": "30X1",
                  "rest": "2 min"
                },
                "whoop": "Weighted Pull Ups",
                "warum": "3 × 4 mit +5 kg, alle Sätze voll — eine Stufe zurück nach dem 5/5/3 der Vorwoche. Steht das sauber, kommt der 3 × 5-Versuch zurück."
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
                  "mode": "rpe",
                  "sets": 3,
                  "reps": 12,
                  "rpe_cap": 7,
                  "rest": "60 sec"
                },
                "whoop": "DB Bench Press",
                "warum": "Last selbst wählen, höchstens 7 von 10, kein Versagen. Zweck: Muskelschutz im Kaloriendefizit — zuletzt lief der Layer zu schwer."
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
          46,
          66
        ],
        "recovery_day": {
          "u50": "Letzte Progressionsstufe entfällt: HSPU zurück auf 4×7, WPU auf 3×3, BMU 5 × 1 Qualitäts-Singles statt Linked Triples, T2B 3×8. Load-RPE-Cap 7.",
          "u34": "Session entfällt — Mobility bis RPE 6, oder Ruhe."
        }
      },
      {
        "iso_date": "2026-08-29",
        "day_type": "box",
        "einheit": "Hang Squat Clean + WOD",
        "sub": "Hang Squat Clean 3-3-2-2-1-1 (moderat, Hook-Grip) → 2 Rd auf Zeit (16-min-Cap): 10 BBJO 60/50 · 15/12 Cal · 20 DL @85 · 15/12 Cal · 10 BBJO, 1 min Pause zwischen den Runden",
        "wod": [
          {
            "struktur": "Strength",
            "bewegungen": [
              {
                "reps": "3·3·2·2·1·1",
                "name": "Hang Squat Clean",
                "detail": "moderate"
              }
            ]
          },
          {
            "struktur": "2 Rounds for time",
            "format": "Score: total time",
            "cap": "16 min",
            "bewegungen": [
              {
                "reps": "10",
                "name": "Burpee Box Jump Overs",
                "detail": "60 cm"
              },
              {
                "reps": "15",
                "name": "Cal Machine",
                "detail": ""
              },
              {
                "reps": "20",
                "name": "Deadlifts",
                "detail": "85 kg"
              },
              {
                "reps": "15",
                "name": "Cal Machine",
                "detail": ""
              },
              {
                "reps": "10",
                "name": "Burpee Box Jump Overs",
                "detail": "60 cm"
              }
            ]
          }
        ]
      },
      {
        "iso_date": "2026-08-30",
        "day_type": "box",
        "einheit": "Team-WOD „Waterfall“ oder Ride",
        "sub": "WOD optional — Alternative ist der Sonntags-Ride",
        "wod": [
          {
            "struktur": "30-min AMRAP",
            "format": "Teams of 3",
            "bewegungen": [
              {
                "reps": "12",
                "name": "Cal Row",
                "detail": ""
              },
              {
                "reps": "12",
                "name": "Burpees",
                "detail": ""
              },
              {
                "reps": "12",
                "name": "Cal Bike",
                "detail": ""
              },
              {
                "reps": "12",
                "name": "Alt DB Hang Snatch",
                "detail": "22,5 kg"
              },
              {
                "reps": "12",
                "name": "Push-ups",
                "detail": ""
              }
            ]
          }
        ]
      }
    ]
  },
  "weeks": [
    {
      "id": "2026-W35",
      "label": "Woche 4 · 24.–30. August 2026",
      "meso": "Meso 3 · Woche 4",
      "von": "2026-08-24",
      "bis": "2026-08-30",
      "days": [
        {
          "iso_date": "2026-08-24",
          "day_type": "rest",
          "warum": "Sonntagslast nach dem Fischmeister-Ride (23.08.) — Standard-Ruhetag, kein Schlüsselslot. Upgrade nur bei grüner Mo-Recovery am Tag selbst."
        },
        {
          "iso_date": "2026-08-25",
          "day_type": "own",
          "focus": "A",
          "focus_label": "Weightlifting-Fokus",
          "kurzform": "C&J, FS, Core",
          "blocks": [
            {
              "block_id": "A",
              "prio": "required",
              "title": "Clean & Jerk Komplex",
              "min": 16,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "clean_jerk",
                  "kurz": "C&J",
                  "name": "Clean & Jerk",
                  "class": "technical",
                  "target": {
                    "mode": "kg",
                    "sets": 6,
                    "reps": "1+1",
                    "kg": 82.5,
                    "ramp": [
                      65,
                      70,
                      75,
                      77.5,
                      80,
                      82.5
                    ],
                    "rpe_cap": 8,
                    "tempo": "explosiv",
                    "rest": "E2:00-2:30"
                  },
                  "whoop": "Clean and Split Jerk",
                  "warum": "Aufbau 65 → 82,5, jede Stufe 1 Clean + 1 Jerk, dazwischen volle Pause. Die 82,5 nur nehmen, wenn Fang und Lockout sauber sind — sonst auf dem letzten sauberen Gewicht bleiben, nichts erzwingen. Ziel: den Komplex wieder über die alte 80er-Bestmarke bringen."
                }
              ]
            },
            {
              "block_id": "B",
              "prio": "required",
              "title": "Front Squat",
              "min": 16,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "front_squat",
                  "kurz": "FS",
                  "name": "Front Squat",
                  "class": "technical",
                  "target": {
                    "mode": "kg",
                    "sets": 5,
                    "reps": 3,
                    "kg": 95,
                    "ramp": [
                      80,
                      85,
                      90,
                      92.5,
                      95
                    ],
                    "rpe_cap": 8,
                    "tempo": "31X1",
                    "rest": "2-3 min"
                  },
                  "whoop": "Front Squat",
                  "warum": "Tempo 31X1: 3 Sekunden runter, unten kurz halten, zügig hoch. Den Topsatz 95 × 3 nur fahren, wenn er sich nach dem C&J wie höchstens 8 von 10 anfühlt. Ziel: in 2–3 Wochen 105–107,5 als schwere Einzel — dieses Volumen legt die Basis dafür."
                }
              ]
            },
            {
              "block_id": "C",
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
                    "sec": 30,
                    "sets": 3,
                    "rest": "60 sec"
                  },
                  "whoop": "Hollow Hold",
                  "warum": "Unterer Rücken bleibt fest am Boden, Spannung aus der Körpermitte, ruhig atmen. Diese Spannung trägt Front-Rack und Gymnastics — bewusst leicht gehalten."
                }
              ]
            },
            {
              "block_id": "D",
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
                    "rest": "60 sec"
                  },
                  "whoop": "Lateral Raise",
                  "warum": "Kontrolliert und ohne Schwung, zwei Wiederholungen bleiben im Tank. Zweck: Muskelschutz im Kaloriendefizit — der Deckel ist strikt, der Layer lief zuletzt zu schwer."
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
                    "rest": "60 sec"
                  },
                  "whoop": "Biceps Curl",
                  "warum": "Kontrolliert, kein Muskelversagen, zwei Wiederholungen im Tank. Zweck: Muskelschutz im Kaloriendefizit."
                }
              ]
            },
            {
              "block_id": "E",
              "prio": "optional",
              "title": "Mobility",
              "min": 8,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "mob_front_rack",
                  "kurz": "Front-Rack-Stretch",
                  "name": "Front-Rack-Stretch",
                  "class": null,
                  "target": {
                    "mode": "time",
                    "sec": 120
                  },
                  "warum": "Cool-down nach Front-Rack-Volumen."
                },
                {
                  "ex_id": "mob_hip_flexor",
                  "kurz": "Hüftbeuger-Stretch je Seite",
                  "name": "Hüftbeuger-Stretch je Seite",
                  "class": null,
                  "target": {
                    "mode": "time",
                    "sets": 2,
                    "sec": 45
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
          "last_spanne": [
            65,
            95
          ],
          "zeit_spanne": [
            37,
            60
          ],
          "recovery_day": {
            "u50": "Letzter Steigerungssatz entfällt: C&J endet bei 77,5 kg, FS endet bei 90 kg. Load-RPE-Cap 7.",
            "u34": "Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
          }
        },
        {
          "iso_date": "2026-08-26",
          "day_type": "box",
          "einheit": "Tempo RDL + Intervals",
          "sub": "Every 2:30 × 4: 8 Tempo RDL (3-sec-Descent) + 10/Seite Monster Band Side Steps → 8 × (1/1 min): 9/7 Cal · 6 S2O @ 42,5 · Max Air Squats",
          "wod": [
            {
              "struktur": "Every 2:30 × 4",
              "bewegungen": [
                {
                  "reps": "8",
                  "name": "Tempo Barbell RDL",
                  "detail": "Tempo 3 s · moderate"
                },
                {
                  "reps": "10/side",
                  "name": "Monster Band Side Steps",
                  "detail": ""
                }
              ]
            },
            {
              "struktur": "8 × (1 min on / 1 min off)",
              "format": "Score: total Air Squats",
              "bewegungen": [
                {
                  "reps": "9",
                  "name": "Cal Machine",
                  "detail": ""
                },
                {
                  "reps": "6",
                  "name": "Shoulder-to-Overhead",
                  "detail": "42,5 kg"
                },
                {
                  "reps": "Max",
                  "name": "Air Squats",
                  "detail": ""
                }
              ]
            }
          ]
        },
        {
          "iso_date": "2026-08-27",
          "day_type": "rest",
          "warum": "Harter Ruhetag — schützt die Fr-Gymnastics-Frische (Grip/Pull) und dient der Defizit-Erholung. Do-DreamWOD bewusst verworfen (25 strict Chin-ups würden Pull/Grip vorermüden)."
        },
        {
          "iso_date": "2026-08-28",
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
                    "sets": 4,
                    "reps": 3,
                    "unbroken": true,
                    "rpe_cap": 8,
                    "rest": "2-3 min"
                  },
                  "whoop": "Muscle Ups",
                  "warum": "4 × 3 verbunden, ohne von der Stange zu steigen. Reißt die Verbindung, zurück auf 5 × 2 — nicht erzwingen. Ziel: Schritt für Schritt zum Max-Test in zwei Wochen."
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
                  "warum": "3 × 10 kontrolliert, Zehen bewusst zur Stange — deutlich unter dem Testwert von 16 am Stück. Halten statt steigern, das neue Ziel kommt nach dem Test-Review."
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
                  "warum": "Tempo 21X0: 2 Sekunden runter, explosiv hoch, oben nicht ausruhen. 4 × 8 sauber bestätigen — bewusst nicht steigern, der Max-Test kommt in zwei Wochen."
                }
              ]
            },
            {
              "block_id": "D",
              "prio": "required",
              "title": "Weighted Pull-up",
              "min": 8,
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
                    "reps": 4,
                    "kg": 5,
                    "rpe_cap": 8,
                    "tempo": "30X1",
                    "rest": "2 min"
                  },
                  "whoop": "Weighted Pull Ups",
                  "warum": "3 × 4 mit +5 kg, alle Sätze voll — eine Stufe zurück nach dem 5/5/3 der Vorwoche. Steht das sauber, kommt der 3 × 5-Versuch zurück."
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
                    "mode": "rpe",
                    "sets": 3,
                    "reps": 12,
                    "rpe_cap": 7,
                    "rest": "60 sec"
                  },
                  "whoop": "DB Bench Press",
                  "warum": "Last selbst wählen, höchstens 7 von 10, kein Versagen. Zweck: Muskelschutz im Kaloriendefizit — zuletzt lief der Layer zu schwer."
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
            46,
            66
          ],
          "recovery_day": {
            "u50": "Letzte Progressionsstufe entfällt: HSPU zurück auf 4×7, WPU auf 3×3, BMU 5 × 1 Qualitäts-Singles statt Linked Triples, T2B 3×8. Load-RPE-Cap 7.",
            "u34": "Session entfällt — Mobility bis RPE 6, oder Ruhe."
          }
        },
        {
          "iso_date": "2026-08-29",
          "day_type": "box",
          "einheit": "Hang Squat Clean + WOD",
          "sub": "Hang Squat Clean 3-3-2-2-1-1 (moderat, Hook-Grip) → 2 Rd auf Zeit (16-min-Cap): 10 BBJO 60/50 · 15/12 Cal · 20 DL @85 · 15/12 Cal · 10 BBJO, 1 min Pause zwischen den Runden",
          "wod": [
            {
              "struktur": "Strength",
              "bewegungen": [
                {
                  "reps": "3·3·2·2·1·1",
                  "name": "Hang Squat Clean",
                  "detail": "moderate"
                }
              ]
            },
            {
              "struktur": "2 Rounds for time",
              "format": "Score: total time",
              "cap": "16 min",
              "bewegungen": [
                {
                  "reps": "10",
                  "name": "Burpee Box Jump Overs",
                  "detail": "60 cm"
                },
                {
                  "reps": "15",
                  "name": "Cal Machine",
                  "detail": ""
                },
                {
                  "reps": "20",
                  "name": "Deadlifts",
                  "detail": "85 kg"
                },
                {
                  "reps": "15",
                  "name": "Cal Machine",
                  "detail": ""
                },
                {
                  "reps": "10",
                  "name": "Burpee Box Jump Overs",
                  "detail": "60 cm"
                }
              ]
            }
          ]
        },
        {
          "iso_date": "2026-08-30",
          "day_type": "box",
          "einheit": "Team-WOD „Waterfall“ oder Ride",
          "sub": "WOD optional — Alternative ist der Sonntags-Ride",
          "wod": [
            {
              "struktur": "30-min AMRAP",
              "format": "Teams of 3",
              "bewegungen": [
                {
                  "reps": "12",
                  "name": "Cal Row",
                  "detail": ""
                },
                {
                  "reps": "12",
                  "name": "Burpees",
                  "detail": ""
                },
                {
                  "reps": "12",
                  "name": "Cal Bike",
                  "detail": ""
                },
                {
                  "reps": "12",
                  "name": "Alt DB Hang Snatch",
                  "detail": "22,5 kg"
                },
                {
                  "reps": "12",
                  "name": "Push-ups",
                  "detail": ""
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
