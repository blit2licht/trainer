# Trainer 3.0 — W35-Datenmodell, Entwurfsstand 2026-08-22

Konsolidiert die Schema-Anforderungen aus `handy-konzept.md` (§Schema-Anforderungen),
`werkstatt-konzept.md`, `entscheidungen-2026-08-22.md` und `uebergabe-opengym-trainer-3.0.md` (§5).
Bei Widerspruch gilt: Entscheidungen 2026-08-22 > Übergabe > dieses Dokument, außer wo
hier ausdrücklich „entschieden in dieser Session" steht.

Status-Legende wie Übergabe: `entschieden` (bauen) / `Vorschlag` (in dieser Session
entworfen, von Martin noch nicht bestätigt) / `offen`.

---

## 0. Dateiübersicht (wer erzeugt was)

```
coach/exercises.json          Registry — handgepflegt, ~20 Einträge         [NEU]
coach/plan/2026-Wxx.json      Planquelle je Woche — Claude schreibt beim
                              Planungs-Commit; trägt ALLE Prosa             [NEU]
website/data.js               Handy-Payload — GENERIERT aus Planquelle +
                              Registry, nur Vollzugsdaten, nur aktuelle
                              Woche; Name bleibt (Deployment-Check)         [UMBAU]
Website-DB: verdicts          Verdict-Tabelle + save_verdict.php (Secret)
                              + get_verdicts.php                            [NEU]
coach/derived.json            Ableitungs-Cache — generiert, nie von Hand
                              (Übergabe 5.4, unverändert)                   [NEU]
website/derived.js            Werkstatt-Payload — generiert aus derived.json
                              + Plan-Archiv + wellness/weight               [NEU]
scripts/build_payload.py      Planquelle+Registry → website/data.js         [NEU]
scripts/derive_state.py       Ist-Kanäle → derived.json + website/derived.js
                              (Übergabe 5.6, um Export erweitert)           [NEU]
```

Prinzip (Entscheid 11 präzisiert): **Quelle speichert einmal, Payload leitet ab.**
Wochenlisten-Kurzform, Lastspanne „40–60 kg", Zeitspanne „40–65 min" werden vom
Generator aus den Targets/Blockzeiten berechnet, nie redundant gespeichert.
Status: Vorschlag (Dateizuschnitt), Generierung selbst entschieden (Entscheid 11).

---

## 1. Registry `coach/exercises.json`

Ein Eintrag pro Übung, handgepflegt, bewusst klein:

```json
{
  "ex_id": "ohs",
  "name": "Overhead Squat",
  "kurz": "OHS",
  "aliases": ["Overhead Squat", "Pause OHS", "Pause Overhead Squat"],
  "class": "technical",
  "increment": 2.5,
  "rep_cap_e1rm": 3,
  "pattern": ["squat", "overhead"]
}
```

- `kurz` = Kurzname für die Wochenlisten-Kurzform (Schema-Anforderung 2).
- `aliases` enthalten die exakten WHOOP-Library-Namen (Paste-Mapping, Übergabe 5.1).
- `pattern` optional (Muster-Balance, Übergabe 1.10 — Idee).

**`skill`-Einträge tragen die Treppe** (Entscheid 8 — aus `profile.json
gymnastics_testprotokoll.progressionstreppen` überführt, keine Neuerfindung):

```json
{
  "ex_id": "bmu",
  "name": "Bar Muscle-Up",
  "kurz": "BMU",
  "aliases": ["Bar Muscle Up"],
  "class": "skill",
  "ladder": {
    "steps": ["5x2 unbroken", "4x3", "3x3 + 1xmax", "test"],
    "confirmed_step": 0,
    "confirmed_at": "2026-08-22",
    "regeln_ref": "coach/profile.json gymnastics_testprotokoll.regeln"
  }
}
```

