---
target: website/index.html
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 3
timestamp: 2026-08-19T17-19-27Z
slug: website-index-html
---
Method: dual-agent (A: Design Review, isoliert · B: Detektor + Browser-Messung, isoliert)

Hinweis zur Methodik: Assessment A lief unverankert und ohne Kenntnis der Detektor-Befunde. Die Messevidenz von B stammt aus einem vorherigen Lauf desselben, unveränderten Standes und lag dem Orchestrator bereits vor der Synthese vor. A ist davon nicht beeinflusst; die Synthese ist es potenziell.

## Design Health Score

| # | Heuristik | Score | Kernbefund |
|---|-----------|-------|------------|
| 1 | Sichtbarkeit des Systemstatus | 2 | Wochenansicht stark (Heute-Karte, Auto-Scroll, Notiz-Indikator). Fokus-Tag: kein Zustand — nichts zeigt, welcher Block läuft oder erledigt ist. |
| 2 | Übereinstimmung System / reale Welt | 3 | Martins eigene Sprache; ein Ort der Wahrheit für Tagestypen. Abzug: "Kernzeit ~45 min (ohne optionale Blöcke)" ist Systemvokabular. |
| 3 | Nutzerkontrolle und Freiheit | 3 | Escape schließt Glossar-Sheet, Fokus kehrt zurück, Entwürfe überleben in localStorage. Kein Sprung zu einem Block. |
| 4 | Konsistenz und Standards | 2 | Emoji im h1 gegen das eigene Icon-System. Dauer an drei Orten, Glossar an zwei, zwei Zugänge zur Routine mit zwei Beschriftungen. |
| 5 | Fehlervermeidung | 3 | Draft-Persistenz, ehrliche Offline-Meldung, stripHtml vor WHOOP-Text. Abzug: 24px-Buttons inline in 13px-Text. |
| 6 | Wiedererkennen statt Erinnern | 2 | Recovery-Kappung gilt für die ganze Session, steckt in geschlossenem Panel ganz oben; ab Block C aus dem Kopf anzuwenden. |
| 7 | Flexibilität und Effizienz | 2 | Keine Sprungnavigation zwischen Blöcken; buildNoteHTML wird in renderFocus gar nicht aufgerufen. |
| 8 | Ästhetik und minimalistisches Design | 1 | Kern der Beschwerde: dieselbe Begründung bis zu fünfmal vor dem ersten Gewicht; 11px ist die häufigste Schriftgröße. |
| 9 | Fehler erkennen und beheben | 2 | Meldung vorbildlich formuliert, verschwindet aber nach 3 s ohne Retry. |
| 10 | Hilfe und Dokumentation | 3 | Glossar mit Quellenangabe, selbstpflegend über fillGlossary. Sauber gebaut, für die Gym-Szene am falschen Ort. |
| **Total** | | **23/40** | **Acceptable — deutliche Verbesserung nötig** |

## Design-Spezifitäts-Verdikt

**LLM-Urteil:** Eindeutig für dieses Produkt gebaut, aber auf die falsche der drei Nutzungsszenen optimiert. Die 84px-Icon-Achse, JetBrains Mono ausschließlich für Lasten, der WHOOP-Klartextblock, die 44px-Disziplin — nichts davon ist austauschbar. Die gesamte Spezifität steckt jedoch in der Meta-Ebene (Prioritätschips, Dauerangaben, Methodik-Fußnoten, Regel-Panels), also in Vorabend-Material. Die Ausführungsebene hat seit e77d8ff keine neue Gestaltung bekommen. Produktprinzip 1 ("Die Box gewinnt") ist im letzten Update strukturell verloren gegangen.

**Deterministischer Scan:** 3 Befunde in website/index.html — flat-type-hierarchy (Größen 11/12/14/16px, Verhältnis 1.5:1), overused-font (Inter), gpt-thin-border-wide-shadow (1.5px Rahmen + 30px Schattenradius). Browser-Detektor zusätzlich: 18 Befunde Wochenansicht mobil, 24 Befunde Fokus-Tag Desktop, darunter tiny-text (7×), wide-tracking (6×), low-contrast (2×), line-length.

**False Positives:** gpt-thin-border-wide-shadow betrifft nur das Glossar-Popover, wo Kante und Elevation zusammen legitim sind. em-dash-overuse zählt deutsche Gedankenstriche aus data.js. side-tab (nur im degradierten Lauf) traf einen neutralen Rahmen-Token, keinen Akzentstreifen.

