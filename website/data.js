/* GENERIERT von scripts/build_payload.py — nicht von Hand editieren.
   Quelle: coach/plan/<id>.json + coach/exercises.json (datenmodell.md §5). */
const DATA = {
  "week": {
    "id": "2026-W38",
    "label": "Reise + Meso-4-Start · 14.–20. September 2026",
    "meso": "Übergang · Meso-4-Start am Samstag",
    "von": "2026-09-14",
    "bis": "2026-09-20",
    "days": [
      {
        "iso_date": "2026-09-14",
        "day_type": "rest",
        "warum": "Erster Tag nach dem Flug. Die Woche ist bewusst frei — sechs Tage Pause nach dem Testblock und der langen Ausfahrt sind der Übergang zwischen zwei Mesos, nicht verlorene Zeit."
      },
      {
        "iso_date": "2026-09-15",
        "day_type": "rest",
        "warum": "Freier Tag wie besprochen."
      },
      {
        "iso_date": "2026-09-16",
        "day_type": "rest",
        "warum": "Freier Tag wie besprochen."
      },
      {
        "iso_date": "2026-09-17",
        "day_type": "rest",
        "warum": "Freier Tag wie besprochen."
      },
      {
        "iso_date": "2026-09-18",
        "day_type": "rest",
        "warum": "Letzter Tag des freien Fensters. Ab morgen läuft wieder Training."
      },
      {
        "iso_date": "2026-09-19",
        "day_type": "own",
        "focus": "A",
        "focus_label": "Weightlifting-Fokus",
        "kurzform": "C&J, OHS",
        "blocks": [
          {
            "block_id": "A",
            "prio": "required",
            "title": "Clean & Jerk",
            "min": 25,
            "superset": false,
            "exercises": [
              {
                "ex_id": "clean_jerk",
                "kurz": "C&J",
                "name": "Clean & Jerk",
                "class": "technical",
                "target": {
                  "mode": "kg",
                  "sets": 4,
                  "reps": 1,
                  "kg": 75,
                  "ramp": [
                    60,
                    65,
                    70,
                    75
                  ],
                  "rpe_cap": 7,
                  "tempo": "explosiv",
                  "rest": "2-3 min"
                },
                "whoop": "Clean and Split Jerk",
                "warum": "Ein Komplex pro Stufe, sauber hoch bis 75. Der Bestwert steht bei 82,5 aus dem August — den lässt du heute liegen. Nach 25 Tagen ohne Kontakt holt man das Muster zurück, nicht die Last."
              }
            ]
          },
          {
            "block_id": "B",
            "prio": "required",
            "title": "Overhead Squat",
            "min": 18,
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
                  "reps": 3,
                  "kg": 50,
                  "ramp": [
                    45,
                    47.5,
                    50
                  ],
                  "rpe_cap": 7,
                  "tempo": "kontrolliert",
                  "rest": "2 min"
                },
                "whoop": "Overhead Squat",
                "warum": "Drei Dreier aufsteigend bis 50. Topwert ist 55×3, aber der ist vier Wochen alt und lief seitdem nur als Positionsarbeit. 52,5 ist frei, wenn die 50 wirklich sauber sitzt — sonst bleibt es dabei."
              }
            ]
          },
          {
            "block_id": "C",
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
                "warum": "Zwei Kurzhanteln à 6 kg, kein Versagen. Zweck: Muskelschutz im Kaloriendefizit."
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
                "warum": "Zwei Kurzhanteln à 10 kg, kontrolliert."
              }
            ],
            "verdict_ex_id": "layer_delts_bizeps",
            "verdict_class": "generic"
          },
          {
            "block_id": "D",
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
                "warum": "Overhead-Enge nach C&J und OHS lösen."
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
          45,
          75
        ],
        "zeit_spanne": [
          43,
          66
        ],
        "recovery_day": {
          "u50": "C&J endet bei 70, OHS bei 47,5. Layer entfällt. Load-RPE-Cap 7.",
          "u34": "Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
        }
      },
      {
        "iso_date": "2026-09-20",
        "day_type": "box",
        "einheit": "Deadlift / Toes-to-Bar Ladder For Time",
        "sub": "3-6-9-12-9-6-3 · 15 Air Squats pro Runde · 13 Min Cap",
        "wod": [
          {
            "struktur": "3-6-9-12-9-6-3 auf Zeit · 15 Air Squats am Ende jeder Runde · 13 Min Cap",
            "bewegungen": [
              {
                "reps": "3-6-9-12-9-6-3",
                "name": "Deadlift",
                "detail": "85 kg · Level 2"
              },
              {
                "reps": "3-6-9-12-9-6-3",
                "name": "Toes-to-Bar",
                "detail": "unbroken solange sauber"
              },
              {
                "reps": "15",
                "name": "Air Squats",
                "detail": "am Ende jeder Runde"
              }
            ]
          }
        ],
        "warum": "Deadlifts mit 85 Kilo, dazu Toes-to-Bar und Air Squats, Deckel bei 13 Minuten. Hinge hattest du letzte Woche gar nicht, und die Last ist so weit unter deinem Bereich, dass der Tag nach dem Wiedereinstieg kein Problem ist. Wenn du lieber Rad fährst, ist das der gleichwertige Tausch."
      }
    ]
  },
  "weeks": [
    {
      "id": "2026-W38",
      "label": "Reise + Meso-4-Start · 14.–20. September 2026",
      "meso": "Übergang · Meso-4-Start am Samstag",
      "von": "2026-09-14",
      "bis": "2026-09-20",
      "days": [
        {
          "iso_date": "2026-09-14",
          "day_type": "rest",
          "warum": "Erster Tag nach dem Flug. Die Woche ist bewusst frei — sechs Tage Pause nach dem Testblock und der langen Ausfahrt sind der Übergang zwischen zwei Mesos, nicht verlorene Zeit."
        },
        {
          "iso_date": "2026-09-15",
          "day_type": "rest",
          "warum": "Freier Tag wie besprochen."
        },
        {
          "iso_date": "2026-09-16",
          "day_type": "rest",
          "warum": "Freier Tag wie besprochen."
        },
        {
          "iso_date": "2026-09-17",
          "day_type": "rest",
          "warum": "Freier Tag wie besprochen."
        },
        {
          "iso_date": "2026-09-18",
          "day_type": "rest",
          "warum": "Letzter Tag des freien Fensters. Ab morgen läuft wieder Training."
        },
        {
          "iso_date": "2026-09-19",
          "day_type": "own",
          "focus": "A",
          "focus_label": "Weightlifting-Fokus",
          "kurzform": "C&J, OHS",
          "blocks": [
            {
              "block_id": "A",
              "prio": "required",
              "title": "Clean & Jerk",
              "min": 25,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "clean_jerk",
                  "kurz": "C&J",
                  "name": "Clean & Jerk",
                  "class": "technical",
                  "target": {
                    "mode": "kg",
                    "sets": 4,
                    "reps": 1,
                    "kg": 75,
                    "ramp": [
                      60,
                      65,
                      70,
                      75
                    ],
                    "rpe_cap": 7,
                    "tempo": "explosiv",
                    "rest": "2-3 min"
                  },
                  "whoop": "Clean and Split Jerk",
                  "warum": "Ein Komplex pro Stufe, sauber hoch bis 75. Der Bestwert steht bei 82,5 aus dem August — den lässt du heute liegen. Nach 25 Tagen ohne Kontakt holt man das Muster zurück, nicht die Last."
                }
              ]
            },
            {
              "block_id": "B",
              "prio": "required",
              "title": "Overhead Squat",
              "min": 18,
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
                    "reps": 3,
                    "kg": 50,
                    "ramp": [
                      45,
                      47.5,
                      50
                    ],
                    "rpe_cap": 7,
                    "tempo": "kontrolliert",
                    "rest": "2 min"
                  },
                  "whoop": "Overhead Squat",
                  "warum": "Drei Dreier aufsteigend bis 50. Topwert ist 55×3, aber der ist vier Wochen alt und lief seitdem nur als Positionsarbeit. 52,5 ist frei, wenn die 50 wirklich sauber sitzt — sonst bleibt es dabei."
                }
              ]
            },
            {
              "block_id": "C",
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
                  "warum": "Zwei Kurzhanteln à 6 kg, kein Versagen. Zweck: Muskelschutz im Kaloriendefizit."
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
                  "warum": "Zwei Kurzhanteln à 10 kg, kontrolliert."
                }
              ],
              "verdict_ex_id": "layer_delts_bizeps",
              "verdict_class": "generic"
            },
            {
              "block_id": "D",
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
                  "warum": "Overhead-Enge nach C&J und OHS lösen."
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
            45,
            75
          ],
          "zeit_spanne": [
            43,
            66
          ],
          "recovery_day": {
            "u50": "C&J endet bei 70, OHS bei 47,5. Layer entfällt. Load-RPE-Cap 7.",
            "u34": "Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
          }
        },
        {
          "iso_date": "2026-09-20",
          "day_type": "box",
          "einheit": "Deadlift / Toes-to-Bar Ladder For Time",
          "sub": "3-6-9-12-9-6-3 · 15 Air Squats pro Runde · 13 Min Cap",
          "wod": [
            {
              "struktur": "3-6-9-12-9-6-3 auf Zeit · 15 Air Squats am Ende jeder Runde · 13 Min Cap",
              "bewegungen": [
                {
                  "reps": "3-6-9-12-9-6-3",
                  "name": "Deadlift",
                  "detail": "85 kg · Level 2"
                },
                {
                  "reps": "3-6-9-12-9-6-3",
                  "name": "Toes-to-Bar",
                  "detail": "unbroken solange sauber"
                },
                {
                  "reps": "15",
                  "name": "Air Squats",
                  "detail": "am Ende jeder Runde"
                }
              ]
            }
          ],
          "warum": "Deadlifts mit 85 Kilo, dazu Toes-to-Bar und Air Squats, Deckel bei 13 Minuten. Hinge hattest du letzte Woche gar nicht, und die Last ist so weit unter deinem Bereich, dass der Tag nach dem Wiedereinstieg kein Problem ist. Wenn du lieber Rad fährst, ist das der gleichwertige Tausch."
        }
      ]
    },
    {
      "id": "2026-W39",
      "label": "Kontaktwoche · 21.–27. September 2026",
      "meso": "Übergang · Kontaktwoche vor Griechenland",
      "von": "2026-09-21",
      "bis": "2026-09-27",
      "days": [
        {
          "iso_date": "2026-09-21",
          "day_type": "own",
          "focus": "B",
          "focus_label": "Gymnastics-Reclaim",
          "kurzform": "BMU, hspu_deficit, PU",
          "blocks": [
            {
              "block_id": "A",
              "prio": "required",
              "title": "BMU",
              "min": 18,
              "superset": false,
              "exercises": [
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
                  "warum": "Fünf verbundene Doubles, eine Stufe unter den 4×3 aus W36. Zwölf Tage ohne Kontakt — heute holst du den Rhythmus zurück, nicht die Stufe. Cues: „Fall Into Pike\" für die Stütz-Pause, „Feet in a Bucket\" für den Descent."
                }
              ],
              "verdict_ex_id": "bmu",
              "verdict_class": "skill"
            },
            {
              "block_id": "B",
              "prio": "required",
              "title": "Deficit Strict HSPU",
              "min": 15,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "hspu_deficit",
                  "kurz": "Deficit Strict HSPU",
                  "name": "Deficit Strict HSPU",
                  "class": null,
                  "target": {
                    "mode": "bw",
                    "sets": 4,
                    "reps": 3,
                    "rpe_cap": 7,
                    "rest": "2 min"
                  },
                  "warum": "Kalibrierung, kein Arbeitssatz: vier Dreier mit steigendem Defizit 5 → 7,5 → 10 → 12,5 cm (Scheiben oder Parallettes). Die letzte Höhe, bei der alle drei Reps sauber und mit vollem ROM stehen, ist dein Kalibrierwert — bitte in die Notiz schreiben. Auf dieser Höhe startet die Treppe 4×3 → 4×4 → 4×5."
                }
              ]
            },
            {
              "block_id": "C",
              "prio": "required",
              "title": "Weighted Pull-up",
              "min": 12,
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
                    "rest": "2-3 min"
                  },
                  "whoop": "Weighted Pull Ups",
                  "warum": "Drei Fünfer mit +5 kg, die oberste Stufe der alten Treppe — als Reclaim, nicht als Start der neuen (3×6 kommt erst mit zusammenhängenden Wochen). Letzter Griff-Block des Tages."
                }
              ]
            },
            {
              "block_id": "D",
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
                  "warum": "Zwei Kurzhanteln à 20 kg, höchstens 7 von 10. Zweck: Muskelschutz im Kaloriendefizit."
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
                  "warum": "Konstante Bandspannung, kontrolliert, kein Versagen."
                }
              ],
              "verdict_ex_id": "layer_brust_trizeps",
              "verdict_class": "generic"
            },
            {
              "block_id": "Z",
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
                  "warum": "Cool-down nach dem Pull-Volumen."
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
                  },
                  "warum": "Schulter nach HSPU und BMU durchbewegen."
                },
                {
                  "ex_id": "mob_thoracic",
                  "kurz": "Thorakale Extension am Foam Roller",
                  "name": "Thorakale Extension am Foam Roller",
                  "class": null,
                  "target": {
                    "mode": "time",
                    "sec": 120
                  },
                  "warum": "Brustwirbelsäule öffnen."
                }
              ],
              "verdict_ex_id": "mobility",
              "verdict_class": "generic"
            }
          ],
          "zeit_spanne": [
            45,
            68
          ],
          "recovery_day": {
            "u50": "BMU 4×2, Deficit nur bis 7,5 cm, WPU 3×4 @ +5. Layer entfällt. Load-RPE-Cap 7.",
            "u34": "Session entfällt — Mobility bis RPE 6, oder Ruhe."
          }
        },
        {
          "iso_date": "2026-09-22",
          "day_type": "own",
          "focus": "A",
          "focus_label": "Weightlifting-Fokus",
          "kurzform": "C&J, OHS, Core",
          "blocks": [
            {
              "block_id": "A",
              "prio": "required",
              "title": "Clean & Jerk",
              "min": 25,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "clean_jerk",
                  "kurz": "C&J",
                  "name": "Clean & Jerk",
                  "class": "technical",
                  "target": {
                    "mode": "kg",
                    "sets": 5,
                    "reps": 1,
                    "kg": 80,
                    "ramp": [
                      60,
                      67.5,
                      72.5,
                      77.5,
                      80
                    ],
                    "rpe_cap": 8,
                    "tempo": "explosiv",
                    "rest": "2-3 min"
                  },
                  "whoop": "Clean and Split Jerk",
                  "warum": "Fünf Komplexe aufsteigend bis 80. Am Samstag war bei 75 Schluss und es fühlte sich nach 6 von 10 an — heute eine Stufe weiter. Der Bestwert 82,5 bleibt liegen: danach kommen zwölf freie Tage, ein Maximalversuch davor bringt nichts."
                }
              ]
            },
            {
              "block_id": "B",
              "prio": "required",
              "title": "Overhead Squat",
              "min": 18,
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
                    "reps": 3,
                    "kg": 55,
                    "ramp": [
                      47.5,
                      52.5,
                      55
                    ],
                    "rpe_cap": 7,
                    "tempo": "kontrolliert",
                    "rest": "2 min"
                  },
                  "whoop": "Overhead Squat",
                  "warum": "Drei Dreier bis 55 — das ist dein Topwert vom 19. August, den du heute reproduzierst. Am Samstag lief die 50 bei 6 von 10, die 55 ist der logische nächste Kontakt. 57,5 kommt nach dem Urlaub."
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
                    "sets": 3,
                    "sec": 30,
                    "rpe_cap": 6,
                    "rest": "60 sec"
                  },
                  "whoop": "Hollow Hold",
                  "warum": "Unterer Rücken bleibt fest am Boden, Spannung aus der Körpermitte, ruhig atmen."
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
                    "tempo": "kontrolliert",
                    "rest": "60 sec"
                  },
                  "whoop": "Lateral Raise",
                  "warum": "Zwei Kurzhanteln à 6 kg, kein Versagen. Zweck: Muskelschutz im Kaloriendefizit."
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
                  "warum": "Zwei Kurzhanteln à 10 kg, kontrolliert."
                }
              ],
              "verdict_ex_id": "layer_delts_bizeps",
              "verdict_class": "generic"
            },
            {
              "block_id": "Z",
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
                  "warum": "Overhead-Enge nach C&J und OHS lösen."
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
                  },
                  "warum": "Brustwirbelsäule öffnen."
                }
              ],
              "verdict_ex_id": "mobility",
              "verdict_class": "generic"
            }
          ],
          "last_spanne": [
            47.5,
            80
          ],
          "zeit_spanne": [
            48,
            71
          ],
          "recovery_day": {
            "u50": "C&J endet bei 75, OHS bei 52,5. Layer entfällt. Load-RPE-Cap 7.",
            "u34": "Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
          }
        },
        {
          "iso_date": "2026-09-23",
          "day_type": "rest",
          "warum": "Termin — kein Training."
        },
        {
          "iso_date": "2026-09-24",
          "day_type": "rest",
          "warum": "Termin — kein Training."
        },
        {
          "iso_date": "2026-09-25",
          "day_type": "rest",
          "warum": "Reisetag nach Griechenland. Kein Training — der Urlaub ist trainingsfrei, so wie du es entschieden hast."
        },
        {
          "iso_date": "2026-09-26",
          "day_type": "rest",
          "warum": "Urlaub. Kein Training."
        },
        {
          "iso_date": "2026-09-27",
          "day_type": "rest",
          "warum": "Urlaub. Kein Training."
        }
      ]
    },
    {
      "id": "2026-W40",
      "label": "Urlaubswoche · 28. September – 4. Oktober 2026",
      "meso": "Übergang · Urlaub Griechenland",
      "von": "2026-09-28",
      "bis": "2026-10-04",
      "days": [
        {
          "iso_date": "2026-09-28",
          "day_type": "rest",
          "warum": "Urlaub. Kein Training."
        },
        {
          "iso_date": "2026-09-29",
          "day_type": "rest",
          "warum": "Urlaub. Kein Training."
        },
        {
          "iso_date": "2026-09-30",
          "day_type": "rest",
          "warum": "Urlaub. Kein Training."
        },
        {
          "iso_date": "2026-10-01",
          "day_type": "rest",
          "warum": "Urlaub. Kein Training."
        },
        {
          "iso_date": "2026-10-02",
          "day_type": "rest",
          "warum": "Urlaub. Kein Training."
        },
        {
          "iso_date": "2026-10-03",
          "day_type": "rest",
          "warum": "Rückreisetag. Kein Training."
        },
        {
          "iso_date": "2026-10-04",
          "day_type": "rest",
          "warum": "Tag nach der Rückreise, bewusst frei. Ab Montag startet Meso 4 — die Woche planen wir, sobald du zurück bist."
        }
      ]
    }
  ]
};
