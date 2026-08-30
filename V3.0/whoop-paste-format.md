# WHOOP-Weekly-Paste — Format-Spezifikation (Entwurf aus Sample 22.08.2026)

Löst Übergabe OFFEN 6.1. Abgeleitet aus einem realen Paste (Martin, 23.08.2026,
Bereich 15.–22.08.). Grundlage für den Parser in `scripts/derive_state.py`
(bislang bewusst nicht gebaut). Prinzip 1.7: der Parser rät nie — die unten mit
**[BESTÄTIGEN]** markierten Punkte hole ich vor dem Parser-Bau von Martin ab.

## Struktur

- Der Paste ist nach **Tagen** gegliedert (Datumsüberschrift „Mi, 19.08.").
- Pro Tag eine oder mehrere **Sessions** mit Kopfzeile (Session-Name, Dauer,
  Strain, ggf. Volumen). Für den Parser irrelevant außer als Session-Grenze.
- Innerhalb einer Session **Übungsblöcke**: eine Übungsnamen-Zeile, darunter die
  Satzzeilen.
- **Übungsname** trägt Equipment-Suffix „ – Barbell" / „ – DB". Der Parser
  strippt „ – <Equipment>" und mappt den Basisnamen über `exercises.json`
  `aliases` auf `ex_id`.

## Übungsnamen (verifiziert gegen Registry-aliases)

| WHOOP-String | ex_id |
|---|---|
| Snatch – Barbell | snatch |
| Overhead Squat – Barbell | ohs |
| Romanian Deadlift – Barbell | rdl |
| Muscle Ups | bmu |
| Hanging Toes to Bar | t2b |
| Handstand Push-Ups | hspu_strict |
| Weighted Pull Ups | wpu |
| Clean and Split Jerk – Barbell | clean_jerk (voller Komplex, EINE Zeile) |
| Clean – Barbell | clean |
| Power Clean – Barbell | power_clean |
| Hang Power Clean – Barbell | hang_power_clean |
| Clean Pull – Barbell | clean_pull |
| Push Jerk – Barbell | push_jerk |
| Push Press – Barbell | push_press |
| Overhead Press – Barbell | overhead_press (loadable, Accessory; Martin-Historie 23.08.) |
| Lateral Raise – DB | lateral_raise (seit 25.08. eigenständig loadable, D1/D2-Split) |
| Biceps Curl – DB | biceps_curl (seit 25.08. eigenständig loadable, D1/D2-Split) |
| DB Bench Press | db_bench (Registry-Eintrag 25.08.; Verdict weiter über layer_brust_trizeps) |
| Triceps Extension | triceps_ext (Registry-Eintrag 25.08.; Verdict weiter über layer_brust_trizeps) |
| Prone Leg Curl | — (Layer-Komponente ohne Registry, s. u.) |

**C&J-Komplex (Martin, 23.08.):** Die WHOOP-Library kennt kein „Clean & Jerk".
Martin loggt den vollen Komplex als eine Zeile **„Clean and Split Jerk"** (Export
schreibt „and", nicht „&"). Die Teil-Lifts **Clean, Power Clean, Hang Power Clean,
Clean Pull, Push Jerk** dürfen NICHT auf `clean_jerk` mappen — Teil-Lift ist nicht
der Komplex. Sie sind **eigenständige ex_ids** (Martin-Entscheid 23.08.: jeder hat
eigene Rechtfertigung, z. B. Clean Pull = Kraft-Accessory für bessere Cleans).
**Push Jerk ≠ Push Press** und **Overhead Press ≠ Push Press** — eigene
WHOOP-Movements, nicht verwechseln.

**WHOOP-Ist ist coverage-limitiert — korrigiert nie eine coach-Ceiling nach
unten (Martin, 23.08.):** Ein Movement fehlt im Paste oder bleibt darin unter dem
coach-gepflegten Ceiling-Wert, WEIL WHOOP früher das Movement/Tracking nicht
hatte — nicht weil die Leistung fehlt. Beispiel: C&J-Ceiling in state.json = 80;
Martin hat 80 gestanden und bis 92,5, nur vor der WHOOP-Ära ungetrackt. Regel für
`derive_state.py`: WHOOP-Ist ist eine **Untergrenze / Teilabdeckung**, nie eine
Widerlegung. Ceiling bleibt coach-gepflegt (Übergabe 2.5), e1RM/Ist wird getrennt
geführt und darf die Ceiling nie nach unten ziehen. (Fehler in einer früheren
Report-Version: WHOOP-75 als „Ceiling evtl. überhöht" gedeutet — falsch,
zurückgezogen.)

**Kurzform-Variante (Martins Zusammenfassung, nicht Roh-Export):** In einer
zusammengefassten Übersicht können mehrere Singles als Komma-Liste in einer Zeile
stehen: `1 × 55 kg, 60 kg, 65 kg, …` = mehrere 1er-Singles. Der Roh-Export listet
jeden Satz einzeln (Sample 22.08.); der Parser zielt auf den Roh-Export. Die
Komma-Form ist optional nachrüstbar, aktuell niedrige Priorität.

## Satz-Notation — Regeln (BESTÄTIGT von Martin, 23.08.2026)

Der Paste mischt Notationen. Disambiguierung über Zahlanzahl + Einheit. Die
Einheit/Struktur bestimmt, ob die **erste** Zahl Reps oder Sätze meint — genau
der 1.7-Fallstrick, deshalb hart belegt:

