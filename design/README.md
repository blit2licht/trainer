# Trainer Design System

Sandbox für das Design von [training.martinwitte.de](https://training.martinwitte.de).
Quelle der Wahrheit ist das Repo `blit2licht/trainer`, Datei `website/index.html`.

## Bauen und hochladen

```
python3 design/build.py
```

Schreibt nach `design/bundle/` — generiertes Ergebnis, nicht versioniert. Der
Upload läuft über das DesignSync-Tool in Projekt „Trainer Design System":
`finalize_plan(localDir=design/bundle)` → `write_files`.

Das Skript prüft sich selbst: Jede im Markup benutzte CSS-Klasse muss im
Produktions-CSS existieren, sonst bricht der Build ab. Das fängt Demo-Markup,
das an der App vorbeigelaufen ist (z. B. geratene Zustandsklassen).

## Woher das kommt

Jede Preview enthält **unverändertes Produktions-CSS** aus dem `<style>`-Block von
`website/index.html`, plus generisches Demo-Markup. Das CSS wird bei jedem Build
frisch aus `index.html` gelesen — es gibt bewusst keine zweite Fassung, die
driften könnte. Was hier aussieht, sieht in der App genauso aus.

Die Demo-Inhalte sind bewusst neutral gehalten — keine echten Trainingsdaten,
Recovery-Werte oder Lastreferenzen.

## Änderungen zurück in die App bringen

1. Hier in der Preview am CSS schrauben (der `<style>`-Block ist in jeder Datei identisch).
2. Geänderte Regeln in `website/index.html` im `<style>`-Block an derselben Stelle ersetzen.
3. Committen und pushen — GitHub Actions deployt per SFTP, Verifikation läuft automatisch.

Es gibt **keinen automatischen Rückweg**. Der Abgleich ist manuell und
absichtlich so: Die App ist eine einzelne HTML-Datei ohne Build-Schritt.

## Aufbau

| Gruppe | Datei | Inhalt |
|---|---|---|
| Foundations | `foundations/colors.html` | 13 Farb-Tokens (OKLCH), live aus `:root` extrahiert, Light + Dark |
| Foundations | `foundations/typography.html` | Space Grotesk / Inter / JetBrains Mono |
| Foundations | `foundations/elevation.html` | Radien, Shadow, Flächen |
| Wochenplan | `components/day-card.html` | Tages-Karte in drei Typvarianten |
| Wochenplan | `components/badges.html` | Type-Badges (Icon + Label statt Emoji), RPE-Pill, Level-Markup |
| Routine | `components/block-header.html` | Block-Kopf mit Buchstabe |
| Routine | `components/exercise-card.html` | Übungskarte mit Chip-Reihe |
| Routine | `components/wod-card.html` | WOD als geschlossene Einheit |
| Routine | `components/whoop-box.html` | Kopierbarer WHOOP-Klartextblock |
| Notizen | `components/note-panel.html` | Notiz-Eingabe mit `session_feel`-Skala (nummerierte Pills) |
| Navigation | `components/navigation.html` | Kopfzeile (kein Branding), Breadcrumb, Seitenkopf, Rücksprung |

## Fallstricke, die im Design schon aufgetreten sind

**Mono verwechselt O und 0.** In JetBrains Mono ist das große O kaum von der Null
zu unterscheiden. In einem WOD, wo Zahlen zählen, las sich „48 S2O" wie „48 S20".
Abkürzungen mit O daher ausschreiben.

**Der Routine-Renderer kennt nur feste Spaltennamen.** `Übung`, `Sets × Reps`,
`Dauer`, `Last`, `RPE`, `Tempo`, `Rest`/`Pause`, `Note` — alles andere wird
stillschweigend verworfen, ohne Fehlermeldung. Ein WOD gehört deshalb in das
`wod`-Objekt, nicht in `headers`/`rows`.

**`f.intro` ist vertrautes HTML, kein Klartext.** Felder wie `intro` werden
per `innerHTML` gerendert und enthalten echtes Markup (`<em>Komplex</em>`,
`&amp;J`). Wer daraus einen Klartextblock baut (WHOOP-Copy-Button), muss vorher
durch `stripHtml()` — sonst landen rohe Tags und Entities auf dem Bildschirm
und in der Zwischenablage.
