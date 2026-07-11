---
name: trainer-change-control
description: >
  Change-Control für dieses Repo: wie Änderungen klassifiziert, gefreigegeben
  (gegated) und committet werden. Nutzen bei: "Änderung committen", "Committen",
  "darf ich X ändern", "canon ändern", "instructions.md anpassen",
  "profile.json ändern", "state.json aktualisieren", "Logbuch-Eintrag",
  "publish", "push to main", "deploy", "commit conventions", "commit message",
  "Commit-Prefix", ".htaccess ändern", "deploy.yml ändern", "Revert",
  "scope of change", "change approval", "was darf ohne Freigabe committet werden".
---

# Change Control: Änderungen klassifizieren, gaten, committen

Runbook für jede Änderung an diesem Repo (Martins Trainingscoach-Repo,
`/home/user/trainer`). Es beantwortet drei Fragen, bevor irgendetwas
geschrieben wird:

1. **Was für eine Änderung ist das?** → Klassifikationstabelle
2. **Wer/was gibt sie frei?** → Gates und Nicht-Verhandelbares
3. **Wie wird sie committet?** → Ausgabeformat + Pre-Commit-Checkliste

Begriffe:

- **Gate** = Bedingung, die erfüllt sein muss, bevor eine Änderung geschrieben
  oder gepusht werden darf (z. B. ein explizites Wort von Martin).
- **Kanon** = die dauerhaften Coaching-Regeln in `coach/instructions.md` und
  das stabile Profil in `coach/profile.json`.
