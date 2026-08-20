---
target: website/index.html
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 3
timestamp: 2026-08-20T08-49-07Z
slug: website-index-html
---
Method: dual-agent (A: Design Review, isoliert · B: Detektor + Browser-Messung, isoliert)

Zwei Befunde wurden vom Orchestrator gegengeprüft: der Dark-Mode-Kontrastfehler von B (widerlegt, Messartefakt) und der Peek-Fehler von A (bestätigt gegen data.js).

## Design Health Score

| # | Heuristik | Score | Kernbefund |
|---|---|---|---|
| 1 | Sichtbarkeit des Systemstatus | 3 | is-done und is-optional nutzen beide --ink3 für blk-letter: eine Farbe, zwei Bedeutungen. Kein Fortschritt auf Tagesebene. |
| 2 | Übereinstimmung System / reale Welt | 4 | Blöcke A-F wie im Notizbuch, Kernblock/Optional in der Sprache der Ausfall-Regel, Fachbegriffe englisch mit Glossar vor Ort. |
| 3 | Nutzerkontrolle und Freiheit | 2 | markBlockDone löst drei Effekte mit einem Tap aus, ohne Undo für den Sprung. openBlock erzwingt Exklusivität: zwei Blöcke nebeneinander sind unmöglich. |
| 4 | Konsistenz und Standards | 2 | Drei Aufklapp-Optiken (.disc, .blk, .dc-chev) für dieselbe Funktion, dazu zwei Grammatiken: Blöcke "genau einer offen", Tageskarten "beliebig viele". |
| 5 | Fehlervermeidung | 2 | blockPeek liest immer rows[0] und behauptet damit Falsches über den Block. |
| 6 | Wiedererkennen statt Erinnern | 1 | Fünf geschlossene Blöcke verlangen Erinnerung; der Peek kürzt die Lasttreppe auf Endpunkte statt auf die nächste Stufe. Warm-up ist kein Block, sondern ein Halbsatz hinter zwei Griffen. |
| 7 | Flexibilität und Effizienz | 2 | Kein "alles aufklappen", keine Sprungnavigation, kein Sticky-Kopf. Rückfrage zu einem früheren Block kostet sechs Handgriffe. |
| 8 | Ästhetik und minimalistisches Design | 3 | Typografisch diszipliniert. Aber unter 480px wird der RPE-Chip volle Breite und Akzentfarbe, während Last ein halbbreiter grauer Kasten bleibt. |
| 9 | Fehler erkennen und beheben | 3 | Netzwerk- und HTTP-Fehler getrennt behandelt, beide sagen was mit den Daten passiert. Abzug: setTimeout löscht nach 3s auch Fehlermeldungen; copyWhoopText ohne catch. |
| 10 | Hilfe und Dokumentation | 3 | fillGlossary sammelt nur real vorkommende Begriffe mit Quelle. Aber die neue Mechanik selbst wird nirgends erklärt. |
| **Total** | | **25/40** | **Acceptable — vorher 23/40** |

## Design-Spezifitaets-Verdikt

**LLM-Urteil:** Spezifisch, aber an der entscheidenden Stelle generisch. prio-Chips aus der Ausfall-Regel, recoveryDay mit tagesgenauen Kilo-Zahlen, der WHOOP-Klartextblock und stackSteps sind aus dieser Domäne erfunden. Der neue Kern jedoch — Fokus-Tag als Akkordeon mit genau einem offenen Block — ist ein geliehenes Muster für lange Formulare und FAQ-Seiten, wo der Nutzer ein Ding sucht und dann fertig ist. Martin sucht mitten im Satz sechsmal hintereinander ein Ding. Der geschlossene Kopf mit den Arbeitszahlen ist die richtige, spezifische Idee darin; das Akkordeon drumherum ist es nicht.

**Deterministischer Scan:** 1 Befund, flat-type-hierarchy (12/13/14/16px, Ratio 1.3:1). Kein DEGRADED, Detektor voll funktionsfähig. Die zwei stillgelegten Regeln erwartungsgemäß nicht aufgetaucht.