`confirmed_step` ist der Werkstatt-Währungswert („Stufe 1/4"). Die Treppenregeln
(eine Stufe/Woche, Unterbrechungsregel usw.) bleiben in `profile.json` — Registry
referenziert nur.

**Neue Klasse `generic`** (löst Schema-Anforderung 7 — jeder Block loggbar):
Verdict-only-Einträge ohne Engine, ohne e1RM, ohne Treppe. Damit bleibt die
Verdict-Tabelle uniform (`iso_date`, `ex_id`).

Entwurf der Einträge (~20):

| ex_id | kurz | class | increment | rep_cap | Bemerkung |
|---|---|---|---|---|---|
| snatch | Snatch | technical | 2.5 | 3 | Ceiling-geführt |
| clean_jerk | C&J | technical | 2.5 | 3 | Komplex; Ceiling-geführt |
| ohs | OHS | technical | 2.5 | 3 | Pause-Variante via Alias |
| front_squat | FS | technical | 2.5 | 3 | Martin-Entscheid 22.08.: technical — Ceiling-geführt in Blöcken, kein mechanischer Deload |
| push_press | PP | loadable | 2.5 | 12 | |
| rdl | RDL | loadable | 5 | 12 | großer Hinge → increment 5 |
| hspu_strict | HSPU | skill | — | — | Treppe 4×5→…→4×8→Test |
| wpu | PU | skill | — | — | Martin-Entscheid 22.08.: skill mit Treppe (3×3→3×4→3×5 @ +5 → Test 6); Zusatzlast via target `bw_plus` |
| t2b | T2B | skill | — | — | Treppe 3×7→…→3×10→Test |
| bmu | BMU | skill | — | — | Treppe s. oben |
| hollow_hold | Core | generic | — | — | Zeit-Modus |
| layer_delts_bizeps | Layer | generic | — | — | Hypertrophie-Layer A-Tag |
| layer_brust_trizeps | Layer | generic | — | — | Hypertrophie-Layer B-Tag |
| mobility | Mobility | generic | — | — | Cool-down |
| bmu_primer | Primer | generic | — | — | Frequenzkontakt, nie Treppe |
| bmu_drill | Drill | generic | — | — | Descent-/Timing-Drills |

(WPU als `skill` statt `loadable` — Martin-Entscheid 22.08.: die Stufenregeln
(eine Stufe/Woche, Rückstufung, Unterbrechungsregel) steuern das Verhalten,
nicht die 2×Hit→+2,5-Regel. Abweichung von der Übergabe-Liste 2.2 dokumentiert.)

Status: entschieden 22.08. (Klassen FS/WPU von Martin bestätigt); Rest der Liste
+ generic-Klasse + ladder-Feld: Vorschlag; Registry selbst entschieden (5.1).

---

## 2. Planquelle `coach/plan/2026-Wxx.json`

Ersetzt das handgeschriebene `data.js` als Wahrheit. Trägt alle Prosa
(`warum`, `note`, `intro`, `plan_note`), die das Handy nie erreicht (§2b).

```json
{
  "id": "2026-W35",
  "label": "Woche 4 · 24.–30. August 2026",
  "meso": "Meso 3 · Woche 4",
  "phase": "FS-Block Teil 2 …",
  "days": [
    {
      "iso_date": "2026-08-26",
      "day_type": "own",
      "focus": "A",
      "focus_label": "Oly-Fokus",
      "plan_note": "Coach-Prosa — erreicht das Handy nie.",
      "recovery_day": { "u50": "…", "u34": "…" },
      "blocks": [
        {
          "block_id": "B",
          "prio": "required",
          "min": 16,
          "title": "Squat Snatch — Singles",
          "superset": false,
          "exercises": [
            {
              "ex_id": "snatch",
              "target": {
                "mode": "kg", "sets": 7, "reps": 1,
                "kg": 60, "ramp": [40,45,50,52.5,55,57.5,60],
                "optional_top": 62.5,
                "rpe_cap": 8, "tempo": "X", "rest": "E1:30-2:00"
              },
              "warum": "Ceiling 60 zweite Reproduktion W34 sauber; …",
              "note": "Coach-Prosa — erreicht das Handy nie."
            }
          ]
        }
      ]
    },
    {
      "iso_date": "2026-08-27",
      "day_type": "box",
      "wod": { "…": "Box-Tage strukturell wie bisher; außerhalb der Engine (Entscheid 9)" }
    }
  ]
}
```

Regeln:

- **`focus_label`** am Tag (Schema-Anforderung 1). Wochenliste zeigt
  `focus_label` + Kurznamen der required-Blöcke (generiert).
- **Titel bleiben sauber** — Klammerzusätze wie „(Stufe wiederholt)" gehören in
  `note`/`warum`, nie in `title` (Schema-Anforderung 5). Der Generator übernimmt
  Titel wörtlich; Lint im Build: Klammern im Titel = Warnung.
- **`warum` Pflicht** an jeder Fokus-Übung (maschinenerzeugt aus der Ableitung,
  Übergabe 5.2); Handy-Payload strippt es (handy-konzept §2).
- **`superset: true` am Block**: Rest steht dann am Block und gilt dem Paar,
  Übungen tragen keinen eigenen Rest (Schema-Anforderung 3). Darstellung
  (Amber-Klammer) ist Sache des Frontends.
- **Box-Tage** behalten die heutige `wod`-Struktur; keine `ex_id`/`target`s,
  keine Verdicts (Entscheid 9). `session_feel` bleibt dort Rückkanal —
  Erfassungsort weiter offen (Schema-Anforderung 6); Kandidat: Notiz-Textfeld
  wie heute, kein neues UI-Element in W35.
- **Fokus-Tage haben kein `session_feel` mehr** — Verdict je Übung ersetzt es
  (Schema-Anforderung 6, entschieden am Clickdummy).

Status: Vorschlag (Struktur); Prosa-Trennung und warum-Pflicht entschieden.

---

## 3. `target`-Objekt — Modi (löst OFFEN 6.3)

Prinzip 1.7: explizites `mode`-Feld, Parser rät nie. Gemeinsame Felder:
`sets`, `reps` (Zahl **oder** `[min,max]` für Rep-Ranges — Schema-Vorhalt für
Doppelprogression OFFEN 6.7, Logik dort weiter offen), `rpe_cap`, `tempo`, `rest`,
`unbroken` (bool, Default false), `interval` (z. B. `"E1:30"`, orthogonal zum Modus).

| mode | Pflichtfelder | Beispiel | Handy-Anzeige |
|---|---|---|---|
| `kg` | `kg` (Zielsatz); optional `ramp[]`, `optional_top` | Snatch, OHS, RDL | „7 × 1 @ 60 kg", Teststreifen aus `ramp` |
| `bw` | — | BMU 5×2, T2B, HSPU | „5 × 2 @ BW" |
| `bw_plus` | `kg` = **Zusatzlast** | WPU +5 | „3 × 5 @ +5 kg" — nie Tages-Kennzahl (Abnahme-Regel) |
| `time` | `sec` pro Satz | Hollow Hold 3×30s | „3 × 30 sec" |
| `band` | `band` = Stärke/Farbe | Triceps Ext. „rotes Band" | „3 × 15 @ rotes Band" |
| `rpe` | `rpe_cap` (ist die Vorgabe) | DB Bench Layer | „3 × 12 · RPE-kalibriert" |

Der Trenner ist **nicht** modusabhängig: Lastangaben bis 12 Zeichen stehen
inline als „@ ‹Last›", längere als „· ‹Last›" (Renderer, `exerciseMarkup`).

- **`band`** (Schema-Anforderung 4): Wert ist ein freier String der Box-Realität
  („rot", „grün", „leicht"). Keine kg-Äquivalenz, keine Engine-Logik — `band`-Targets
  sind nie `loadable`-progressionsfähig.
- **`rpe`** (ergänzt 24.08. nach Code-Review): Last wählt Martin selbst, der
  `rpe_cap` ist die Vorgabe — typisch für Rekompositions-Layer. Vorher stand
  dafür `mode:"kg"` ohne `kg`, was am Handy eine Zeile ganz ohne Lastangabe
  erzeugte. `build_payload.py` lintet jetzt jeden Modus gegen seine
  Pflichtfelder, `mode:kg` ohne Wert ist eine Warnung.
- EMOM/Intervall ist **kein** Modus: `interval` + beliebiger Modus
  (Beispiel Komplex: `mode:"kg"`, `interval:"E2:00"`).
- Tages-Lastspanne der Wochenkarte = min/max aller `mode:"kg"`-Targets des Tages
  (Generator); `bw_plus`-Zusatzlasten fließen nie ein.

Status: Vorschlag → mit Abnahme dieses Dokuments entschieden.

---

## 4. Verdict-Kanal (DB + Endpoints)

Übergabe 5.3, konkretisiert:

```sql
CREATE TABLE verdicts (
  iso_date    DATE NOT NULL,
  ex_id       VARCHAR(32) NOT NULL,
  verdict     ENUM('hit','miss') NOT NULL,
  miss_reason ENUM('technik','last') DEFAULT NULL,  -- nur class technical
  source      ENUM('button','whoop_derived','recap_answer') NOT NULL DEFAULT 'button',
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (iso_date, ex_id)
);
```

- Last-write-wins über den PRIMARY KEY (REPLACE/UPSERT).
- `save_verdict.php`: Shared Secret (Entscheid 7), Secret im localStorage;
  Antwort = gespeicherter Zeilenstand → Handy zeigt **Serverstand**, nie
  Tap-Annahme (handy-konzept §1).
- `get_verdicts.php`: Read-Endpoint analog `get_notes.php` (Entscheid 3);
  Parameter `from`/`to` (iso_date-Bereich). Seite lädt damit beim Öffnen den
  Zustand der aktuellen Woche zurück (inkl. Nachtrag-Anzeige „offen" für
  vergangene Fokus-Tage, handy-konzept §3).
- `unknown` ist **kein DB-Wert** — es ist die Abwesenheit einer Zeile
  (Übergabe 2.1: unknown = kein Verdict vorhanden). Abgeleitet, nie gespeichert.
- **Rücknahme (Nachtrag 23.08.):** `save_verdict.php` akzeptiert zusätzlich
  `verdict:'clear'` und löscht die Zeile — zurück auf unknown. Rücknahme-Kanal
  für Fehltaps am Handy; kein eigener Delete-Endpoint.
- **Ersetzt die vertagte `blocks_done`-Migration vollständig** — der dort
  geplante Erledigt-Rückkanal (ALTER TABLE, vertagt 20.08.) wird nicht mehr
  gebaut; „Block erledigt" entfällt zugunsten des Übungs-Verdicts (Entscheid 4).

Status: entschieden (Übergabe 5.3 + Entscheide 3/7); unknown-als-Abwesenheit
und blocks_done-Ablösung = Vorschlag dieser Session.

---

## 5. Handy-Payload `website/data.js` (generiert)

Nur Vollzugsdaten. **Revision 23.08. (Martin):** Der Payload trägt nicht mehr
strikt nur die aktuelle Woche, sondern jede Planwoche, deren `bis` beim Bau
noch nicht vorbei ist — praktisch die laufende plus die bereits gebaute
Folgewoche (`weeks[]`, `week` bleibt als erste Woche für den Deployment-Check).
Grund ist ein Datenverlust, kein Komfort: Wird die Folgewoche am Samstag
veröffentlicht, ersetzte der Ein-Wochen-Payload die laufende Woche komplett
und das Handy verlöre deren Resttage. Die Auswahl passiert deshalb zur
**Anzeigezeit** (Woche, in der HEUTE liegt), nicht zur Bauzeit; die Kopfzeile
bietet die Vorschau auf die Folgewoche. Vergangene Wochen bleiben draußen —
„keine Wochenrückschau am Handy" (§2b) gilt unverändert.

Struktur (eine Woche):

```js
const DATA = {
  week: {
    id: "2026-W35", von: "2026-08-24", bis: "2026-08-30",
    days: [
      { iso_date: "2026-08-26", day_type: "own", focus_label: "Oly-Fokus",
        kurzform: "Snatch, OHS",          // generiert aus required-Blöcken
        last_spanne: [40, 60],            // generiert, nur mode:kg
        zeit_spanne: [45, 70],            // generiert aus block.min
        blocks: [
          { block_id: "B", prio: "required", title: "Squat Snatch — Singles",
            superset: false,
            exercises: [
              { ex_id: "snatch", kurz: "Snatch",
                target: { mode:"kg", sets:7, reps:1, kg:60,
                          ramp:[40,45,50,52.5,55,57.5,60], optional_top:62.5,
                          rpe_cap:8, tempo:"X", rest:"E1:30-2:00" } }
            ] }
        ] },
      { iso_date: "2026-08-27", day_type: "rest" }
    ]
  }
};
```

Was der Generator **strippt**: `note`, `intro`, `plan_note`, Wochen-Archiv,
Regeln/Glossar-Prosa (Regeln bleiben als `recovery_day`-Kurzform je Fokus-Tag,
sonst nichts). **Revision 23.08. (Martin):** `warum` wandert MIT und ist am
Handy ausklappbar („Begründung"), nie offen gerendert — Ausnahme von der
Content-Diät. Box-/Ride-Tage tragen `einheit`/`sub`/`wod` (DreamWOD-Kerninfos
wie 2.x, Tag-Klick öffnet die Detailansicht). Was er **anreichert**: `kurz`
aus der Registry, generierte Spannen/Kurzformen. Deployment-Check (CLAUDE.md) bleibt gültig:
`data.js` liefert weiter die aktuelle Wochen-ID.

Status: Vorschlag (Feldnamen); Content-Diät und Nur-aktuelle-Woche entschieden (§2b).

---

## 6. Werkstatt-Export `website/derived.js` (generiert) — löst Konflikt 2

**ENTSCHIEDEN (Martin, 22.08.): Weekly.** Der Diff entsteht beim Weekly-Paste
(Recap-Commit regeneriert `derived.json` + `website/derived.js`); sein Ort ist
die Werkstatt. Der Handy-Diff-Slot bleibt reserviert und in W35 leer.
Herleitung:

Ein Diff „82,5 → 80" braucht die **Ist-Last**. Die existiert in genau einem Kanal:
WHOOP-Weekly-Paste (Entscheid 4.1, kein Doppel-Logging — der Verdict-Button trägt
hit/fail + miss_reason, nie kg). Ableitung läuft nur in Claude-Sessions
(Übergabe 2.6). Damit gilt hart:

- **Diff am Trainingstag** wäre nur möglich mit (a) täglicher Claude-Session
  nach dem Training (unrealistische Pflicht) oder (b) einem neuen
  Same-Day-Lastkanal am Verdict-Button (ein Zahlenfeld bei Fail-Last —
  minimaler Bruch von 4.1, aber Bruch). Beides neue Infrastruktur.
- **Diff mit Weekly-Paste** braucht nichts Neues: `derive_state.py` läuft beim
  Recap, schreibt `derived.json` + `website/derived.js`. Der Diff ist dann
  Wochenrückblick — und gehört damit laut §2b ohnehin NICHT aufs Handy
  (keine Wochenrückschau am Handy). Sein Ort ist die Werkstatt
  (Sektion Soll/Ist-Muster). Der im Handy-Layout reservierte Diff-Platz
  (handy-konzept §4) bleibt reserviert, wird aber in W35 nicht befüllt —
  die Seite funktioniert laut Konzept vollständig ohne.

Begründung des Entscheids: Der Trainingstag-Diff löst kein Ausführungsproblem
(beim Training weiß Martin, was er gehoben hat); er löst ein Auswertungsproblem,
und Auswertung ist der Werkstatt-Raum. Option (b) bleibt später additiv möglich,
ohne dass sich am Schema etwas ändert (Diff-Felder sind ab Tag 1 im Export).

Exportinhalt (generiert aus `derived.json` + Plan-Archiv + wellness/weight):

```js
const DERIVED = {
  derived_at: "2026-08-30T19:40:00+02:00",
  meso: { id: "Meso 3", ziele: ["snatch","clean_jerk","ohs","front_squat","bmu","wpu","hspu_strict","t2b","gewicht"] },
  exercises: { /* je ex_id: Klasse-Währung (e1RM-Serie | ceiling-Daten | ladder-Stand),
                  verdict-Historie, prescriptions mit why, soll_ist: [{iso_date, soll, ist, status}] */ },
  gewicht: { /* Wochenschnitte aus weight.json */ },
  regel_treue: { /* Recovery-Gate-Abgleich, snooze_until */ }
};
```

`soll_ist.status` ∈ `erfuellt | abgewichen | offen` (Konzept-Dreiwert).
Quelle der „aktiven Meso-Ziele" (Werkstatt offen): **Vorschlag `state.json`
Meso-Kontext** (aktuelle_foki + Körperkomposition), keine neue Markierung in
profile.json — eine Quelle weniger.

Status: Diff-Timing entschieden (22.08.); Exportinhalt/Feldnamen Vorschlag.

---

## 7. Bau-Reihenfolge W35 (Vorschlag)

Parallel-Lauf-Timing ist entschieden (Übergabe 4.4): Bau W35, Erprobung ≥W36,
scharf zum Meso-4-Start.

1. `coach/exercises.json` (Registry) — blockiert alles andere.
2. Verdict-Tabelle + `save_verdict.php` (mit Secret) + `get_verdicts.php`.
3. `coach/plan/2026-W35.json` als erste echte Planquelle + `build_payload.py`
   → neues `data.js`; Handy-Frontend (V3.0/handy.html-Stand) dagegen.
4. `derive_state.py` Phase 1 (Report-only, Vergleich gegen load_references).
5. `website/derived.js`-Export + Werkstatt-Seite (Konflikt 2 entschieden: Weekly).

Offen bleibt (unverändert): WHOOP-Paste-Format (reales Sample nötig, OFFEN 6.1),
Doppelprogressions-Logik (6.7), Sync-Details Offline-Puffer (6.5),
session_feel-Erfassungsort Box-Tage.
