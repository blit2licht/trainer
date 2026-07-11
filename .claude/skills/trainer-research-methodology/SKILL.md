---
name: trainer-research-methodology
description: Wie in diesem Repo aus einem Verdacht eine angenommene Änderung wird — Ideen-Lebenszyklus, Evidenzlatte, Adoptionsprotokoll — plus die offene Forschungsfront (verlässliches KI-Coaching-System, erster Sechs-Wochen-Review, messbare Autoregulationsqualität). Use when proposing a new rule or method, designing an experiment, changing the methodology, or advancing the system — "Verbesserungsidee", "neue Regel vorschlagen", "Methodik ändern", "Experiment entwerfen", "hypothesis", "research", "Sechs-Wochen-Review vorbereiten", "frontier", "improve the system", "was sind die offenen Probleme".
---

# Trainer-Research-Methodologie und Forschungsfront

Stand: 2026-07-11. Zwei Teile: (A) die Disziplin, mit der hier aus einem Verdacht eine angenommene Änderung wird; (B) die offenen Probleme, an denen dieses Projekt seinen eigenen Anspruch („verlässliches KI-Coaching-System") vorantreibt. Bestätigt von Martin (2026-07-11): Die Innovation dieses Projekts ist **das System selbst** — versioniertes Gedächtnis + Regeln + Reviews, die auch kleine Modelle fehlerfrei fahren können.

## Wann diese Skill NICHT die richtige ist

| Situation | Stattdessen |
|---|---|
| Eine konkrete Analyse durchführen (Plateau, Review, Experiment lesen) | `trainer-analysis-toolkit` |
| Die Freigabe-Gates selbst (wer darf was ändern) | `trainer-change-control` |
| Regelkonform durch eine Session kommen | `trainer-session-discipline-campaign` |
| Tägliche Beweisregeln (was gilt als bestätigt) | `trainer-validation-and-qa` |

## Teil A — Vom Verdacht zur angenommenen Änderung

### Der beobachtete Ideen-Lebenszyklus

Rekonstruiert aus der Git-Historie (alle Commits verifiziert):

1. **Beobachtung/Vorfall** — aus Wochenreview, Kalibrierungs-Retro oder Fehlschlag. Beispiel: Snatch stagniert W26 bei 50 kg trotz Ceiling-Ziel 52 (logbook W26).
2. **Hypothese mit Vorhersage VOR dem Test** — ein Mechanismus, der ALLE Beobachtungen erklärt, inklusive der negativen. Beispiel: „Nicht Last, sondern Speed limitiert" (Hüftspeed + langsamer Drop laut Notiz) → Vorhersage: Speed-Bias-Arbeit hebt die Ceiling ohne mehr Lastvolumen.
3. **Intervention, auf einen Mechanismus beschränkt** — W27: Snatch Balance + speed-gated Hang Squat Snatch, Load bewusst zurückgefahren.
4. **Validierung gegen vorab definierte Kriterien** — W27: Ceiling 52,5 sauber erreicht, Notiz „Catch spürbar schneller" → Hypothese bestätigt, Status: settled (logbook W27, `state.json` squat_snatch_ceiling).
5. **Adoption oder dokumentierter Rückzug** — Adoption ausschließlich über Martins ausdrückliche Freigabe (Auftragsdisziplin Regel 6); Rückzug wird in `coach/decisions.md` oder Logbuch festgehalten, nicht still gelöscht.

**Doktrin-Umkehr, richtig gemacht (Gegenbeispiel):** W25 verhängte der Review ein „kein Wochenend-Stacking"-Verbot. W26-Evidenz (Wochenend-Last entkoppelt, nur der akute Übertrag in die nächste Einheit zählt) drehte das: heute gilt „Kein Stacking-Dogma" + „Sonntagslast → Montag-Standard" (`coach/instructions.md`, Commit `437f9bb`). Die alte Regel ist als abgelöst dokumentiert (logbook W26) — Überzeugungen werden durch Evidenz aktualisiert, und der Wechsel bleibt nachvollziehbar.

### Die Evidenzlatte (aus dem Kanon, `coach/instructions.md`)

- Ein Mechanismus muss ALLE Beobachtungen erklären, auch die negativen.
- **≥90 % Konfidenz oder fragen** — unter 90 % wird benannt, was zur Klärung fehlt.
- Quellenkonflikte werden markiert, nie still aufgelöst.
- Externe Quellen nach Güte gewichtet: offiziell/methodisch sauber vor Blogs/Foren.
- Fremde Programme (auch DreamWOD) nie ungeprüft übernehmen.
- Hypothese sagt Zahlen/Verhalten VOR dem Testlauf vorher; hinterher wird gegen genau diese Vorhersage gelesen (Kalibrierungs-Delta-Methode, siehe `trainer-analysis-toolkit`).

### Woher gute Ideen historisch kamen (verifiziert)

| Quelle | Belege |
|---|---|
| Wochenreview-Befunde (häufigste Quelle) | logbook W25→W26 (Reclaim-Fokus), W26→W27 (Speed-Bias), W27→W28 (C&J-Rotation) |
| Externer Methodik-Review mit nummerierten Findings V1–V7, in Tranchen adoptiert | `9a9ab70` (V1 Lastraster, V2 Kappungsregel, V3 systemstatus, V7 Sonntagslast→Montag), `411590f` (V4 Meso-Bogen, V5 Gymnastics-Testprotokoll) |
| Vorfalls-Retros | `coach/decisions.md` 2026-06-30 → Regeln in `7b4ad58`, `1cc3b7c` |
| Doktrin-Härtung nach Fehlern | `4bd6e0a` (Recovery-Historie ≠ Prognose), `437f9bb` (90 %-Regel) |
| Martins Vorschläge beim Review | `coach/profile.json`: „Martin schlägt neue Ziele beim Review vor" |

### Adoptionsprotokoll

Jede Kanon-/Profil-Änderung braucht Martins ausdrücklichen Auftrag (Auftragsdisziplin Regel 6). Ein Vorschlag wird formuliert als: **Entscheidung → betroffene Dateien/Felder → Begründung → Commit-Message** und Martin vorgelegt. Kandidaten-Entscheidungen dürfen in `state.json`-Notizen mitfahren (Beispiel: WPU „W28 bleibt 3×3, ab W30 fest 3×4", Commit `411590f`) — sie sind dort dokumentiert, aber erst mit Umsetzung im Plan verbindlich. Forschungsbefunde laufen IMMER durch dieses Protokoll, nie direkt in den Kanon.

## Teil B — Forschungsfront (Stand 2026-07-11)

Alle Punkte sind **offen/Kandidat** — nichts davon ist erreicht oder versprochen.

### 1. Null-Verstoß-Betrieb mit kleineren Modellen (das bestätigte härteste Problem)

- **Warum generische SOTA scheitert:** Assistenten driften bei langen Regelwerken — jede Härtungsregel in `instructions.md` ist Narbengewebe eines realen Verstoßes (erfundene Konflikte, Recovery-Prognosen, ungefragte Artefakte).
- **Asset dieses Projekts:** vollständig verschriftlichter Kanon + diese Skill-Bibliothek + messbarer Verstoß-Katalog (`trainer-session-discipline-campaign`).
- **Erste drei Schritte in diesem Repo:** (1) Wochenzyklen mit einem kleineren Modell fahren, Campaign-Skill ab Session-Start geladen; (2) Verstöße pro Session gegen den Katalog protokollieren (Selbst-Report am Sessionende); (3) Skills dort nachschärfen, wo Verstöße wiederholt auftreten.
- **Ergebnis erreicht, wenn:** N aufeinanderfolgende vollständige Wochenzyklen (Neue Woche → Committen → Wochenreview) mit null Katalog-Verstößen laufen, ohne dass Martin korrigierend eingreifen muss.

### 2. Der erste Sechs-Wochen-Review als Institution

- **Status:** Noch nie durchgeführt (`state.json` systemstatus: „Erster Sechs-Wochen-Review noch offen"); fällig W30 (`mesocycle_plan.wochenrollen`). `coach/reviews/` enthält nur den Platzhalter-README.
- **Asset:** sechs Wochen konsistente Logbuch-/State-Daten (W25–W30).
- **Erste drei Schritte:** (1) Review-Template aus den Kanon-Anforderungen ableiten (Zielreview: Zielstände gegen `profile.json`, Fokuswechsel-Entscheidung, Schwerpunkt verlängerbar); (2) W25–W30-Daten aggregieren (Logbuch, Lastreferenzen, Testprotokoll-Ergebnisse — Gymnastics-Test W30); (3) Review in W30 fahren und unter `coach/reviews/` ablegen (CLAUDE.md-Konvention).
- **Ergebnis erreicht, wenn:** ein Review in `coach/reviews/` liegt, das Martin akzeptiert und aus dem die Ziele des nächsten Mesos hervorgehen.

### 3. Messbare Autoregulationsqualität (Kandidat)

- **Warum SOTA scheitert:** Erfolg wird heute pro Woche qualitativ beurteilt; starre Programme haben Benchmarks, autoregulierte nicht.
- **Asset:** Längsschnitt in Git — Wochen-Strain, Recovery-Verteilung, rpe_feel, Lastreferenzen, Topleistungen (Prototyp: die W27-Pullback-Analyse — −22 % Strain bei gehaltenen/gesteigerten Topleistungen, logbook W27).
- **Kandidaten-Metriken (unerprobt):** Zielfortschritt pro Meso; Topleistung-pro-Strain-Trend; Rate verstoßfreier Sessions.
- **Erste drei Schritte:** (1) Wochen-Aggregate aus dem Logbuch in eine vergleichbare Tabelle ziehen; (2) für den nächsten Meso die erwartete Richtung VOR dem Meso festhalten; (3) nach dem Meso gegen die Vorhersage lesen.
- **Ergebnis erreicht, wenn:** eine Metrik eine Planungsentscheidung nachweislich besser erklärt/vorhersagt als das narrative Urteil — dokumentiert in einem Review.

### Abgezäunte Irrwege

- Kein neues Tooling, keine neuen Dateien im Repo ohne Martins Auftrag (Auftragsdisziplin Regel 6 — Vorfall `claude_ai_stub`, siehe `trainer-failure-archaeology`).
- Keine Metrik ersetzt die Kanon-Hierarchie (Apex: Gesundheit vor Leistung).
- Recovery-Historie bleibt auch für Forschungszwecke KEINE Prognosequelle für Tagesform-Entscheidungen (`4bd6e0a`, Kanon-Doktrin) — Längsschnitt-Analyse ja, Tagesplanung daraus nein.

## Provenanz und Wartung

| Behauptung | Quelle | Re-Verifikation |
|---|---|---|
| V1–V7-Findings in zwei Tranchen adoptiert | Commits `9a9ab70`, `411590f` | `git show -s 9a9ab70 411590f` |
| Snatch-Speed-Fall (Hypothese→Validierung) | logbook W26/W27, state.json | `grep -n "Speed" coach/logbook.md` |
| Stacking-Doktrin-Umkehr | logbook W25/W26, `437f9bb` | `grep -n "Stacking" coach/instructions.md coach/logbook.md` |
| Erster Sechs-Wochen-Review offen, fällig W30 | `coach/state.json` | `grep -n "systemstatus\|W30" coach/state.json` |
| Evidenzlatte (90 %-Regel etc.) | `coach/instructions.md` § Quellendisziplin | `grep -n "90" coach/instructions.md` |
| Härtestes Problem + Frontier-Definition | Martins Antwort vom 2026-07-11 (dieses Projekt) | Bei Zweifel: Martin fragen — nicht im Repo dokumentiert |