**Widersprueche zwischen den Assessments, aufgeloest:**
- A schätzte ~730px Chrome vor dem ersten Blockkopf; B maß #blk-A bei 369px. Die programmatische Messung gilt. A hat aus dem Screenshot geschätzt.
- B meldete #f-nbtn im Dark Mode mit 2,75:1. Vom Orchestrator mit Wartezeit nachgemessen: 6,47:1. Der Wert war eine laufende Farbüberblendung (transition:color .15s). Vollständiger Scan aller vier Zustände im Dark Mode: null Fehlpaare. Kein Defekt.

## Was messbar besser wurde

| Fokus-Tag A, 375x812 | vor dem Umbau | jetzt (Auslieferung) |
|---|---|---|
| Dokumenthöhe | 4773 px | 2013 px |
| Scrolltiefe | 6,0 Bildschirme | 2,5 Bildschirme |
| Sichtbarer Text | 3291 Zeichen | 1150 Zeichen |
| Tap-Ziele unter 44px | 14 von 21 | 0 |
| Kontrast-Fehlpaare | 6-12 je Ansicht | 0 (hell und dunkel) |

#blk-A beginnt bei 369px und liegt damit im ersten Bildschirm. Funktionsprüfung vollständig bestanden: Zustand in localStorage, überlebt Reload, keine doppelten IDs, gestapelte Lasttreppen im textContent korrekt getrennt.

**Was schlechter wurde:** Mit allen Blöcken offen ist der Fokus-Tag 4928px hoch — mehr als die 4773px der alten Fassung. Wer alles sehen will, bekommt jetzt mehr Seite als vorher, ohne dass ein "alles aufklappen" existiert.

## Priority Issues

### P0-1 — Der Peek traegt bei mehrzeiligen Bloecken die falsche Zahl
blockPeek liest immer rows[0]. Gegen data.js verifiziert: Fokus B, Block A "BMU — Linked Doubles" hat als Zeile 0 den Descent-Drill (2 × 3 + 2 × 3, RPE 6); die eigentliche Arbeit 5 × 2 unbroken (RPE 7-8) steht im geschlossenen Kopf nirgends. Ebenso: Block F zeigt "2 × 45 sec" ohne Übungsnamen bei drei Übungen; Block E verschweigt die zweite Übung. Dazu kürzt ramp() Lasttreppen auf die Endpunkte (7 × 1 · 40 … 60 kg) — an der Stange lautet die Frage aber "welche Scheibe jetzt", nicht "wo fängt es an und wo hört es auf".
Warum es schadet: Der Peek ist die einzige Rechtfertigung dafür, fünf von sechs Blöcken geschlossen zu halten. Trägt er die falsche Zahl, ist das Akkordeon ein Nettoverlust — Martin muss trotzdem öffnen, beim BMU-Block sogar im Glauben, er wisse schon was drinsteht. Checklistenpunkt 1 der verbindlichen Persona ist damit durch genau das Element verletzt, das ihn erfüllen sollte.
Fix: Nicht rows[0], sondern die Zeile mit dem höchsten RPE (bei Gleichstand die erste). Mehrzeilige Blöcke bekommen einen Zähler ("+1 Übung"). ramp() auf die letzten drei Stufen kürzen statt auf die Enden, oder die volle Treppe mit nowrap. Blöcke ohne Last: Übungsname statt Dauer.
Command: /impeccable clarify

### P0-2 — Der Erledigt-Zustand ist der billigste Rueckkanal und endet in localStorage
markBlockDone schreibt nach localStorage und sonst nirgendwohin. Nie an save_note.php, nie in weekNotes, nicht im WHOOP-Block, beim Wochenreview unsichtbar. Gleichzeitig ist ein Tag ohne Notiz in der Wochenansicht eine leere Zone — visuell nicht von einem Tag ohne Einheit zu unterscheiden.
Warum es schadet: Der zentrale Zielkonflikt der Persona verlangt wörtlich "einen einzigen Handgriff im Moment des Geschehens". Genau dieser Handgriff existiert jetzt, sechsmal pro Einheit, ohne Tastatur — und das System wirft ihn weg. Anforderung 3 verlangt zudem, fehlende Rückmeldung als Unsicherheit zu kennzeichnen, nie als Erfolg. Testszenario 4 (Stille-Woche-Probe) fällt durch.
Fix: markBlockDone sendet den Erledigt-Vektor als neues Feld blocks_done mit. Sind alle Kernblöcke erledigt und session_feel noch 0, das Notiz-Panel automatisch aufklappen. Vergangene Trainingstage ohne jede Rückmeldung bekommen einen sichtbaren Indikator "Keine Rückmeldung".
Command: /impeccable harden

