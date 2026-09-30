---
target: website/index.html (Mobilversion)
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 3
timestamp: 2026-08-30T18-59-07Z
slug: website-index-html
---
Method: dual-agent (A: Design-Review-Agent · B: Detector/Browser-Agent)
Geprüft live bei 390×844, 375×812, 360×640, 430×932, dark + light.

# Critique · website/index.html (Handy, Operate) — 21/40 (Acceptable, unteres Ende)

| # | Heuristik | Score | Kernbefund |
|---|---|---|---|
| 1 | Systemstatus | 2 | Wochenliste verdict-blind — stripMarkup() liest vstore nie; geloggter Tag sieht aus wie ungeloggter |
| 2 | System/Realwelt | 3 | Stark; Bruch: Lastzelle „RPE-kalibriert" benennt keine Hantel |
| 3 | Kontrolle/Freiheit | 1 | „Woran lag's?" ohne Abbruch; askOpen überlebt Navigation (nie in showWeek() genullt) |
| 4 | Konsistenz | 3 | Diszipliniert; Last einmal Display-23px, einmal Mono-13,5px im selben Block |
| 5 | Fehlervermeidung | 1 | ✕/✓ 64×46 mit 10 px Lücke (Z. 534), kein Wort, kein Draft-Recovery |
| 6 | Wiedererkennen | 2 | Zwei Long-Press-Gesten ohne Anzeige; Teststreifen-Chips antippbar ohne Affordanz |
| 7 | Flexibilität | 2 | start() rendert immer die Wochenansicht; Fokusseite 2896 px = 3,1 Screens |
| 8 | Ästhetik/Minimalismus | 3 | Hoch; Tageskopf schreibt focus_label zweimal untereinander |
| 9 | Fehler-Recovery | 2 | Verdict-Fehler vorbildlich; Notiz verwirft den Text und spricht von „Vorschau" |
| 10 | Hilfe/Doku | 2 | Kein Glossar mehr in der Datei; „BEGRÜNDUNG" 6× pro Tag statt einmal am Ort |
| **Total** | | **21/40** | **Acceptable** |

Assessment A wollte Heuristik 10 als n/a führen; überstimmt, weil die App RPE/EMOM/Ceiling zeigt und mit den note-handle-Griffen eine bewertbare Doku-Ebene trägt.

## Design-Spezifität

Produkteigen, klar über der Kategorie-Schwelle: Teststreifen (Ton steigt mit --z, Zielband Bernstein), Monogramm-Blockalphabet wdth 124, Notationszeile „3 × 4 @ +5 kg", Radius 0 ohne Ausnahme.

Einschränkungen: die Signaturform erscheint nur an ramp-Lasten — der Gymnastics-Tag (28.08.) hat null Teststreifen und fällt auf eine generische Liste zurück. Die Wochenliste hält seit dem Entfall der Lastspalte eine leere vierte Grid-Spalte offen.

Deterministischer Scan: CLI detect.mjs → [], EXIT 0, sauber (einziger Roh-Treffer flat-type-hierarchy steht auf der Ignore-Liste). In-Page-detect.js, vier Kombinationen: week/dark 2 · day/dark 15 · week/light 3 · day/light 21. Werte bei 360/390/430 identisch. Kein Befund ist mobile-exklusiv — 1280×900 reproduziert jedes Kontrastpaar und die 38×38-Buttons; mobil ist nur die Konsequenz (Fingerziel, Außenlicht).

## Was trägt

1. Teststreifen. Löst den mehrstufigen Lastaufbau mit einer Form, die nur dieses Produkt haben kann, und ist gleichzeitig ein 76×56-px-Trefferraster. Der Zielsatz hebt sich über Fläche und Gewicht ab, nie über einen anderen Grad.
2. Rückkanal-Zustand als Zeichen. Vier eigene Formen (Wolke / durchgestrichen / Schloss / Gerät), Wort in der .sr-Zeile, bei Hydrate-Fehler zeigt vstore.mirrorRead den Gerätespiegel statt fälschlich „offen".
3. Notationszeile. exerciseMarkup() presst Schema und Gewicht in eine Zeile, Zusätze über die ||-Konvention darunter, Umschaltschwelle bei loadInline.length <= 12. Lange Übungsnamen brechen bei 360 px sauber, ohne Ellipse, ohne die Zahl zu zerreißen.

