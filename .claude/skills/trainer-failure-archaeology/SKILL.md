---
name: trainer-failure-archaeology
description: >
  Chronik aller abgeschlossenen Untersuchungen, Sackgassen, Reverts und
  Doktrin-Wechsel dieses Repos — damit keine Session einen bereits
  entschiedenen Kampf neu ausficht. Nutzen bei Fragen wie: "warum ist X so",
  "gab es das schon mal", "wurde das schon versucht", "warum kein Basic Auth",
  "warum kein Stacking-Verbot", "warum liegt pfad.php im website-Ordner",
  "history", "incident", "revert", "past failures", "why was this reverted",
  "has this been tried before", "postmortem", "Entscheidungshistorie",
  "Doktrin-Änderung", "alte Regel".
---

# Trainer Failure Archaeology

Jeder Eintrag ist ein abgeschlossener (oder explizit offener) Kampf: **Symptom → Ursache → Belege → Status → Regel heute**. Alle Commit-Hashes wurden per `git show` gegen die echte Historie verifiziert (Stand: 2026-07-11, 52 Commits auf `main`, aktuelle Woche W28).

**Kernprinzip:** Wenn eine Frage hier als *settled* markiert ist, wird sie nicht neu aufgerollt — es sei denn, Martin bringt neue Fakten. Viele Regeln in `coach/instructions.md` sind Narbengewebe aus genau diesen Vorfällen; diese Skill erklärt das *Warum* hinter dem *Was*.

## Wann diese Skill NICHT die richtige ist

| Situation | Richtige Skill |
|---|---|
| Etwas ist JETZT kaputt (Deploy rot, Endpoint liefert nichts) | `trainer-debugging-playbook` (Live-Triage) |
| Was darf ich ändern, welche Gates gelten aktuell? | `trainer-change-control` |
| Wie ist das System heute aufgebaut, welche Invarianten gelten? | `trainer-architecture-contract` |

Diese Skill beantwortet nur: *Warum ist es so geworden? Wurde das schon versucht? Was ist die Vorgeschichte?*

---

## Teil 1: Technische Schlachten

### T1 — Basic-Auth-Saga (2026-06-21, settled)

Der größte technische Vorfall des Repos: zwei fehlgeschlagene Versuche mit Auto-Revert, dann Grundsatzentscheidung gegen Auth.

| Schritt | Commit | Was geschah |
|---|---|---|
| 1. Versuch | `c5de0bc` | "HTTP Basic Auth für gesamte Seite" (.htaccess + .htpasswd) |
| Auto-Revert | `0b53b9b` | Deploy-Verify schlug fehl → github-actions[bot] revertierte automatisch |
| 2. Versuch | `b27cc8e` | "korrekter AuthUserFile-Pfad für IONOS" |
| Auto-Revert | `cd6083f` | Wieder Verify-Fehlschlag → Bot-Revert |
| Auflösung | `840903d` | Basic Auth komplett entfernt, stattdessen `robots.txt` (Disallow: /) |

- **Symptom:** Seite sollte vor Fremdzugriff geschützt werden; jeder Auth-Versuch brach das Deployment (HTTP 500 durch falschen AuthUserFile-Pfad auf IONOS).
- **Eigentlicher Killer** (aus der Commit-Message `840903d`): iOS-Standalone-Mode (Add to Home Screen) ist **inkompatibel mit Basic Auth** → schwarzer Screen beim Öffnen des Homescreen-Icons. Selbst ein funktionierender Auth-Pfad wäre also verworfen worden.
- **Beleg für den Auto-Revert-Mechanismus:** `.github/workflows/deploy.yml` (Step "Revert failed deployment", Zeile ~65) — dieser Bot ist Absicht, kein Unfall.
- **Status:** settled. Die Seite ist bewusst ohne Auth; Schutz = nicht verlinkt + `website/robots.txt` sperrt Crawler.
- **Regel heute:** Kein Auth auf der Seite (nicht wieder vorschlagen). IONOS nutzt nicht-standardisierte interne Pfade — **vor jeder `.htaccess`-Änderung den tatsächlichen Pfad bestätigen, sonst HTTP 500** (`coach/architecture.md`, Abschnitt Hosting & Deployment).

