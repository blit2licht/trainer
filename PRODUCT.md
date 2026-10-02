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

Zwei bestätigte Nutzungsszenen, nach Härte der Anforderung:

1. **Im Gym am Handy, mitten im Satz.** Kurzer Blick zwischen zwei Sätzen oder
   vor dem WOD, oft mit Magnesium an den Händen, wechselndes Licht, Zeitdruck.
   Diese Szene stellt die härtesten Anforderungen und gewinnt im Konflikt.
2. **Nach der Einheit: Rückmeldung erfassen.** Im Open Gym das
   Verdict je Block (Done/Fail), an jedem Tag die Notiz — direkt nach dem
   Training am Handy.

Planung und Fortschrittsblick laufen in Claude-Code-Sessions, nicht in der App.
Die Werkstatt am Desktop wurde am 30.09.2026 verworfen (nie genutzt).

## Product Purpose

Trainer 3.0 ist die **Handy-Seite eines KI-Coaches mit versioniertem Gedächtnis**
(`coach/`). Seit dem 30.09.2026 ist die Box die Hauptbühne. Ab W42 gilt im
Regelfall 3 Box + 1–2 Open Gym (~75 min, Technik und aktive Lastprogression bei
Snatch und Clean & Jerk; im Datenmodell der Tagestyp `own`, bisher „eigene
Einheit“). Die App tut zwei Dinge:

- **Plan ausliefern:** den freigegebenen Wochenplan an die Box bringen — an
  Box-Tagen das WOD mit Level und Ansage, im Open Gym die Blöcke mit
  Lasten.
- **Rückmeldung erfassen:** Verdicts und Notizen entgegennehmen, damit der
  Coach die nächste Woche auf dem aufbaut, was tatsächlich passiert ist.

Lasten, Ceilings und Ziele pflegt der Coach von Hand (`coach/state.json`,
`coach/profile.json`). Eine Engine, die Lasten automatisch aus Verdicts ableitet,
war geplant und ist am 30.09.2026 eingestellt worden.

Erfolg bedeutet: Martin findet den Tag im Gym ohne Nachdenken, die Rückmeldung
kostet einen Tap oder einen Satz, und der Plan nimmt ihm nichts von dem weg, was
das Training in der Class ausmacht.

## Positioning

Keine generische Fitness-App und kein WHOOP-Ersatz, sondern die Ausführungsseite
eines persönlichen Coaches. Der Plan begründet sich selbst (`warum` je Tag und
Übung, am Handy ausklappbar), und die Antwort steht auf der Titelseite, nicht
hinter einem Prompt. Die Lastentscheidung bleibt bei Martin und seinem Coach.

## Operating Context

- **Wochenrhythmus.** Der Coach schreibt die Planquelle
  `coach/plan/<jahr>-W<nr>.json`; `scripts/build_payload.py` erzeugt daraus
  `website/data.js`. Der Payload trägt die laufende und die nächste Woche,
  vergangene Wochen zeigt das Handy nicht.
- **Rückkanal.** Verdict per Done/Fail-Tap im Open Gym
  (`save_verdict.php`, Rückspiegelung über `get_verdicts.php`; bei `technical`
  nach Fail die Rückfrage Technik/Last). An Box-Tagen die Tagesnotiz; an Tagen
  mit Zielkontakt (Snatch, C&J) ein Satz mit Top-Last und sauber ja/nein. Ein
  fehlendes Verdict ist nie ein Miss.
- **Recovery** filtert am Trainingstag (Abschnitt „Recovery und Steigerungen“ in
  `coach/instructions.md`), nie in der Wochenplanung und nie auf der Website.
- **Übungs-Registry** `coach/exercises.json`: `ex_id`, Name, Kurzname, Aliasse,
  `class`.
- **Datenquellen.** Recovery/HRV/Schlaf aus intervals.icu
  (`scripts/pull_wellness.py`), Gewicht aus Withings (`scripts/pull_weight.py`,
  BIA-Körperfett wird ignoriert), WODs aus DreamWOD per Schnittstelle, Verdicts
  und Notizen aus der Website-DB.
- **Deployment.** Push auf `main` mit Änderung unter `website/` → GitHub Actions
  → SFTP auf IONOS. Ein
  Deployment gilt erst als erfolgreich, wenn https://training.martinwitte.de
  die aktuelle Wochen-ID ausliefert. `website/config.php` existiert nur auf dem
  Server. Endpoints mit Schreibzugriff tragen ein Shared Secret.
- **Technische Referenz:** `coach/architecture.md` (Planquelle, Registry,
  Verdict-Kanal, Altlasten). Der Vorgänger 2.0 liegt nur noch in der
  Git-Historie.
- **Offener Ausbau:** `coach/auftraege/app-paket-box-tag.md` (Box-Tag als
  Hauptansicht, Verdict auf dem Zielblock, WOD-Score, Taille) — ohne Termin.

## Capabilities and Constraints