## Prioritätsprobleme

### 1. [P0] Wochenliste kennt den Verdict-Stand nicht — „Nachtrag möglich" hat keinen Eingang

stripMarkup() (~Z. 1265) rendert Tag, Symbol und Kurzform, liest vstore an keiner Stelle. Live verifiziert: Verdict für 2026-08-25|clean_jerk gespeichert, die DI-Zeile blieb unverändert.

Warum es zählt: Der Startbildschirm verbucht stumme Planerfüllung — genau der von Persona 04 benannte Vertrauensbruch. Die Fallback-Kette Button → Nachtrag → WHOOP reißt am zweiten Glied, weil dieses Glied unauffindbar ist.

Fix: Verdicts des Tages aus vstore.cache (Keys iso|ex_id) aggregieren und in die bereits leere vierte Grid-Spalte (.strip-load) setzen: ✓ in --good bei vollständig, --marker bei gemischt, vergangener Tag ohne Stand als Wort „offen" im vorhandenen .strip-load.is-word-Grad. renderWeek() läuft nach vstore.hydrate(), die Daten liegen bereit. Damit trägt die Zeile Farbe und Wort.

Kommando: /impeccable clarify

### 2. [P0] Notiz-Fehlerfall vernichtet den Text

wireNoteBlock() (~Z. 1740) hat im .catch() nur eine Statuszeile, kein nstore.set(), kein input-Autosave. Live verifiziert: Text eingegeben, Eintragen, Fehler, zurück — Textarea leer, localStorage.v3_notes === null. Die Kopie ist zusätzlich falsch: „Kein Backend in dieser Vorschau", obwohl die Datei seit dem 30.08. die Produktiv-App ist.

Warum es zählt: Verdict-Taps puffern offline, die Notiz nicht. Ein Funkloch löscht die einzige Meldung, die freiwillig entsteht.