### T2 — pfad.php: Debug-Relikt der Auth-Saga (offen)

- **Symptom/Herkunft:** `474a8e5` "Add pfad.php to display the current directory" — entstand am selben Morgen (2026-06-21, 10:11 Uhr) als Debug-Endpoint, um den echten IONOS-Serverpfad für `AuthUserFile` herauszufinden.
- **Inhalt:** genau eine Zeile `<?php echo __DIR__; ?>` — echot den Serverpfad öffentlich.
- **Status:** **offen.** Die Datei liegt Stand 2026-07-11 immer noch in `website/pfad.php` und wird mit deployed. Zweck erfüllt, nie aufgeräumt. Kandidat für Löschung — aber nur mit Martins Auftrag (Auftragsdisziplin Regel 6).
- **Regel heute:** keine dedizierte Regel; fällt unter "keine ungefragten Systemartefakte" — und umgekehrt: ungefragtes Löschen wäre derselbe Fehler.

### T3 — Favicon-Evolution: PHP-Icons → PNGs (settled, ein offener Rest)

| Commit | Was geschah |
|---|---|
| `4dd95ad` | apple-touch-icon.php angelegt (Icon als PHP-Endpoint) |
| `1971d81` | favicon.php angelegt |
| `745f371` | fix: falsche favicon-Bilddaten korrigiert |
| `651a8c5` | .htaccess-RewriteRules: `favicon.ico`/`apple-touch-icon.png` → icons/*.php |
| `6e5accf` | fix: apple touch icon war unvollständig ausgeliefert |
| `4b429fc` | Auflösung: echte PNGs (16/32/180/192/512) eingecheckt, in index.html verlinkt, **verwaiste favicon.php/apple-touch-icon.php gelöscht** |

- **Ursache der Churn:** Icons als PHP-Endpoints mit inline Bilddaten waren fehleranfällig (zweimal kaputte Daten in drei Tagen).
- **Status:** Icon-Auslieferung settled (statische PNGs in `website/icons/`).
- **Offener Rest (verifiziert 2026-07-11):** `website/.htaccess` enthält **immer noch die vier RewriteRules auf `/icons/favicon.php` und `/icons/apple-touch-icon.php`** — Dateien, die seit `4b429fc` nicht mehr existieren. Requests auf `/favicon.ico` laufen dadurch auf einen toten Pfad; die App selbst ist unbetroffen, weil `index.html` die PNGs direkt verlinkt. Aufräum-Kandidat, nur mit Auftrag.
- **Regel heute:** Icons sind statische PNGs mit `Cache-Control: public, max-age=2592000` (`website/.htaccess`); keine PHP-generierten Assets mehr.

### T4 — Website-UX-Churn: 9 Commits in ~20 Minuten (settled als Prozess-Lektion)

- **Symptom:** Am 2026-06-21 zwischen 11:03 und 11:23 Uhr neun aufeinanderfolgende UI-Commits: `cc4a86e` (UX-Paket) → `8541aa5`→`dba56d4` (Schatten-Sichtbarkeit der Heute-Karte, zweimal nachjustiert) → `9953f60`→`f22cf32`→`d6ee9e4`→`ef60c07`→`2ddd6ec`→`c4cc77c` (collapsed Cards, Toggle-Button, RPE-Anzeige, grüne Haken rein → wieder raus).
- **Ursache:** UI-Details werden gegen Martins reale Telefonnutzung kalibriert, nicht am Desktop entschieden. Erst-Entwürfe treffen selten; grüne Haken wurden z. B. innerhalb von 4 Minuten eingeführt (`ef60c07`) und wieder entfernt (`c4cc77c`).
- **Status:** settled (das damalige UI-Layout steht; PWA kam später sauber in Paketen: `d3893ec`, `90d9181`, `74a96d9`).
- **Regel heute:** keine formale Regel — aber Erwartungsmanagement: **Bei UI-Änderungen mehrere schnelle Iterationsrunden mit Martin am Handy einplanen.** Kleine Einzelcommits sind hier das gewollte Muster (jeder Push deployed und ist sofort am Gerät prüfbar).

### T5 — Dreifach-Commits "audit findings" + ungefragter claude.ai-Stub (settled)

- **Symptom:** Drei Commits mit identischer Message "fix: audit findings — load_references, profile corrections, claude.ai stub" innerhalb von 3 Sekunden (2026-06-15, 21:08 Uhr).
- **Rekonstruktion aus den Diffs:** `74be6e6` ist der **Initial-Import des gesamten Repos** (16 Dateien, 1193 Zeilen — CLAUDE.md, coach/, website/, deploy.yml), `893cb70` nur eine profile.json-Korrektur, `cb87802` legte `coach/claude_ai_stub.md` an (Fallback-Anleitung für claude.ai-Sessions ohne Repo-Zugriff). Eine logische Änderung wurde als drei Commits mit recycelter Message gepusht.
- **Auflösung:** `0abca4c` "remove misunderstood claude.ai stub" — der Stub wurde 3 Minuten später gelöscht. Er war ein **ungefragtes Systemartefakt**, das ein Audit aus eigenem Antrieb erzeugt hatte.
- **Status:** settled.
- **Regel heute:** Auftragsdisziplin Regel 6 in `coach/instructions.md`: *"Keine ungefragten Systemartefakte erzeugen"* — keine neuen Dateien, keine Kanon-Änderungen ohne expliziten Auftrag (geschärft in `1cc3b7c`).

### T6 — W26-Sonntag: falsches Format veröffentlicht (settled)

- **Symptom:** In `website/data.js` stand für Sonntag W26 ein Team-WOD als "3 RFT"; das echte Team-WOD war **10 RFT**.
- **Ursache:** Format wurde rekonstruiert/angenommen statt gegen die echte Quelle verifiziert.
- **Beleg:** `5e2353f` "data: W26-Sonntag korrigiert — echtes TeamWOD (10 RFT) statt 3 RFT" (Ein-Zeilen-Fix in data.js, 2026-06-23).
- **Verwandter Vorfall:** `8153c52` (2026-06-21) korrigierte einen **erfundenen W24-Focus-A-Ausfall** — Focus A war 1× ausgefallen (W25), nicht 2×; der halluzinierte W24-Ausfall wurde aus state.json, data.js und logbook.md entfernt. Derselbe Commit führte die Pflichtsektion "Quellen- und Verbindungsdisziplin" ein.
- **Status:** settled.
- **Regel heute:** `coach/instructions.md` Quellendisziplin Punkt 3 ("Fehlt eine Quelle, nachfragen. Nicht raten, nicht aus Plausibilität rekonstruieren.") und Referenzen-Abschnitt ("Benchmark-WODs … exaktes Format verifizieren. Nicht aus dem Gedächtnis rekonstruieren."). Verstärkt durch die 90-%-Konfidenzregel (Punkt 8, `437f9bb`).

### T7 — DreamWOD-Endpoint: Entdeckung + Throttling-Falle (settled)

- **Symptom:** Wochenprogramm der Box hing an manuellen Screenshots; nach Entdeckung des Ajax-Endpoints lieferten schnelle Serien-Requests plötzlich `false`/leere `workouts[]` bei HTTP 200 — sah aus wie "kaputt" oder "nicht veröffentlicht".
- **Ursache:** Die Seite drosselt schnelle Request-Serien (Soft-Block). Ein leeres Ergebnis ist **mehrdeutig**: Drosselung ODER noch nicht veröffentlichtes Programm.
- **Belege:** `092d911` (Endpoint dokumentiert: POST admin-ajax.php, doppelt kodiertes JSON, `&to=` als Teil EINES Werts; plus Daten-vor-Plan-Sequenz) und `47e3d7f` (Disambiguierung: bekannt veröffentlichte Vergangenheitswoche nachziehen — kommt die auch leer → Drosselung; kommt sie mit Daten → Programm hängt noch nicht).
- **Status:** settled.
- **Regel heute:** `coach/instructions.md` Referenzen-Abschnitt: eine Woche pro Request, ~30 s Abstand, "Hart kaputt = nur HTTP ≠ 200 oder Parse-Fehler". Fetch liefert das *programmierte* WOD, nicht das tatsächlich Gelaufene.

---

## Teil 2: Coaching-Methodik-Schlachten

### C1 — Recovery-Historie als Prognosequelle: ausgeschlossen (settled)

- **Symptom:** Tendenz, künftige Tagesform aus gestrigen/vergangenen WHOOP-Recovery-Werten vorherzusagen und Wochenstruktur daraus abzuleiten.
- **Ursache:** Naheliegender, aber falscher Schluss — Recovery-Werte prognostizieren nichts; sie sind nur am Ausführungstag gültig.
- **Belege:** `8153c52` (erste Fassung: "Recovery = Tagesform-Input, kein Strukturinput"), verschärft in `4bd6e0a` (2026-07-03): kompletter Doktrin-Absatz — "Recovery-Historie ist keine Prognosequelle. … Wenn ein aktueller Wert für den Entscheidungstag existiert, sind ältere Recovery-Werte für diese Tagesentscheidung irrelevant."
- **Status:** settled.
- **Regel heute:** `coach/instructions.md`, Doktrin-Absatz nach Quellendisziplin Punkt 8: Recovery ist **ausschließlich Day-of-Autoregulation** (RPE-Caps, Kürzung, Eskalation am Ausführungstag); Wochenstruktur kommt aus Trainingslogik.

### C2 — Stacking-Dogma: eingeführt und wieder abgeschafft (settled — echter Doktrin-Wechsel)

**Beide Zustände dokumentieren, damit niemand die alte Regel wiederbelebt:**

| Phase | Doktrin | Beleg |
|---|---|---|
| W25-Review (alt) | "Wochenende überholte Recovery … → **künftig kein Wochenend-Stacking**" | `3489fc7`, `coach/logbook.md` W25 |
| W26-Review (neu) | "Wochenend-Last ist vom Rest der Woche **entkoppelt** — relevant ist nur der akute Übertrag in die nächste Einheit … **Kein pauschales Stacking-Verbot mehr**" | `a1d55b2`, `coach/logbook.md` W26 |
| Kanonisierung | "**Kein Stacking-Dogma**"-Absatz in instructions.md | `437f9bb` |
| Operationalisierung | V7: "**Sonntagslast → Montag-Standard**" (Mo nie Schlüsselslot nach hartem So; Upgrade nur bei bestätigt grüner Mo-Recovery) | `9a9ab70` |

- **Warum der Wechsel:** W26 zeigte empirisch, dass ein harter Sonntag (Team-WOD + 2 Rides, Tagesstrain 19,6) mit Ruhetag danach die Folgewoche nicht beeinträchtigt — nur der Montag brauchte Autoregulation (32 % rot → Ruhe + Nap).
- **Status:** settled. Das pauschale Wochenend-Stacking-Verbot ist **abgeschafft**; wer es zitiert, zitiert die überholte W25-Doktrin.
- **Regel heute:** `coach/instructions.md` Absätze "Kein Stacking-Dogma" und "Sonntagslast → Montag-Standard".

### C3 — Snatch-Plateau: Fehldiagnose Last, echte Ursache Speed (settled)

- **Symptom:** W26 stoppte der Snatch bei 50 kg (Doubles), Ceiling 52 kg nicht erreicht.
- **Diagnose (W26-Review):** "Hüftspeed + Drop unter die Bar langsam → **nicht Last, sondern Speed** ist das Limit" (`coach/logbook.md` W26, `a1d55b2`).
- **Intervention (W27):** Speed-Bias — Snatch Balance + speed-gated Hang Squat Snatch, Focus A auf den frischesten Slot gelegt.
- **Ergebnis:** Ceiling **52,5 kg sauber erreicht**, "Catch spürbar schneller" (`coach/logbook.md` W27; `coach/state.json` `squat_snatch_ceiling`: "Speed-Baustelle aus W26 aufgelöst. W28: Ceiling anheben (z. B. 55 kg) prüfen").
- **Status:** settled. Speed-Bias funktioniert bei diesem Athleten; bei künftigen Oly-Plateaus zuerst Geschwindigkeits-/Positionslimit prüfen, nicht reflexhaft Last steigern.
- **Regel heute:** keine generische Kanon-Regel, aber gelebte Referenz in `coach/state.json` (Lastreferenz-Notes) und `coach/logbook.md` W26/W27.

### C4 — Focus A vom Team-WOD gefressen → "geschützter Slot" → autoregulierter Slot (settled)

- **Symptom:** W25 fiel Focus A (Snatch-Reclaim) aus — der Samstag wurde vom Team-WOD gefressen (`coach/logbook.md` W25; live dokumentiert in `34a44bb`: "Blöcke C+D gestrichen wegen Team-AMRAP"; Rest-Hinweis bereinigt in `7f74876`).
- **Erste Antwort:** W26 legte Focus A auf Montag als **"geschützten Slot"** (fixer Wochentag; `3489fc7`).
- **Verfeinerung:** `437f9bb` — geschützt heißt **"frisch und passend, nicht an einen Kalendertag gebunden"**; die Schlüssel-Einheit wandert an den frischesten Tag statt sklavisch auf einen fixen Slot. Flag "Snatch-Wochenanfang" im W26-Review aufgelöst (`coach/logbook.md` W26: "Timing wird ab jetzt autoreguliert statt fix").
- **Status:** settled.
- **Regel heute:** `coach/instructions.md` Absatz "Geschützte Slots sind frisch und passend, nicht an einen Kalendertag gebunden."

### C5 — Ad-hoc-Tausch W27: Kalibrierungs-Miss bei der Selbstvorhersage (settled, ein offener Rest)

- **Vorfall:** Beim W27-Tausch (Snatch Di statt Fr, BMU Sa, Fr Restday — `1d914af`) machte der Coach den vorhergesagten Fehler (fehlende Recovery-Abfrage vor Argumentation) — aber die Selbst-Kalibrierung übersah den **Sequenz-Fehler**: die Rückfrage kam NACH der inhaltlichen Argumentation statt davor (`coach/decisions.md`, Eintrag 2026-06-30).
- **Maßnahmen:** `7b4ad58` (Ad-hoc-Änderung-Regel + Diagnose-vor-Verordnung, decisions.md angelegt) und `1cc3b7c` (Auftragsdisziplin geschärft; unbestätigte physiologische Einschätzungen als Frage formulieren).
- **Status:** settled. **Offener Rest** (decisions.md, Stand 2026-07-11): DECISION_LOG-Pfad final klären — Obsidian-Vault "obsidian-challenge" im Aufbau, **noch nicht produktiv**. Bis dahin: `coach/decisions.md` im Repo ist der Ort.
- **Regel heute:** `coach/instructions.md` Abschnitt "Ad-hoc-Änderung": *Grund + Recovery erfragen VOR dem Urteil*, erst danach Begründung/Alternative/Trade-off. Und in "Lasten und RPE": nicht ableitbare Einschätzungen als Frage stellen, nicht behaupten.

### C6 — WHOOP-Rundung vs. Platten-Mathematik (settled)

- **Symptom:** WHOOP zeigte krumme Ganzzahlen (48 kg, 43 kg), die Martin physisch nie geladen haben kann.
- **Ursache:** Zwei Fakten kollidierten: (a) Martin lädt symmetrisch mit 1,25-kg-Scheiben → nur Vielfache von 1,25 kg (42,5 / 45 / 47,5 / 50 / 52,5); (b) WHOOP **rundet geloggte Gewichte auf ganze kg** (47,5 → 48).
- **Belege:** `7d21136` (plattenfreundliche Lasten, Scheibenpark dokumentiert) und `48bdb1c` (WHOOP-Rundung: krumme Werte auf das nächste 1,25-Vielfache zurücklesen). Angewandt in `9a9ab70` V1 (Lastreferenzen auf 1,25er-Raster: Snatch-Ceiling 52,5, Pause OHS 47,5).
- **Status:** settled.
- **Regel heute:** `coach/instructions.md` Abschnitt "Lasten und RPE": nur 1,25-Vielfache empfehlen; WHOOP-Ganzzahlen nie wörtlich nehmen.

### C7 — Conditioning-Reiz unterschätzt: leichte Last ≠ leichter Reiz (settled)

- **Symptom:** Ein leichtes Mixed-Modal-Stück wurde als "moderat" eingestuft; Martins W26-Feedback (24.06.) korrigierte: Zone 4+, harte Einheit.
- **Ursache:** Reiz wurde nach Last beurteilt statt nach Bewegungsmuster + Puls — Laufen, T2B und kurze schnelle Zyklen treiben unabhängig vom Gewicht in Zone 4+.
- **Beleg:** `6f52ba8` "Conditioning-Reiz nach Bewegungsmuster + Puls einschätzen, nicht nach Last. … Kalibrierung aus Martins W26-Feedback".
- **Status:** settled.
- **Regel heute:** `coach/instructions.md` ("Lasten und RPE"): Mixed-Modal mit Run/T2B/kurzen Zyklen ist **nie "moderat"** und zählt in der Wochenlast als harte Einheit.

### C8 — Methodik-Review: wie externe Findings adoptiert werden (settled)

- **Vorgang:** Ein externes Methodik-Review erzeugte durchnummerierte Findings (**V-Nummern = Review-Findings**, keine Versionsnummern). Adoption in zwei Wellen: `9a9ab70` (2026-07-03) übernahm die Quick Wins **V1** (1,25er-Raster), **V2** (Kappungsregel konkret: <50 % → RPE-Cap 7, kein Top-Gewicht, Steigerungssatz entfällt; <34 % → nur Technik/Mobility ≤ RPE 6 oder Ruhe), **V3** (systemstatus), **V7** (Sonntagslast → Montag-Standard). `411590f` (2026-07-06) folgte mit **V4** (Meso-Bogen in profile.json) und **V5** (Gymnastics-Testprotokoll) plus WPU-Entscheidung W28 = 3×3 / ab W30 3×4.
- **V6 und evtl. weitere Nummern:** nirgends im Repo umgesetzt oder dokumentiert (rekonstruiert: verworfen oder zurückgestellt — Status unbekannt).
- **Status:** settled als Muster: Findings einzeln bewerten, Quick Wins zuerst, jede Übernahme als eigener nachvollziehbarer Commit mit V-Referenz.
- **Regel heute:** kein eigener Kanon-Absatz; das Muster selbst ist die Referenz (`9a9ab70`, `411590f`). Inhaltlich leben V1/V2/V7 in `coach/instructions.md`, V4/V5 in `coach/profile.json`/`state.json`.

### C9 — Gedächtnis-Konsolidierung: claude.ai-Memory + Drive → Git (settled, ein offener Rest)

- **Symptom:** Coaching-Wissen lag verteilt (claude.ai-Projekt-Memory, Google Drive, Repo) — Drift-Gefahr zwischen Quellen.
- **Auflösung:** `4b429fc` "Projekt-Memory ins Repo" (u. a. wodwell-Pflichtreferenz, Strava-Aggregation, harte Ruhetage, WHOOP-Farbskala nach instructions.md; `coach/architecture.md` neu angelegt). **Drive ist stillgelegt** — "nicht lesen oder schreiben" (`coach/instructions.md` Datenmodell, `coach/architecture.md`). Der frühere claude.ai-Stub-Versuch (siehe T5) war ein Irrweg derselben Frage.
- **Status:** settled — GitHub ist die einzige versionierte Wahrheit. **Offener Rest:** Obsidian-Vault "obsidian-challenge" (`coach/decisions.md`) — im Aufbau, **nicht produktiv**, keine Quelle.
- **Regel heute:** `coach/instructions.md` "Datenmodell und Wahrheit" + Pflichtstart; CLAUDE.md: "GitHub ist die gemeinsame Wahrheit."

### C10 — Quellen-Hierarchie: Auto-Log vs. Notiz, fremde Pläne (settled)

- **Symptom:** Wiederholte kleine Quellenkonflikte: WHOOP-Auto-Log zählte BMU falsch (12 statt 13 in W26; "Back Squat" statt Front Squat und 95 statt 100 kg in W27 — `coach/logbook.md`), und die Versuchung, externe Pläne (auch DreamWOD) ungeprüft zu übernehmen.
- **Auflösung:** `2ed174d` (Quellen-Hierarchie + "Pläne nie ungeprüft übernehmen") und `092d911` (WHOOP-Auto-Log vs. freie Notiz: **Notiz hat Vorrang**).
- **Status:** settled.
- **Regel heute:** `coach/instructions.md` Quellendisziplin Punkte 6–7 und Referenzen-Abschnitt "WHOOP-Auto-Log vs. freie Notiz" (Konflikt markieren, nicht still auflösen).

---

## Wie du selbst gräbst

Alle Kommandos read-only, vom Repo-Root `/home/user/trainer`:

```bash
git log --oneline --all                    # Gesamtchronik (Commit-Messages sind ungewöhnlich informativ)
git show <hash>                            # Voller Commit: Message + Diff — IMMER lesen, bevor du einen Commit zitierst
git show <hash> --stat                     # Nur betroffene Dateien
git log --oneline -- website/.htaccess     # Historie einer einzelnen Datei (z. B. Auth-Saga)
git log --follow -p -- coach/instructions.md   # Wie eine Regel entstand (Diff-Historie des Kanons)
git log --grep="Revert"                    # Alle Reverts (Bot-Reverts = fehlgeschlagene Deploys)
git log --author="github-actions"          # Nur die Auto-Reverts des Deploy-Bots
git blame coach/instructions.md -L 130,145 # Welcher Commit brachte welchen Doktrin-Satz
```

Lese-Reihenfolge für Kontext: `coach/logbook.md` (Wochen-Narrativ W25–W27) → `coach/decisions.md` (Retro-Notizen) → `git show` der hier zitierten Hashes.

## Provenanz und Wartung

Stand: 2026-07-11 · 52 Commits auf `main` · alle Hashes per `git show` verifiziert. Re-Verifikation:

- Commit existiert & Message stimmt: `git show <hash> --stat | head -20`
- pfad.php noch da (T2 offen)? `ls /home/user/trainer/website/pfad.php`
- Tote Favicon-RewriteRules noch da (T3 offen)? `grep favicon.php /home/user/trainer/website/.htaccess`
- Doktrin unverändert (C1/C2/C4)? `grep -n "Stacking-Dogma\|Prognosequelle\|frisch und passend" /home/user/trainer/coach/instructions.md`
- Obsidian-Status (C5/C9)? `grep -n -i obsidian /home/user/trainer/coach/decisions.md`
- Neue Schlachten seit diesem Stand? `git log --oneline 411590f..HEAD` (alles nach dem jüngsten hier zitierten Commit prüfen und hier nachtragen)

Bei Widerspruch zwischen dieser Chronik und `coach/instructions.md` gilt **instructions.md** — dann diese Skill aktualisieren.