- **„Committen"** = Martins explizites Trigger-Wort, das Dateiänderung, Push
  auf `main` und Deployment für einen Wochenplan erst erlaubt
  (`coach/instructions.md`, Abschnitt „Neue Woche").
- **Auto-Revert** = der GitHub-Actions-Bot revertiert den letzten Commit
  selbstständig, wenn das Deployment-Verify fehlschlägt
  (`.github/workflows/deploy.yml`).

Grundmodell dieses Repos (Stand: 2026-07-11):

- GitHub ist die einzige Wahrheit. Vor jeder Änderung neuesten Stand laden.
- Es wird **direkt auf `main` gepusht**. Keine PRs, keine Feature-Branches im
  Normalbetrieb.
- Jeder Push auf `main` löst das Deployment aus — auch wenn nur
  `coach/`-Dateien geändert wurden. Deshalb ist jeder Push
  veröffentlichungsrelevant zu denken.
- Nur `website/` wird auf https://training.martinwitte.de ausgeliefert.

---

## 1. Klassifikationstabelle

Jede Änderung fällt in genau eine dieser Klassen. Bei Mischungen gilt das
strengste Gate der beteiligten Klassen.

| Änderungstyp | Dateien | Gate / erforderliche Freigabe | Commit-Prefix (Konvention, s. u.) |
|---|---|---|---|
| **State-Update** | nur `coach/state.json` | Im Wochenreview-Modus: nach vollständigen Daten **ohne zusätzliche Freigabe** committen (`instructions.md`, „Wochenreview" Schritt 6). Außerhalb eines Arbeitsmodus: Auftrag von Martin nötig. | `state:` oder `coach:` |
| **Logbuch-Eintrag** | `coach/logbook.md`, ggf. `coach/reviews/` | Teil des Wochenreviews; gleiche Regel wie State-Update. Ungefragte Einträge außerhalb des Reviews sind durch Auftragsdisziplin-Regel 6 verboten. | `coach:` oder unpräfixiert („Wochenreview W27 abschließen") |
| **Kanon-Änderung** | `coach/instructions.md`, `coach/profile.json`, `coach/decisions.md` | **Nur auf ausdrücklichen Auftrag von Martin** oder wenn zwingend für den beauftragten Task (Auftragsdisziplin-Regel 6). Niemals proaktiv. `profile.json` zusätzlich: nur bei stabilen Änderungen (Wochenreview Schritt 5). | `docs:` (Regeln/Kanon-Text) oder `coach:` (Coaching-Entscheidungen) |
| **Website-Inhalt** | `website/data.js` | Wochenplan: **erst Vorschau, dann explizites „Committen"** von Martin. Unterwöchige Ad-hoc-Korrekturen: nach kurzer Abstimmung direkt (`instructions.md`, „Ad-hoc-Änderung"). Max. 4 Wochen in `data.js` behalten. | `data:`, `feat:` oder unpräfixiert („W28-Plan veröffentlichen") |
| **Website-Code** | `website/index.html`, `*.php`, `sw.js`, `manifest.json`, `icons/` | Auftrag von Martin. Nach Push Deployment-Verify abwarten und Ergebnis prüfen. | `web:` (Feature-Pakete), `fix:`/`feat:` (Einzeländerungen) |
| **Infra** | `.github/workflows/deploy.yml`, `website/.htaccess`, `robots.txt` | Auftrag von Martin **plus**: reale Server-Gegebenheiten (IONOS-Pfade, Modul-Verfügbarkeit) vorher verifizieren — siehe Nicht-Verhandelbares Nr. 6. | `fix:` / `feat:` |

### Commit-Prefix-Konvention (empirisch, Stand: 2026-07-11, 52 Commits)

Es gibt keine geschriebene Prefix-Norm; die Konvention ist aus der Historie
abgeleesen. Verteilung:

```bash
git -C /home/user/trainer log --oneline | grep -oE '^[0-9a-f]+ [a-z]+:' \
  | awk '{print $2}' | sort | uniq -c | sort -rn
# Stand 2026-07-11:  14 fix:  11 feat:  9 docs:  6 coach:  3 web:  1 state:  1 data:
```

Bedeutung in der Praxis:

| Prefix | Verwendung (belegte Beispiele) |
|---|---|
| `coach:` | Coaching-Entscheidungen, Planlogik, Kanon-Regeln mit Trainingsbezug (`411590f`, `1d914af`, `48bdb1c`) |
| `docs:` | Präzisierung/Schärfung von Regeln im Kanon (`1cc3b7c`, `4bd6e0a`, `092d911`) |
| `feat:` | neue Website-Features und Wochen-Pakete (`f22cf32`, `a1d55b2`) |
| `fix:` | Korrekturen an Website, Daten oder Repo-Hygiene (`c4cc77c`, `0abca4c`) |
| `web:` | gebündelte Website-Pakete (`74a96d9`, `90d9181`, `d3893ec`) |
| `data:` | reine `data.js`-Inhaltskorrektur (`5e2353f`) |
| `state:` | reine `state.json`-Änderung (`7f74876`) |
| *(ohne Prefix)* | Wochen-Meilensteine: „W28-Plan veröffentlichen (06.–12.07.)" (`58fce69`), „Wochenreview W27 abschließen" (`6dadb77`) |

Regel daraus: **Prefix nach dem dominanten Inhalt wählen; Wochenplan-Publish
und Review-Abschluss dürfen als unpräfixierter Meilenstein-Commit laufen.**
Details zur Message-Formulierung: Skill `trainer-schemas-and-style`.

**Reserviert:** Commit-Messages, die mit `Revert` beginnen, gehören dem
Auto-Revert-Mechanismus (siehe Nr. 5). Niemals einen eigenen Nicht-Revert-Commit
so benennen — er würde vom Fail-Safe der Pipeline ausgenommen.

---

## 2. Nicht-Verhandelbares

Jede Regel: **Regel → Rationale → belegter Vorfall** mit Prüfkommando.

### 2.1 Keine ungefragten Artefakte, strikter Scope

**Regel** (Auftragsdisziplin-Regeln 1, 2 und 6 in `coach/instructions.md`):
Zuerst den engsten beauftragten Scope bestimmen, betroffene Dateien/Felder
explizit benennen. Keine neuen Dateien, keine Änderungen an
`coach/instructions.md`, `coach/profile.json`, `coach/logbook.md`,
`coach/decisions.md` ohne ausdrücklichen Auftrag oder zwingende Notwendigkeit.
Naheliegende Folgeänderungen werden **vorgeschlagen, nicht umgesetzt**.

**Rationale:** Das Repo ist das Gedächtnis des Coaches. Ungefragte Artefakte
verschmutzen den Kanon, erzeugen Aufräumarbeit und untergraben das Vertrauen,
dass jeder Commit genau das enthält, was beauftragt war.

**Vorfall (2026-06-15):** Bei einem Audit wurde ungefragt
`coach/claude_ai_stub.md` erzeugt — ein „Projektsetting-Stub" für claude.ai,
den niemand bestellt hatte. Zusätzlich entstanden **drei Commits mit identischer
Message** („fix: audit findings — load_references, profile corrections,
claude.ai stub": `74be6e6`, `893cb70`, `cb87802`), obwohl sie völlig
verschiedene Inhalte trugen (Initial-Import, profile.json-Fix, Stub-Anlage).
Drei Minuten später musste der Stub wieder entfernt werden:
`0abca4c` „fix: remove misunderstood claude.ai stub".

```bash
git -C /home/user/trainer show --stat 74be6e6 893cb70 cb87802 0abca4c
git -C /home/user/trainer show cb87802:coach/claude_ai_stub.md   # der ungefragte Stub
```

Lehren: (a) keine ungefragten Dateien, (b) eine Commit-Message beschreibt genau
ihren Commit — nie dieselbe Message für verschiedene Inhalte recyceln.

### 2.2 Das „Committen"-Gate: Vorschau zuerst, Publish nur auf Trigger

**Regel** (`coach/instructions.md`, „Neue Woche" und „Veröffentlichung";
`CLAUDE.md`, Trigger): Beim Wochenplan gilt: erst Diagnose und Auswahl, dann
**Vorschau** (Wochenstundenplan, Wochenlogik, Fokus-Tage, Hauptempfehlung,
Alternativen, Ablehnungsgründe). Fragen einholen. **Erst der eindeutige Trigger
„Committen" erlaubt Dateiänderung, Push auf `main` und Deployment.**

**Rationale:** Push auf `main` = sofortige Veröffentlichung auf der Live-Site.
Es gibt keinen PR-Review als Sicherheitsnetz; das Gate ist Martins explizites
Wort. Ein Plan, der ohne Freigabe live geht, ist ein Plan, den Martin nie
gesehen hat.

**Wichtig:** Diese Skill zeigt niemals Wege, das Gate zu umgehen. Wer unsicher
ist, ob „mach mal" schon „Committen" bedeutet: nachfragen, nicht pushen.
Ausnahme laut Kanon: der abgeschlossene Wochenreview committet ohne
zusätzliche Freigabe (Wochenreview Schritt 6), und unterwöchige
Ad-hoc-Planänderungen gehen „nach kurzer Abstimmung direkt" live — beides ist
im Kanon explizit erlaubt, kein Umgehen des Gates.

**Vorfall:** kein dokumentierter Gate-Bruch in der Historie (das Gate ist
präventiv). Die Schärfung der Auftragsdisziplin insgesamt: `1cc3b7c`
„docs: Auftragsdisziplin und reale Konflikte schärfen".

### 2.3 Neuesten Stand laden, nie bei Konflikt überschreiben

**Regel** (`CLAUDE.md`; `coach/instructions.md`, „Pflichtstart jeder
Session"): Vor jeder Änderung den neuesten GitHub-Stand laden
(`git pull`/Fetch). Nicht auf Chat-Historie verlassen. Bei Konflikten **nicht
überschreiben, sondern neu abgleichen**.

**Rationale:** Mehrere Agenten und Martin selbst schreiben in dasselbe Repo
(die Historie enthält echte Merge-Commits: `66e35d3`, `3887bf6`). Wer auf
veraltetem Stand schreibt, löscht fremde Arbeit oder plant auf alten Zahlen.

```bash
git -C /home/user/trainer log --oneline --merges   # belegt parallele Schreiber
```

### 2.4 Konfliktbehauptungen brauchen eine benannte Quelle

**Regel** (Auftragsdisziplin-Regeln 3–5): Alte `akute_hinweise`, Plan-Notizen
oder frühere Chat-Aussagen sind nie alleiniger Konfliktbeweis — nur Warnflags.
Ein Konflikt ist erst real, wenn er im **aktuellen** `website/data.js`,
**aktuellen** `coach/state.json` oder durch Martins aktuelle Aussage belegt
ist. Wer eine Kollision behauptet, nennt direkt die Quelle: Datei, Datum,
Einheit oder aktueller Nutzerhinweis. **Ohne Quelle keine Konfliktbehauptung.**
Vor jeder Konfliktentscheidung prüfen: real, aktuell, entscheidungsrelevant?
Wenn nein: nicht diskutieren. Wenn unklar: eine kurze konkrete Frage.

**Rationale:** Erfundene oder veraltete Konflikte führen zu ungefragten
Scope-Erweiterungen („ich musste noch X anpassen, weil…") — genau der
Fehlermodus, den Regel 2.1 verbietet. Für Change Control heißt das: ein
behaupteter Konflikt rechtfertigt nur dann eine Zusatzänderung, wenn die
Quelle im Commit-/Änderungsvorschlag mit benannt wird.

**Vorfall:** Die Regeln wurden nach realen Fehlkalibrierungen geschärft
(`1cc3b7c`, dokumentiert in `coach/decisions.md`, Eintrag 2026-06-30:
fehlende Recovery-Abfrage vor Argumentation, falsche Sequenz).

### 2.5 Deployment-Erfolg ist definiert; Auto-Revert ist der Fail-Safe

**Regel** (`.github/workflows/deploy.yml`; `CLAUDE.md`, „Veröffentlichung"):
Ein Deployment ist erst erfolgreich, wenn https://training.martinwitte.de
erreichbar ist **und** die aktuelle Wochen-ID aus `website/data.js`
ausliefert. Mechanik der Pipeline (Stand: 2026-07-11):

1. Push auf `main` → SFTP-Mirror von `website/` nach IONOS
   (`config.php` und `config.template.php` ausgeschlossen).
2. Verify: bis zu **5 Versuche**, je `curl` auf
   `https://training.martinwitte.de/data.js` mit `grep` auf die erste
   Wochen-ID aus `website/data.js`, **12 s Pause** zwischen den Versuchen.
3. Bei Fehlschlag: der Bot (`github-actions[bot]`) macht
   `git revert --no-edit HEAD` und pusht auf `main` — **außer** die
   Commit-Message beginnt mit `Revert` (verhindert Revert-Schleifen).
   Danach schlägt der Workflow mit Fehlermeldung fehl.

**Rationale:** Es gibt keine Staging-Umgebung. Der Auto-Revert ist die einzige
automatische Rücknahme; deshalb (a) niemals eigene Commits mit `Revert…`
beginnen, (b) nach jedem Push den Workflow-Ausgang prüfen, (c) bei Fehlschlag
per Kanon: nachvollziehbaren Revert-Zustand akzeptieren, **stoppen** und den
Fehler erklären — nicht sofort erneut pushen.

```bash
sed -n '50,72p' /home/user/trainer/.github/workflows/deploy.yml   # Verify + Revert-Step
```

**Vorfall:** siehe 2.6 — der Auto-Revert hat dort zweimal binnen Minuten
ausgelöst (`0b53b9b`, `cd6083f`).

### 2.6 Infra-Änderungen (.htaccess, deploy.yml): reale IONOS-Gegebenheiten zuerst verifizieren

**Regel:** Vor jeder Änderung an `website/.htaccess` oder
`.github/workflows/deploy.yml` die realen Server-Gegebenheiten prüfen —
absolute IONOS-Dateipfade, verfügbare Apache-Module, Client-Kompatibilität.
Niemals einen Serverpfad raten. Das ist die Change-Control-Anwendung der
Quellendisziplin-Regel 1 („Erst Quelle lesen, dann handeln") und Regel 8
(„Nur mit ≥90 % Sicherheit ausgeben").

**Rationale:** `.htaccess`-Fehler wirken sofort auf die gesamte Live-Site,
und die Pipeline kann nur revertieren, nicht diagnostizieren.

**Vorfall (2026-06-21, Fünf-Commit-Kette):**

| Commit | Was geschah |
|---|---|
| `c5de0bc` | „feat: HTTP Basic Auth für gesamte Seite" — `.htaccess` + `.htpasswd` mit geratenem `AuthUserFile`-Pfad |
| `0b53b9b` | **Auto-Revert** durch `github-actions[bot]` (~2 min später): Verify schlug fehl, Site lieferte `data.js` nicht aus (falscher `AuthUserFile`-Pfad; typische Folge ist HTTP 500 — exakter Statuscode im Repo unverifiziert) |
| `b27cc8e` | „fix: korrekter AuthUserFile-Pfad für IONOS" — zweiter Versuch |
| `cd6083f` | **erneuter Auto-Revert** (~2 min später) |
| `840903d` | Aufgabe des Ansatzes: „fix: Basic Auth entfernen, robots.txt für Suchmaschinen-Ausschluss". Commit-Body dokumentiert den zweiten Blocker: iOS-Standalone-Mode (Add to Home Screen) ist mit Basic Auth inkompatibel → schwarzer Screen beim Öffnen des Homescreen-Icons |

```bash
git -C /home/user/trainer show --stat c5de0bc 0b53b9b b27cc8e cd6083f
git -C /home/user/trainer show 840903d   # Body erklärt die iOS-Inkompatibilität
```

Lehren: (a) Serverpfade und Modulverhalten vor dem Push verifizieren (z. B.
per Test-PHP wie dem historischen `pfad.php`, Commit `474a8e5`, oder durch
Nachfrage bei Martin), (b) Client-Auswirkungen (PWA/Standalone) mitdenken,
(c) nach einem Auto-Revert nicht sofort den nächsten Rateversuch pushen.
Vollständige Vorfalls-Chronik: Skill `trainer-failure-archaeology`.

---

## 3. Pflicht-Ausgabeformat für Änderungsaufträge

Bei jedem konkreten Änderungsauftrag ist die Antwort so aufgebaut
(Auftragsdisziplin-Regel 7, `coach/instructions.md`):

1. **Entscheidung zuerst** (eine Zeile: was wird gemacht / nicht gemacht)
2. **Betroffene Dateien/Felder** (explizit, engster Scope)
3. **Kurze Begründung**
4. **Commit-Message** (Prefix gemäß Tabelle in Abschnitt 1)
5. *Nur bei Bedarf:* knapper Patch-Plan

Keine langen Herleitungen, keine Bash-Skripte, wenn ein strukturierter Auftrag
reicht. Folgeänderungen außerhalb des Scopes werden unter der Begründung als
**Vorschlag** markiert, nicht stillschweigend eingebaut.

Beispiel:

> **Entscheidung:** W28-Donnerstag in `data.js` von „Restday" auf „Zone-2-Ride 45 min" ändern.
> **Dateien/Felder:** `website/data.js` → Woche `2026-W28`, Tag Do.
> **Begründung:** Martins heutige Ansage; kein Konflikt mit Fokus-Tagen (Fr ist Low-CNS).
> **Commit-Message:** `data: W28-Do — Zone-2-Ride statt Restday (Martins Ansage 2026-07-09)`

---

## 4. Pre-Commit-Checkliste

Vor **jedem** `git commit` / Push auf `main` abhaken:

- [ ] **Frischer Stand:** neuester GitHub-Stand geladen; kein Schreiben auf
      Basis von Chat-Erinnerung. Bei Konflikt: abgleichen, nie überschreiben.
- [ ] **Klassifiziert:** Änderungstyp aus der Tabelle bestimmt; bei Mischung
      gilt das strengste Gate.
- [ ] **Gate erfüllt:** Wochenplan-Publish nur nach explizitem „Committen".
      Kanon-Dateien nur auf ausdrücklichen Auftrag. Wochenreview-Commits nach
      vollständiger Datenlage.
- [ ] **Scope minimal:** Diff enthält nur beauftragte Dateien/Felder. Keine
      neuen ungefragten Dateien. Folgeänderungen nur als Vorschlag geäußert.
- [ ] **Konflikte belegt:** jede behauptete Kollision hat eine benannte,
      aktuelle Quelle (Datei/Datum/Einheit/Nutzeraussage).
- [ ] **Keine Rohdaten:** keine WHOOP-/Strava-/Satz-Rohdaten im Diff — nur
      verdichtete Erkenntnisse und bestätigte Werte
      (`instructions.md`, „Datenmodell und Wahrheit").
- [ ] **data.js-Hygiene** (falls betroffen): aktuelle + max. drei
      Vorwochen; Wochen-ID korrekt, denn das Deploy-Verify grept genau darauf.
- [ ] **Commit-Message:** passender Prefix, beschreibt genau diesen Commit,
      beginnt **nicht** mit `Revert`.
- [ ] **Infra-Sonderfall:** bei `.htaccess`/`deploy.yml` reale IONOS-Pfade und
      Client-Auswirkungen vorher verifiziert (Abschnitt 2.6).
- [ ] **Nach dem Push:** Deployment-Workflow-Ausgang prüfen; Erfolg erst
      melden, wenn https://training.martinwitte.de die neue Wochen-ID
      ausliefert. Bei Auto-Revert: stoppen und Fehler erklären.

---

## Wann diese Skill NICHT die richtige ist

| Anliegen | Richtige Skill |
|---|---|
| Einen der vier Arbeitsmodi fahren (Neue Woche, Daily WOD Adjustment, Ad-hoc-Änderung, Wochenreview) | `trainer-weekly-workflow` |
| Mechanik von `data.js`-Aufbau, SFTP-Deploy, Deployment-Prüfung im Detail | `trainer-publish-and-deploy` |
| Evidenz-Standards: welche Quelle wofür zählt, 90-%-Regel im Coaching-Alltag | `trainer-validation-and-qa` |
| Vollständige Chronik aller historischen Vorfälle und deren Lehren | `trainer-failure-archaeology` |
| Datei-Schemata (state.json, data.js, profile.json) und Feinheiten des Commit-Message-Stils | `trainer-schemas-and-style` |

Diese Skill ist nur der **Torwächter**: Klassifikation, Gates, Scope,
Commit-Konvention, Fail-Safes.

---

## Provenanz und Wartung

Volatile Fakten dieser Skill und ihr Re-Verifikationskommando
(alle zuletzt geprüft: 2026-07-11):

| Behauptung | Prüfkommando |
|---|---|
| Prefix-Verteilung (14 fix / 11 feat / 9 docs / 6 coach / 3 web / 1 state / 1 data bei 52 Commits) | `git -C /home/user/trainer log --oneline \| grep -oE '^[0-9a-f]+ [a-z]+:' \| awk '{print $2}' \| sort \| uniq -c` |
| Stub-Vorfall: 3× identische Message + Entfernung | `git -C /home/user/trainer show --stat 74be6e6 893cb70 cb87802 0abca4c` |
| .htaccess-Vorfall: 2 Auto-Reverts, iOS-Begründung | `git -C /home/user/trainer log --oneline c5de0bc^..840903d -- website/.htaccess website/robots.txt && git show 840903d` |
| Verify-Loop 5 × 12 s, grep auf Wochen-ID | `sed -n '50,63p' /home/user/trainer/.github/workflows/deploy.yml` |
| Auto-Revert außer bei `Revert`-Message | `sed -n '65,71p' /home/user/trainer/.github/workflows/deploy.yml` |
| Auftragsdisziplin-Regeln 1–7 (Scope, Quellen, Regel 6, Ausgabeformat) | `grep -n -A 20 'Auftragsdisziplin und reale Konflikte' /home/user/trainer/coach/instructions.md` |
| „Committen"-Gate im Modus Neue Woche | `grep -n 'Committen' /home/user/trainer/coach/instructions.md /home/user/trainer/CLAUDE.md` |
| Wochenreview committet ohne Zusatzfreigabe | `grep -n 'Ohne zusätzliche Freigabe' /home/user/trainer/coach/instructions.md` |
| Pflichtstart / nie überschreiben bei Konflikt | `grep -n -B1 -A1 'nicht überschreiben' /home/user/trainer/coach/instructions.md /home/user/trainer/CLAUDE.md` |
| Deployment-Erfolgsdefinition (Erreichbarkeit + Wochen-ID) | `grep -n -A 3 'Veröffentlichung' /home/user/trainer/CLAUDE.md` |
| SFTP-Excludes `config.php`/`config.template.php` | `grep -n 'exclude-glob' /home/user/trainer/.github/workflows/deploy.yml` |
| Merge-Commits belegen parallele Schreiber | `git -C /home/user/trainer log --oneline --merges` |
