# Trainer 3.0 — Designwelt: Dunkelkammer (gelockt 2026-08-22)

**Dunkelkammer** ist die verbindliche Designwelt für beide Räume — Ausführung
(Handy) und Werkstatt (Desktop). Von Martin am 22.08. abends entschieden, nach
Verwurf des 8-Bit-Farb-Oszilloskops („der karierte Background komplett störend
… zurück auf Dunkelkammer, das war sauberer"). Referenz-Implementierung:
`design/dunkelkammer.html` (Token-Quelle), erster Anwendungsfall:
`V3.0/handy.html`.

## Grammatik (verbindlich)

- **Eine Tonwertleiter regelt alles.** Elfstufige oklch-Leiter g0–g10
  (g0 Grund, g10 die Zahl), keine zweite Skala für Sonderfälle. Rollen werden
  auf die Leiter gemappt (`--ground/--rule/--ink…`), nie Farben direkt benutzt.
  Heller Modus = dieselbe Leiter umgekehrt.
- **Amber ist Sicherheitslicht, kein Neon:** kein Glühen, keine Leuchtkante.
  Trägt Marker, Ziel, armiert/offen/Warnung.
- **Der kalte Akzent trägt ausschließlich Bestätigtes** (Done/steht/erledigt).
- **Linien statt Kästen:** Hierarchie über Trennlinien (`--rule`/`--rule-2`)
  und Tonwert, keine Panels, kein Raster, keine Schatten, keine Verläufe.
- **Teststreifen für den Lastaufbau:** gestufte Bänder, Ton steigt mit der
  Last, das Zielband trägt das Sicherheitslicht mit großer Zahl. Die Zahl
  steht in jedem Band — Ton ist Grund, nie Träger der Information.
- **Schrift:** Archivo (variabel, wdth als Gestaltungsachse) + Spline Sans
  Mono für Maß, Etikett, Zeit. Tabular nums überall.
- **Zustände tragen Worte, nie nur Farbe** (Gym-Prüfstein, gilt fort).
  Verdict-Vokabular aus der Konzeptphase bleibt: armiert / steht / offen /
  Fail; Done/Fail-Trigger pro Übung, Technik/Last-Rückfrage bei `technical`.

## Grundprinzip Textdiät (bindend, Martin 2026-08-22)

Kein unnützer Text — die Handy-Seite zeigt nur Vollzugsdaten (Übung führt den
Block, Soll, Trigger). Kein `warum` am Handy (bleibt Datenfeld für
Engine/Werkstatt), keine Coach-Prosa, keine Wiederholungen, keine
Wochenrückschau/Wochenwahl am Handy. Details: `V3.0/handy-konzept.md` §2/§2b.

## Verworfen (nicht erneut vorschlagen)

- 8-Bit-Farb-Oszilloskop: Graticule als Seitengrund, Indexpalette (Pico-8),
  Kanalfarben pro Übung, Stufenkurven-SVG auf der Handy-Seite.
  Artefakt `V3.0/welt-visualisierung.html` ist damit Historie.

## Nächste Phasen

3. Clickdummy pro Raum (Handy: `V3.0/handy.html` steht; Werkstatt folgt).
4. Iteration: /impeccable live + Kommentar-PDFs.
5. critique/polish, dann DESIGN.md + Token-Extraktion aus dem Gewinner.
