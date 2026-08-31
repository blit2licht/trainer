---
name: Trainer 3.0 · Dunkelkammer
description: Trainingsumgebung als Dunkelkammer — Tonwertleiter, Sicherheitslicht, Notation statt Bild
colors:
  g0: "oklch(11% 0.006 62)"
  g1: "oklch(14.5% 0.007 62)"
  g2: "oklch(18% 0.008 62)"
  g3: "oklch(22% 0.009 62)"
  g4: "oklch(28% 0.010 62)"
  g5: "oklch(36% 0.011 62)"
  g6: "oklch(47% 0.012 62)"
  g7: "oklch(61% 0.012 62)"
  g8: "oklch(76% 0.010 62)"
  g9: "oklch(88% 0.008 62)"
  g10: "oklch(97% 0.005 62)"
  amber: "oklch(80% 0.152 72)"
  amber-ink: "oklch(14% 0.02 62)"
  amber-dim: "oklch(34% 0.075 68)"
  good: "oklch(80% 0.14 152)"
  good-dim: "oklch(32% 0.07 152)"
  logged-done: "oklch(40% 0.080 152)"
  logged-fail: "oklch(40% 0.080 68)"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 8.5vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 88"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 7.5vw, 3rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 86"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "23px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Spline Sans Mono, ui-monospace, monospace"
    fontSize: "11.5px"
    fontWeight: 700
    letterSpacing: "0.13em"
rounded:
  none: "0px"
spacing:
  xs: "10px"
  sm: "14px"
  md: "16px"
  lg: "20px"
  xl: "30px"
components:
  button-go:
    backgroundColor: "{colors.g10}"
    textColor: "{colors.g0}"
    rounded: "{rounded.none}"
    padding: "0 20px 0 18px"
    height: "48px"
  button-verdict:
    backgroundColor: "transparent"
    textColor: "{colors.g7}"
    rounded: "{rounded.none}"
    width: "64px"
    height: "46px"
  teststrip-target:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.none}"
---

# Design System: Trainer 3.0 · Dunkelkammer

## Overview

**Creative North Star: „Die Dunkelkammer"**

Der Plan ist Notation, kein Bild. Die Oberfläche schreibt Lasten so, wie sie
am Whiteboard stehen, und verweigert sich sowohl dem Kartenfeed mit
Fortschrittsringen als auch der abgebildeten Hantel. Eine einzige elfstufige
Tonwertleiter (g0–g10) regelt die gesamte Hierarchie; Struktur entsteht aus
Haarlinie, Spalte und Leere — nie aus Kästen. Bernstein ist Sicherheitslicht,
kein Neon: es markiert das Offene, Armierte, das Ziel. Grün trägt
ausschließlich Bestätigtes.

Gebaut für genau eine Szene, die jeden Konflikt gewinnt: Martin im Gym,
mitten im Satz, Magnesium an den Händen, wechselndes Licht. Deshalb: große
Zahlen, Ein-Tap-Ziele, Zustände in Worten, kein unnützer Text.

**Key Characteristics:**
- Eine Tonwertleiter, keine zweite Skala für Sonderfälle
- Linien statt Kästen, flach statt Schatten
- Amber = offen/Ziel, Grün = bestätigt, immer wortbegleitet
- Notation im Whiteboard-Duktus: Repschema groß, „@ Last" daneben
- Nur Vollzugsdaten — Coach-Prosa erreicht die Fläche nie

## Colors

Warmgraue Leiter (Hue 62) mit zwei funktionalen Akzenten.

### Primary
- **Sicherheitslicht** (`amber`, oklch(80% 0.152 72)): heute-Markierung,
  Zielband des Teststreifens, offene/armierte Zustände, Fail-Urteile,
  Blockkopf-Flags. Auf Amber-Flächen schreibt `amber-ink`.
  `amber-dim` (oklch(34% 0.075 68)) für Klammern/Ränder (Superset-Linie).

