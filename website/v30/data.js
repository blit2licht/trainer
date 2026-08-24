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
                "warum": "Reclaim über die W32-Ceiling 80 (Sa 08.08., session_feel 5, seither ~18 Tage ohne Komplex-Kontakt). 82,5 nur bei sauberem Fang + Jerk-Lockout — sonst auf dem letzten sauberen Gewicht ausfahren, kein Erzwingen in der Defizit-Dip-Woche."
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
                "warum": "Block-Start vor dem erwarteten Defizit-Dip (Meso-Rolle W35). Referenz: Top-Single 102,5 aus Block Teil 1 (W30). Topsatz 95×3 RPE-gated nach der C&J-Vorermüdung — der Korridor 105–107,5 wird W36/W37 mit Singles/Doubles angefahren."
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
                "warum": "Rumpfspannung als Basis für Front-Rack und Gymnastics — bewusst leicht gehalten."
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
                "kurz": "DB Lateral Raise",
                "name": "DB Lateral Raise",
                "class": null,
                "target": {
                  "mode": "kg",
                  "sets": 3,
                  "reps": 12,
                  "kg": 6,
                  "rpe_cap": 7,
                  "rest": "60 sec"
                },
                "warum": "Rekompositions-Layer. RPE-Deckel 7 strikt — der Layer lief zwei Wochen heiß."
              },
              {
                "ex_id": "biceps_curl",
                "kurz": "DB Curl",
                "name": "DB Curl",
                "class": null,
                "target": {
                  "mode": "kg",
                  "sets": 3,
                  "reps": 12,
                  "kg": 10,
                  "rpe_cap": 7,
                  "rest": "60 sec"
                },
                "warum": "Rekompositions-Layer, RPE-Deckel 7 strikt."
              }
            ],
            "verdict_ex_id": "layer_delts_bizeps",
            "verdict_class": "generic"
          },
          {
            "block_id": "E",
            "prio": "optional",
            "title": "Mobility",
            "min": 8,
            "superset": false,
            "exercises": [
              {
                "ex_id": "mobility",
                "kurz": "Mobility",
                "name": "Mobility / Cool-down",
                "class": "generic",
                "target": {
                  "mode": "time",
                  "sec": 480
                },
                "warum": "Cool-down nach Front-Rack-Volumen."
              }
            ]
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
                "warum": "Descent-Kontrolle + Hip-Pop-Timing primen (~5 min) — die Video-Diagnose vom 22.08. zeigt den Engpass im Descent (0,55–0,76 Torsolängen von der Stange) und in der Stütz-Pause, nicht im Zug."
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
                "warum": "Stufe hoch von 5×2: W34 lief mit feel 3 und einmal 3 am Stück — der Aufstieg auf der Linked-Sets-Treppe (5×2 → 4×3 → 3×3+1×max → Test) ist gerechtfertigt. Reißt das Linking, zurück auf 5×2 — nicht erzwingen."
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
                "warum": "Gehalten, kein Test — Test 16 hat das Ziel 10 klar übertroffen, Zielneusetzung kommt beim W37-Review."
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
                "warum": "Oberste Leiterstufe 4×8 in W34 am Limit bestätigt (letzter Satz schwer) — konsolidieren statt steigern, NICHT 4×9. Nächster Schritt ist der Max-Test W37."
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
                "warum": "Stufe zurück nach dem 3×5-Miss in W34 (5/5/3, rec 78 = echtes Kapazitätslimit) — Stufe-zurück-Regel. 3×4 sauber zementieren, alle Sätze voll; 3×5-Retry erst W36."
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
                "kurz": "DB Bench Press",
                "name": "DB Bench Press",
                "class": null,
                "target": {
                  "mode": "rpe",
                  "sets": 3,
                  "reps": 12,
                  "rpe_cap": 7,
                  "rest": "60 sec"
                },
                "warum": "Rekompositions-Layer, RPE-kalibriert. Deckel 7 strikt — lief zwei Wochen heiß (W34 RPE 8-9)."
              },
              {
                "ex_id": "triceps_ext",
                "kurz": "Triceps Extension",
                "name": "Triceps Extension",
                "class": null,
                "target": {
                  "mode": "band",
                  "band": "rotes Band",
                  "sets": 3,
                  "reps": 15,
                  "rpe_cap": 7,
                  "rest": "60 sec"
                },
                "warum": "Rekompositions-Layer, konstante Spannung."
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
                "ex_id": "mobility",
                "kurz": "Mobility",
                "name": "Mobility / Cool-down",
                "class": "generic",
                "target": {
                  "mode": "time",
                  "sec": 300
                },
                "warum": "Cool-down nach Pull-Volumen."
              }
            ]
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
                  "warum": "Reclaim über die W32-Ceiling 80 (Sa 08.08., session_feel 5, seither ~18 Tage ohne Komplex-Kontakt). 82,5 nur bei sauberem Fang + Jerk-Lockout — sonst auf dem letzten sauberen Gewicht ausfahren, kein Erzwingen in der Defizit-Dip-Woche."
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
                  "warum": "Block-Start vor dem erwarteten Defizit-Dip (Meso-Rolle W35). Referenz: Top-Single 102,5 aus Block Teil 1 (W30). Topsatz 95×3 RPE-gated nach der C&J-Vorermüdung — der Korridor 105–107,5 wird W36/W37 mit Singles/Doubles angefahren."
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
                  "warum": "Rumpfspannung als Basis für Front-Rack und Gymnastics — bewusst leicht gehalten."
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
                  "kurz": "DB Lateral Raise",
                  "name": "DB Lateral Raise",
                  "class": null,
                  "target": {
                    "mode": "kg",
                    "sets": 3,
                    "reps": 12,
                    "kg": 6,
                    "rpe_cap": 7,
                    "rest": "60 sec"
                  },
                  "warum": "Rekompositions-Layer. RPE-Deckel 7 strikt — der Layer lief zwei Wochen heiß."
                },
                {
                  "ex_id": "biceps_curl",
                  "kurz": "DB Curl",
                  "name": "DB Curl",
                  "class": null,
                  "target": {
                    "mode": "kg",
                    "sets": 3,
                    "reps": 12,
                    "kg": 10,
                    "rpe_cap": 7,
                    "rest": "60 sec"
                  },
                  "warum": "Rekompositions-Layer, RPE-Deckel 7 strikt."
                }
              ],
              "verdict_ex_id": "layer_delts_bizeps",
              "verdict_class": "generic"
            },
            {
              "block_id": "E",
              "prio": "optional",
              "title": "Mobility",
              "min": 8,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "mobility",
                  "kurz": "Mobility",
                  "name": "Mobility / Cool-down",
                  "class": "generic",
                  "target": {
                    "mode": "time",
                    "sec": 480
                  },
                  "warum": "Cool-down nach Front-Rack-Volumen."
                }
              ]
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
                  "warum": "Descent-Kontrolle + Hip-Pop-Timing primen (~5 min) — die Video-Diagnose vom 22.08. zeigt den Engpass im Descent (0,55–0,76 Torsolängen von der Stange) und in der Stütz-Pause, nicht im Zug."
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
                  "warum": "Stufe hoch von 5×2: W34 lief mit feel 3 und einmal 3 am Stück — der Aufstieg auf der Linked-Sets-Treppe (5×2 → 4×3 → 3×3+1×max → Test) ist gerechtfertigt. Reißt das Linking, zurück auf 5×2 — nicht erzwingen."
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
                  "warum": "Gehalten, kein Test — Test 16 hat das Ziel 10 klar übertroffen, Zielneusetzung kommt beim W37-Review."
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
                  "warum": "Oberste Leiterstufe 4×8 in W34 am Limit bestätigt (letzter Satz schwer) — konsolidieren statt steigern, NICHT 4×9. Nächster Schritt ist der Max-Test W37."
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
                  "warum": "Stufe zurück nach dem 3×5-Miss in W34 (5/5/3, rec 78 = echtes Kapazitätslimit) — Stufe-zurück-Regel. 3×4 sauber zementieren, alle Sätze voll; 3×5-Retry erst W36."
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
                  "kurz": "DB Bench Press",
                  "name": "DB Bench Press",
                  "class": null,
                  "target": {
                    "mode": "rpe",
                    "sets": 3,
                    "reps": 12,
                    "rpe_cap": 7,
                    "rest": "60 sec"
                  },
                  "warum": "Rekompositions-Layer, RPE-kalibriert. Deckel 7 strikt — lief zwei Wochen heiß (W34 RPE 8-9)."
                },
                {
                  "ex_id": "triceps_ext",
                  "kurz": "Triceps Extension",
                  "name": "Triceps Extension",
                  "class": null,
                  "target": {
                    "mode": "band",
                    "band": "rotes Band",
                    "sets": 3,
                    "reps": 15,
                    "rpe_cap": 7,
                    "rest": "60 sec"
                  },
                  "warum": "Rekompositions-Layer, konstante Spannung."
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
                  "ex_id": "mobility",
                  "kurz": "Mobility",
                  "name": "Mobility / Cool-down",
                  "class": "generic",
                  "target": {
                    "mode": "time",
                    "sec": 300
                  },
                  "warum": "Cool-down nach Pull-Volumen."
                }
              ]
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
