---
name: trainer-publish-and-deploy
description: >
  Wochenplan veröffentlichen und Deployment betreiben: "Committen", "Plan
  veröffentlichen", "publish weekly plan", "data.js aktualisieren", "push to
  main", "deploy", "Deployment prüfen", "deployment failed", "Website down",
  "auto-revert", "IONOS", "SFTP", "GitHub Actions", "training.martinwitte.de".
  Enthält data.js-Wochenschema, Publish-Runbook, Anatomie von deploy.yml,
  Verifikation, Auto-Revert-Semantik und bekannte Fallstricke.
---

# Trainer: Veröffentlichen & Deployen

Diese Skill beschreibt, **wie** ein freigegebener Wochenplan auf https://training.martinwitte.de kommt und wie die Deploy-Pipeline funktioniert. Repo: `blit2licht/trainer`, Hosting: IONOS (PHP + MariaDB, Upload per SFTP), Pipeline: `.github/workflows/deploy.yml`.

**Hartes Gate:** Veröffentlichen ist ausschließlich nach Martins explizitem Trigger **„Committen"** erlaubt (siehe `coach/instructions.md`, Abschnitt „Veröffentlichung"). Vorher: nur Vorschau, keine Datei-Änderungen, kein Push.

## Wann diese Skill NICHT die richtige ist

| Frage | Richtige Skill |
|---|---|
| WAS soll diese Woche veröffentlicht werden (Planinhalt, Datenerhebung, Review)? | `trainer-weekly-workflow` |
| DARF diese Änderung überhaupt gemacht werden (Regeln, Freigaben)? | `trainer-change-control` |
| Fehlersuche jenseits des Deployments (Notes-API, DB, PWA-Bugs)? | `trainer-debugging-playbook` |
| Vollständiger Schema-Katalog aller Dateien (state.json, profile.json, …)? | `trainer-schemas-and-style` |
| Warum ist das System so gebaut (Design-Entscheidungen)? | `trainer-architecture-contract` |

## 1. Anatomie von `website/data.js`

`website/data.js` ist der einzige veröffentlichte Plan. Ein globales `const DATA = { weeks: [...] }`. Die PWA (`website/index.html`) liest ausschließlich `DATA.weeks`; `DATA.weeks[0]` ist die Default-Ansicht — **neueste Woche steht immer VORNE**. Maximal **4 Wochen** in der Datei (Stand 2026-07-11: `2026-W28`, `2026-W27`, `2026-W26`, `2026-W25`).

### Wochen-Objekt

| Feld | Typ | Pflicht | Beispiel (W28) | Bedeutung |
|---|---|---|---|---|
| `id` | String | ja | `"2026-W28"` | ISO-Wochen-ID. **Wird vom Deploy-Workflow aus der ersten Woche extrahiert und gegen die Live-Site verifiziert.** |
| `label` | String | ja | `"Woche 4 · 6.–12. Juli 2026"` | Anzeige im Week-Selector der PWA. |
| `meso` | String | ja | `"Meso 2 · Woche 4"` | Mesozyklus-Einordnung. |
| `phase` | String | ja | `"Reclaim / Kapazität / Robustheit"` | Phasenname. |
| `dateFrom` | String | ja | `"2026-07-06"` | Montag, `YYYY-MM-DD`. Wird für den Notes-Abruf genutzt: `loadNotes(w.dateFrom, w.dateTo)`. |
| `dateTo` | String | ja | `"2026-07-12"` | Sonntag, `YYYY-MM-DD`. |
| `days[]` | Array | ja | 7 Objekte Mo–So | Tagesplan, siehe unten. |
| `focusDays` | Objekt | ja | `{ A: {...}, B: {...} }` | Detailpläne der Eigen-Trainingstage; Keys `A` und/oder `B`. |

### Tages-Objekt (`days[]`)