Fix: Debounced nstore.set(iso, ta.value, …) bei jedem input; im catch dasselbe plus Statuszeile im Verdict-Vokabular („Nicht gespeichert · auf dem Gerät gesichert"); ungesyncten Entwurf flaggen und beim nächsten linkFetch-Erfolg nachschieben; das Wort „Vorschau" streichen.

Kommando: /impeccable harden

### 3. [P1] Ein Token drückt 20+ Textstellen unter AA, inklusive zweier Bedienelemente

--ink-3 = --g6 = oklch(47% 0.012 62) auf --ground ergibt 2,98:1 im Dark-Mode und 4,49:1 im Light-Mode. Betroffen: button#backBtn („Zur Woche", 2×), button.note-handle („Begründung", 7×), p.ex-meta > b (Tempo/Rest/RPE, 11×), focus-when, week-head, mv-detail, strip-date. Dazu drückt .strip.is-rest{opacity:.8} auf 2,89:1 — auch auf den 24px/900-Tagesbuchstaben, die damit die Large-Text-Schwelle von 3:1 verfehlen. .strip.is-today (amber-getönt) ist mit 2,60:1 der schlechteste Wert der Wochenansicht, ausgerechnet die Heute-Zeile. Im Light-Mode zusätzlich: --amber auf --ground 4,29:1 (10× „16 min", 6× „Offen · Nachtrag möglich") und --amber-ink auf --amber 4,34:1 im Zielchip.

Warum es zählt: Nutzungsszene 1 ist ausdrücklich „wechselndes Licht". Die Zeile, die heute markiert, ist am schwersten lesbar.

Fix: --ink-3 von g6 auf g7 (oklch 61 %) heben oder eine eigene Rolle für Text auf getönten Flächen einführen; die is-rest-Opacity durch eine Ton-Rolle ersetzen statt Deckkraft; den Zielchip auf ein dunkleres amber-ink setzen. Die Eine-Leiter-Regel bleibt gewahrt.

Kommando: /impeccable colorize

### 4. [P1] Verdict-Ergonomie widerspricht Produktprinzip 4

✕ und ✓ stehen rechtsbündig geclustert, 64×46, mit gap:10px (Z. 534), beschriftet nur per aria-label. Die seltene Rückfrage Technik/Last bekommt zwei volle Wortflächen über die Zeilenbreite; die häufigste Aktion bekommt eine unbeschriftete Glyphe. askOpen (Z. 986) wird in showWeek() nie genullt — nach einem Fehltap auf einer technical-Übung ist der einzige Ausweg ein Reload oder ein geschriebener miss. Dazu ist a.timer-btn hart auf 38×38 gesetzt (Z. 644–649), viermal pro Fokusseite.

Fix: dritter gleichrangiger Ausgang im askOpen-Zweig (askOpen = null; rerender()), plus askOpen = null in showWeek() und am Kopf von showFocus(); .vbtns auf justify-content:space-between (✕ links, ✓ rechts) statt Cluster, gap ≥24 px; .vbtn auf ≥56 px Höhe mit Mono-Label DONE/FAIL unter dem Zeichen, damit die Wortcodierungs-Regel auch am Knopf gilt; .timer-btn auf 44×44.

Kommando: /impeccable harden

### 5. [P1] Tageskopf doppelt, größte Zahl der App ohne Herkunft

renderWeek() setzt .today-when auf focusLabel(today.focus), headMarkup() die H1 aus d.einheit, das aus day.focus_label stammt — dasselbe Wort, 40 px auseinander. Und objFigure() (Z. 1179–1180) berechnet src: o.source, renderWeek() rendert fig.n und fig.u, aber fig.src nie. „95 KG" steht monumental da, ohne Angabe wovon — und 95 ist die Front-Squat-Spitze, nicht der C&J-Komplex, der den Tag inhaltlich führt (82,5).

Warum es zählt: Martins Dealbreaker Nr. 1 („eine Zahl, deren Herkunft niemand benennen kann") trifft die prominenteste Stelle der App; die Doppelung verletzt das DESIGN.md-Don't „Tagestitel nicht mehrfach zeigen".

Fix: base.einheit für day_type === 'own' aus day.kurzform speisen (liegt im Payload: „C&J, FS, Core"); unter .today-figure eine Mono-Zeile esc(fig.src) im --ink-3-Grad ergänzen.

Kommando: /impeccable distill

## Was der Detector fand und Assessment A nicht

- 11 Teststreifen-Chips (div.ts[data-tick], Z. 1449–1452) haben Click-Handler mit localStorage-Persistenz, aber role="listitem", tabIndex=-1, kein aria-pressed, kein Key-Handler. Im getickten Zustand ist der Accessible Name leer: .ts.is-ticked .ts-kg{visibility:hidden} (Z. 458) und .ts-check ist aria-hidden. 44 interaktive Elemente, 33 fokussierbar.
- Die Heading-Outline der Day-View springt H1 → H3; die Blockebene A–E ist gar nicht als Heading ausgezeichnet (button.blk-toggle).
- .setup-in:focus{outline:none} (Z. 171) entfernt den einzigen Focus-Ring des Secret-Felds, Ersatz nur Border-Farbe.
- Kein horizontaler Page-Overflow bei 360/390/430; 0 Bilder ohne Alt, 0 Elemente ohne Accessible Name, 0 positive tabindex.

False Positives: col-main/viewWeek +14 px ist der absichtliche Full-Bleed der .strip-Zeilen, kein Page-Scroll · span.sr ist Standard-sr-only · die 24×24- und 18,5×21-Buttons gehörten dem Overlay-Banner selbst · skipped-heading in der Week-View ist ein Artefakt, weil #viewFocus als hidden im DOM bleibt · kicker-above-heading an p.today-when bestritten: strukturell Kicker, inhaltlich Wochentag und Fokus, also Information.

## Zwei Korrekturen an Assessment A

- „Zur Einheit existiert nicht" ist falsch aufgelöst: der Button steht in Z. 1219, aber nur bei today.focus. Der 30.08. ist ein Box-Tag, deshalb hat Assessment B ihn nie gesehen. Kein Befund.
- „BEGRÜNDUNG auf der Fläche" als Verstoß gegen handy-konzept §2 ist überholt: die Revision vom 23.08. erlaubt „warum" ausdrücklich eingeklappt. Befund bleibt nur die Menge (6× pro Tag) und der Kontrast des Griffs, nicht die Existenz.

## Persona-Rotflaggen

Martin (04, verbindlich): „95 KG" ohne Quelle · Wochenliste verbucht stumme Planerfüllung · „3 × 12 · RPE-kalibriert" ist eine offene Entscheidung am Trainingsmorgen ohne Referenzlast, mit „RPE ≤7" direkt darunter, also dieselbe Information zweimal in einer Übung · 6× „OFFEN · NACHTRAG MÖGLICH" auf einem vergangenen Tag · Milchglas trennt Done und Fail faktisch nicht: gemessen Done oklch(.317 .0462 89) gegen Fail oklch(.317 .0498 65) — gleiche Helligkeit, 24° Hue-Abstand bei Chroma 0,05, weil color-mix den Ton Richtung Grund (Hue 62) zieht. Bei 3,6 rem im Hallenlicht trägt allein das 20-px-Zeichen rechts.

Lena (01, Sprung zum Auffälligsten): Auf dem Gymnastics-Tag ist das Auffälligste dreimal Bernstein — „15 MIN KERNBLOCK", „8 MIN KERNBLOCK", „OFFEN · NACHTRAG MÖGLICH". Keine davon ist eine Last. „KERNBLOCK" steht an jedem nicht-optionalen Block und trägt damit null Information.

Jonas (02, Vorhersagbarkeit): Zwei 1,2-s-Long-Press-Gesten ohne jedes Zeichen (Tageszeile zur Zwischenablage, Rail zum Passwort-Popover). Modellkonflikt: dieselbe Geste bedeutet am Teststreifen-Chip „nur lokal" und am ✓ „schreibt in den Log", ohne visuellen Unterschied. askOpen überlebt zwei Ansichten.

## Kleinere Beobachtungen

- @media (max-width:430px){.rail-meso{display:none}} greift bei genau 430 px noch: auf jedem aktuellen iPhone erscheint „Meso 3 · Woche 4" nie, die Schiene ist am Handy zu rund 76 % leer, obwohl DESIGN.md ihr genau diesen Job zuschreibt.
- ::selection{background:var(--marker);color:#fff} und .go:hover setzen Weiß auf Amber statt amber-ink; iOS behält :hover nach dem Tap.
- Kein Service Worker registriert (sw.js ist seit dem 30.08. ein Kill-Switch). Die Offline-Zeichensprache der Schiene ist nur aus einer bereits offenen Seite erreichbar; im Funkloch lädt die App gar nicht.
- Schriften kommen ohne Cache-Schicht vom Google-CDN — die gesamte Notation (wdth, tabular-nums) hängt beim Kaltstart am Drittanbieter.
- meta name="theme-color" content="#171310" ist fest dunkel; im Light-Mode steht eine dunkelbraune Statusleiste über einer fast weißen Seite.
- Box-Tage (3 von 5 Trainingstagen in W35) haben keinen Ein-Tap-Rückkanal: session_feel ist hart auf 0 verdrahtet, der einzige Kanal ist eine Textarea im eingeklappten Akkordeon der Wochenliste, nicht dort, wo die Einheit endet. Beim Aufklappen steht das WOD zweimal auf demselben Screen.
- Rund 105 px Leere zwischen „ZUR EINHEIT" und „DIE WOCHE"; die Ruhetag-Karte ist nach dem Begründungs-Griff etwa 400 px nichts.
- Positiv im Code: localIso() statt toISOString(), stripHtml() im Apparat, blockSlug-Rückfall, .strip.is-last statt :last-of-type — die Kommentare dokumentieren durchweg das Warum.

## Fragen

1. Wenn der Verdict-Tap „das Produkt" ist — warum ist er das kleinste unbeschriftete Element, während die Rückfrage nach dem Fehlschlag zwei volle Wortflächen bekommt?
2. Wozu existiert „Nachtrag möglich", wenn kein Bildschirm der App je darauf zeigt?
3. DESIGN.md sagt „Keine Wochenwahl am Handy", die Rail hat einen Vorwärts-Umschalter mit VORSCHAU-Tag. Welches der beiden ist überholt?
