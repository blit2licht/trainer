# Abweichung 2026-10-05: Lastvorgabe in Prozent statt Kilogramm

**Status:** Sofortmaßnahmen erledigt (Commit `8a7dc07`), Vorbeugemaßnahme offen
**Betroffen:** W41, Box-Tag Mo 05.10. (Box Squat), Fr 09.10. (Power Snatch, Snatch Pulls), So 11.10. (Paused Bench)
**Gemeldet von:** Martin, 05.10.2026, 07:32, vor dem Training

## Was passiert ist

Der veröffentlichte W41-Plan nannte für den Box Squat am 05.10. nur „70–72,5 % Back-Squat-1RM“. Martin stand ohne Kilogrammzahl in der Box. Dieselbe Lücke betraf zwei weitere Tage der Woche: Power Snatch „60–65 %“ und Snatch Pulls „bis 100 %“ am Freitag sowie Paused Bench „60 % des schwersten 4ers“ am Sonntag.

## Auswirkung

Am 05.10. hat Martin die Last nach einer verspäteten Nachfrage im Chat gelegt: 6 × 80 kg, RPE 6. Ein Trainingsschaden ist nicht entstanden. Die Kosten waren Zeit und Vertrauen: Martin musste eine Erwartung durchsetzen, die er für selbstverständlich hielt. Zusätzlich blieb der erste Coach-Turn der Session ohne Antwort.

## Ursache

1. **Kanonlücke.** Die Erwartung „immer Kilogramm“ stand weder in `coach/instructions.md` noch in `coach/decisions.md`. Für Fokus-Tage hieß es „kg oder RPE-Kalibrierung“, für Box-Tage nur „Level beziehungsweise Last/Scaling“. Damit war ein Prozentwert formal zulässig.
2. **Ungefilterte Übernahme.** Bei der Wochenplanung wurden DreamWOD-Details wörtlich in `coach/plan/2026-W41.json` kopiert, ohne Umrechnung.
3. **Fehlende Referenz.** `state.json` enthielt keinen Back Squat und keinen Bench. Die Regel „nur bestätigte Daten, sonst fragen oder RPE“ hat den Coach dazu gebracht, die Entscheidung zurückzugeben, statt eine Zahl zu schätzen.
4. **Kein technischer Riegel.** `scripts/build_payload.py` prüft beim Lint nicht, ob eine Lastangabe eine kg-Zahl enthält.

Martins Einordnung: Es ist Aufgabe des Coaches, zu sagen, was geht, notfalls per Schätzung.

## Sofortmaßnahmen (erledigt, `8a7dc07`)

Die Kilogramm-Regel steht jetzt in `coach/instructions.md` unter „Lasten und RPE“. Danach nennt jede Lastangabe kg, Prozentvorgaben aus DreamWOD werden vor der Veröffentlichung umgerechnet, und bei fehlender Referenz schätzt der Coach eine markierte Zahl mit Korridor und RPE-Abbruchkriterium.

In `coach/state.json` ist der Back Squat als Schätzreferenz eingetragen: ~120 kg 1RM nach Martins Angabe, dazu Box Squat 6 × 80 kg bei RPE 6 am 05.10.

Der W41-Plan wurde umgerechnet: Box Squat 80–85 kg, Power Snatch 37,5–40 kg, Snatch Pulls bis 60 kg. Payload ist neu gebaut, Deploy auf IONOS erfolgreich.

`coach/decisions.md` enthält den Retro-Eintrag vom 05.10.

## Offene Punkte

1. **Paused Bench So 11.10.** Die Angabe steht noch als „60 % des schwersten 4ers“. Es fehlt eine Bench-Referenz, Martins Schätzung ist angefragt. Danach Plan und Payload aktualisieren.
2. **Lint-Riegel in `scripts/build_payload.py` (Auftrag an Claude Code).** Jedes `detail`, `sub` und `plan_note` mit einem Prozentzeichen im Lastkontext muss im selben Feld auch eine kg-Zahl enthalten, sonst bricht der Build mit Hinweis auf Tag und Übung ab. Ausnahmen wie Steigungs- oder Pulsangaben explizit erlauben. Abnahme: Ein Plan mit „70 %“ ohne kg scheitert, der aktuelle W41-Plan baut sauber, sobald der Bench-Wert ergänzt ist.
3. **Wochenreview W41.** Bestätigte Box-Squat- und Snatch-Lasten aus den Notizen in `load_references` übernehmen. Die Back-Squat-Schätzung ersetzen, sobald es einen belegten schweren Satz gibt.

## Prozesslehre

Die Prüfung „steht in jeder Lastangabe eine kg-Zahl?“ gehört in den Schritt vor „Committen“ der Wochenplanung, nicht in den Trainingsmorgen. Unterwöchige Korrekturen wie diese werden ohne Commit-Rückfrage veröffentlicht. Der Kanon sah das bereits vor, die Session hat es zunächst nicht befolgt.
