# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Ein einziger Nutzer: Martin, 45, seit 13+ Jahren CrossFit, trainiert in einer voll
ausgestatteten Box. Kein Mehr-Nutzer-Betrieb geplant und keiner vorgesehen —
Design-Entscheidungen dürfen ausdrücklich auf genau diesen einen Athleten
optimieren.

Unter `personas/` liegen fünf Review-Linsen. **Martin Witte (04) ist die
verbindliche** — sie beschreibt den realen Nutzer, und sein Urteil entscheidet.
Die vier übrigen (Lena Hartkamp, Jonas Bendler, Maren Otholt, Tomasz Wilk) sind
ein **Review-Werkzeug**, keine Zielgruppe: Sie decken blinde Flecken auf, dürfen
Martin aber nicht überstimmen, und aus ihnen darf keine Feature- oder
Zielgruppenanforderung abgeleitet werden. Lena ist zusätzlich ausdrücklich als
Impulsgeberin ohne Verbindlichkeit gekennzeichnet.

Drei bestätigte Nutzungsszenen, nach Härte der Anforderung:

1. **Im Gym am Handy, mitten im Satz.** Kurzer Blick zwischen zwei Sätzen, oft mit
   Magnesium an den Händen, wechselndes Licht, Zeitdruck. Diese Szene stellt die
   härtesten Anforderungen an Lesbarkeit, Trefferflächen und Sprungnavigation und
   gewinnt im Konflikt gegen die anderen beiden.
2. **Nach der Einheit: Notiz erfassen.** Session-Feel, tatsächliche Lasten und
   Bemerkungen direkt nach dem Training eintragen, ebenfalls am Handy.
3. **Wochenplanung mit Claude am Desktop.** Plan prüfen, mit Vorwochen vergleichen,
   Reviews lesen — mit Zeit und großem Viewport.

## Product Purpose

Die Website ist die **Ausgabeoberfläche eines KI-gestützten Trainingscoachs**: Sie
liefert den freigegebenen Wochenplan an den Ort, an dem er ausgeführt wird — die
Box — und nimmt die Rückmeldung entgegen, aus der die nächste Wochenplanung
entsteht.

Das Repository ist das versionierte Gedächtnis dieses Coachs (`coach/`), die
Website (`website/`) sein einziger veröffentlichter Teil. Erfolg bedeutet: Martin
kann den Plan im Gym ohne Nachdenken ausführen, und die erfassten Notizen sind
gut genug, dass die nächste Woche darauf aufbauen kann.

## Positioning

Kein Trainingsplan-Viewer und kein Tracking-Tool, sondern die Oberfläche eines
Coachs mit Gedächtnis: Jede Zahl im Plan lässt sich auf eine bestätigte
Vorleistung, eine dokumentierte Entscheidung oder eine Progressionsregel
zurückführen (`coach/state.json`, `coach/decisions.md`, `coach/profile.json`).
Der Plan ist begründet, nicht generiert — Notizfelder wie `session_feel` fließen
nachweisbar in die Folgewoche zurück.

## Operating Context

- **Wochenrhythmus.** Eine neue Woche wird als Objekt vorne in `weeks[]` in
  `website/data.js` eingefügt; die Seite zeigt maximal vier Wochen.
- **Zwei Ansichten.** Wochenübersicht (`#view-week`, sieben Tageskarten mit den
  Typen Focus/Box/Ride/Ruhetag) und Fokus-Tag-Detail (`#view-focus`, Blöcke A–F
  mit Übungstabellen, Recovery-Anpassung und kopierbarem WHOOP-Klartextblock).
- **Datenquellen.** Recovery/HRV/Schlaf aus intervals.icu
  (`scripts/pull_wellness.py`), Gewicht aus Withings (`scripts/pull_weight.py`,
  BIA-Körperfettwert systemweit ignoriert), WODs aus DreamWOD, Notizen aus der
  eigenen Website-Datenbank (`get_notes.php`).
- **Deployment.** Commit auf `main` → GitHub Actions → SFTP auf IONOS. Ein
  Deployment gilt erst als erfolgreich, wenn https://training.martinwitte.de die
  aktuelle Wochen-ID aus `data.js` ausliefert. `website/config.php` existiert nur
  auf dem Server und wird nie überschrieben.
- **Design-Sandbox.** `design/build.py` erzeugt aus dem `<style>`-Block von
  `index.html` eine Komponenten-Preview nach `design/bundle/`. Der Weg zurück in
  die App ist bewusst manuell; es gibt keine zweite CSS-Fassung.

## Capabilities and Constraints

**Bestätigte Randbedingungen (bindend):**

- **Single-File-HTML ohne Build-Schritt.** `website/index.html` bleibt eine Datei
  mit Inline-CSS und Inline-JS. Keine Bundler, keine Frameworks, kein
  Transpilierschritt. `data.js` ist die einzige Datei, die pro Woche wächst.
- **Deutsch als einzige Sprache.** Keine i18n-Anforderung. Fachbegriffe (WOD, RPE,
  BMU, EMOM, Ceiling) bleiben englisch und werden im Glossar in `data.js` erklärt.
- **Keine Tracker.** Externe CDNs sind dagegen ausdrücklich erlaubt
  (Entscheidung 2026-08-19) — Schriften und vergleichbare Assets dürfen von
  fremden Hosts geladen werden.

