# Trainer 3.0 — Werkstatt (Desktop-Raum), Konzeptstand 2026-08-22

Eigener Ort auf demselben Origin (z. B. `/werkstatt`), eigener Release-Takt.
Leitsatz: **„Bewegt sich mein Fitnesslevel noch?" ist die Antwort beim Öffnen,
nicht hinter einem Prompt** (Anti-WHOOP). Datengrundlage: `derived.json`-Export,
Verdict-Tabelle, wellness.json, weight.json, Plan-Archiv.

## Kernidee: vier Fortschrittswährungen

Kein Einheits-Score. Fortschritt misst sich pro Zielklasse in ihrer eigenen Währung:

| Klasse | Währung | Beleg |
|---|---|---|
| loadable | e1RM-Trend | berechnete Serie (Epley, rep_cap) |
| technical | Ceiling-Bestätigungen | coach-gepflegt, mit Datum |
| skill | Treppenstufe | bestätigte Stufe der Progressionstreppe |
| Körper | Wochentrend kg | Withings-Serie |

## Titelseite: Lagebild

Eine Zeile pro Ziel — große Zahl, benannter Zustand, Beleg:

```
SNATCH   60 → 60    hält       Ceiling zuletzt bestätigt 19.08.
RDL      e1RM 101,3 steigt     +2,4 in 4 Wochen
BMU      Stufe 2/4  steigt     4×3 bestätigt W34
OHS      55         stagniert  seit 5 Wochen keine neue Bestätigung
GEWICHT  79,1       fällt      −0,4/Woche, im Zielband
```

Entschieden (Martin, 2026-08-22):

1. **Lagebild zeigt die aktiven Meso-Ziele.** Andere Messgrößen erreichbar über
   Selektion, nicht dauerhaft im Lagebild. (Übererfülltes wie T2B 16/10 steht
   also nicht permanent herum.)
2. **Zustandswörter:** steigt / hält / stagniert / fällt — nie nur Farbe.
   **Stagniert = keine neue Währungseinheit seit 6 Wochen** (deckungsgleich mit
   dem Review-Rhythmus). Eine Schwelle für alle Klassen.
3. Zustände sind aus den Daten ableitbar, nie handgesetzt.

## Sektionen unterhalb des Lagebilds

1. **Übungsseite** (pro ex_id): e1RM-Kurve, Verdict-Historie als Zeile
   (Hit/Fail/unknown), Prescriptions mit `why`, Ceiling und e1RM getrennt
   nebeneinander (nie vermischt — Übergabe 2.5 sichtbar gemacht).
2. **Soll/Ist-Muster:** systematische Abweichungen, nicht Einzeltage
   („OHS: 3 der letzten 5 Zielsätze nicht angesteuert").
3. **Regel-Treue:** rückblickend Recovery-Gate gegen tatsächliches Verhalten
   (Steigerungssatz an <50-%-Tagen gefahren?). **Entschieden: rein — mit
   Snooze.** Abschaltbar für 2 Wochen, kommt danach von selbst wieder.
   Nie permanent deaktivierbar. Einziges Feature, das Martin bewertet statt
   sein Training; Snooze ist das Ventil.
4. **Muster-Balance** (aus Übergabe 1.10, Status Idee): unterversorgte
   Bewegungsmuster der Woche.
5. **Körper × Kraft:** Gewichtstrend gegen e1RM-Erhalt — macht die
   Performance-Leitplanke der Rekomposition sichtbar.

## Optisch abgenommen 2026-08-22 (Clickdummy V3.0/werkstatt.html)

Martin: „okay ist angenommen." Referenzstand = V3.0/werkstatt.html
(Dunkelkammer, synthetische derived-Daten). Kern: Lagebild als Titelseite
(Zeile je Meso-Ziel: Name/Klasse · Wert mit Label darunter · Zustandswort ·
Beleg, vertikal auf Mittellinie, Spalten bündig); Übungsseite mit Ceiling und
e1RM getrennt, 1,5px-Trace, Verdict-Historie, Prescription mit why nur bei
loadable; Soll/Ist-Muster; Regel-Treue mit 2-Wochen-Snooze; Körper × Kraft.
Layout-Doktrin daraus (DESIGN.md „Linien-Regel"): Haarlinien nur zwischen
Elementen derselben Sektion, Sektionen trennt Abstand.

## Planung aus der Werkstatt (Martin, 2026-08-23)

Zwei Buttons in der Werkstatt-Schiene: **Weekly Recap** und **Neue Woche
planen**. Klick öffnet ein Panel mit Textfeld für Besonderheiten (zeitliche
Limits, Infos); Recap fragt zusätzlich nach dem WHOOP-Recap-Paste. Übergabe
an Claude Code läuft rein lokal, ohne externe API:

- **Architektur-Entscheid:** Eine auf IONOS gehostete Seite kann keine
  lokalen Programme starten (Browser-Sandbox). Deshalb läuft die Werkstatt
  am Rechner vom lokalen Helper `scripts/werkstatt_serve.py`
  (http://localhost:8125, bindet nur 127.0.0.1). Design-Vorgabe
  „HTML auf Server" dafür bewusst umgangen — Funktion vor Umgebung
  (Martin-Freigabe 23.08.). Auf fremdem Origin blenden sich die Buttons
  automatisch aus (`/ping`-Probe).
- **Fluss:** Panel → POST `/auftrag` → Helper schreibt
  `V3.0/inbox/<zeit>-<typ>.md` (Besonderheiten + ggf. WHOOP-Paste) →
  öffnet Terminal mit `claude "<Auftrag, zeigt auf die Datei>"`. Die
  Prompts verweisen auf die CLAUDE.md-Trigger (Weekly Recap / Neue Woche).
- **Abschluss in Claude Code:** Alles Weitere passiert in der Session;
  committet und gepusht wird erst, wenn Martin die Session mit „committen"
  abschließt (bestehender Trigger).
- Start: `python3 scripts/werkstatt_serve.py` · Test ohne Terminal-Öffnen:
  `--dry-run`. End-zu-Ende getestet: dry-run (ping, beide Panels,
  Auftragsdatei, Fehlerpfad wortcodiert) und Live-Terminal-Start
  (Martin, 23.08.: „klappt gut").
- **Real-life-Setup (abgenommen 23.08.):** einmalig
  `bash scripts/werkstatt_install.sh` → LaunchAgent
  `de.martinwitte.werkstatt` (RunAtLoad + KeepAlive, Log /tmp/werkstatt.log);
  danach Werkstatt dauerhaft unter localhost:8125, als Dock-App via Safari
  „Zum Dock hinzufügen" (Seite verlinkt das Sicherheitslicht-Icon).
- Ausbauoption (bewertet): native Mac-App (Xcode/Menüleiste) statt
  Python-Helper — gleicher Fluss, mehr Komfort (Autostart), mehr
  Pflegeaufwand (Build/Signing). Erst sinnvoll, wenn der Helper nervt.

## Offen (Werkstatt-spezifisch)

- Reihenfolge/Gewichtung der Sektionen 2–5 nach erstem realen Gebrauch.

## Geklärt in der Datenmodell-Session (22.08., `datenmodell.md`)

- **Exportmechanismus:** `website/derived.js`, generiert aus `derived.json` +
  Plan-Archiv + wellness/weight. Erzeugt beim Weekly-/Recap-Commit (Konflikt 2
  = Weekly entschieden). Feldskizze in `datenmodell.md` §6.
- **Quelle der aktiven Meso-Ziele:** `state.json` Meso-Kontext (aktuelle_foki +
  Körperkomposition), keine eigene Markierung in profile.json.
