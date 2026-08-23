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
        "day_type": "box",
        "wod": {
          "_placeholder": "aus DreamWOD zu ziehen (Neue-Woche-Session)"
        }
      },
      {
        "iso_date": "2026-08-25",
        "day_type": "box",
        "wod": {
          "_placeholder": "aus DreamWOD zu ziehen (Neue-Woche-Session)"
        }
      },
      {
        "iso_date": "2026-08-26",
        "day_type": "own",
        "focus": "A",
        "focus_label": "Weightlifting-Fokus",
        "kurzform": "Primer, FS, C&J",
        "blocks": [
          {
            "block_id": "A",
            "prio": "required",
            "title": "BMU-Primer",
            "min": 5,
            "superset": false,
            "exercises": [
              {
                "ex_id": "bmu_primer",
                "kurz": "Primer",
                "class": "generic",
                "target": {
                  "mode": "bw",
                  "sets": 4,
                  "reps": 2,
                  "rpe_cap": 7
                }
              }
            ]
          },
          {
            "block_id": "B",
            "prio": "required",
            "title": "Front Squat — Block Teil 2",
            "min": 20,
            "superset": false,
            "exercises": [
              {
                "ex_id": "front_squat",
                "kurz": "FS",
                "class": "technical",
                "target": {
                  "mode": "kg",
                  "sets": 5,
                  "reps": 3,
                  "kg": 95,
                  "ramp": [
                    60,
                    70,
                    80,
                    87.5,
                    95
                  ],
                  "rpe_cap": 8,
                  "tempo": "kontrolliert",
                  "rest": "3:00"
                }
              }
            ]
          },
          {
            "block_id": "C",
            "prio": "required",
            "title": "Clean & Jerk — Reclaim 82,5",
            "min": 18,
            "superset": false,
            "exercises": [
              {
                "ex_id": "clean_jerk",
                "kurz": "C&J",
                "class": "technical",
                "target": {
                  "mode": "kg",
                  "sets": 6,
                  "reps": 1,
                  "kg": 82.5,
                  "ramp": [
                    60,
                    65,
                    70,
                    75,
                    80,
                    82.5
                  ],
                  "optional_top": null,
                  "rpe_cap": 8,
                  "tempo": "X",
                  "rest": "E2:00",
                  "interval": "E2:00"
                }
              }
            ]
          },
          {
            "block_id": "D",
            "prio": "optional",
            "title": "Hypertrophie-Layer Delts/Bizeps",
            "min": 15,
            "superset": false,
            "exercises": [
              {
                "ex_id": "lateral_raise",
                "kurz": "Lateral Raise",
                "class": null,
                "target": {
                  "mode": "kg",
                  "sets": 3,
                  "reps": 12,
                  "kg": 14,
                  "rpe_cap": 7
                }
              },
              {
                "ex_id": "biceps_curl",
                "kurz": "Biceps Curl",
                "class": null,
                "target": {
                  "mode": "kg",
                  "sets": 3,
                  "reps": 12,
                  "kg": 24,
                  "rpe_cap": 7
                }
              }
            ],
            "verdict_ex_id": "layer_delts_bizeps",
            "verdict_class": "generic"
          },
          {
            "block_id": "E",
            "prio": "optional",
            "title": "Core + Mobility",
            "min": 5,
            "superset": false,
            "exercises": [
              {
                "ex_id": "hollow_hold",
                "kurz": "Core",
                "class": "generic",
                "target": {
                  "mode": "time",
                  "sec": 30,
                  "sets": 3
                }
              },
              {
                "ex_id": "mobility",
                "kurz": "Mobility",
                "class": "generic",
                "target": {
                  "mode": "time",
                  "sec": 300
                }
              }
            ]
          }
        ],
        "last_spanne": [
          60,
          95
        ],
        "zeit_spanne": [
          43,
          63
        ],
        "recovery_day": {
          "u50": "Load-RPE-Cap 7, kein neues Top-Gewicht, letzter Steigerungssatz entfällt.",
          "u34": "Nur Technik-/Mobility-Arbeit bis RPE 6 — oder Ruhe."
        }
      },
      {
        "iso_date": "2026-08-27",
        "day_type": "box",
        "wod": {
          "_placeholder": "aus DreamWOD zu ziehen (Neue-Woche-Session)"
        }
      },
      {
        "iso_date": "2026-08-28",
        "day_type": "rest"
      },
      {
        "iso_date": "2026-08-29",
        "day_type": "own",
        "focus": "B",
        "focus_label": "Gymnastics-Fokus",
        "kurzform": "BMU, HSPU, PU, T2B",
        "blocks": [
          {
            "block_id": "A",
            "prio": "required",
            "title": "Bar Muscle-up — Linked Doubles",
            "min": 14,
            "superset": false,
            "exercises": [
              {
                "ex_id": "bmu",
                "kurz": "BMU",
                "class": "skill",
                "target": {
                  "mode": "bw",
                  "sets": 5,
                  "reps": 2,
                  "unbroken": true,
                  "rpe_cap": 8
                }
              }
            ]
          },
          {
            "block_id": "B",
            "prio": "required",
            "title": "Strict HSPU — konsolidieren",
            "min": 12,
            "superset": false,
            "exercises": [
              {
                "ex_id": "hspu_strict",
                "kurz": "HSPU",
                "class": "skill",
                "target": {
                  "mode": "bw",
                  "sets": 4,
                  "reps": 8,
                  "rpe_cap": 8
                }
              }
            ]
          },
          {
            "block_id": "C",
            "prio": "required",
            "title": "Weighted Pull-up — Stufe zementieren",
            "min": 12,
            "superset": false,
            "exercises": [
              {
                "ex_id": "wpu",
                "kurz": "PU",
                "class": "skill",
                "target": {
                  "mode": "bw_plus",
                  "sets": 3,
                  "reps": 4,
                  "kg": 5,
                  "rpe_cap": 8
                }
              }
            ]
          },
          {
            "block_id": "D",
            "prio": "required",
            "title": "Toes-to-Bar — Volumen",
            "min": 8,
            "superset": false,
            "exercises": [
              {
                "ex_id": "t2b",
                "kurz": "T2B",
                "class": "skill",
                "target": {
                  "mode": "bw",
                  "sets": 3,
                  "reps": 10,
                  "rpe_cap": 7
                }
              }
            ]
          },
          {
            "block_id": "E",
            "prio": "optional",
            "title": "Hypertrophie-Layer Brust/Trizeps",
            "min": 15,
            "superset": false,
            "exercises": [
              {
                "ex_id": "db_bench",
                "kurz": "DB Bench Press",
                "class": null,
                "target": {
                  "mode": "kg",
                  "sets": 3,
                  "reps": 12,
                  "kg": 45,
                  "rpe_cap": 7
                }
              },
              {
                "ex_id": "triceps_ext",
                "kurz": "Triceps Extension",
                "class": null,
                "target": {
                  "mode": "band",
                  "band": "rotes Band",
                  "sets": 3,
                  "reps": 15
                }
              }
            ],
            "verdict_ex_id": "layer_brust_trizeps",
            "verdict_class": "generic"
          }
        ],
        "zeit_spanne": [
          46,
          61
        ],
        "recovery_day": {
          "u50": "Load-RPE-Cap 7, keine neue Stufe testen, letzter Steigerungssatz entfällt.",
          "u34": "Nur Technik-/Mobility-Arbeit bis RPE 6 — oder Ruhe."
        }
      },
      {
        "iso_date": "2026-08-30",
        "day_type": "ride",
        "wod": {
          "_placeholder": "Sonntag, optionales Socializing (keine Strength-Daten)"
        }
      }
    ]
  }
};