**Technische Fakten:**

- Vanilla JS, keine Dependencies im Frontend. Backend sind vier einzelne
  PHP-Dateien (`get_notes.php`, `save_note.php`, `notes_db.php`,
  `cron_summary.php`) gegen eine MySQL-Datenbank.
- PWA-Bestandteile sind vorhanden: `manifest.json` (standalone, `theme_color`
  `#1c1a15`) und ein Service Worker mit Network-first-Strategie und
  Cache-Fallback für same-origin GETs.
- Farbtokens in OKLCH, Light- und Dark-Theme, 13 Tokens aus `:root`.
- Der Routine-Renderer kennt nur feste Spaltennamen: `Übung`, `Sets × Reps`,
  `Dauer`, `Last`, `RPE`, `Tempo`, `Rest`/`Pause`, `Note`. Alles andere wird
  stillschweigend verworfen. WODs gehören ins `wod`-Objekt, nicht in
  `headers`/`rows`.
- Felder wie `f.intro` werden per `innerHTML` gerendert und enthalten echtes
  Markup — Klartext-Ableitungen (WHOOP-Copy) müssen durch `stripHtml()`.

**Explizit offen / ungeklärt:**

- **Offline-Fähigkeit ist „nice to have", kein Must-have** (Entscheidung
  2026-08-19). Der Service Worker existiert und funktioniert; vorhandenes
  Verhalten erhalten, aber Offline-Betrieb rechtfertigt keine Einschränkung an
  anderer Stelle und darf einer besseren Lösung weichen.

## Brand Commitments

- Name der Anwendung: „Training · Martin" (Manifest), Kurzform „Training".
- Kein Branding in der Kopfzeile — die Navigation ist bewusst markenlos.
- Domain: training.martinwitte.de.
- Schriftfamilien im Bestand: Space Grotesk (Display), Inter (Text),
  JetBrains Mono (Zahlen/Lasten), geladen von `fonts.googleapis.com`.
  **Die Wahl der Schrift ist ausdrücklich kein Markenwert** (Entscheidung
  2026-08-20): Maßstab ist Lesbarkeit unter Gym-Bedingungen, nicht
  Unverwechselbarkeit. Ein Austausch ist jederzeit zulässig, wenn er die
  Lesbarkeit verbessert.
- Ton: sachlich, verdichtet, begründend. Der Plan behauptet nicht, er belegt —
  Notizen im Plan nennen den Grund für eine Entscheidung, nicht nur die Anweisung.

## Evidence on Hand

- Echte Trainingshistorie seit 2026-W25 in `coach/logbook.md`, Sechs-Wochen-Reviews
  unter `coach/reviews/`, Entscheidungsprotokoll in `coach/decisions.md`.
- Bestätigte Leistungsstände und Ziele in `coach/profile.json` (u. a. Snatch 60 kg,
  C&J 80 kg, Front Squat 102,5 kg, Strict HSPU 9 unbroken, T2B 16 unbroken).
- Echte Wellness- und Gewichtsreihen in `coach/wellness.json` und
  `coach/weight.json`.
- Video-Analyse-Pipeline mit MediaPipe (`scripts/analyze_video.py`, Auswertungen in
  `coach/video_analysis/`), bisher zwei ausgewertete Einzel-BMU-Clips.
- Komponenten-Preview mit unverändertem Produktions-CSS unter `design/bundle/`.
- **Nicht vorhanden und nicht erfindbar:** Nutzerzahlen, Testimonials, Vergleiche
  mit anderen Coaching-Produkten, Preise, medizinische oder physiologische
  Messwerte jenseits der oben genannten Quellen.

## Product Principles

1. **Die Box gewinnt.** Im Konflikt zwischen Lesbarkeit unter Gym-Bedingungen und
   allem anderen — Dichte, Eleganz, Vollständigkeit — gewinnt die Ausführbarkeit
   mitten im Satz.
2. **Jede Zahl ist belegt.** Lasten, Stufen und Wiederholungen tragen ihre
   Herkunft mit (Vorwoche, Testergebnis, Entscheidung). Nichts erscheint im Plan,
   was nicht auf `coach/` zurückführbar ist.
3. **Ein Ort der Wahrheit pro Sache.** Regeln, Tokens, CSS und Beschriftungen
   existieren genau einmal; abgeleitete Fassungen werden generiert, nie parallel
   gepflegt.
4. **Rückmeldung ist Teil des Produkts, nicht Zubehör.** Die Notizfunktion ist
   der Rückkanal, aus dem die nächste Woche entsteht — sie wird nie zum
   Nebenschauplatz degradiert.
5. **Der Plan ist verbindlich, die Anpassung geregelt.** Recovery-Kappung,
   Ausfallreihenfolge und Ruhetage sind explizite, sichtbare Regeln — keine
   stillen Ausnahmen.

## Accessibility & Inclusion

Keine produktspezifische Anforderung erhoben. Faktisch relevant bleiben die
Bedingungen der Nutzungsszene 1: hoher Kontrastbedarf bei wechselndem Licht,
große Trefferflächen für unpräzise Bedienung mit Magnesium an den Händen, und
Lesbarkeit im Vorbeigehen. Der Dark-Mode ist implementiert und folgt der
Systemeinstellung.