### P1-1 — Der Umbau hat vier von sieben Tagen nicht angefasst
Die gesamte Arbeit ging in #view-focus. Box- und Ride-Tage — die Mehrheit der Woche — zeigen ihre komplette WOD-Struktur weiterhin als einen Fließtextabsatz in .dc-sub. Beispiel Donnerstag: "Every 2:30 × 4: 8 Barbell RDL (kontrollierter Abstieg) + 20 banded Hamstring Curls → E2:00 × 8 (Score: langsamste Runde): 10 DB Shoulder-to-Overhead · 30 DU/45 Singles · 5 Burpee Box Jump Overs".
Warum es schadet: Martins Checklistenpunkt "Kein Fließtextabsatz zwischen der Überschrift und der ersten Zahl" fällt hier ungebremst durch, und laut seiner Persona wird dieser Absatz nicht überflogen, sondern übersprungen — samt allem was darin stand. Der Umbau hat die zwei Tage strukturiert, die schon strukturiert waren.
Fix: Das wod-Objekt und renderWod existieren bereits. Box-Tage auf dieselbe Struktur heben statt auf Fließtext.
Command: /impeccable layout

### P1-2 — Die Recovery-Kappung ist am Ort der Nutzung nicht sichtbar
rule-rec-focus steht oberhalb aller Blöcke, standardmäßig zu. Der Inhalt für Fokus A: "Snatch endet bei 57,5 kg, OHS endet bei 50 kg, Load-RPE-Cap 7". Sobald Block C offen ist, liegt das rund 1500px weiter oben — und Block C zeigt unverändert 42,5 → 52,5 und RPE ≤7-8.
Warum es schadet: Das ist der einzige Ort, an dem dieselbe Größe zwei Werte haben kann. Martins Dealbreaker Nr. 3 lautet wörtlich "Dieselbe Größe an zwei Stellen mit verschiedenen Werten", und er verliert daran das Vertrauen in alle übrigen Zahlen.
Fix: Die tagesspezifische Kappung in den betroffenen Block rendern, als Warnzeile unter den Chips. Oder eine einmalige Recovery-Eingabe im Kopf, die die angezeigten Lasten tatsächlich kappt — dann gibt es nur einen Wert.
Command: /impeccable harden

### P1-3 — Der RPE-Chip ist auf dem Handy das groesste Element der Uebungskarte
Unter 480px setzt .chip flex:1 1 calc(50% - 4px). Bei drei Chips füllt der dritte die zweite Zeile allein und ganz aus. Da .chip.rpe zusätzlich accent-soft und accent-ink trägt, ist RPE der auffälligste Block der Karte — größer und farbiger als Last.
Warum es schadet: Produktprinzip 1 sagt, mitten im Satz gewinnt die Ausführbarkeit. Mitten im Satz braucht er das Gewicht. RPE ist über die Einheit weitgehend konstant und nach dreizehn Jahren im Gefühl.
Fix: Explizites Grid statt Flex-Reste — Last volle Breite mit größerer Ziffer, Sätze und RPE halbbreit darunter. Der RPE-Chip verliert die Akzentfarbe, die Akzentfarbe gehört zur Last.
Command: /impeccable layout

## Kognitive Last

5 von 8 Punkten gescheitert (vorher 7 von 8).

Bestanden: Single Focus (der offene Block ist unstrittig das eine Ding), Eins nach dem anderen (die Sequenz ist explizit — die Stärke des Umbaus), Progressive Disclosure knapp (die Griffe sind alle benannt, nicht "Mehr").
Gescheitert: Chunking (sechs Blöcke ohne Zwischengruppierung, obwohl die Ausfall-Regel die Zweiteilung Kern/Optional frei Haus liefert), Gruppierung (gestrichelte 1px-Linie ist bei Hallenlicht kein Signal), visuelle Hierarchie (RPE-Chip; und im Kopf ist der Peek kleiner gesetzt als sein Etikett), minimale Auswahl, Arbeitsgedächtnis (Recovery-Kappung außer Sicht, sobald Block C erreicht ist).

