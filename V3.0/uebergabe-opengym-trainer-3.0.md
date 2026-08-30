# Übergabe: openGym-Analyse → Trainer 3.0 (Backend/Engine/Datenmodell)

Erstellt: 2026-08-22, claude.ai-Session mit Martin.
Quelle der Analyse: github.com/arvids-unavailable/openGym (React-PWA-Gym-Tracker, Kernlogik in `frontend/src/lib/`). Die Ziel-Session liest openGym NICHT — dieses Dokument ist die einzige Quelle.
Abgrenzung: Keine UI/Design-Themen. Diese liegen der Ziel-Session als `trainer-3.0-konzeptskizze-v2.md` und `ui-briefing-trainer-3.0.md` vor. Zielsystem: Repo `blit2licht/trainer` + Website-DB `training.martinwitte.de` (MariaDB/PHP).

Statuslegende: `entschieden` = von Martin in der Session bestätigt, bauen. `Idee` = analysiert und für sinnvoll befunden, nicht entschieden.

---

## 1. ÜBERNOMMEN

### 1.1 Prescription als pure Funktion der Historie
- Quelle: `progression.js` (Architekturprinzip des gesamten Repos)
- Regel: Es werden keine Fortschritts-Zähler gespeichert. Das nächste Zielgewicht wird bei jeder Ableitung vollständig aus dem Session-Log neu berechnet. Jede Prescription trägt eine maschinenerzeugte Begründung (`why`) mit den Eingangsdaten der Berechnung. Korrektur einer historischen Notiz ändert deterministisch die nächste Empfehlung.
- Status: entschieden

### 1.2 Lineare Progression für einfache Lifts
- Quelle: `progression.js`
- Regel: Nur für Klasse `loadable`. 2 aufeinanderfolgende Sessions mit Verdict `hit` → Lastvorschlag `+increment` (increment aus Registry, Standard 2,5 kg; große Hinge-Lifts 5 kg). Ergebnis wird auf ladbare Scheibenkombination gesnappt (Snap-Funktion: nächstes Vielfaches von 2,5 kg bzw. des Registry-Increments).
- Status: entschieden

### 1.3 Stall-Deload pro Übung
- Quelle: `progression.js` (`DELOAD_AFTER`, `deloadTo`)
- Regel: `miss_streak >= 3` bei einer `loadable`-Übung → Deload-Vorschlag: `neue_last = snap(alte_last × 0,9)`, mindestens jedoch `alte_last − 1 × increment` (nie mehr als nötig, nie unter einen einzelnen Schritt reduzieren). Kein Wochen-/Kalender-Deload — Deload ist per-Übung und stall-getriggert. Immer Vorschlag, nie Automatik: Commit bleibt beim Coach/Martin.
- Status: entschieden

### 1.4 e1RM-Engine mit Rep-Cap und Quellenangabe
- Quelle: `onerm.js`
- Regel: Epley: `e1RM = w × (1 + r/30)`. Sätze mit `r > rep_cap` fließen nicht ein (`rep_cap` aus Registry: Default 12, Oly-nahe Lifts 3). `r = 1` gilt als Messung, nicht Schätzung. Jeder e1RM-Wert trägt seine Quelle als String (`"64,2 aus 55×3 am 2026-08-19"`). Pro Übung wird eine Zeitserie gehalten → 4-Wochen-Trend.
- Status: entschieden (Serie/Trend-Berechnung); Website-Darstellung ist Phase 2

### 1.5 Snap auf ladbare Schritte
- Quelle: `progression.js`
- Regel: Jede berechnete Last (Progression wie Deload) wird auf die real ladbare Kombination gerundet. Increment ist übungsspezifisch in der Registry hinterlegt (2,5 kg Default, 5 kg für DL/RDL-Klasse), nicht global.
- Status: entschieden

### 1.6 Ehrliche Verdict-Semantik als Progressions-Gate
- Quelle: `progression.js` / `history.js`
- Regel: Last bewegt sich ausschließlich auf Basis expliziter Verdicts. Ein `miss` erhöht nie die Last. Kein Verdict = kein Fortschritt (Details der unknown-Abweichung: siehe 2.1).
- Status: entschieden

