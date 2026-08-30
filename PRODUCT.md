# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Ein einziger Nutzer: Martin, 45, seit 13+ Jahren CrossFit, trainiert in einer voll
ausgestatteten Box. Selbst gehostet, kein Mehr-Nutzer-Betrieb geplant und keiner
vorgesehen — Design- und Architekturentscheidungen dürfen ausdrücklich auf genau
diesen einen Athleten optimieren.

Unter `personas/` liegen fünf Review-Linsen. **Martin Witte (04) ist die
verbindliche** — sie beschreibt den realen Nutzer, und sein Urteil entscheidet.
Die vier übrigen (Lena Hartkamp, Jonas Bendler, Maren Otholt, Tomasz Wilk) sind
ein **Review-Werkzeug**, keine Zielgruppe: Sie decken blinde Flecken auf, dürfen
Martin aber nicht überstimmen, und aus ihnen darf keine Feature- oder
Zielgruppenanforderung abgeleitet werden.

Drei bestätigte Nutzungsszenen, nach Härte der Anforderung:

1. **Im Gym am Handy, mitten im Satz.** Kurzer Blick zwischen zwei Sätzen, oft mit
   Magnesium an den Händen, wechselndes Licht, Zeitdruck. Dazu gehört jetzt der
   Ein-Tap-Rückkanal (Verdict). Diese Szene stellt die härtesten Anforderungen
   und gewinnt im Konflikt gegen die anderen beiden.
2. **Nach der Einheit: Rückmeldung erfassen.** Verdict pro Übung (Done/Fail),
   Session-Feel und Notiz, direkt nach dem Training am Handy.
3. **Werkstatt am Desktop.** Fortschritt prüfen, Historie und e1RM-Kurven lesen,
   Soll/Ist-Muster erkennen, mit Claude die nächste Woche planen — mit Zeit und
   großem Viewport.

## Product Purpose

Trainer 3.0 ist eine **self-hosted Trainingsumgebung** für einen Athleten:
Planung, Ausführung, Rückmeldung und abgeleitete Progression in einem System,
dessen Gehirn ein KI-Coach mit versioniertem Gedächtnis ist (`coach/`).

Zwei Räume, ein Produkt:

- **Ausführung (Handy):** liefert den freigegebenen Wochenplan an die Box und
  nimmt Verdicts und Notizen entgegen. Dokumentartig, stabil.
- **Werkstatt (Desktop, eigener Ort):** beantwortet beim Öffnen die Frage
  „Bewegt sich mein Fitnesslevel noch?" — Lagebild nach Meso-Zielen, Historie,
  e1RM-Kurven, Soll/Ist-Muster, Regel-Treue. Eigener Release-Takt.

Leitprinzip der Datenarchitektur: **Das Log ist unantastbar, alles andere wird
abgeleitet.** Ausgeführte Sätze (Website-DB, WHOOP-Paste) sind die einzige
Wahrheit; Prescriptions werden bei jeder Ableitung deterministisch neu berechnet
(`scripts/derive_state.py` → `coach/derived.json`), nie als Zähler fortgeschrieben.

Erfolg bedeutet: Martin führt den Plan im Gym ohne Nachdenken aus, ein Tap
genügt als Rückmeldung, und die nächste Woche baut nachweisbar auf dem auf, was
tatsächlich passiert ist.

## Positioning

Keine generische Fitness-App und kein WHOOP-Ersatz, sondern eine persönliche
Trainingsumgebung mit auditierbarer Progression: Jede Zahl im Plan trägt ihre
maschinenerzeugte Begründung (`warum`-Pflichtfeld), jede Empfehlung ist eine
pure Funktion der Historie, und Fortschritt wird in vier ehrlichen Währungen
gemessen (e1RM-Trend, Ceiling-Bestätigung, Treppenstufe, Gewichtstrend) statt in
einem Kunst-Score. Vorschlag, nie Automatik: die Lastentscheidung bleibt bei
Martin und seinem Coach. Abgrenzung zu WHOOP: die Antwort steht auf der
Titelseite, nicht hinter einem Prompt.

## Operating Context

- **Wochenrhythmus.** Neue Woche vorne in `weeks[]` in `website/data.js`;
  die Seite zeigt maximal vier Wochen. Fokus-Übungen tragen künftig `ex_id`,
  `target`-Objekt und `warum` (maschinenlesbares Soll).
