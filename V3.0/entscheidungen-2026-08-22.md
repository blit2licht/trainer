# Trainer 3.0 — Entscheidungen aus der Ideation-Session 2026-08-22

Ergänzt `uebergabe-opengym-trainer-3.0.md` und die Konzeptskizze v2. Bei Widerspruch gilt dieses Dokument (neuer).

## Entschieden heute

1. **Produkt-Neupositionierung:** Trainer 3.0 ist eine self-hosted Trainingsumgebung
   (ein Nutzer: Martin, selbst gehostet wie bisher). Die PRODUCT.md-Sätze „kein
   Trainingsplan-Viewer, kein Tracking-Tool" erledigen sich damit. PRODUCT.md wird
   erst nach Abschluss der Ideation neu geschrieben.

2. **Zwei Räume, ein Produkt:**
   - **Handy = Ausführung.** Veröffentlichtes Soll + dünner Rückkanal (Verdict, Note).
     Bleibt dokumentartig und stabil.
   - **Werkstatt = Desktop, eigener Ort** (eigene Route auf demselben Origin, z. B.
     `/werkstatt`). Historie, e1RM-Kurven, Soll/Ist-Muster, Stagnationsflags.
     Kernsatz: **„Bewegt sich mein Fitnesslevel noch?" als Antwort beim Öffnen,
     nicht hinter einem Prompt** (Anti-WHOOP). Eigener Release-Takt.
   - e1RM-Kurven gehören NUR in die Werkstatt, nicht aufs Gym-Handy.
   - Ein Build-/Generierungsschritt für die Werkstatt darf entstehen (hebt das
     bisherige „kein Build-Schritt"-Verbot gezielt für diesen Raum auf).

3. **Leserechte der Website (löst Konflikt 1 der Übergabe-Review):**
   Neuer Read-Endpoint `get_verdicts.php` (analog `get_notes.php`), damit die Seite
   den gespeicherten Verdict-Zustand zurückspiegelt. Kein rein optimistisches
   UI — Serverstand ist sichtbar. Empfang im Gym ist gut, Offline-Puffer bleibt
   trotzdem (Übergabe 4.2).

4. **Verdict-UI (ersetzt Dreistufen-Button aus Übergabe 2.3 / Skizze v2):**
   Einheitliche Geste für alle Klassen: **Done / Fail**. Bei `class: technical`
   folgt nach Fail eine Zwei-Wort-Rückfrage **Technik / Last** (`miss_reason`).
   Datenmodell unverändert. Drei nebeneinanderliegende Buttons sind verworfen
   („UX-seitiger Müll" — Martin).
   Verdict hängt an der Übung, nicht am Block. „Block erledigt" aus dem
   Dunkelkammer-Entwurf entfällt zugunsten des Übungs-Verdicts.

5. **Soll/Ist-Diff auf der Website:** Martin soll „80 statt 82,5" sehen.
   **Konflikt 2 entschieden (abends, 22.08.): Weekly.** Der Diff entsteht beim
   Weekly-Paste und lebt in der Werkstatt (Sektion Soll/Ist-Muster), nicht am
   Handy — die Ist-Last existiert nur im WHOOP-Paste-Kanal (4.1), und ein
   Wochenrückblick gehört laut handy-konzept.md §2b ohnehin nicht aufs Handy.
   Der reservierte Diff-Platz im Handy-Layout (handy-konzept.md §4) bleibt in
   W35 leer. Ein späteres Same-Day-Feld (kg bei Fail-Last) bliebe additiv
   möglich, ohne Schemaänderung. Herleitung: `datenmodell.md` §6.

6. **Backfill (Übergabe OFFEN 6.8):** Beim Setup über gezielte WHOOP-Prompts für
   die wichtigsten Movements — die Daten liegen in WHOOP vor. „Historie ab
   soliden Einträgen"; kein `unknown`-Rauschen für die Zeit davor.

7. **Endpoint-Absicherung (Übergabe OFFEN 6.6):** bestätigt — Shared-Secret-
   Mechanismus für `save_verdict.php` (Ein-Nutzer, Secret z. B. im localStorage),
   entsteht mit dem Endpoint, wird nicht nachgerüstet.

8. **`skill`-Klasse (Übergabe OFFEN 6.2):** bestätigt — Skills bekommen
   Treppen-Logik aus den bestehenden Gymnastics-Progressionstreppen in
   `coach/profile.json` (BMU, T2B, WPU, HSPU), in die Registry überführt,
   keine Neuerfindung.

9. **Engine-Scope (Übergabe OFFEN 6.4), abgeleitet bestätigt:** Box-Tage bleiben
   außerhalb der Verdict-/Progressions-Logik; dort führt das WOD,
   Session-Rückmeldung über bestehendes `session_feel`.

10. **Plattform-Entscheid Mobile (Nachtrag, abends):** Keine native iOS-App
    (Xcode/Deploy aufs Gerät) — aus funktionalen Gründen, nicht aus Prinzip:
    (a) bricht den Kern-Loop „Claude schreibt, git push, live" (Xcode-Build +
    Signing je Iteration; ohne Dev-Account 7-Tage-Ablauf), (b) kein
    Anforderungs-Feature setzt nativ voraus — Homescreen, Vollbild,
    Offline-Verdict-Puffer leistet die bestehende PWA, (c) doppelte Pflege
    von Rendering + Verdict-Logik für einen Nutzer. Falls später eine reale
    PWA-Lücke im Gym auftritt: Capacitor-Wrapper um dieselbe Seite, kein
    Swift-Neubau. Mac-Zentrale = Werkstatt (bereits Entscheid 2).

11. **Ein-Datei-Prämisse präzisiert (Nachtrag, abends):** „Kein Build-Schritt"
    war Einfachheitsprämisse, kein Dogma. Sie **fällt für die Daten**: beim
    Planungs-Commit wird ein schlanker Handy-Payload generiert (nur
    Vollzugsdaten: ex_id, target, Kurzname, focus_label, superset — Prosa wie
    note/intro erreicht das Handy nie; vgl. handy-konzept.md §2b und die
    dortigen Schema-Anforderungen). Gleicher Mechanismus wie der
    `derived.js`-Kandidat aus Konflikt 2. Die Seite selbst bleibt eine
    HTML-Datei, die den generierten Payload lädt; der „Build" läuft in der
    Claude-Session, nie auf dem Handy.

## Datenmodell-Session (abends, 22.08.)

Entwurf in `datenmodell.md` — konsolidiert die Schema-Anforderungen beider
Konzeptdateien. Dort zusätzlich von Martin entschieden:

12. **Konflikt 2 / Diff-Timing: Weekly** (in Punkt 5 eingearbeitet).
13. **Front Squat = `technical`** — Ceiling-geführt in Blöcken, kein
    mechanischer −10-%-Deload.
14. **Weighted Pull-up = `skill` mit Treppe** (Abweichung von Übergabe 2.2,
    die WPU als `loadable` listete): die Stufenregeln aus profile.json steuern
    das Verhalten, nicht die 2×Hit→+2,5-Regel.
15. **`target`-Modi (Übergabe OFFEN 6.3) entworfen:** `kg | bw | bw_plus |
    time | band`, Intervall orthogonal als `interval`-Feld. Details §3.

## Weiter offen

- WHOOP-Paste-Format: reales Sample nötig, bevor der Parser spezifiziert wird
  (Übergabe OFFEN 6.1).
- Doppelprogression für Rep-Range-Accessories (Übergabe OFFEN 6.7).
- Sync-Details Offline-Puffer (Übergabe OFFEN 6.5).
- Scope/Umfang der Werkstatt-Ansichten (welche Fragen genau, Reihenfolge).

## Design-Anschluss (Stand Dunkelkammer-Entwurf, design/dunkelkammer.html)

- `warum` (Pflicht, maschinenerzeugt) = sichtbarer Beleg an der Übung — Konzept
  „Apparat/Begründung" trägt das bereits.
- Teststreifen zeigt `target`; Diff-Darstellung braucht drei Zustände:
  erfüllt / abgewichen / unknown.
- Zwei Textsorten sauber trennen: `warum` (kurz, abgeleitet) vs. `note`
  (Prosa-Kontext) — nie gleich aussehen lassen.