### 1.7 Explizite Felder statt impliziter Defaults
- Quelle: `plan-share.js` (Lehrbeispiel dort: Plan ohne `mode`-Feld interpretierte 45-Sekunden-Plank als 45 Reps)
- Regel: Überall, wo Ambiguität teuer ist, explizites Feld statt Konvention: `mode`-artige Unterscheidungen (Reps vs. Sekunden vs. BW vs. kg), `class` pro Übung, `source` pro Verdict. Parser raten nie stillschweigend; Unparsebares landet als Flag im Report (`unparsed`-Liste), nicht in den Daten.
- Status: entschieden

### 1.8 Effort-Normalisierung / „harte Sätze" als Volumenmetrik
- Quelle: `effort.js`
- Regel: RIR und RPE auf eine interne Skala normalisieren (`RPE ≈ 10 − RIR`). Ein Satz gilt als „hart" bei `RIR <= 3` (≙ `RPE >= 7`). Aggregierte Anzeigen (Durchschnitts-Effort) erst ab `n >= 5` bewerteter Sätze. Verwendung in Trainer 3.0: wöchentliche Zählung harter Sätze pro Bewegungsmuster als Recap-Metrik und Input fürs Kollisionsmanagement (Overhead/Grip/Hinge).
- Status: Idee

### 1.9 Template/Instanz-Trennung im Plan
- Quelle: Store-Datenmodell (`week` = Wochen-Template vs. `dayPlan` = Tages-Overlay für Verschiebungen)
- Regel: Der Wochenplan bleibt unangetastet, wenn ein einzelner Tag verschoben/ersetzt wird; die Änderung lebt in einem Overlay-Objekt pro Datum. Geplant-vs-ausgeführt wird dadurch automatisch diffbar. Für Trainer 3.0: Kandidat für ein `data.js`-Schema-Redesign, eher als Teil eines größeren Rewrites.
- Status: Idee