- **Rückkanal (Ist), zwei Kanäle, kein Doppel-Logging:**
  Verdict per Done/Fail-Tap auf der Website (`save_verdict.php`, Rückspiegelung
  über `get_verdicts.php`; bei `technical` nach Fail die Rückfrage Technik/Last);
  Satzdetails aus dem WHOOP Weekly Paste, geparst zur Planungszeit.
  `unknown` bewegt nie Last; Fallback-Kette Button → Nachtrag auf der Seite →
  WHOOP → Recap-Nachfrage.
- **Ableitung zur Planungszeit, nie live im Gym.** `derive_state.py` läuft nur
  in Claude-Code-Sessions; Output `coach/derived.json` mit `derived_at`.
  Recovery-Gate danach, nie davor (Recovery < 50 %: kein Steigerungssatz,
  RPE-Cap 7; die Engine sieht Recovery nie).
- **Übungs-Registry** `coach/exercises.json` (~15 Einträge): `ex_id`, Aliasse,
  `class` (loadable | technical | skill), `increment`, `rep_cap_e1rm`.
- **Datenquellen.** Recovery/HRV/Schlaf aus intervals.icu
  (`scripts/pull_wellness.py`), Gewicht aus Withings (`scripts/pull_weight.py`,
  BIA-Körperfett wird ignoriert), WODs aus DreamWOD, Verdicts und Notizen aus
  der Website-DB.
- **Deployment.** Commit auf `main` → GitHub Actions → SFTP auf IONOS. Ein
  Deployment gilt erst als erfolgreich, wenn https://training.martinwitte.de
  die aktuelle Wochen-ID ausliefert. `website/config.php` existiert nur auf dem
  Server. Endpoints mit Schreibzugriff tragen ein Shared Secret.
- **Migration 3.0 — abgeschlossen (30.08.2026, W36).** Bau W35, Parallel-Lauf
  unter `/v30/` in W35. Martin nutzte 2.0 in W35 nicht mehr, deshalb
  Scharfschaltung vor dem geplanten Meso-4-Termin: `website/index.html` ist die
  3.0-App, `website/data.js` wird aus `coach/plan/` generiert, `/v30/` leitet
  auf `/` um, 2.0 liegt stillgelegt unter `archive/2.0/`. Offen bleibt die
  Engine (`derive_state.py` Phase 1, read-only gegen die handgepflegten
  Referenzen). Konzeptdokumente versioniert in `V3.0/*.md`.

## Capabilities and Constraints

**Bestätigte Randbedingungen (bindend):**

- **Ausführungsseite bleibt eine HTML-Datei ohne Build-Schritt — die Daten
  dürfen generiert sein** (präzisiert 2026-08-22 abends): beim Planungs-Commit
  entsteht ein schlanker Handy-Payload (nur Vollzugsdaten; Coach-Prosa
  erreicht das Handy nie), den die Seite lädt. Keine Frameworks, kein Build
  auf dem Handy. **Werkstatt:** eigener Generierungsschritt erlaubt
  (Entscheidung 2026-08-22). **Keine native iOS-App** — funktionale
  Begründung in `V3.0/entscheidungen-2026-08-22.md` Nr. 10; bei realer
  PWA-Lücke Capacitor-Wrapper um dieselbe Seite, kein Swift-Neubau.
- **Deutsch als einzige Sprache.** Fachbegriffe (WOD, RPE, BMU, EMOM, Ceiling,
  Verdict) bleiben englisch, Glossar erklärt sie.
- **Keine Entscheidungsunterstützung bei der Lastkappung auf der Website**
  (Entscheidung 2026-08-20, gilt fort): kein Recovery-Eingabefeld, keine
  automatisch reduzierten Lasten im Gym. Das Recovery-Gate lebt in der Planung.
- **Keine Tracker.** Externe CDNs (Schriften) ausdrücklich erlaubt
  (Entscheidung 2026-08-19).
- **Vorschlag, nie Automatik.** Die Engine liefert Prescriptions mit
  Begründung; Commit bleibt bei Martin/Coach. Automatische Progression nur für
  `class: loadable`; `technical` bekommt nie eine automatische Prescription.

**Technische Fakten:**

- Vanilla JS im Frontend. Backend: einzelne PHP-Endpoints gegen MySQL/MariaDB
  (`get_notes.php`, `save_note.php`, künftig `save_verdict.php`,
  `get_verdicts.php`).
- PWA-Bestandteile vorhanden (Manifest, Service Worker network-first);
  Offline ist „nice to have", kein Must-have (Entscheidung 2026-08-19).
  Verdict-Taps puffern offline und syncen nach (last-write-wins).