| Feld | Typ | Pflicht | Werte / Beispiel | Bedeutung |
|---|---|---|---|---|
| `day` | String | ja | `"Montag"` | Wochentagsname. |
| `date` | String | ja | `"06.07."` | Anzeige-Datum (deutsch, kurz). |
| `isoDate` | String | **ja, immer** | `"2026-07-06"` | **Join-Key zum Notes-System — siehe Kontrakt unten.** |
| `type` | String | ja | `box` \| `own` \| `rest` \| `ride` | Steuert Rendering/Farbe in der PWA. |
| `einheit` | String | ja | `"Front Squat (Wk 2/3) + …"` oder `"—"` | Titel der Einheit. |
| `sub` | String | nein | Ablaufbeschreibung | Fehlt bei `rest`/`ride`. |
| `rx` | String | ja | `"FS bis <span class='rv'>~97,5–100 kg</span> …"` | Lasten/Scaling. **HTML erlaubt**, insb. `<span class='rv'>…</span>` für Hervorhebungen (einfache Anführungszeichen innerhalb des JS-Doublequote-Strings). |
| `rpe` | String | nein | `"RPE ≤8 (Topsatz)"` | Intensitätsvorgabe; fehlt bei `rest`/`ride`. |
| `note` | String | ja | Kontext/Begründung | Coach-Notiz zum Tag. |
| `focus` | String | nein | `"A"` oder `"B"` | Nur bei `type:"own"` — verweist auf `focusDays`. |
| `strava` | Objekt | nein | `{ km:"74.5", time:"2h 35m", elev:263, speed:"28.8" }` | Optional bei `ride`-Tagen, nachträglich ergänzte Ist-Daten. |

### `focusDays.A` / `focusDays.B`

Top-Level-Felder pro Focus-Tag: `title` (z. B. `"🏋️ Focus-Tag A"`), `date` (`"Donnerstag · 09.07.2026"`), `sub`, `intro` (Begründungstext), `blocks[]`, `whoop[]`.

Jeder Block in `blocks[]`:

| Feld | Typ | Bedeutung |
|---|---|---|
| `letter` | String | Block-Buchstabe `"A"`…`"F"`. |
| `title` | String | Block-Titel, z. B. `"Squat Clean + Push Jerk Komplex"`. |
| `sub` | String | Untertitel/Schema. |
| `headers` | Array | Tabellen-Header, z. B. `["Übung","Sets × Reps","Last","RPE","Tempo","Rest","Note"]`. Mobility-Blöcke nutzen kürzere Header wie `["Übung","Dauer","Note"]`. |
| `rows` | Array of Arrays | Zeilen passend zu `headers`. `\|\|` innerhalb einer Zelle erzeugt einen Zeilenumbruch im Rendering. |
| `note` | String (optional) | Block-Fußnote. |

`whoop[]` ist ein Array aus `[Übungsname, Detailstring]`-Paaren, z. B. `["Bar Muscle Up","EMOM 10 · 1–2 reps/min · BW · …"]`. **Die Übungsnamen müssen exakte Einträge der WHOOP-Übungsbibliothek sein** (keine erfundenen Namen — Regel aus `coach/instructions.md`).

### KRITISCHER KONTRAKT: `isoDate`

`isoDate` (`YYYY-MM-DD`) ist auf **jedem** Tages-Objekt Pflicht — auch bei `rest`. Es ist der Join-Key zwischen Plan und Notiz-System (verifiziert am Code, Stand 2026-07-11):

- `index.html` lädt Notizen per `fetch('/get_notes.php?from=${fromDate}&to=${toDate}')` (Bereich = `dateFrom`/`dateTo` der Woche) und indiziert sie mit `weekNotes[n.note_date] = …`.
- Beim Speichern schickt `saveNote(isoDate)` den Body `{ session_key: isoDate, note_date: isoDate, rpe_feel, note_text }` an `save_note.php`.
- `get_notes.php` selektiert aus MariaDB: `SELECT session_key, note_date, … FROM session_notes WHERE note_date BETWEEN :from AND :to`.
- Rendering greift per `weekNotes[date]` (= `isoDate`) auf die Notiz des Tages zu.

Falsches oder fehlendes `isoDate` ⇒ RPE-/Notiz-UI des Tages hängt an keinem DB-Datensatz mehr. Der Kopf-Kommentar von `data.js` sagt es selbst: „isoDate-Felder sind Pflicht — werden vom Notes-System genutzt."

