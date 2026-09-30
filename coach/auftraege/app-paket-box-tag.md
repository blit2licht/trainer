# Auftrag: App-Paket „Box-Tag als Hauptansicht"

**Status:** offen, ohne Termin (Martin 30.09.2026: nicht primär). Nicht umsetzen, bevor Martin den Auftrag freigibt.
**Ziel-Datei:** `website/index.html`, dazu `scripts/build_payload.py` und je nach Lösung ein PHP-Endpoint.
**Herkunft:** Kanon-Umbau vom 30.09.2026 (`coach/decisions.md`). Seitdem ist die Box die Hauptbühne, die App ist aber noch um die eigene Einheit herum gebaut.

## Warum

An 4–5 von 5–6 Trainingstagen zeigt die App einen Box-Tag. Dort gibt es heute das WOD, eine ausklappbare Begründung und die Tagesnotiz. Die zielbezogene Ansage an Tagen mit Snatch oder C&J steht versteckt in der Begründung, und die Rückmeldung zum Zielkontakt läuft als freier Satz in der Notiz.

## Umfang

1. **Zielkontakt sichtbar.** Ein Box-Tag mit Snatch- oder C&J-Teil trägt in der Wochenliste eine Markierung und in der Tagesansicht die Ansage offen über dem WOD (Lastbereich, Cue, Ceiling ja/nein) — ein Satz, nicht eingeklappt.
2. **Verdict auf dem Zielblock.** Genau ein Done/Fail am Zielteil des Box-Tags, mit derselben Technik/Last-Rückfrage wie in der eigenen Einheit. Übrige WOD-Teile bleiben ohne Button.
3. **WOD-Score, optional.** Ein kurzes Feld für Zeit oder Runden+Reps am Box-Tag. Freiwillig, ohne Pflicht und ohne Auswertung am Handy.
4. **Taille.** Ein Zahlenfeld, einmal pro Woche, damit der Wert nicht im Review abgefragt werden muss.

## Offene Entwurfsfragen (vor dem Bau mit Martin klären)

- Planquelle: Wie trägt ein Box-Tag seinen Zielblock? Vorschlag: `ziel: { ex_id, ansage }` am Tag; der Generator reicht es durch, die App nutzt `save_verdict.php` unverändert (`iso_date`, `ex_id`).
- Score und Taille brauchen einen Speicherort. Möglich: eigene Spalten in `session_notes`, eine kleine neue Tabelle, oder beides als strukturierte Zeile in der Notiz. Jede Tabellenänderung heißt Handarbeit auf dem IONOS-Server.
- Soll der Box-Tag in der Wochenliste anders aussehen als heute, oder reicht die Markierung?

## Nicht Teil des Auftrags

- Keine Auswertung, keine Kurven, keine Rückschau am Handy.
- Keine Engine, keine automatischen Lastvorschläge.
- Kein Umbau der eigenen Einheit.

## Abnahme

- Visuell am Handy (375 px): Wochenliste, Box-Tag mit und ohne Zielkontakt, eigene Einheit — Screenshot jeder Ansicht ansehen, Datenchecks reichen nicht.
- Verdict auf dem Zielblock kommt über `get_verdicts.php` zurück und überlebt ein Neuladen.
- Bis zur Umsetzung gilt der Übergang aus `coach/instructions.md`: ein Satz in der Tagesnotiz, Taille im Wochenreview.