1. **Drei Zahlen + `kg`** `A×B×C kg` → **Sätze × Reps × Gewicht(gesamt)**.
   Bsp. `DB Bench Press 3×12×45 kg` = 3 Sätze, 12 Reps, 45 kg — und **45 ist die
   Summe beider Kurzhanteln** (2×22,5 kg), nicht pro Hantel. Ebenso
   `Lateral Raise 3×12×14 kg`, `Prone Leg Curl 4×20×28 kg`. Die 3-Zahl-Form
   tritt auch bei **Barbell** auf, wenn WHOOP uniforme Sätze zusammenfasst:
   `Overhead Press 3×1×50 kg` (30.04.) = 3 Sätze à 1 Rep @ 50 kg (3 Singles).
   Der Parser liest 3 Zahlen immer als Sätze×Reps×Gewicht, unabhängig vom Gerät.

2. **Zwei Zahlen + `kg`** (kein `@`) `A×B kg` → **Reps × Gewicht, EIN Satz**
   (keine Satzzahl in der Zeile; jede Zeile ist ein Satz, mehrere Zeilen =
   mehrere Sätze). Bsp. paused OHS `3×42,5 kg` = 3 Reps @ 42,5 (ein Rampensatz);
   Snatch `1×40 kg` = 1er-Single; RDL `8×60 kg` = 8 Reps @ 60.

3. **Zwei Zahlen + `BW`** `A×B BW` → **Sätze × Reps** (bodyweight).
   Bsp. `Muscle Ups 5×2 BW` = 5 Sätze, 2 Reps; `Handstand Push-Ups 4×8 BW`.

4. **`@ +N kg`-Suffix** `A×B @ +N kg` → **Sätze × Reps**, Zusatzlast +N
   (→ target-Modus `bw_plus`). Bsp. `Weighted Pull Ups 3×5 @ +5 kg`.

**Merkregel:** Die letzte kg-Zahl ist immer das Gewicht. Bleibt bei einer
kg-Zeile davor **eine** Zahl → das sind **Reps** (ein Satz). Bleiben **zwei**
Zahlen davor → **Sätze × Reps**. `BW`- und `@ +N kg`-Zeilen tragen nie ein
Satzgewicht, ihre führende Zahl ist deshalb die **Satzzahl**.

## Dezimal- und Trennzeichen

- Dezimal-**Komma**: `52,5 kg`, `42,5 kg`. Parser normalisiert „," → ".".
- Multiplikator ist `×` (U+00D7), nicht `x`. Parser sollte beide akzeptieren.

## Layer-/Accessory-Komponenten (kein Parser-Zwang)

WHOOP loggt die **Einzelübungen** eines Hypertrophie-Layers (Lateral Raise,
Biceps Curl, DB Bench Press) — die Registry hat dafür nur die **Composite**-
generic-Einträge `layer_delts_bizeps` / `layer_brust_trizeps`. Diese sind
`generic` = Verdict-only, ohne Engine: ihr hit/miss kommt aus dem Button, nicht
aus dem Paste. Der Parser **ignoriert** unbekannte Accessory-Namen (kein
Mapping-Zwang), meldet sie aber im Report als `unmapped` (Übergabe 1.7). Falls
Layer-Volumen später ausgewertet werden soll, braucht es eine Komponentenliste
je Layer — offene Frage, nicht W35.

## Bekannte Mapping-Unschärfen

- **„Muscle Ups"** ist in WHOOP nicht nach Bar/Ring getrennt. Für Martin
  eindeutig BMU (Ring-MU steht in `profile.ausgeschlossen`). Mapping sicher,
  aber der Name allein trägt die Klärung nicht — nur der Kontext.
- **„Handstand Push-Ups"** unterscheidet strict/kipping nicht. Registry-ex_id
  ist `hspu_strict`; die Strict-Eigenschaft kommt aus dem Plan-Kontext, nicht
  aus dem Paste. Bei gemischtem Gebrauch (Box-Kipping-HSPU) könnte der Paste
  fälschlich auf `hspu_strict` mappen — im Fokus-Kontext unkritisch, an Box-Tagen
  laufen ohnehin keine Verdicts (Entscheid 9).

## Autolog vs. Wahrheit (validiert am Sample)

Der Sa-22.08.-Block zeigt `Weighted Pull Ups 3×5 @ +5 kg` — den WHOOP-Autolog.
Die freie Notiz/das Verdict sagt real 5/5/3/2 = **Miss**. Bestätigt die
Kanal-Regel: bei Widerspruch zählt Verdict-Button/freie Notiz, nicht der
WHOOP-Autolog (Übergabe 2.1/4.1). Der Parser darf aus dem Paste nie ein `hit`
ableiten, das einem gesetzten Verdict widerspricht — Verdict hat Vorrang.

## Verdict ist Leading Signal — Komplexe (Martin, 23.08.)

Programmierte **Komplexe** (z. B. `3 Clean + 1 Jerk`, `3 Hang Power Snatch +
1 Hang Squat Snatch`) sind in WHOOP praktisch nicht abbildbar — Martin trägt sie
allenfalls behelfsweise ein. Konsequenz, bindend:

- Der **Verdict-Button auf der Seite ist das Leading Signal** für hit/miss —
  **nie** der WHOOP-Recap. Der Paste ist nachrangiger, verlustbehafteter Kontext.
- Fehlt ein programmierter Block im Paste (Komplex nicht abbildbar), erzeugt das
  **kein** `miss` und **kein** `unknown`, solange ein Verdict existiert. `unknown`
  entsteht nur bei Verdict-Abwesenheit UND fehlender WHOOP-Ableitung (Übergabe
  2.1). Ein vorhandenes Verdict schlägt jede WHOOP-Lücke.
- Dieses Muster (Leading Verdict, WHOOP als optionaler Beleg) gilt **überall**,
  nicht nur bei Komplexen — Martin: „solches Verhalten kann praktisch überall
  auftreten."
- Zweck des Komplexes („die Bar nicht loslassen") wird im Target über
  `unbroken: true` getragen (datenmodell.md §3), nicht über den Paste.