## Gesamteindruck

Der Inhalt besteht jede Prüfung; die Darstellung zwingt dazu, ihn viermal zu lesen. Das letzte Update hat Rechenschaft über Ausführbarkeit gestellt. Größte Einzelchance: den Fokus-Tag vom Dokument zum Ablauf machen.

## Was funktioniert

1. Die Lastzeile dc-rx steht außerhalb des Karten-Buttons und bleibt bei zugeklappter Karte sichtbar — die einzige Stelle, an der die Gym-Szene das Layout wirklich diktiert hat.
2. Ein Ort der Wahrheit für Tagestypen: DATA.regeln.prio[type].typ liefert Badge und Chip, ein Tagestyp kann nirgends zwei Namen bekommen.
3. fillGlossary liest den DOM nach vorhandenen Begriffen aus, statt das Glossar-Objekt abzuschreiben — selbstpflegend, kein toter Ballast.
4. Trefferflächen-Disziplin: alle Bedienelemente außer den Abkürzungs-Buttons haben explizit min-height 44px.

## Priority Issues

### P0-1 — Fokus-Tag ohne Ausführungszustand, alle sechs Blöcke gleichzeitig offen
renderFocus rendert A bis F permanent ausgeschrieben. Kein aktueller Block, kein Erledigt-Zustand, keine Sprungnavigation. Gemessen: 4773px (Mi) und 5060px (Sa) Dokumenthöhe auf 375×812 — 6,0 bzw. 6,3 Bildschirmlängen, 3291 bzw. 3561 Zeichen Text.
Fix: Blöcke als Disclosure rendern, geschlossene Kopfzeile trägt Letter, Titel, Sätze×Wdh und Last der ersten Zeile. Genau ein Block offen, zuletzt geöffneter in localStorage. Optionale Blöcke E/F starten geschlossen.
Command: /impeccable distill

### P0-2 — Dieselbe Begründung bis zu fünfmal vor dem ersten Gewicht
day.einheit, day.sub, day.note, focusDay.sub und focusDay.intro tragen im Kern dieselbe Aussage; renderWhoopCopy druckt f.intro ein weiteres Mal als sichtbaren Klartext.
Fix: f.intro hinter eine Disclosure; introPlain aus dem sichtbaren whoop-text streichen und nur in den kopierten Text legen (zwei Zeilen); in data.js festschreiben, dass focusDay.intro nur ergänzt, was in day.note nicht steht.
Command: /impeccable distill

### P1-1 — Methodik-Fußnote der Dauerangabe steht über der ersten Zahl
routine-meta-note trägt Warm-up-Hinweis und Schätzmethodik in 11px auf dem wertvollsten Platz der App. Browser-Messung bestätigt: ~132 Zeichen pro Zeile am Desktop (Ziel unter 80), Kontrast 3,93:1.
Fix: routine-meta-note ersatzlos aus dem Fokus-Kopf entfernen, drei Chips auf einen zusammenziehen, Prio-Chip aus der Routine entfernen.
Command: /impeccable layout

### P1-2 — Abkürzungs-Buttons: 24px Trefferfläche, Text springt beim Antippen
Gemessen: 14 von 21 interaktiven Elementen in Fokus A sind kleiner als 44×44px, 11 von 17 in Fokus B — ausnahmslos Abkürzungs-Buttons, alle 24px hoch ("DB" 25,5×24, "RPE" 26,5×24). toggleAbbr ersetzt den Text, der Absatz bricht neu um.
Fix: abbr:false auch im Fokus-Tag; nur Glossar-Term-Buttons behalten. ABBR-Tabelle als aria-label ohne Button.
Command: /impeccable adapt

### P1-3 — Farbtoken --ink3 verfehlt den Kontrastbedarf systematisch
Hell #7c7a74: 4,18:1 / 3,93:1 / 3,60:1 gegen die drei Flächen. Dunkel #767b82: 4,33:1 / 4,05:1 / 3,52:1. Alle unter 4,5:1. Betroffen 6 bis 12 Textpaare je Ansicht. Breadcrumb-Trenner 1,27:1. Ein Token, nicht dreißig Stellen.
Fix: --ink3 um etwa 8-12 Prozent Helligkeit abdunkeln, in beiden Modi.
Command: /impeccable colorize