## 2. Publish-Runbook (nach „Committen")

1. **Aktuellen Stand laden** (GitHub ist die gemeinsame Wahrheit, nie blind überschreiben):
   ```bash
   cd /home/user/trainer && git pull origin main
   ```
2. **Neue Woche in `website/data.js` einfügen** — als erstes Objekt in `weeks[]`, direkt unter dem Kommentar `/* ── neue Woche als nächstes Objekt HIER (oben) einfügen ── */`. Alle Pflichtfelder gemäß Abschnitt 1, jeder Tag mit `isoDate`.
3. **Auf maximal 4 Wochen kürzen**: das älteste Wochen-Objekt am Ende von `weeks[]` entfernen (inkl. trennendem Kommentar).
4. **Syntax prüfen** (data.js ist plain JS, ein Tippfehler bricht die ganze PWA):
   ```bash
   node --check website/data.js
   ```
5. **`coach/state.json` konsistent aktualisieren**: `aktuelle_woche` (`id`, `von`, `bis`, `mesocycle`, `woche_im_fokus`, `phase`) und `aktualisiert_am` müssen zur neuen Woche in `data.js` passen. Weitere betroffene Coach-Dateien ebenfalls konsistent halten.
6. **Committen und direkt auf `main` pushen** (Publishing = Push auf `main`, kein PR):
   ```bash
   git add website/data.js coach/state.json
   git commit -m "W29-Plan veröffentlichen (13.–19.07.)"
   git push -u origin main
   ```
   Commit-Message darf **nicht** mit „Revert" beginnen, sonst greift der Auto-Revert-Schutz nicht (Abschnitt 3).
7. **Deployment BEOBACHTEN — nicht nur anstoßen.** Erfolg erst melden, wenn die Verifikation (Abschnitt 4) grün ist. Bei Fehlschlag: Auto-Revert-Verhalten kennen (Abschnitt 3 und 5), stoppen, Fehler erklären.

## 3. Deploy-Pipeline: `.github/workflows/deploy.yml`

Trigger: `push` auf `main` sowie `workflow_dispatch`. Concurrency-Gruppe `production-deploy` mit `cancel-in-progress: false` — Deployments laufen strikt nacheinander, ein laufender Deploy wird nie abgebrochen. `permissions: contents: write` (für den Auto-Revert-Push). Checkout mit `fetch-depth: 2`.

| Step | Was passiert |
|---|---|
| `Install tools` | `sudo apt-get update && sudo apt-get install -y lftp` |
| `Determine expected week` | Extrahiert die **erste** Wochen-ID aus `data.js` (Original-Zeile aus deploy.yml): `WEEK_ID="$(sed -n 's/^[[:space:]]*id: "\([^"]*\)",/\1/p' website/data.js | head -n 1)"` — dann `test -n "$WEEK_ID"`. Deshalb muss die neue Woche exakt das Format `id: "2026-W29",` (Doublequotes, Komma) haben und OBEN stehen. |
| `Deploy website via SFTP` | `lftp` gegen `sftp://$SFTP_HOST` (Secrets `FTP_HOST`/`FTP_USERNAME`/`FTP_PASSWORD`), dann `mirror --reverse --exclude-glob config.php --exclude-glob config.template.php ./website/ /`. Das echte `config.php` lebt NUR auf dem Server und wird nie committet oder überschrieben. **Kein `--delete`** — siehe Falle (a). |
| `Verify deployment` | `continue-on-error: true`; bis zu **5 Versuche × 12 s Sleep**: `curl --fail --silent --show-error --max-time 20 https://training.martinwitte.de/data.js | grep --fixed-strings "$EXPECTED_WEEK_ID"`. Erfolg = HTTP 2xx **und** Wochen-ID im Body. |
| `Revert failed deployment` | Nur wenn `steps.verify.outcome == 'failure' && !startsWith(github.event.head_commit.message, 'Revert')`: der github-actions[bot] macht `git revert --no-edit HEAD` und `git push origin HEAD:main`. Der Revert-Push löst selbst wieder ein Deployment aus — das dank „Revert"-Präfix bei erneutem Fehlschlag NICHT noch einmal revertet (Endlosschleifen-Schutz). |
| `Report deployment failure` | Bei Verify-Fehlschlag immer: `::error::Website nicht erreichbar oder Wochen-ID … wurde nicht ausgeliefert.` und `exit 1` — der Run wird rot. |

