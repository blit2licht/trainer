# Trainer 3.0 — Offene Detailfragen aus der Bau-Phase W35 Teil 1

Gesammelt statt geraten (Prinzip 1.7). Betrifft Datenmodell + Backend
(exercises.json, Verdict-Endpoints, derive_state.py Phase 1). Für jeden Punkt:
was blockiert ist und was von Martin gebraucht wird.

## 1. WHOOP-Weekly-Paste-Format — GEKLÄRT + Parser gebaut (23.08.)
Reales Sample (Martin, 23.08.) verarbeitet. Format + Set-Notation von Martin
bestätigt: **V3.0/whoop-paste-format.md**. Set-Notation: `A×B kg` = Reps×Gewicht
(ein Satz), `A×B×C kg` = Sätze×Reps×Gesamtgewicht (DB summiert), `A×B BW` =
Sätze×Reps, `A×B @ +N kg` = Sätze×Reps@+N. Parser in `derive_state.py`
implementiert (`--whoop <datei>`), report-only. Erledigt.

## 2. `aliases` in exercises.json — VOLLSTÄNDIG verifiziert
Mit den Samples + der WHOOP-Movement-Liste (23.08.) belegt: bmu → "Muscle Ups",
t2b → "Hanging Toes to Bar", hspu_strict → "Handstand Push-Ups", wpu → "Weighted
Pull Ups", clean_jerk → "Clean and Split Jerk", push_press → "Push Press";
snatch/ohs/rdl bestätigt. **Keine Best-Guesses mehr offen.** Verwandte, aber
eigene WHOOP-Movements (Overhead Press, Push Jerk, Clean-Varianten) bewusst NICHT
als Alias — Verwechslung verfälscht die Ist-Zuordnung.

## 2b. Teil-Lifts des C&J — ENTSCHIEDEN 23.08.: eigene ex_ids
Martin: die Teil-Lifts sind immer eigenständig, jeder mit eigener Rechtfertigung
(Clean Pull = Kraft-Accessory für bessere Cleans). Als eigene ex_ids angelegt:
`clean`, `power_clean`, `hang_power_clean`, `push_jerk` (technical),
`clean_pull` (loadable, increment 5). Erledigt. `Overhead Press` bleibt vorerst
ohne Eintrag (unmapped), bis benötigt.

## 3. `target`-Modi — welche Übung fährt welchen Modus?
Modi sind entschieden (`kg | bw | bw_plus | time | band`, Entscheid 15). Offen
ist die konkrete Zuordnung beim ersten echten Planquellen-Bau (2026-W35.json,
kommt in Auftrag-Schritt 3, noch nicht gebaut):
- **wpu**: `bw_plus` mit `kg` = Zusatzlast (+5) — bestätigt so gemeint?
- **hollow_hold**: `time` mit `sec` pro Satz — ja?
- **Box-Accessory mit Band** (falls in W35): braucht `band`-String aus der
  Box-Realität ("rot"/"grün"). Nur relevant, wenn ein solcher Block geplant wird.

## 3c. Komplex-Repräsentation im target (Bauschritt 2)
Programmierte Komplexe wie `3 Clean + 1 Jerk` oder `3 Hang Power Snatch +
1 Hang Squat Snatch` (Martin, 23.08.) brauchen eine Target-Repräsentation — sie
sind KEINE Registry-Einträge pro Komplex. Vorschlag als Startpunkt für die
Planquelle: der Block trägt ein `complex`-Feld (geordnete Liste Sub-Movements +
Reps), z. B.
`target: { mode:"kg", complex:[{ex_id:"clean",reps:3},{ex_id:"push_jerk",reps:1}],
sets:5, kg:60, interval:"E2:00", unbroken:true }`. Offen:
- Woran hängt das **Verdict** — an einem „Lead"-ex_id des Komplexes, oder an
  einer eigenen Komplex-ex_id? (Verdict ist Leading Signal, s.
  whoop-paste-format.md; WHOOP trägt den Komplex ohnehin nicht.)
- Wie fließt der Komplex in e1RM/Ceiling? Vermutlich gar nicht automatisch —
  nur Verdict-Tracking + Ceiling coach-gepflegt. In Bauschritt 2 entscheiden.

## 4. Doppelprogression Rep-Range-Accessories (Übergabe OFFEN 6.7)
Layer-Blöcke (Delts/Bizeps, Brust/Trizeps) laufen aktuell als `generic`
(Verdict-only, keine Engine). Falls sie später eine Rep-Range-Doppelprogression
bekommen sollen (erst Reps füllen, dann Last), fehlt die Logik. In W35 nicht
nötig — nur festhalten.

## 5. Sync-Details Offline-Puffer (Übergabe OFFEN 6.5)
Retry-Verhalten, Queue-Persistenz (localStorage?), Korrektur-Taps offline. Nur
das Grundprinzip (Cache als Puffer, last-write-wins pro (iso_date, ex_id)) ist
entschieden. Betrifft das Handy-Frontend — ist ein späterer Schritt, nicht Teil
dieses Backend-Baus.

## 6. session_feel-Erfassungsort an Box-Tagen (Schema-Anforderung 6)
Fokus-Tage: Verdict je Übung ersetzt session_feel. Box-Tage: session_feel bleibt
Rückkanal, aber wo erfasst? Kandidat aus datenmodell.md §2: Notiz-Textfeld wie
heute, kein neues UI-Element in W35. Bestätigung offen.

## 7. Backfill-Tiefe (Übergabe OFFEN 6.8 / Entscheid 6)
Beim Scharfschalten wird Alt-Historie über gezielte WHOOP-Prompts nachgezogen.
Wie weit zurück (`source_range`)? Skizze war ab 2026-06-01, nicht bestätigt.
Erst bei Phase-2-Scharfschaltung relevant.