### P2-1 — Notizfunktion im Fokus-Tag nicht erreichbar
buildNoteHTML wird nur in dayCardHTML aufgerufen. Szene 2 passiert unmittelbar nach dem letzten Satz, also im Fokus-Tag.
Fix: buildNoteHTML ans Ende von renderFocus, vor den WHOOP-Block.
Command: /impeccable harden

## Kognitive Last

7 von 8 Punkten gescheitert — kritisch.

Pass: Gruppierung (exc-Karten, blk-Gruppen, Icon-Achse, is-optional gestrichelt).
Fail: Single Focus, Chunking (sechs Blöcke, sieben Karten, bis zu sieben Datenpunkte pro Übungskarte), visuelle Hierarchie (11px ist mit 61 Elementen die häufigste Größe in Fokus B), eins nach dem anderen, minimale Auswahl, Arbeitsgedächtnis (Recovery-Kappung über sechs Blöcke im Kopf), Progressive Disclosure (existiert, adressiert aber nur das ohnehin Kleine).

Entscheidungspunkte mit mehr als 4 sichtbaren Optionen: Wochenansicht-Kopf 11; aufgeklappte Tageskarte 11 Bedienelemente; Fokus-Tag-Kopf 8+; Fokus-Tag-Fuß 5+; Übungskarte mit eingestreuten Abkürzungs-Buttons.

## Persona Red Flags

**Lena Hartkamp (10-Sekunden-Kreide-Test):** Sieht in 10 Sekunden Breadcrumb, Emoji-Titel, fünfzeiligen Untertitel, drei Chips, Methodik-Fußnote, zwei Regelzeilen, Beginn des Intro-Absatzes — keine einzige Last. Ihr Dealbreaker "Fließtext über drei Zeilen liest sie im Gym nicht" trifft detail-sub direkt.

**Maren Otholt (Schlechter-Morgen-Probe):** Die tagesspezifische Recovery-Regel existiert und ist mit Quelle belegt, steckt aber in einem standardmäßig geschlossenen Panel, dessen Label nicht signalisiert, dass heute-spezifische Zahlen darin stehen. Inhaltlich erfüllt, im Interface begraben.

**Tomasz Wilk (Redundanz-Kriterium):** Sein Satz "ohne Information doppelt zu lesen" ist der am härtesten gebrochene des Persona-Sets. Sein Hauptkriterium — verankerte Referenzen mit Herkunft — besteht dagegen klar.

## Kleinere Beobachtungen

- Emoji im h1 widerspricht dem dokumentierten Icon-System; gehört aus data.js entfernt, nicht per CSS versteckt.
- Glossar existiert an zwei Orten (inline plus Panel am Fuß) mit identischem Text.
- Ausfall-Regel wird zweimal gerendert und ist eine reine Vorabend-Entscheidung.
- note-status wird nach 3000 ms geleert, ohne zu prüfen, ob inzwischen ein neuer Speichervorgang läuft.
- dc-cta-btn und dc-main lösen dieselbe Aktion mit unterschiedlichen Beschriftungen aus.
- type-badge min-width 84px ist ein manueller Vertrag zwischen CSS und data.js, den nichts prüft.
- 6 Elemente tragen wide-tracking 0.06em auf Fließtext.

## Fragen

1. Für wen steht "Geschätzt aus Sätzen, Pausen und den im Plan genannten Blockzeiten" auf dem Bildschirm, wenn Martin der einzige Nutzer ist?
2. Produktprinzip 2 sagt "Jede Zahl ist belegt" — muss der Beleg sichtbar sein oder nur auffindbar? Das letzte Update hat stillschweigend das Erste angenommen.
3. Der Fokus-Tag ist eine Anleitung für eine sequenzielle Handlung — warum wird er als Dokument gerendert und nicht als Ablauf?
4. Wäre ein einziger Zustand ("Session läuft, Block C offen") der Hebel, der Ausführung, Notiz und WHOOP-Export zu einer Sache macht statt zu drei Screens?
5. Wenn index.html zurück unter 45 KB müsste: Was davon würde im Gym fehlen?

## Offene Verifikation

Assessment A hat keine Browser-Inspektion durchgeführt (Zeitbudget). Die Aussage "Block A liegt auf 375×812 etwa eine volle Bildschirmhöhe unter dem Seitenanfang" ist aus CSS-Höhen gerechnet, nicht gemessen, und sollte vor der Umsetzung real bestätigt werden. Alle übrigen Zahlen in diesem Bericht stammen aus echter Messung (Assessment B).