### Run prüfen

- GitHub Actions UI: https://github.com/blit2licht/trainer/actions (Workflow „Deploy to IONOS").
- CLI: `gh run list --repo blit2licht/trainer --workflow deploy.yml --limit 3` und `gh run watch --repo blit2licht/trainer <run-id>`.
- MCP: `mcp__github__actions_list` (Runs auflisten), `mcp__github__actions_get` (Run-Details), `mcp__github__get_job_logs` (Logs bei Fehlschlag).
- Nach jedem Push zusätzlich prüfen, ob der github-actions[bot] einen `Revert "…"`-Commit auf `main` gepusht hat: `git fetch && git log origin/main --oneline -3`.

## 4. Manuelle Verifikation (Einzeiler)

```bash
curl -fsS https://training.martinwitte.de/data.js | grep -F '2026-W29' && echo OK
```

(Wochen-ID durch die soeben veröffentlichte ersetzen — dieselbe Semantik wie der Verify-Step.)

## 5. Fallstricke (alle in der Git-History belegt)

**(a) `lftp mirror --reverse` hat KEIN `--delete` — Server-Leichen.** Aus dem Repo gelöschte Dateien bleiben auf dem IONOS-Server liegen. Beleg: Commit `4b429fc` (2026-06-21) entfernte `website/icons/favicon.php` und `website/icons/apple-touch-icon.php`, aber `website/.htaccess` enthält Stand 2026-07-11 weiterhin `RewriteRule`s auf `/icons/favicon.php` und `/icons/apple-touch-icon.php` (Zeilen 3–6) — die funktionieren live nur, weil die PHP-Dateien serverseitig nie gelöscht wurden. Ebenso liegt `website/pfad.php` (Debug-Datei, `<?php echo __DIR__; ?>`, Commit `474a8e5`) noch im Repo und deployed. Konsequenz: Wer eine Datei wirklich vom Server entfernen will, muss das manuell per SFTP tun — ein Repo-Delete + Push reicht nicht.

**(b) `.htaccess`-Fehler ⇒ HTTP 500 site-weit ⇒ Verify schlägt fehl ⇒ Auto-Revert.** Belegter Vorfall (alle 2026-06-21): `c5de0bc` („feat: HTTP Basic Auth für gesamte Seite") → Verify-Fehlschlag → Auto-Revert `0b53b9b` durch github-actions[bot]; Reparaturversuch `b27cc8e` („fix: korrekter AuthUserFile-Pfad für IONOS") → erneut Auto-Revert `cd6083f`; final `840903d` entfernte Basic Auth ganz und setzte stattdessen `robots.txt`. Zwei Lehren, beide in `coach/architecture.md` festgehalten: (1) **IONOS nutzt nicht-standardisierte interne Pfade** (z. B. für `AuthUserFile`) — vor JEDER `.htaccess`-Auth-Änderung den tatsächlichen Pfad bestätigen, sonst 500. (2) **Basic Auth ist mit dem iOS-Standalone-PWA-Modus inkompatibel** (Homescreen-Icon → schwarzer Screen, dokumentiert in der Commit-Message von `840903d`) — also auch bei korrektem Pfad keine Option.

**(c) Service-Worker/PWA-Staleness: Cache-Strategie nicht „verbessern".** `website/sw.js` (Cache-Name `training-v1`) fährt bewusst **Network-first** mit Cache-Fallback, und `website/.htaccess` setzt `Cache-Control "no-cache"` exakt auf `index.html|data.js|sw.js|manifest.json` — genau damit Planänderungen sofort auf dem iPhone ankommen (online immer frisch, offline letzter Stand). Icons (`png|ico`) dürfen lange cachen (`max-age=2592000`). Niemals lange Cache-Header auf die veränderlichen Dateien legen und die no-cache-`FilesMatch`-Liste bei neuen mutablen Dateien erweitern.