**Bestätigte Randbedingungen (bindend):**

- **Ausführungsseite bleibt eine HTML-Datei ohne Build-Schritt — die Daten
  dürfen generiert sein** (präzisiert 2026-08-22): beim Planungs-Commit
  entsteht ein schlanker Handy-Payload, den die Seite lädt. Keine Frameworks,
  kein Build auf dem Handy. **Keine native iOS-App** (Entscheidung 2026-08-22);
  bei realer PWA-Lücke ein Capacitor-Wrapper um dieselbe Seite, kein
  Swift-Neubau.
- **Deutsch als einzige Sprache.** Fachbegriffe (WOD, RPE, BMU, EMOM, Ceiling,
  Verdict) bleiben englisch.
- **Keine Entscheidungsunterstützung bei der Lastkappung auf der Website**
  (Entscheidung 2026-08-20, gilt fort): kein Recovery-Eingabefeld, keine
  automatisch reduzierten Lasten im Gym.
- **Keine Tracker.** Externe CDNs (Schriften) ausdrücklich erlaubt
  (Entscheidung 2026-08-19).
- **Kein unnützer Text am Handy.** Coach-Prosa (`plan_note`, `note`) erreicht
  das Handy nie; Begründungen sind eingeklappt; keine Wochenrückschau.

**Technische Fakten:**

- Vanilla JS im Frontend. Backend: einzelne PHP-Endpoints gegen MariaDB
  (`get_notes.php`, `save_note.php`, `save_verdict.php`, `get_verdicts.php`,
  `cron_summary.php`).
- Kein Service Worker: `website/sw.js` ist ein Kill-Switch für den alten
  2.0-Worker. Der Cache-Stempel in `index.html` sorgt für frische Stände.
- `session_feel` ist abgeschafft (Entscheidung 2026-08-31); die DB-Spalte
  bleibt als Historie (siehe Altlasten in `coach/architecture.md`).

## Brand Commitments

- Name der Anwendung: „Training · Martin" (Manifest), Kurzform „Training".
- Kein Branding in der Kopfzeile — die Navigation ist bewusst markenlos.
- Domain: training.martinwitte.de.
- **Die Wahl der Schrift ist ausdrücklich kein Markenwert** (Entscheidung
  2026-08-20): Maßstab ist Lesbarkeit unter Gym-Bedingungen. Die gültige
  Designwelt steht in `DESIGN.md`.
- Ton: sachlich, verdichtet, begründend. Der Plan behauptet nicht, er belegt.
  Zustände tragen Worte, nie nur Farbe.

## Evidence on Hand

- Echte Trainingshistorie seit 2026-W25 in `coach/logbook.md`,
  Sechs-Wochen-Reviews unter `coach/reviews/`, Entscheidungsprotokoll in
  `coach/decisions.md`.
- Ziele, geparkte und geschlossene Ziele in `coach/profile.json`; aktuelle
  Arbeitszahlen in `coach/state.json`.
- Wellness- und Gewichtsreihen in `coach/wellness.json` und `coach/weight.json`.
- Historische Satzdaten in WHOOP, per gezielter Detailabfrage erschließbar.
- Video-Analyse-Pipeline (`scripts/analyze_video.py`, MediaPipe) für konkrete
  Technikfragen.
- **Nicht vorhanden und nicht erfindbar:** Nutzerzahlen, Testimonials,
  Vergleiche, Preise, medizinische Messwerte jenseits der genannten Quellen.

## Product Principles

1. **Die Box gewinnt.** Im Konflikt zwischen Lesbarkeit unter Gym-Bedingungen
   und allem anderen gewinnt die Ausführbarkeit mitten im Satz.
2. **Jede Zahl ist belegt.** Lasten tragen ihre Begründung (`warum`), Ceilings
   ihr Bestätigungsdatum. Eine Empfehlung, die man nicht nachvollziehen kann,
   ist eine, der man aufhört zu vertrauen.
3. **Rückmeldung ist Teil des Produkts.** Sie kostet nie mehr als einen Tap
   oder einen Satz; ein fehlendes Verdict ist Unsicherheit, kein Miss.
4. **Vorschlag, nie Automatik.** Der Coach schlägt vor, der Mensch entscheidet.
   Recovery filtert am Tag, nicht im Plan.
5. **Kein zweites Vollprogramm neben der Box.** Die App zeigt das Box-Training
   und das Open Gym. Das Open Gym hat eine eigene Aufgabe (Technik und aktive
   Lastprogression bei Snatch und Clean & Jerk) und ist kein Lückenfüller.

## Accessibility & Inclusion

Keine produktspezifische Anforderung erhoben. Faktisch relevant bleiben die
Bedingungen der Nutzungsszene 1: hoher Kontrastbedarf bei wechselndem Licht,
große Trefferflächen für unpräzise Bedienung mit Magnesium an den Händen,
Zustände nie nur über Farbe codiert. Der Dark-Mode folgt der Systemeinstellung.
