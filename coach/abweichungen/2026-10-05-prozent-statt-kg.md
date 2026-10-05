# Abweichung 2026-10-05: Lastvorgabe in Prozent statt Kilogramm

**Status:** Geschlossen am 05.10.2026 — Sofortmaßnahmen (`8a7dc07`), Restkorrektur der Woche, Lint-Riegel und Zweitdiagnose (Folgecommit). Offen bleibt nur die Übernahme der gelaufenen Lasten im W41-Review.
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

1. **Paused Bench So 11.10.** Erledigt 05.10. nachmittags: Da keine Bench-Referenz existiert und Martins Schätzung noch nicht vorliegt, hat der Coach nach der neuen Regel selbst geschätzt (Bench-1RM ~95 kg aus Push Press 82,5 und Strict HSPU 10, ±10 kg, ~65 % sicher). Im Plan stehen jetzt 4er aufbauend 65 → 80 kg mit RPE-8-Abbruch und Paused Bench 47,5 kg mit Tabelle für das gelaufene 4er-Top. Martins Antwort am selben Tag: keine Zahl, Bauchgefühl 4er ~70 kg, ausdrücklich unsicher. Der Plan nimmt diese Zahl als Kern (Aufbau 60 → 75 kg, Paused Bench 42,5 kg mit Tabelle); die Schätzung steht markiert in `state.json` (`load_references.bench_press`).
2. **Lint-Riegel in `scripts/build_payload.py`.** Erledigt 05.10.: Box- und Ruhetage werden in `sub`, `plan_note`, `warum` und jedem `detail` geprüft. Prozentzeichen oder das Wort „Prozent“ ohne kg-Zahl im selben Feld bricht den Build mit Tag und Übung ab, bevor Payload oder Cache-Stempel geschrieben werden. Erlaubt bleiben Steigung, Puls, HFmax, Recovery, Zone, Effort, Pace und Dämpfer (`PCT_ALLOW`). Abnahme: der Original-W41-Plan (`fd34fae`) scheitert mit acht Treffern, der aktuelle W41-Plan baut sauber, ein Testplan mit Steigungs- und Recovery-Prozenten baut sauber.
3. **Wochenreview W41.** Bleibt offen: bestätigte Box-Squat-, Snatch- und Bench-Lasten aus den Notizen in `load_references` übernehmen; Back-Squat- und Bench-Schätzung durch belegte Sätze ersetzen.

## Zweitdiagnose (Claude Code, 05.10.2026 nachmittags)

Eigene Prüfung des Falls anhand der Git-Historie, unabhängig von der Morgen-Retro. Die vier genannten Ursachen stimmen, greifen aber zu kurz; das zeigen drei Befunde.

1. **Kein Einzelfall, sondern Muster.** Der W40-Plan trug für den Wiedereinstieg am So 04.10. dieselbe Form („50–55 %“, „bis 90 %“ bei Power Clean und Clean Pull), angelegt im selben Commit `fd34fae` vom 30.09. Der Fehler ist also am ersten Box-Tag nach dem Urlaub bereits einmal durchgelaufen, ohne dass er auffiel. Ursache ist nicht ein Kopierfehler an einem Tag, sondern die Übernahme des DreamWOD-Lastsystems: Metcon-Teile tragen dort ein Level mit kg, Kraftteile Prozente der 1RM. Das Level wurde übersetzt, die Prozente nicht, an jedem Kraftteil der beiden Wochen.
2. **Die Sofortkorrektur hat Felder repariert, nicht die Woche.** Nach `8a7dc07` standen noch drei lastlose Stellen: Mo-Begründung „Box Squats bei 70 Prozent“ (am Handy ausklappbar), Do Kurzhantel-Snatch und Renegade Rows ohne kg, So Bench „schwerster sauberer 4er“ ohne Zahl neben dem bekannten Paused-Bench-Prozent. Dieselbe Logik, die die Prozente durchgelassen hat (nur die genannte Stelle prüfen, nicht die Klasse), hat auch die Korrektur begrenzt.
3. **Der Kanon widerspricht sich.** Die neue kg-Regel verlangt eine geschätzte Zahl, wenn die Referenz fehlt. Direkt darüber steht weiter „3. Nur bestätigte Daten verwenden. 4. Ohne Referenz entweder Martin fragen oder eine RPE-basierte Kalibrierung planen“, und in der Quellen-Disziplin „Nur mit ≥90 % Sicherheit ausgeben“. Eine Bench-Schätzung aus Push Press und HSPU erreicht keine 90 %. Solange beide Regeln nebeneinander stehen, entscheidet die Session, welche sie befolgt; heute Morgen hat sie die ältere befolgt. Umgesetzt am 05.10. nach Martins Go: Schätzregel unter „Lasten und RPE“, Ausnahme für Planlasten in Punkt 3 und 8 der Quellen-Disziplin, dazu die übrigen Stellen mit „RPE statt kg“ (Eintrag in `decisions.md`).

Strukturell liegt darunter, dass die Last an Box-Tagen Freitext im Feld `detail` ist. Es gibt kein Zahlfeld, das ein Build prüfen könnte; deshalb konnte der Lint bisher nur Open-Gym-Targets sehen. Der heute eingebaute Riegel prüft den Text und fängt damit die Klasse „Prozent ohne kg“, nicht aber „gar keine Last“ (wie den 4er ohne Zahl). Ein Schema mit Pflichtfeld `kg` je Bewegung wäre die saubere Lösung. Martin hat es am selben Tag beauftragt, es ist umgesetzt: Jede Box-Bewegung trägt `kg` (Zahl, Bereich oder „ohne“), der Build prüft Vorhandensein, Übereinstimmung mit `detail` und „ohne“ bei Hantelbewegungen. Damit fällt auch „gar keine Last“ auf. Für Kreuzheben und Strict Press hat Martin Referenzen geliefert, beide stehen in `state.json`.

## Prozesslehre

Die Prüfung „steht in jeder Lastangabe eine kg-Zahl?“ gehört in den Schritt vor „Committen“ der Wochenplanung, nicht in den Trainingsmorgen. Unterwöchige Korrekturen wie diese werden ohne Commit-Rückfrage veröffentlicht. Der Kanon sah das bereits vor, die Session hat es zunächst nicht befolgt.