### Secondary
- **Bestätigt-Grün** (`good`, oklch(80% 0.14 152)): ausschließlich für
  Bestätigtes — ✓-Urteil, „Steht"-Zeile, Done-Hover. `good-dim` als Rand.

### Neutral
- **Tonwertleiter g0–g10** (oklch, Hue 62): g0 Grund, g1 zweite Fläche
  (Textarea, Ruhetag-Feld), g2 feine Trennlinie, g4 Trennlinie, g5 Ränder,
  g6/g7 Sekundärtext, g8–g9 gehobener Text, g10 die Zahl.
  Rollen-Mapping: `--ground`=g0, `--rule`=g4, `--rule-2`=g2, `--ink`=g10,
  `--ink-2`=g7, `--ink-3`=g6, `--marker`=amber.

### Named Rules
**Die Eine-Leiter-Regel.** Jedes Grau kommt aus g0–g10 über die Rollen-Tokens;
nirgends wird eine Farbe direkt benutzt. Der helle Modus kehrt dieselbe
Leiter um (g0=oklch(98.5% 0.003 62) … g10=oklch(12% 0.006 62)); die Akzente
werden auf die Helligkeit des Grundes gebracht (amber→58 %, good→52 %).

**Die Sicherheitslicht-Regel.** Amber glüht nie: kein Glow, keine Leuchtkante,
kein Verlauf. Es ist Licht im abgedunkelten Raum, keine Reklame.

**Die Wortcodierungs-Regel.** Farbe ist nie das einzige Signal — jeder
Zustand trägt Wort oder Zeichen (Steht/Fail·Technik/Offen, ✓/✕).

**Die Milchglas-Regel.** Erledigtes tritt hinter Milchglas: geloggte
Block-Buchstaben stehen in `--logged-done` bzw. `--logged-fail` — eigene
Rollen mit erhaltenem Farbton (152° / 68°), nicht als Mischung gegen den
Grund. Die frühere `color-mix`-Fassung zog auch den Farbton mit und ließ
Done und Fail auf 24° zusammenfallen (gemessen 30.08.). Tiefschwarz (g10)
gehört nur dem Offenen.

## Typography

**Display Font:** Archivo (variabel, mit system-ui-Fallback) — die
Breitenachse `wdth` ist Gestaltungsmittel: 86–92 für Titel, 112–124 für
Zahlen und Monumentales.
**Body Font:** Archivo
**Label/Mono Font:** Spline Sans Mono (Maße, Etiketten, Zeit, Meta)

**Character:** Whiteboard-Notation — verdichtete, schwere Grotesk für das,
was zählt; Mono für alles Gemessene. `font-variant-numeric: tabular-nums`
gilt global.

### Hierarchy
- **Display** (800–900, clamp(2rem–3.25rem) bzw. Kennzahl bis clamp(4.25rem–6rem),
  lh ≤1, −0.03…−0.05em, wdth 88/124): Tagestitel und Tages-Kennzahl. Auf
  Fokus-Tagen führt seit dem 31.08. der Inhalt statt einer Zahl: dieselben
  Kurznamen wie in Spalte 3 der Wochenzeile, clamp(1.5rem–2.05rem), wdth 112.
  Eine Tages-Kennzahl ohne benannte Quelle steht nicht mehr auf der Karte.
- **Headline** (800, clamp(1.9rem–3rem), wdth 86): Fokus-Titel.
- **Title** (800, 23px, wdth 112): Repschema-Zeile „5 × 2 @ BW" — führt die
  Übung; 20px/700/wdth 92 für Übungsnamen, 16px für Tageszeilen.
- **Body** (400, 17px, lh 1.45): Fließ- und Zellentext, 15–15.5px sekundär.
- **Label** (700, 11–13px, +0.13em, UPPERCASE, Mono): Skirt, Flags,
  Buttons, Meta (Reihenfolge Tempo · Rest · RPE), Zustandsworte.