### 1.10 Neglect-Detection / Muster-Balance
- Quelle: `muscles.js` (Alias-Kollaps von 59 Muskel-Schreibweisen auf 18 kanonische, plus „nicht trainiert diese Woche"-Auswertung)
- Regel adaptiert: Statt Muskeln Bewegungsmuster (Squat/Hinge/Push/Pull/Overhead/Carry) als kanonische Kategorien in der Registry; Wochenauswertung, welche Muster unterversorgt sind.
- Status: Idee

---

## 2. ADAPTIERT (Abweichungen von openGym)

### 2.1 unknown statt Miss bei fehlendem Log
- Original (openGym): Nicht abgehakter Satz = Miss; weniger Sätze als geplant = Miss. Fehlende Logs zählen Richtung Deload.
- Abweichung: Dritte Verdict-Kategorie `unknown`. `unknown` ist nie ein Miss, zählt in keine Streak und bewegt die Last in keine Richtung. Fallback-Kette bei fehlendem Verdict: (1) Website-Button prüfen → (2) WHOOP-Paste prüfen, ob Verdict aus Satzdaten ableitbar → (3) sofortige geschlossene Nachfrage im nächsten Recap („<Übung> <Tag>: kein Verdict, nicht in WHOOP — gemacht?"). Martins Antwort schließt die Lücke rückwirkend.
- Begründung: Martins bisherige Praxis enthält „plangemäß angenommen"-Sessions; strenge Miss-Semantik würde rückwirkend falsche Deloads erzeugen. Ein vergessener Log darf keine falsche Trainingsempfehlung produzieren.
- Status: entschieden

### 2.2 Übungsklassen: Automatik nur für technisch einfache Lifts
- Original (openGym): Eine Progressions-Logik für alle Übungen.
- Abweichung: Registry-Feld `class` mit Werten `loadable | technical | skill`. Generelles Prinzip (Martin-Entscheid): Alle Overhead- und Oly-nahen Lifts sind `technical` — Snatch, Clean & Jerk, Overhead Squat, ohne Lastgrenze. `loadable` sind technisch einfache Lifts: Deadlift/RDL, Presses, Strict HSPU, Weighted Pull-up, Accessories. Regeln 1.2/1.3 gelten NUR für `loadable`. Für `technical` liefert die Engine Verdict-Historie und e1RM als Kontext, aber nie eine automatische Prescription; die Lastentscheidung trifft der Coach.
- Begründung: Bei technischen Lifts ist ein Miss meist Technik/Position, nicht Kraft; ein mechanischer −10 %-Deload wäre falsche Intervention.
- Status: entschieden

### 2.3 miss_reason-Verzweigung bei technischen Lifts
- Original (openGym): Miss ist ein einwertiger Zustand.
- Abweichung: Bei `class: technical` trägt ein Miss zusätzlich `miss_reason: technik | last` (Erfassung: dreistufiger Website-Button Hit / Miss-Technik / Miss-Last; die Website ist damit primäre Quelle, Nachfrage nur als Fallback). Verzweigung:
  - `last` → Engine darf die normale Load-Logik als Vorschlag an den Coach anwenden (Wiederholung auf gleicher Last; wiederholte Last-Misses → Deload-Vorschlag).
  - `technik` → Last wird nie angefasst. Engine setzt Technik-Flag mit Vorschlagsoptionen (Drill-Block, Volumenreduktion auf aktueller Last, Video-Diagnose). Eskalation: 2 Technik-Misses in Folge auf derselben Last → automatischer Vorschlag Video-Diagnose (`scripts/analyze_video.py`) statt weiterer Wiederholung.
- Begründung: Martin will die wiederkehrende Coaching-Frage „Technik- oder Lastproblem?" dynamisch im System abgebildet haben.
- Status: entschieden

### 2.4 Recovery-Gate nach der Ableitung
- Original (openGym): Kennt keine Readiness-Daten.
- Abweichung: Zweistufige Pipeline mit fixer Reihenfolge: (1) Historie → Prescription („was wäre fällig"), (2) `coach/wellness.json` (WHOOP via intervals.icu) → Gate („was ist heute klug"). Bestehende Regel unverändert: WHOOP-Recovery < 50 % → kein Steigerungssatz, Load-RPE-Cap 7; < 34 % → Hard-Rest-Prüfung. Die Engine selbst sieht Recovery-Daten nie.
- Begründung: Sonst empfiehlt die Engine an einem gelben/roten Tag ein neues Top-Gewicht.
- Status: entschieden

### 2.5 Ceiling getrennt von e1RM
- Original (openGym): Ein Maximalwert pro Übung (e1RM).
- Abweichung: Zwei getrennte Felder. `ceiling` = coach-gepflegter, technisch sauber bestätigter Bestlift (kg + Bestätigungsdatum[e]), nur bei `technical`-Lifts, wird nie berechnet. `e1rm` = berechneter Schätzwert nach 1.4. Beide dürfen divergieren und werden nie vermischt.
- Begründung: Martins „60 kg Snatch reproduziert" ist ein Technik-Ceiling, kein Kraftmaximum; e1RM aus OHS-Triples misst etwas anderes.
- Status: entschieden

### 2.6 Ableitung zur Planungszeit, nicht zur Laufzeit
- Original (openGym): Prescription wird live in der App beim Öffnen des Workouts berechnet.
- Abweichung: `derive_state.py` läuft nur in Claude-Code-Sessions (Planung/Recap), nie im Gym. Grund ist eine harte Infrastruktur-Grenze: `get_notes.php`/Website-DB ist nur aus Claude Code erreichbar, nicht aus claude.ai. Output ist `coach/derived.json` mit `derived_at`-Timestamp; claude.ai-Sessions lesen den Cache und müssen bei Staleness warnen. Ableitung ist fester Abschluss-Schritt jeder Claude-Code-Session, die Trainingsdaten berührt.
- Begründung: Zwei-Wahrheiten-Problem wird über Cache-Disziplin gelöst statt über Live-Zugriff, der nicht existiert.
- Status: entschieden

---

## 3. VERWORFEN (nicht erneut prüfen)

- **Exercise-Library (1.324 Übungen inkl. GIFs/Medien):** CrossFit-Movements schwach abgedeckt; Trainer braucht ~15 kuratierte Einträge, keine generische Library.
- **Auth-/Sync-Infrastruktur (Passkeys, Node-Sync-Server, Multi-Device):** Ein-Nutzer-System mit GitHub + IONOS-PHP; löst ein Problem, das nicht existiert.
- **PWA-/Self-Hosting-Stack (Docker, Service Worker, Push/VAPID, Wakelock):** UI-/Betriebs-Schicht, für das Claude-mediierte Setup irrelevant.
- **Superset-/Circuit-Modellierung:** Fokus-Tage sind sequenzielle Blöcke; keine Anforderung.
- **i18n (10+ Locales):** Ein Nutzer, eine Sprache.
- **CSV-Import fremder Tracker (`import-csv.js`):** Historie kommt aus eigener DB + WHOOP; kein Fremdimport geplant.
- **Strenge Unlogged=Miss-Semantik:** explizit geprüft und durch 2.1 ersetzt.
- **intervals.icu als Satzdaten-Kanal:** bereits früher real geprüft — API überträgt nur Strain, keine Übung/Last. Nicht erneut evaluieren.

---

## 4. EIGENE IDEEN (nicht aus openGym, in der Session entstanden)

### 4.1 Zwei-Kanal-Ist-Erfassung (Verdict-Button + WHOOP-Paste)
- Regel: Kein Doppel-Logging. Kanal 1 (Verdict): Button auf der Website pro Fokus-Übung, persistiert über neuen Endpoint `save_verdict.php` in der Website-DB; zweistufig bei `loadable` (Hit/Miss), dreistufig bei `technical` (Hit/Miss-Technik/Miss-Last). Kanal 2 (Lastdetails): bestehender WHOOP-Weekly-Paste (Strength Trainer, Library-Namen) bleibt einziger Satz-Kanal; `derive_state.py` parst ihn und mappt Namen über Registry-Aliasse auf `ex_id`. Website-Notizen (`save_note.php`) bleiben Freitext-Kontext, nie Satzquelle.
- Herkunft: Martins Vorschlag (Button) + gemeinsame Kanaltrennung.
- Status: entschieden

### 4.2 Offline-Fallback für Verdicts
- Regel: Der heutige „Erledigt"-Zustand lebt nur im Browser-Cache (bestätigt: kein DB-Write). Neubau: Button schreibt in die DB; lokaler Cache bleibt als Offline-Puffer (Gym-Funkloch) und synct nach, sobald Netz da ist. Konfliktauflösung: last-write-wins pro (isoDate, ex_id).
- Status: entschieden (Sync-Detailverhalten: siehe OFFEN 6.5)

### 4.3 Technik-Eskalation an Video-Pipeline koppeln
- Regel: Siehe 2.3 — 2× `miss_reason: technik` auf derselben Last → Vorschlag Video-Diagnose über das bereits spezifizierte `scripts/analyze_video.py` (MediaPipe-Pose; Modi für BMU und Snatch existieren als Spec).
- Status: entschieden

### 4.4 Parallel-Lauf als Migrationsmuster
- Regel: Phase 1 = Read-only-Betrieb: `derive_state.py` erzeugt Report, der gegen die handgepflegten `load_references` in `state.json` verglichen wird; erst nach bestandenem Vergleich wird `derived.json` scharf geschaltet und `load_references` durch einen Verweis ersetzt. Alt-Historie ohne Targets: gegen den damaligen Plan aus dem `data.js`-Archiv bewerten, wo vorhanden; sonst `unknown`.
- Status: entschieden. Timing (Martin-Entscheid): Bau in W35; Erprobung frühestens W36 (gekoppelt an Website-Redesign, das parallel bei einem Designer liegt); Scharfschaltung zum Meso-4-Start nach dem W37-Review.

---

## 5. DATENMODELL-ENTSCHEIDUNGEN

### 5.1 `coach/exercises.json` — Registry (neu, klein, handgepflegt)
Pro Eintrag: `ex_id` (stabiler Slug), Anzeigename, `aliases` (inkl. exakter WHOOP-Library-Namen fürs Paste-Mapping), `class` (`loadable | technical | skill`), `increment` (kg), `rep_cap_e1rm` (Default 12, Oly 3), Bewegungsmuster-Tags (für 1.10, optional). Umfang bewusst ~15 Einträge. Status: entschieden (Feld `skill`-Semantik: OFFEN 6.2).

### 5.2 `website/data.js` — maschinenlesbares Soll
Jede Fokus-Übung erhält `ex_id` und ein `target`-Objekt; `warum` wird Pflichtfeld (maschinenerzeugt aus der Ableitung). Skizze aus der Session (wörtlich):

```js
{ uebung: "Overhead Squat", ex_id: "ohs",
  target: { sets: 5, reps: 3, kg: 55, pause: true, load_rpe_cap: 8 },
  warum: "5×3 @ 55 sauber in W34; nächster Schritt +2,5 nach 2× Hit" }
```

Status: entschieden (Feldliste von `target` für Nicht-kg-Modi wie Sekunden/BW: OFFEN 6.3 — Prinzip 1.7 verlangt ein explizites `mode`-Feld).

### 5.3 Website-DB — Verdict-Tabelle (neu) + Endpoint `save_verdict.php` (Neubau)
Spalten mindestens: `iso_date`, `ex_id`, `verdict` (`hit | miss`), `miss_reason` (`technik | last | NULL`), `updated_at`. Eindeutigkeit auf (`iso_date`, `ex_id`), last-write-wins. Lesezugriff für die Ableitung analog `get_notes.php` (nur Claude Code). Status: entschieden.

### 5.4 `coach/derived.json` — generierter Cache (neu, nie von Hand editiert)
Skizze aus der Session (wörtlich, v2):

```json
{
  "derived_at": "2026-08-23T19:40:00+02:00",
  "source_range": "2026-06-01..2026-08-23",
  "exercises": {
    "rdl": {
      "class": "loadable",
      "last_sessions": [
        { "d": "2026-08-19", "verdict": "hit", "source": "button", "top": "80x8" },
        { "d": "2026-08-12", "verdict": "hit", "source": "button", "top": "80x8" }
      ],
      "miss_streak": 0,
      "prescription": { "kg": 82.5, "why": "2x Hit @80, Klasse loadable, Schritt +2,5" },
      "e1rm": { "best": 101.3, "from": "80x8 @ 2026-08-19", "trend_4w": "+2.4" }
    },
    "ohs": {
      "class": "technical",
      "ceiling": { "kg": 55, "confirmed": ["2026-08-19"], "note": "Coach-gepflegt" },
      "last_sessions": [
        { "d": "2026-08-19", "verdict": "miss", "miss_reason": "technik", "source": "button" }
      ],
      "prescription": null,
      "flags": ["technik_1x@55 — bei Wiederholung: Video-Diagnose statt erneuter Versuch"]
    }
  },
  "unparsed_notes": []
}
```

`verdict.source` ∈ `button | whoop_derived | recap_answer`. Status: entschieden.

### 5.5 `coach/state.json` — Rückbau
`load_references` wird nach bestandenem Parallel-Lauf durch einen Verweis auf `derived.json` ersetzt. Coach-gepflegt in `state.json` verbleiben: Ceilings technischer Lifts (mit Datum), akute Flags, Mesocycle-Kontext. Status: entschieden.

### 5.6 Skript `scripts/derive_state.py` (neu)
Läuft nur in Claude Code. Inputs: Verdict-Tabelle (via Endpoint), WHOOP-Paste (Sessioninput), `data.js` inkl. Archiv (Soll), `exercises.json`. Outputs: `derived.json` + menschenlesbarer Vergleichs-/Lücken-Report (`unknown`-Liste, Unparsed-Liste, Registry-Mapping-Lücken). Schreibt in Phase 1 nur den Report. Status: entschieden.

---

## 6. OFFENE FRAGEN

1. **WHOOP-Paste-Format:** Der Parser braucht das exakte Textformat des Weekly-Pastes (Struktur, Übungszeilen, Satznotation). Kontext: Bisher liest ein Mensch (Claude) den Paste; für den Parser fehlt eine Format-Spezifikation und mindestens ein Beispiel-Paste. Vor Parser-Bau von Martin ein reales Sample anfordern.
2. **`skill`-Klasse:** In der Registry vorgesehen (BMU, T2B u. ä. — rep-/qualitätsbasiert statt lastbasiert), aber Progressionslogik dafür wurde nie besprochen. Frage: Bekommen Skills nur Verdict-Tracking ohne Engine-Logik, oder eine eigene Regel (z. B. Rep-Progression analog 1.2)?
3. **`target`-Modi jenseits kg:** Wie werden BW-Übungen, Zeitvorgaben (Sekunden) und EMOM-Formate im `target`-Objekt codiert? Prinzip 1.7 verlangt ein explizites `mode`-Feld; die Feldliste ist nicht entschieden.
4. **Scope der Engine:** Nur Fokus-Tage, oder auch Box-Tage/WODs? In der Session wurden ausschließlich Fokus-Übungen behandelt; Box-WODs (DreamWOD) haben keine per-Übung-Targets. Naheliegend: Box-Tage bleiben außerhalb der Verdict-/Progressions-Logik — aber nicht entschieden.
5. **Sync-Details Offline-Fallback (4.2):** Retry-Verhalten, Queue-Persistenz (localStorage?), Verhalten bei Korrektur-Taps offline. Nur Grundprinzip (Cache als Puffer, last-write-wins) ist entschieden.
6. **Endpoint-Absicherung:** Die Website hat keinen Login. `save_note.php` existiert bereits ohne besprochene Auth; ob `save_verdict.php` einen Shared-Secret-Mechanismus braucht, wurde nicht besprochen.
7. **Doppelprogression für Hypertrophie-Accessories:** Accessories mit Rep-Range (z. B. 3×8–12) passen nicht sauber auf 1.2 (feste Reps). Ob eine Doppelprogression (erst Reps ausfüllen, dann Last) ergänzt wird: nicht besprochen.
8. **Backfill-Tiefe:** Wie weit zurück wird Alt-Historie bewertet (`source_range`)? Vorschlag in der Skizze war ab 2026-06-01; nicht explizit bestätigt.

---

## Begriffsdefinitionen (in der Session fest belegt)

- **verdict:** Bewertung einer geplanten Übung in einer Session; Wertebereich `hit | miss | unknown`.
- **hit:** Übung plangemäß absolviert; primär per Website-Button erfasst.
- **miss:** Übung nicht plangemäß absolviert; erhöht nie die Last.
- **miss_reason:** Zusatzdimension eines Miss bei technischen Lifts; `technik | last`; steuert die Engine-Verzweigung (2.3).
- **unknown:** Kein Verdict vorhanden und nicht aus WHOOP ableitbar; zählt in keine Streak, bewegt nie Last, triggert sofortige Recap-Nachfrage.
- **loadable:** Übungsklasse technisch einfacher Lifts; einzige Klasse mit automatischer Progressions-/Deload-Logik.
- **technical:** Übungsklasse aller Overhead-/Oly-nahen Lifts (Snatch, C&J, OHS); Engine liefert nur Kontext, Lastentscheidung beim Coach.
- **skill:** Übungsklasse rep-/qualitätsbasierter Gymnastics-Elemente; Semantik offen (6.2).
- **prescription:** Maschinell abgeleiteter Lastvorschlag inkl. `why`-Begründung; existiert nur für `loadable`.
- **ceiling:** Coach-gepflegter, technisch sauber bestätigter Bestlift eines technischen Lifts (kg + Bestätigungsdatum); wird nie berechnet.
- **e1RM:** Nach Epley geschätztes Einer-Maximum mit Rep-Cap und Quellenangabe; strikt getrennt vom Ceiling.
- **Recovery-Gate:** Nachgelagerter Filter auf jede Prescription anhand `wellness.json`; Recovery < 50 % → kein Steigerungssatz, RPE-Cap 7.
- **Registry:** `coach/exercises.json`; kanonische Übungsliste mit `ex_id`, Aliassen, Klasse, Increment, Rep-Cap.
- **derived.json:** Generierter, nie handeditierter Ableitungs-Cache mit `derived_at`-Staleness-Marker; ersetzt die handgepflegten `load_references`.
- **Parallel-Lauf:** Read-only-Migrationsphase, in der der Engine-Report gegen die handgepflegten Werte verglichen wird, bevor irgendetwas scharf geschaltet wird.
- **Load RPE vs. rpe_feel (Bestand, nie verwechseln):** Load RPE = Intensität pro Satz (höher = näher am Limit); `rpe_feel` = subjektive Sessionqualität 1–5 (höher = besser).