Entscheidungspunkte über 4 Optionen: Fokus-Tag-Kopf mit rund 15 interaktiven Zielen, davon fünf gleich aussehende Aufklapp-Elemente. Offener Block mit zwei Übungskarten: 9+ visuelle Einheiten in dem, was als "das eine Ding" verkauft wird. Session-Feel-Zeile: fünf identische Kacheln ohne sichtbare Skalenbeschriftung. Tageskarte: .dc-main und .dc-chev tun dasselbe, bei Fokus-Tagen zusätzlich .dc-main und .dc-cta-btn.

## Persona Red Flags

**Martin Witte (04, verbindlich):** Nach markBlockDone('B') ist B zu. Rückfrage zu B aus C heraus: hochscrollen, tippen (C schließt dabei), lesen, tippen, zurückscrollen, C wieder tippen — sechs Handgriffe. Seine Persona: "Aufklappen, scrollen, wieder zuklappen für eine einzelne Zahl ist ein Fehler im Entwurf, kein Bedienfehler." Dazu fehlt jeder Anker: kein Sticky-Kopf, keine Positionsanzeige, obwohl er laut Persona rund zwanzigmal pro Einheit hinschaut. Positiv und ausdrücklich: Testszenario 2 (Herkunfts-Stichprobe) besteht sauber, die Herkunftskette bricht nirgends ab.

**Maren Otholt (03):** Die Wochenübersicht zeigt Einheiten, nicht Belastungslogik — die Prio-Chips sind die Streichreihenfolge, nicht die Härte. Ein Fokus-Tag mit RPE ≤8 und ein Sonntagsride stehen typografisch gleichwertig da. Positiv: Ruhetage sind begründete Entscheidungen statt Leerstellen, ihr Dealbreaker Nr. 3 ist sauber vermieden. Neu gebrochen: Sie liest Pläne als Ganzes; der Fokus-Tag lässt sich nicht mehr als Ganzes lesen, obwohl die Wochenansicht genau diesen Knopf hat.

## Kleinere Beobachtungen

- is-done und is-optional teilen sich --ink3: an Block E/F ist Erledigt nur am Häkchen erkennbar.
- Der Warm-up ist kein Block, sondern ein Halbsatz hinter zwei Griffen — in einem Interface, dessen These "ein Ablauf" lautet, fehlt der erste Schritt.
- Die Ausfall-Regel steht auf dem Fokus-Tag ganz am Ende, gebraucht wird sie mitten drin.
- b.min steht als Chip im Blockkörper, bei geschlossenem Block also unsichtbar. Eine Restzeit wäre aus vorhandenen Daten frei.
- setTimeout löscht nach 3s auch Fehlermeldungen.
- copyWhoopText hat keinen catch.
- .mchip-opt (warn auf warn-soft) ist der einzige Kontrastwert, der nur knapp besteht.
- blkStateKey enthält die Wochen-ID, aber kein Datum: derselbe Fokus-Tag zweimal trainiert erbt den Erledigt-Zustand.
- Der zweite nav-back am Seitenende ist der einzige Inline-Style im sonst tokenisierten Blatt.
- "2 × 3 + 2 × 3" bricht bei 375px mitten in der Angabe um; stackSteps deckt + nicht ab.

## Fragen

1. Wenn der Peek die Zahl trägt — wozu ist der Block dann noch zu? Wäre die ehrlichere Antwort auf "zu viel Text": alle Blöcke offen, aber die Übungsnotizen hinter einen Griff pro Übung? Das Akkordeon versteckt gerade Zahlen, um Text zu verstecken.
2. Warum hat der Umbau die zwei Tage angefasst, die schon strukturiert waren, und die vier gelassen, die es nicht sind?
3. Wenn der Erledigt-Zustand einen Reload überlebt, warum überlebt er dann nicht die Wochenplanung?
4. Warum ist "Erledigt" ein Knopf am Ende des Blocks und nicht der Blockkopf selbst, der ohnehin immer sichtbar ist?

## Einschraenkungen

Assessment A hat den Desktop-Viewport nicht visuell geprüft (Browser stellte das Kompositieren ein) und den Dark Mode nicht gerendert; beides ist durch die Messungen von B abgedeckt. Fokus-Tag A wurde von A nicht im Browser geöffnet, die Peek-Aussagen sind aus dem Code gegen data.js abgeleitet — vom Orchestrator gegengeprüft und bestätigt.
