# Persona-Review W32 · Konsolidierte Befunde

Ergebnis der fünf Persona-Reviews (Lena, Jonas, Maren, David, Tomasz) der Woche **2026-W32**.
Überschneidungen sind zu einer Zeile zusammengeführt; Mehrfachnennungen stehen oben, sie haben das stärkste Signal.

**So arbeitest du mit der Tabelle:**

- **Bewertung**: deine Einschätzung, z. B. `1–5` oder `A/B/C`
- **Einbringen?**: `ja` / `nein` / `später`

Zur Einordnung: Nr. 1–6 und 10 betreffen direkt W32/W33 und sind ohne neue Features umsetzbar
(Text- und Planungsänderungen in `website/data.js` bzw. im Wochenworkflow). Nr. 7–9 und die
Ideen-Sektion sind Feature-Arbeit an der Website.

## Mehrfach genannt

| Nr | Vorschlag | Typ | Bereich | Personas | Bewertung | Einbringen? |
|---|---|---|---|---|---|---|
| 1 | Fr-`rx` „Auf Anfrage" ersetzen: Kernzahlen in die Tageskarte oder sichtbarer Verweis auf die Fokus-Tag-Seite | Verbesserung | Darstellung | Lena, Jonas, David | | |
| 2 | Snatch-Di eindeutig machen: ein bindender Wert (57,5 oder 60), Begriff „Ceiling" einheitlich definieren | Verbesserung | Inhalt | Lena, Jonas, Tomasz | | |
| 3 | Mo-Entscheidung als Wenn-Dann-Regel mit Recovery-Schwelle (statt „nach aktueller Recovery"); „z. B." beim Di-Aufbau entfernen | Verbesserung | Inhalt | Jonas, Maren, David | | |
| 4 | Presskette Fr–Sa–So entschärfen: So-Bench reduzieren oder gegen Zug-Element tauschen, Entscheidung dokumentieren | Verbesserung | Inhalt | Maren, Tomasz | | |
| 5 | Defizit-Start im Wochenkopf benennen, inkl. erwartetem Leistungs-Dip (steht bisher nur intern) | Verbesserung | Inhalt | Maren, Tomasz | | |
| 6 | Ausfall-/Ausweichregel für Schlüsseltage: Test verschiebt bei roter Recovery; Priorität/Verschiebung bei Tagesausfall | Verbesserung | Inhalt | Maren, David | | |
| 7 | Übertrag in Folgewoche sichtbar machen: „aus W32 übernommen: WPU → 3×5", Testkonsequenzen in W33 zeigen | Idee | Feature | Lena, David | | |
| 8 | Wochen-Belastungsübersicht: Farbstreifen hart/moderat/frei (Lena) bzw. Körperregionen-Matrix Schulter/LWS/Grip/Beine (Maren) | Idee | Feature | Lena, Maren | | |
| 9 | Wochenvolumen-Summen automatisch mitführen: Sätze je Pattern, Overhead- und Kipping-Volumen | Idee | Feature | Tomasz, Maren | | |
| 10 | Deload-Trigger aus `state.json` auf die Website — sichtbare Tagesform-Regel statt interner Doku | Verbesserung | Inhalt | Maren | | |

## Einzelnennungen — Verbesserungen

| Nr | Vorschlag | Typ | Bereich | Persona | Bewertung | Einbringen? |
|---|---|---|---|---|---|---|
| 11 | Mo-Sub-Struktur lesbar machen: Stationen nummerieren oder Format-Zeile statt Abkürzungskette | Verbesserung | Darstellung | Lena | | |
| 12 | Testtag: sichtbarer Ergebnis-Landeplatz (Ergebnisfeld, Vergleich Stand → Ziel) | Verbesserung | Feature | Lena | | |
| 13 | Farbige `rv`-Markierung nur für Lasten verwenden (nicht für Z1/Z2 beim Ride) | Verbesserung | Darstellung | Lena | | |
| 14 | Test-Reihenfolge Fr: Interferenz (BMU ermüdet T2B-Max) dokumentieren, Reihenfolge fixieren oder Tests splitten | Verbesserung | Inhalt | Tomasz | | |
| 15 | Layer-Startgewichte loggen und fortschreiben statt „RPE-kalibriert" ohne Anker | Verbesserung | Inhalt | Tomasz | | |
| 16 | Glossar für benannte Regeln und Kürzel (Sonntagslast-Regel, L2/L3, E2:15, C2B …), per Tooltip/Link erreichbar | Verbesserung | Darstellung | Jonas | | |
| 17 | Notation vereinheitlichen: ein Intervallformat („Every 2:00" vs. „E2:15"), Paarangaben (24/16 kg) auf den geltenden Wert reduzieren | Verbesserung | Darstellung | Jonas | | |
| 18 | Zeitbudget: realistische Gesamtdauer pro Einheit anzeigen (Fr sprengt 65-min-Fenster), optional Zeit je Block | Verbesserung | Inhalt | David | | |
| 19 | Streichreihenfolge pro Einheit markieren: welcher Block fällt zuerst bei Zeitnot | Verbesserung | Inhalt | David | | |

## Einzelnennungen — Ideen

| Nr | Vorschlag | Typ | Bereich | Persona | Bewertung | Einbringen? |
|---|---|---|---|---|---|---|
| 20 | „Heute in 3 Zahlen"-Kopfzeile pro Tageskarte: Last · Cap · RPE, immer an derselben Stelle | Idee | Darstellung | Lena | | |
| 21 | Badge „Testtag in 2 Tagen" auf den Vortagen | Idee | Darstellung | Lena | | |
| 22 | Notizen standardmäßig eingeklappt, Zahlenzeile immer sichtbar | Idee | Darstellung | Lena | | |
| 23 | Meso-Roadmap W32–W37 (Wochenrollen aus `state.json`) auf der Website anzeigen | Idee | Feature | Tomasz | | |
| 24 | Wiederverwendbare Test-Protokollkarte: Vorzustand, feste Reihenfolge, Abbruchkriterium, Ergebnisfeld | Idee | Feature | Tomasz | | |
| 25 | Referenzen klickbar machen: „78 @7 (W28)" springt zur historischen Einheit | Idee | Feature | Tomasz | | |
| 26 | Entscheidungs-Log ausbauen: verworfene Alternativen als eigenes, wiederkehrendes Element | Idee | Darstellung | Tomasz | | |
| 27 | Einheitliches Pflichtfeld-Schema pro Tageskarte; fehlende Angaben explizit als „—" | Idee | Darstellung | Jonas | | |
| 28 | Wochen-Changelog: was sich an Regeln/Struktur gegenüber der Vorwoche geändert hat | Idee | Feature | Jonas | | |
| 29 | Alle Konditionalen als Wenn-Dann-Struktur formatieren, nie als Prosa-Nebensatz | Idee | Darstellung | Jonas | | |
| 30 | Automatischer Konsistenz-Check beim Commit: kein Wert darf auf Tageskarte und Detailseite abweichen | Idee | Tooling | Jonas | | |
| 31 | Recovery-Gate morgens: Tag zeigt direkt seine Normal- oder Reduziert-Variante | Idee | Feature | Maren | | |
| 32 | „Warum liegt dieser Tag hier"-Begründung als fester Bestandteil jedes Schlüsseltags | Idee | Inhalt | Maren | | |
| 33 | Sechs-Wochen-Trendansicht: Belastung / Recovery / Gewicht übereinander (Defizit-Überwachung) | Idee | Feature | Maren | | |
| 34 | Kurz-Variante pro Einheit hinterlegen: dieselbe Session, fertig auf 45 min gekürzt | Idee | Feature | David | | |
| 35 | WHOOP-Kopierprinzip ausweiten: ganzer Tag als kopier-/abhakbare Checkliste | Idee | Feature | David | | |
| 36 | Morgen-Modus: Block für Block durchtippen statt scrollen | Idee | Feature | David | | |