- Der Routine-Renderer kennt feste Spaltennamen (`Übung`, `Sets × Reps`,
  `Dauer`, `Last`, `RPE`, `Tempo`, `Rest`/`Pause`, `Note`); WODs gehören ins
  `wod`-Objekt. Felder wie `f.intro` werden per `innerHTML` gerendert —
  Klartext-Ableitungen müssen durch `stripHtml()`.
- Box-Tage bleiben außerhalb der Verdict-/Progressions-Logik; dort führt das
  WOD, Rückmeldung über `session_feel`.

## Brand Commitments

- Name der Anwendung: „Training · Martin" (Manifest), Kurzform „Training".
- Kein Branding in der Kopfzeile — die Navigation ist bewusst markenlos.
- Domain: training.martinwitte.de; Werkstatt als eigener Ort auf demselben
  Origin.
- **Die Wahl der Schrift ist ausdrücklich kein Markenwert** (Entscheidung
  2026-08-20): Maßstab ist Lesbarkeit unter Gym-Bedingungen. Bestand nutzt
  Space Grotesk/Inter/JetBrains Mono; der Dunkelkammer-Entwurf Archivo/Spline
  Sans Mono — entschieden wird beim Redesign-Commit.
- Ton: sachlich, verdichtet, begründend. Der Plan behauptet nicht, er belegt.
  Zustände tragen Worte, nie nur Farbe.

## Evidence on Hand

- Echte Trainingshistorie seit 2026-W25 in `coach/logbook.md`,
  Sechs-Wochen-Reviews unter `coach/reviews/`, Entscheidungsprotokoll in
  `coach/decisions.md`.
- Bestätigte Leistungsstände und Ziele in `coach/profile.json` (u. a. Snatch 60,
  C&J 80, Front Squat 102,5, Strict HSPU 9 unbroken, T2B 16 unbroken) samt
  Gymnastics-Progressionstreppen — Grundlage der `skill`-Klasse.
- Wellness- und Gewichtsreihen in `coach/wellness.json` und `coach/weight.json`.
- Historische Satzdaten in WHOOP, per Prompt-Backfill für Kern-Movements
  erschließbar (Entscheidung 2026-08-22).
- Trainer-3.0-Konzeptstand: `V3.0/uebergabe-opengym-trainer-3.0.md`
  (Engine-Regeln, Datenmodell), `V3.0/entscheidungen-2026-08-22.md`,
  `V3.0/werkstatt-konzept.md`, `V3.0/handy-konzept.md`.
- Video-Analyse-Pipeline (`scripts/analyze_video.py`, MediaPipe) — Eskalationsziel
  bei wiederholten Technik-Fails.
- **Nicht vorhanden und nicht erfindbar:** Nutzerzahlen, Testimonials,
  Vergleiche, Preise, medizinische Messwerte jenseits der genannten Quellen.

## Product Principles

1. **Die Box gewinnt.** Im Konflikt zwischen Lesbarkeit unter Gym-Bedingungen
   und allem anderen gewinnt die Ausführbarkeit mitten im Satz.
2. **Jede Zahl ist belegt.** Prescriptions tragen ihre maschinenerzeugte
   Begründung (`warum`), e1RM-Werte ihre Quelle, Ceilings ihr
   Bestätigungsdatum. Eine Empfehlung, die man nicht auditieren kann, ist eine,
   der man aufhört zu vertrauen.
3. **Das Log ist unantastbar, alles andere abgeleitet.** Keine Zähler, die
   driften; eine korrigierte Notiz erzeugt deterministisch die korrigierte
   nächste Empfehlung. `unknown` ist nie ein Miss und bewegt nie Last.
4. **Rückmeldung ist Teil des Produkts.** Der Verdict-Tap ist der primäre
   Rückkanal; er wird nie zum Nebenschauplatz degradiert und kostet nie mehr
   als einen Tap.
5. **Vorschlag, nie Automatik.** Die Engine rechnet, der Mensch entscheidet.
   Recovery filtert nach der Ableitung, nie in ihr.
6. **Fortschritt in ehrlichen Währungen.** Vier Währungen je Zielklasse, kein
   Einheits-Score; Zustände heißen steigt/hält/stagniert/fällt und sind aus
   Daten ableitbar, nie handgesetzt.

## Accessibility & Inclusion

Keine produktspezifische Anforderung erhoben. Faktisch relevant bleiben die
Bedingungen der Nutzungsszene 1: hoher Kontrastbedarf bei wechselndem Licht,
große Trefferflächen für unpräzise Bedienung mit Magnesium an den Händen,
Zustände nie nur über Farbe codiert. Der Dark-Mode folgt der Systemeinstellung.