### Named Rules
**Die Notations-Regel.** Eine Zeile Repschema mit Gewicht („5 × 2 @ BW");
ändert sich Schema oder Gewicht, entsteht eine neue Zeile. Zusätze
(„unbroken") stehen darunter im Label-Grad, nie daneben. Nur der
mehrstufige Lastaufbau wird zum Teststreifen.

## Layout

Eine Spalte, max. 520px-Lesefluss am Handy; Desktop (≥1100px) zweispaltig
1fr + 300px Apparat-Randspalte, Container max 1320px. Sticky-Schiene oben
(52px) trägt die Wochen-ID links und das Verbindungszeichen rechts; die
Meso-Angabe entfällt am Handy ganz (Martin 31.08.: im Gym irrelevant).
Wochenliste als Grid 92px · 22px · 1fr · auto (Tag · Typ-Symbol · Einheit ·
Verdict-Zustand); Heute-Zeile
mit Bernstein-Feld (`color-mix(amber 14%, ground)`), Ruhetag mit g1-Feld,
beide über Zeilenbreite (Bleed ±14px). Rhythmus: 10/14/16/20/30px;
Blockkopf → Inhalt bewusst eng (10px).

**Die Zentrier-Regel.** Nach jedem Verdict scrollt der nächste offene Block
in die Viewport-Mitte (smooth, `block:'center'`).

**Die Linien-Regel.** (Martin, 22.08., an der Werkstatt.) Haarlinien trennen
Elemente derselben Sektion (Zeilen, Blöcke: `rule-2`/`rule`); Sektionen
untereinander trennt ausschließlich Abstand — nie eine Linie. Zeilen im
Lagebild-/Listenraster sitzen auf einer Mittellinie (`align-items:center`),
keine Baseline-Sprünge; überlange Einheits-Labels wandern als kleine Zeile
unter die Zahl, die Zahl bricht nie.

## Elevation & Depth

Keine Schatten. Tiefe entsteht ausschließlich über die Tonwertleiter
(Flächen g0/g1, Linien g2/g4) und über Zurücktreten: Erledigtes wird grau
und klappt ein. Interaktion antwortet mit Farb-/Randwechsel (0.14s,
cubic-bezier(.16,1,.3,1)), nie mit Erhebung.

## Shapes

Radius 0 überall. Rechteckige Felder, 1px-Haarlinien, 2px-Klammerlinie für
Supersets. Icons sind gezeichnete Strich-SVGs (stroke 2, round caps, 18px):
Puls=Cardio, Hantel=Fokus, Stoppuhr=Box, Pause=Ruhe. Der Teststreifen ist
die Signaturform: aneinandergesetzte Bänder, Ton steigt mit der Last
(`color-mix(g1→g5 über --z)`), das Zielband in Amber mit großer Zahl.

## Components

### Buttons
- **Shape:** rechteckig (0px), Mono-Label, uppercase, +0.13em
- **Go („Zur Einheit"):** Tinte auf Grund invertiert (g10/g0), 48px hoch;
  Hover → Amber mit weißer Schrift
- **Verdict:** ✕ links, ✓ rechts; 64×46px Symbolflächen, 1px-Rand g5,
  rechtsbündig; Hover ✓ → good, Rückfrage-Buttons (Technik/Last) als
  Wortflächen in Amber
- **Hover / Focus:** Rand-/Farbwechsel 0.14s; Fokus 2.5px Amber-Outline,
  Offset 3px

### Cards / Containers
- Keine Karten. Blöcke sind Abschnitte mit 1px-Trennlinie (g4), Monogramm-
  Buchstabe (wdth 124, bis 3.6rem) + Titel + Flags in Amber; geloggt:
  eingeklappt, Name g6, Buchstabe Milchglas-Grün/-Bernstein, ✓/✕ (17px)
  rechts neben dem Titel.

### Inputs / Fields
- **Notiz-Textarea:** g1-Fläche, 1px g4-Rand, 15.5px Archivo; Fokus-Rand g6;
  Placeholder g6. Kein Session-Rating auf Fokus-Tagen — Verdict je Übung
  ersetzt es.
- **Session-Feel (nur Box-/Rad-Tage, Paket 3 Strang 1):** vier Ein-Tap-Ziele
  in der Tagesansicht (`.feel`), je Wort UND Zahl — 1 Mies · 2 Zäh · 4 Gut ·
  5 Stark (DB-Skala 1–5, höher = besser; die Mitte „Okay" entfällt, weil die
  Coach-Signale nur ≤2 und 4–5 lesen). Tap speichert sofort, erneuter Tap
  nimmt zurück; gewählt = Amber-Rand + Amber-Text.
- **Save:** wie Go-Button; Fehlerzustand als Amber-Textzeile.

### Navigation
- Sticky-Schiene: Mono-Label „2026 W34" links, Verbindungszeichen rechts.
  Keine Meso-Angabe. Zurück-Pfeil als Strich-SVG + „Zur Woche".
- **Ein Navigationsmodell** (Paket 3 Strang 1): jeder Trainingstag wechselt
  per Tap in eine Tagesansicht — Fokus-Tage in die Block-/Verdict-Seite,
  Box-/Rad-Tage in eine WOD-Seite mit Session-Feel und Notiz am Ende.
  Ruhetage reagieren nicht. Das Inline-Akkordeon der Wochenliste (Chevron,
  `strip-body`) ist entfallen.
- **Zustandszeichen der Wochenliste** in der vierten Spalte, nur Zeichen,
  kein Wort (Martin 31.08.): Haken = geloggt, leerer Kreis = offen,
  gefüllter Viertel-/Halb-/Dreiviertelkreis = teilweise. Grün für geloggt,
  Bernstein sonst; das Wort steht im `aria-label`. Ein geloggter Tag tritt
  grau zurück, bleibt aber stehen — er ist der Eingang zum Nachtrag.
- **Verbindungszeichen** ganz rechts, dauerhaft, nie als Satz: Wolke =
  Serverstand, durchgestrichene Wolke = Funkloch (angezeigt wird der
  Gerätespiegel), Schloss = Secret abgelehnt, Gerät = Stub ohne Server.
  15px Strich-SVG, grau im Ruhezustand, Amber wenn der Rückkanal nicht
  trägt; das Wort steht für Screenreader in der `.sr`-Zeile.

### Teststreifen (Signatur)
Lastaufbau als belichtete Probestreifen: je Stufe ein Band mit Zahl,
Tonwert steigt, Ziel = Amber-Band mit Zahl in amber-ink
(clamp 1.6–2.3rem, wdth 118). Fußzeile „Zielsatz X kg · N Stufen" im Mono.

## Do's and Don'ts

### Do:
- **Do** jede Fläche aus der Leiter mappen (`--ground/--rule/--ink…`),
  hell wie dunkel.
- **Do** Zustände doppelt codieren: Farbe + Wort/Zeichen.
- **Do** Repschema als „N × M @ Last" in einer Zeile führen; Zusätze darunter.
- **Do** Wiederholtes streichen: jede Information genau einmal pro Screen.
- **Do** Amber sparsam: heute, Ziel, offen, Fail — sonst nichts.

### Don't:
- **Don't** Karten, Schatten, Radien, Verläufe, Glow oder Scanlines.
- **Don't** Coach-Prosa (`note`, `intro`, warum) auf die Handy-Fläche.
- **Don't** Wochen-ID, Tagestitel oder Typwort mehrfach zeigen.
- **Don't** Fortschrittsringe, gezeichnete Hanteln oder Icon-Dekor — Icons
  nur als Typ-Kategorisierung in der Wochenliste und als Verbindungszeichen
  in der Schiene.
- **Don't** Zusatzlasten („+5 kg") als Tages-Kennzahl werten.
