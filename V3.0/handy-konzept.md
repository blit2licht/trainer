# Trainer 3.0 — Handy-Seite (Ausführungsraum), Konzeptstand 2026-08-22

Von Martin bestätigt. Dunkelkammer-Entwurf (design/dunkelkammer.html) ist
Rohmaterial, nicht Vorgabe.

1. **Done/Fail im Satz.** Ein Verdict-Ziel pro Übung, am Ende des Übungsblocks,
   volle Breite, ein Tap. Done: Übung setzt sich ab, bleibt als Spur stehen
   (kalter Akzent, durchgestrichene Station), verschwindet nie. Fail: an Ort
   und Stelle Zwei-Wort-Rückfrage **Technik / Last** — nur bei `technical`;
   `loadable` ist mit Fail fertig. Angezeigt wird der Serverstand
   (`save_verdict.php`-Antwort), nie die Tap-Annahme; Offline-Puffer stumm.
   Ersetzt „Block erledigt".

2. **`warum` wird am Handy NICHT angezeigt.** (Revidiert 2026-08-22 am
   Clickdummy — Martin: „‚Warum' wollten wir nie zeigen.") `warum` bleibt
   Pflicht-Datenfeld für Engine, Audit und Werkstatt; die Ausführungsseite
   zeigt nur das Soll. Auch Prosa-`note`/`intro` gehören nicht auf die
   Handy-Fläche.

2b. **Grundprinzip: kein unnützer Text.** (Martin, 2026-08-22, bindend.)
   Die Handy-Seite zeigt ausschließlich Vollzugsdaten: Übung, Soll, Trigger.
   Keine Wiederholungen (Wochen-ID, Titel, Notizen mehrfach), keine
   Wochenrückschau am Handy (keine Wochenwahl — nur die aktuelle Woche),
   keine Coach-Prosa. Das ist auch eine Backend-/Schema-Frage: data.js trägt
   heute Prosa (`note`, `intro`, lange Zellen-Notizen), die das Frontend gar
   nicht erst erreichen darf — Content-Reduktion gehört ins 3.0-Schema,
   nicht in CSS. Der Übungsname führt den Block, nicht die Zahl allein.

3. **`unknown` ist rückwärtsgewandt.** Am Tag selbst nur „noch kein Verdict".
   Vergangener Fokus-Tag ohne Verdict zeigt explizit „offen" (kein Alarmrot)
   und erlaubt **Nachtrag direkt dort**. Fallback-Kette damit:
   Button → Nachtrag auf der Seite → WHOOP → Recap-Nachfrage.

4. **Diff: Platz reserviert.** Ist als zweiter Wert neben Soll („82,5 → 80"),
   drei Zustände erfüllt/abgewichen/offen. Erscheinungszeitpunkt = offener
   Konflikt 2; die Seite funktioniert vollständig ohne.

## Optisch abgenommen 2026-08-22 (Clickdummy V3.0/handy.html)

Acht Kommentar-Runden am Artifact, Martin: „optisch sind wir fertig."
Referenzstand = V3.0/handy.html (Dunkelkammer-Basis + Verdict). Kern der
abgenommenen Interaktion:

- Wochenansicht: Heute ausgeklappt oben (nur Wochentag + Fokus-Label),
  darunter „Die Woche" komplett Mo–So; Heute Bernstein-Feld, Ruhetag
  Grau-Feld inkl. grauem Wochentag; Tagestyp als Strich-Symbol in eigener
  Spalte; Fokus-Zeilen in Kurzform („Gymnastics · BMU, T2B, HSPU, PU");
  Last als Spanne „40–60 kg"; Zusatzlasten („+5 kg") nie Tages-Kennzahl.
- Detail: kein Stationsband, Zeit als „40–65 min"; Rep-Schema groß
  „5 × 2 @ BW" (Zusätze wie unbroken darunter); Meta Tempo · Rest · RPE;
  Teststreifen für Lastaufbau; Superset als Amber-Klammer, Rest gilt dem
  Paar; Verdict an jedem Block (✕ links, ✓ rechts, kleine Symbolflächen);
  geloggter Block klappt ein, wird grau, Buchstabe „Milchglas"-Grün/-Bernstein,
  ✓/✕ rechts neben Titel; nach dem Abhaken zentriert der nächste offene
  Block; Session-Rating entfernt, Notiz-Textfeld bleibt.

## Schema-Anforderungen aus den Kommentar-Runden (für W35-Datenmodell)

Alle sieben Punkte in `datenmodell.md` aufgelöst (Registry `kurz`, `focus_label`,
`superset`, `band`-target-Modus, generic-Klasse für loggbare Layer/Cool-down-Blöcke,
session_feel-Wegfall auf Fokus-Tagen). Ursprungsliste zur Nachverfolgung:

Im Dummy hart verdrahtet, produktiv Datenfelder:

1. **`focus_label` je Fokus-Tag** („Oly-Fokus", „Gymnastics-Fokus") — Woche/Tag.
2. **Kurzname je `ex_id` in der Registry** (BMU, T2B, HSPU, PU, Snatch, OHS …)
   für die Wochenlisten-Kurzform.
3. **`superset`-Kennung am Block** (+ Rest gilt dem Paar, nicht dem Einzelsatz).
   Martin: fehlende Kennzeichnung war im Training real verwirrend.
4. **Band-Stärke/-Farbe im `target`** („rotes Band") — gehört zu OFFEN 6.3
   (target-Modi jenseits kg).
5. **Klammerzusätze wie „(Stufe wiederholt)" gehören nicht in Titel** —
   Planungsprosa, die das Handy nicht erreicht (siehe 2b).
6. **Session-Feel entfällt auf Fokus-Tagen** (Verdict je Übung ersetzt es);
   an Box-Tagen bleibt `session_feel` der Rückkanal — Erfassungsort dort noch
   offen.
7. Verdict-Ziele auch für Layer/Cool-down-Blöcke (jeder Block loggbar) —
   generische ex_id oder Registry-Erweiterung klären.
