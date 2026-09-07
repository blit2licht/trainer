/* GENERIERT von scripts/build_payload.py — nicht von Hand editieren.
   Quelle: coach/plan/<id>.json + coach/exercises.json (datenmodell.md §5). */
const DATA = {
  "week": {
    "id": "2026-W37",
    "label": "Woche 6 · 7.–13. September 2026",
    "meso": "Meso 3 · Woche 6",
    "von": "2026-09-07",
    "bis": "2026-09-13",
    "days": [
      {
        "iso_date": "2026-09-07",
        "day_type": "rest",
        "warum": "Ruhetag nach dem Team-WOD von gestern. Der Box-Chipper heute wäre viel Quad-Arbeit direkt vor dem Testblock — der Mittwoch soll frisch sein, und darum bleibt heute Pause."
      },
      {
        "iso_date": "2026-09-08",
        "day_type": "rest",
        "warum": "Termin — kein Training. Zwei Ruhetage vor dem Testtag sind hier Absicht: Max-Sätze auf müdem System messen nichts."
      },
      {
        "iso_date": "2026-09-09",
        "day_type": "own",
        "focus": "B",
        "focus_label": "Gymnastics-Testtag",
        "kurzform": "BMU, HSPU, PU, T2B",
        "blocks": [
          {
            "block_id": "A",
            "prio": "required",
            "title": "BMU",
            "min": 20,
            "superset": false,
            "exercises": [
              {
                "ex_id": "bmu",
                "kurz": "BMU",
                "name": "Bar Muscle-up",
                "class": "skill",
                "target": {
                  "mode": "bw",
                  "sets": 1,
                  "reps": "max",
                  "unbroken": true,
                  "rpe_cap": 10,
                  "rest": "3-4 min"
                },
                "whoop": "Muscle Ups",
                "warum": "Max unbroken, frisch als erster Arbeitssatz. Stand ist 3, das Ziel 5. Nach dem Warm-up ein Satz, alles rausholen, kein zweiter Versuch — der Wert zählt nur frisch."
              },
              {
                "ex_id": "bmu",
                "kurz": "BMU",
                "name": "Bar Muscle-up",
                "class": "skill",
                "target": {
                  "mode": "bw",
                  "sets": 3,
                  "reps": 3,
                  "unbroken": true,
                  "rpe_cap": 8,
                  "rest": "2-3 min"
                },
                "whoop": "Muscle Ups",
                "warum": "Drei verbundene Tripel nach dem Testsatz — das ist die Treppenstufe 3×3, die auf die 4×3 aus W36 folgt. Reißt ein Satz nach dem Max, ist das kein Rückschritt, sondern Vorermüdung."
              }
            ],
            "verdict_ex_id": "bmu",
            "verdict_class": "skill"
          },
          {
            "block_id": "B",
            "prio": "required",
            "title": "Strict HSPU",
            "min": 12,
            "superset": false,
            "exercises": [
              {
                "ex_id": "hspu_strict",
                "kurz": "HSPU",
                "name": "Strict Handstand Push-up",
                "class": "skill",
                "target": {
                  "mode": "bw",
                  "sets": 1,
                  "reps": "max",
                  "unbroken": true,
                  "rpe_cap": 10,
                  "rest": "3 min"
                },
                "whoop": "Handstand Push-Ups",
                "warum": "Max unbroken. Stand 9 aus W32, das Ziel ist 10. Die Stufe 4×8 steht seit W34 dreimal sauber — der Test ist überfällig, nicht 4×9."
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
                  "sets": 1,
                  "reps": "max",
                  "kg": 5,
                  "rpe_cap": 10,
                  "tempo": "30X1",
                  "rest": "3 min"
                },
                "whoop": "Weighted Pull Ups",
                "warum": "Testsatz mit +5 kg, Ziel sind 6 Wiederholungen. 3×5 stand in W36 sauber — stehen heute 6 am Stück, ist das Profil-Ziel erreicht. Letzter Test des Tages, weil der Griff hier am meisten Vorbelastung mitbringt."
              }
            ]
          },
          {
            "block_id": "D",
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
                "warum": "Volumen, kein Test. Der Wert von 16 aus W32 reicht für die Zielneusetzung im Review; ein vierter Max-Satz auf plattem Griff wäre nicht vergleichbar."
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
                "warum": "Zwei Kurzhanteln à 20 kg, höchstens 7 von 10. Zweck: Muskelschutz im Kaloriendefizit. Erster Streichkandidat nach drei Testsätzen."
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
          52,
          72
        ],
        "recovery_day": {
          "u50": "Keine Testsätze. Stattdessen Volumen eine Stufe tiefer: BMU 5×2, HSPU 4×7, WPU 3×4 @ +5, T2B 3×8. Testblock verschiebt sich um eine Woche. Load-RPE-Cap 7.",
          "u34": "Session entfällt — Mobility bis RPE 6, oder Ruhe."
        }
      },
      {
        "iso_date": "2026-09-10",
        "day_type": "own",
        "focus": "A",
        "focus_label": "Weightlifting-Fokus",
        "kurzform": "Drop Snatch, Snatch, FS, Core",
        "blocks": [
          {
            "block_id": "A",
            "prio": "required",
            "title": "Drop Snatch",
            "min": 20,
            "superset": false,
            "exercises": [
              {
                "ex_id": "drop_snatch",
                "kurz": "Drop Snatch",
                "name": "Drop Snatch",
                "class": "generic",
                "target": {
                  "mode": "kg",
                  "sets": 3,
                  "reps": 3,
                  "kg": 45,
                  "ramp": [
                    40,
                    42.5,
                    45
                  ],
                  "rpe_cap": 6,
                  "tempo": "schnell unter die Stange",
                  "rest": "90 sec"
                },
                "whoop": "Drop Snatch",
                "warum": "Aus dem Stand die Stange auf den Schultern, dann so schnell wie möglich unter sie fallen und tief fangen. Leichte Last mit Absicht: geübt wird der Weg nach unten, nicht das Gewicht. Genau die Bewegung, die im Video 3,1 Sekunden gedauert hat."
              }
            ]
          },
          {
            "block_id": "B",
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
                  "sets": 5,
                  "reps": 1,
                  "kg": 57.5,
                  "ramp": [
                    45,
                    50,
                    55,
                    57.5
                  ],
                  "rpe_cap": 7,
                  "tempo": "explosiv",
                  "rest": "2 min"
                },
                "whoop": "Snatch",
                "warum": "Singles unter der Ceiling, bewusst tief empfangen — nicht hoch fangen und dann absitzen. Fünf Sätze auf vier Stufen: die 57,5 nimmst du zweimal. Kein 60 und kein Ceiling-Versuch heute, die 60 steht seit letzter Woche — gearbeitet wird an der Position darunter."
              }
            ]
          },
          {
            "block_id": "C",
            "prio": "required",
            "title": "Front Squat",
            "min": 18,
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
                  "reps": 1,
                  "kg": 105,
                  "ramp": [
                    85,
                    95,
                    100,
                    102.5,
                    105
                  ],
                  "rpe_cap": 8,
                  "tempo": "31X1",
                  "rest": "3 min"
                },
                "whoop": "Front Squat",
                "warum": "Einzelversuche bis 105 — das wäre ein neuer Bestwert über die 102,5 aus W30 und der Korridor, der seit dem Blockstart offen ist. Abbruchkriterium ist die Rack-Position: kippen die Ellbogen, ist der Satz vorbei. 107,5 nur, wenn 105 sich wie höchstens 8 von 10 anfühlt."
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
                "warum": "Unterer Rücken bleibt fest am Boden, Spannung aus der Körpermitte, ruhig atmen."
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
                "warum": "Zwei Kurzhanteln à 10 kg, kontrolliert, keine Failure-Sätze."
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
                "warum": "Overhead-Enge nach der Snatch-Arbeit lösen."
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
          105
        ],
        "zeit_spanne": [
          61,
          84
        ],
        "recovery_day": {
          "u50": "FS endet bei 100, kein 105. Snatch-Singles enden bei 55, Video verschiebt sich. Load-RPE-Cap 7.",
          "u34": "Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
        }
      },
      {
        "iso_date": "2026-09-11",
        "day_type": "rest",
        "warum": "Ruhetag. „McGhee\" wäre 30 Minuten Deadlifts einen Tag nach dem schweren Front Squat und Push-ups zwei Tage nach dem HSPU-Test — beides auf müdem Material. Der Samstag ist der bessere Box-Tag."
      },
      {
        "iso_date": "2026-09-12",
        "day_type": "box",
        "einheit": "Squat Clean and Jerk 10 Rounds For Time",
        "sub": "10 Rd · 3 Squat Clean and Jerks + 20 Double Unders · 13 Min Cap",
        "wod": [
          {
            "struktur": "10 Runden auf Zeit · 13 Min Cap",
            "bewegungen": [
              {
                "reps": "3",
                "name": "Squat Clean and Jerk",
                "detail": "60 kg · saubere Singles"
              },
              {
                "reps": "20",
                "name": "Double Unders",
                "detail": "oder 40 Single Unders"
              }
            ]
          }
        ],
        "warum": "Level 2 mit 60 Kilo. Das sind gut 70 Prozent deines Komplex-Bestwerts, also technisch machbar, auch mit müden Beinen vom Donnerstag. Die drei Wiederholungen pro Runde als einzelne saubere Lifts, nicht am Stück — bei dieser Last kostet touch-and-go mehr Technik als es Zeit spart. Das Banded-Squat-Stück vorher lässt du weg."
      },
      {
        "iso_date": "2026-09-13",
        "day_type": "rest",
        "warum": "Reisetag nach Charlotte. Kein Training. Die Reisewoche planen wir separat, sobald du weißt, was vor Ort geht."
      }
    ]
  },
  "weeks": [
    {
      "id": "2026-W37",
      "label": "Woche 6 · 7.–13. September 2026",
      "meso": "Meso 3 · Woche 6",
      "von": "2026-09-07",
      "bis": "2026-09-13",
      "days": [
        {
          "iso_date": "2026-09-07",
          "day_type": "rest",
          "warum": "Ruhetag nach dem Team-WOD von gestern. Der Box-Chipper heute wäre viel Quad-Arbeit direkt vor dem Testblock — der Mittwoch soll frisch sein, und darum bleibt heute Pause."
        },
        {
          "iso_date": "2026-09-08",
          "day_type": "rest",
          "warum": "Termin — kein Training. Zwei Ruhetage vor dem Testtag sind hier Absicht: Max-Sätze auf müdem System messen nichts."
        },
        {
          "iso_date": "2026-09-09",
          "day_type": "own",
          "focus": "B",
          "focus_label": "Gymnastics-Testtag",
          "kurzform": "BMU, HSPU, PU, T2B",
          "blocks": [
            {
              "block_id": "A",
              "prio": "required",
              "title": "BMU",
              "min": 20,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "bmu",
                  "kurz": "BMU",
                  "name": "Bar Muscle-up",
                  "class": "skill",
                  "target": {
                    "mode": "bw",
                    "sets": 1,
                    "reps": "max",
                    "unbroken": true,
                    "rpe_cap": 10,
                    "rest": "3-4 min"
                  },
                  "whoop": "Muscle Ups",
                  "warum": "Max unbroken, frisch als erster Arbeitssatz. Stand ist 3, das Ziel 5. Nach dem Warm-up ein Satz, alles rausholen, kein zweiter Versuch — der Wert zählt nur frisch."
                },
                {
                  "ex_id": "bmu",
                  "kurz": "BMU",
                  "name": "Bar Muscle-up",
                  "class": "skill",
                  "target": {
                    "mode": "bw",
                    "sets": 3,
                    "reps": 3,
                    "unbroken": true,
                    "rpe_cap": 8,
                    "rest": "2-3 min"
                  },
                  "whoop": "Muscle Ups",
                  "warum": "Drei verbundene Tripel nach dem Testsatz — das ist die Treppenstufe 3×3, die auf die 4×3 aus W36 folgt. Reißt ein Satz nach dem Max, ist das kein Rückschritt, sondern Vorermüdung."
                }
              ],
              "verdict_ex_id": "bmu",
              "verdict_class": "skill"
            },
            {
              "block_id": "B",
              "prio": "required",
              "title": "Strict HSPU",
              "min": 12,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "hspu_strict",
                  "kurz": "HSPU",
                  "name": "Strict Handstand Push-up",
                  "class": "skill",
                  "target": {
                    "mode": "bw",
                    "sets": 1,
                    "reps": "max",
                    "unbroken": true,
                    "rpe_cap": 10,
                    "rest": "3 min"
                  },
                  "whoop": "Handstand Push-Ups",
                  "warum": "Max unbroken. Stand 9 aus W32, das Ziel ist 10. Die Stufe 4×8 steht seit W34 dreimal sauber — der Test ist überfällig, nicht 4×9."
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
                    "sets": 1,
                    "reps": "max",
                    "kg": 5,
                    "rpe_cap": 10,
                    "tempo": "30X1",
                    "rest": "3 min"
                  },
                  "whoop": "Weighted Pull Ups",
                  "warum": "Testsatz mit +5 kg, Ziel sind 6 Wiederholungen. 3×5 stand in W36 sauber — stehen heute 6 am Stück, ist das Profil-Ziel erreicht. Letzter Test des Tages, weil der Griff hier am meisten Vorbelastung mitbringt."
                }
              ]
            },
            {
              "block_id": "D",
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
                  "warum": "Volumen, kein Test. Der Wert von 16 aus W32 reicht für die Zielneusetzung im Review; ein vierter Max-Satz auf plattem Griff wäre nicht vergleichbar."
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
                  "warum": "Zwei Kurzhanteln à 20 kg, höchstens 7 von 10. Zweck: Muskelschutz im Kaloriendefizit. Erster Streichkandidat nach drei Testsätzen."
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
            52,
            72
          ],
          "recovery_day": {
            "u50": "Keine Testsätze. Stattdessen Volumen eine Stufe tiefer: BMU 5×2, HSPU 4×7, WPU 3×4 @ +5, T2B 3×8. Testblock verschiebt sich um eine Woche. Load-RPE-Cap 7.",
            "u34": "Session entfällt — Mobility bis RPE 6, oder Ruhe."
          }
        },
        {
          "iso_date": "2026-09-10",
          "day_type": "own",
          "focus": "A",
          "focus_label": "Weightlifting-Fokus",
          "kurzform": "Drop Snatch, Snatch, FS, Core",
          "blocks": [
            {
              "block_id": "A",
              "prio": "required",
              "title": "Drop Snatch",
              "min": 20,
              "superset": false,
              "exercises": [
                {
                  "ex_id": "drop_snatch",
                  "kurz": "Drop Snatch",
                  "name": "Drop Snatch",
                  "class": "generic",
                  "target": {
                    "mode": "kg",
                    "sets": 3,
                    "reps": 3,
                    "kg": 45,
                    "ramp": [
                      40,
                      42.5,
                      45
                    ],
                    "rpe_cap": 6,
                    "tempo": "schnell unter die Stange",
                    "rest": "90 sec"
                  },
                  "whoop": "Drop Snatch",
                  "warum": "Aus dem Stand die Stange auf den Schultern, dann so schnell wie möglich unter sie fallen und tief fangen. Leichte Last mit Absicht: geübt wird der Weg nach unten, nicht das Gewicht. Genau die Bewegung, die im Video 3,1 Sekunden gedauert hat."
                }
              ]
            },
            {
              "block_id": "B",
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
                    "sets": 5,
                    "reps": 1,
                    "kg": 57.5,
                    "ramp": [
                      45,
                      50,
                      55,
                      57.5
                    ],
                    "rpe_cap": 7,
                    "tempo": "explosiv",
                    "rest": "2 min"
                  },
                  "whoop": "Snatch",
                  "warum": "Singles unter der Ceiling, bewusst tief empfangen — nicht hoch fangen und dann absitzen. Fünf Sätze auf vier Stufen: die 57,5 nimmst du zweimal. Kein 60 und kein Ceiling-Versuch heute, die 60 steht seit letzter Woche — gearbeitet wird an der Position darunter."
                }
              ]
            },
            {
              "block_id": "C",
              "prio": "required",
              "title": "Front Squat",
              "min": 18,
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
                    "reps": 1,
                    "kg": 105,
                    "ramp": [
                      85,
                      95,
                      100,
                      102.5,
                      105
                    ],
                    "rpe_cap": 8,
                    "tempo": "31X1",
                    "rest": "3 min"
                  },
                  "whoop": "Front Squat",
                  "warum": "Einzelversuche bis 105 — das wäre ein neuer Bestwert über die 102,5 aus W30 und der Korridor, der seit dem Blockstart offen ist. Abbruchkriterium ist die Rack-Position: kippen die Ellbogen, ist der Satz vorbei. 107,5 nur, wenn 105 sich wie höchstens 8 von 10 anfühlt."
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
                  "warum": "Unterer Rücken bleibt fest am Boden, Spannung aus der Körpermitte, ruhig atmen."
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
                  "warum": "Zwei Kurzhanteln à 10 kg, kontrolliert, keine Failure-Sätze."
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
                  "warum": "Overhead-Enge nach der Snatch-Arbeit lösen."
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
            105
          ],
          "zeit_spanne": [
            61,
            84
          ],
          "recovery_day": {
            "u50": "FS endet bei 100, kein 105. Snatch-Singles enden bei 55, Video verschiebt sich. Load-RPE-Cap 7.",
            "u34": "Nur Technik mit leichter Stange und Mobility bis RPE 6 — oder Ruhe."
          }
        },
        {
          "iso_date": "2026-09-11",
          "day_type": "rest",
          "warum": "Ruhetag. „McGhee\" wäre 30 Minuten Deadlifts einen Tag nach dem schweren Front Squat und Push-ups zwei Tage nach dem HSPU-Test — beides auf müdem Material. Der Samstag ist der bessere Box-Tag."
        },
        {
          "iso_date": "2026-09-12",
          "day_type": "box",
          "einheit": "Squat Clean and Jerk 10 Rounds For Time",
          "sub": "10 Rd · 3 Squat Clean and Jerks + 20 Double Unders · 13 Min Cap",
          "wod": [
            {
              "struktur": "10 Runden auf Zeit · 13 Min Cap",
              "bewegungen": [
                {
                  "reps": "3",
                  "name": "Squat Clean and Jerk",
                  "detail": "60 kg · saubere Singles"
                },
                {
                  "reps": "20",
                  "name": "Double Unders",
                  "detail": "oder 40 Single Unders"
                }
              ]
            }
          ],
          "warum": "Level 2 mit 60 Kilo. Das sind gut 70 Prozent deines Komplex-Bestwerts, also technisch machbar, auch mit müden Beinen vom Donnerstag. Die drei Wiederholungen pro Runde als einzelne saubere Lifts, nicht am Stück — bei dieser Last kostet touch-and-go mehr Technik als es Zeit spart. Das Banded-Squat-Stück vorher lässt du weg."
        },
        {
          "iso_date": "2026-09-13",
          "day_type": "rest",
          "warum": "Reisetag nach Charlotte. Kein Training. Die Reisewoche planen wir separat, sobald du weißt, was vor Ort geht."
        }
      ]
    }
  ]
};