**(d) Ein fehlgeschlagener Revert-Deploy revertet NICHT erneut.** Wegen des Guards `!startsWith(github.event.head_commit.message, 'Revert')` bleibt ein kaputter „Revert …"-Commit einfach kaputt auf `main` liegen (Run rot, Site ggf. defekt). Dann: manuell diagnostizieren (Logs via `gh run view --log-failed` / `mcp__github__get_job_logs`), Fix committen (Message NICHT mit „Revert" beginnen, damit das Sicherheitsnetz wieder aktiv ist) und Deployment erneut beobachten. Gleiches gilt für manuell erstellte Revert-Commits: Message beginnt mit „Revert" ⇒ kein Auto-Revert-Netz.

## 6. Post-Publish-Checkliste

- [ ] GitHub-Actions-Run „Deploy to IONOS" für den Push ist grün (kein rotes `Report deployment failure`).
- [ ] Kein `Revert "…"`-Commit vom github-actions[bot] auf `origin/main` erschienen.
- [ ] `curl -fsS https://training.martinwitte.de/data.js | grep -F '<NEUE-WOCHEN-ID>'` liefert einen Treffer.
- [ ] Site erreichbar: `curl -fsS -o /dev/null -w '%{http_code}\n' https://training.martinwitte.de/` → `200`.
- [ ] PWA zeigt die neue Woche (Reload in der App; dank Network-first + no-cache genügt einmal Öffnen mit Netz).
- [ ] `coach/state.json` → `aktuelle_woche.id` == erste `id` in `website/data.js`; `von`/`bis` == `dateFrom`/`dateTo`.
- [ ] `website/data.js` enthält maximal 4 Wochen, neueste vorn.
- [ ] Erst JETZT Erfolg an Martin melden.

## Provenanz und Wartung

Volatile Fakten Stand 2026-07-11. Re-Verifikation:

| Behauptung | Quelle | Re-Check-Kommando |
|---|---|---|
| Wochen-IDs / max 4 Wochen / neueste vorn | `website/data.js` | `grep -n 'id: "' website/data.js` |
| Wochen-/Tages-/Block-Felder | `website/data.js` | `sed -n '1,110p' website/data.js` |
| isoDate-Join zu `session_notes.note_date` | `website/index.html`, `website/get_notes.php`, `website/save_note.php` | `grep -n 'note_date' website/index.html website/get_notes.php website/save_note.php` |
| Workflow-Steps, sed-Extraktion, Verify 5×12 s, Revert-Guard, Concurrency | `.github/workflows/deploy.yml` | `cat .github/workflows/deploy.yml` |
| `.htaccess`-Staleness (Rewrites auf gelöschte icons/*.php) | `website/.htaccess` + Commit `4b429fc` | `grep -n 'icons/.*\.php' website/.htaccess; git show --stat 4b429fc` |
| Kein `--delete` in lftp mirror | `.github/workflows/deploy.yml` | `grep -n 'mirror' .github/workflows/deploy.yml` |
| Basic-Auth-/AuthUserFile-Vorfall inkl. iOS-Black-Screen | Git-History | `git log --oneline c5de0bc~1..840903d; git show 840903d --format='%B' -s` |
| `pfad.php` noch im Repo | `website/` | `ls website/pfad.php` |
| sw.js Network-first, Cache `training-v1` | `website/sw.js` | `sed -n '1,10p' website/sw.js` |
| no-cache-Header auf mutablen Dateien | `website/.htaccess` | `grep -n 'Cache-Control' website/.htaccess` |
| state.json-Felder `aktuelle_woche` | `coach/state.json` | `head -15 coach/state.json` |
| „Committen"-Gate & Publish-Schritte | `coach/instructions.md`, `CLAUDE.md` | `grep -n 'Committen' coach/instructions.md CLAUDE.md` |
| Hosting-Fakten (IONOS, SFTP, MariaDB) | `coach/architecture.md` | `sed -n '1,20p' coach/architecture.md` |
