#!/usr/bin/env python3
"""Baut das Design-System-Bundle für Claude Designer aus dem Produktions-CSS.

    python3 design/build.py

Liest den <style>-Block aus website/index.html und schreibt eigenständige
Preview-Seiten nach design/bundle/ (nicht versioniert — generiertes Ergebnis).
Jede Preview enthält das CSS unverändert, dazu generisches Demo-Markup.
Dadurch entspricht die Sandbox in Designer exakt der echten App und Änderungen
lassen sich zeilengleich zurück nach website/index.html übertragen.

Demo-Inhalte sind bewusst neutral: keine echten Trainingsdaten, Recovery-Werte
oder Lastreferenzen — das Bundle wird zu einem externen Dienst hochgeladen.

Hochgeladen wird mit dem DesignSync-Tool (Projekt "Trainer Design System"):
list_files → finalize_plan(localDir=design/bundle) → write_files.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "design" / "bundle"
SRC = ROOT / "website" / "index.html"


def production_css() -> str:
    """Den <style>-Block aus index.html ziehen — keine kopierte Zweitfassung."""
    html = SRC.read_text(encoding="utf-8")
    m = re.search(r"<style>\n(.*?)\n</style>", html, re.S)
    if not m:
        sys.exit(f"Kein <style>-Block in {SRC} gefunden.")
    return m.group(1)


CSS = production_css()

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700'
         '&family=JetBrains+Mono:wght@500;600;700&display=swap">')

PAGE = """<!-- @dsCard group="{group}" -->
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
{fonts}
<style>
{css}
/* ── Nur für die Preview-Darstellung, nicht Teil des Produktions-CSS ── */
body {{ padding:22px; }}
.ds-wrap {{ max-width:640px; margin:0 auto; }}
.ds-label {{ font-family:var(--mono); font-size:11px; font-weight:700; letter-spacing:.1em;
             text-transform:uppercase; color:var(--ink3); margin:26px 0 10px; }}
.ds-label:first-child {{ margin-top:0; }}
.ds-hint {{ font-family:var(--body); font-size:12px; color:var(--ink3); margin:6px 0 0; line-height:1.5; }}
.ds-grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px; }}
.ds-swatch {{ border:1px solid var(--line); border-radius:11px; overflow:hidden; background:var(--card); }}
.ds-swatch-color {{ height:58px; }}
.ds-swatch-meta {{ padding:8px 10px; }}
.ds-swatch-name {{ font-family:var(--mono); font-size:11px; font-weight:700; color:var(--ink); }}
.ds-swatch-val {{ font-family:var(--mono); font-size:10px; color:var(--ink3); margin-top:2px; }}
</style>
</head>
<body>
<div class="ds-wrap">
{body}
</div>
</body>
</html>
"""


def write(path, group, title, body):
    p = OUT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(PAGE.format(group=group, title=title, fonts=FONTS, css=CSS, body=body),
                 encoding="utf-8")
    return path


# ── Foundations ───────────────────────────────────────────────────────────
COLORS = [
    ("--bg", "#EEF1F5", "Seitenhintergrund"), ("--card", "#FFFFFF", "Kartenfläche"),
    ("--line", "#E2E6EC", "Rahmen"), ("--line2", "#EDF0F4", "Trennlinie innen"),
    ("--ink", "#11131A", "Text primär"), ("--ink2", "#444B5A", "Text sekundär"),
    ("--ink3", "#76808F", "Text tertiär"),
    ("--blue", "#2563EB", "Akzent / Focus-Tag"), ("--blue-soft", "#E8F0FE", "Akzentfläche"),
    ("--blue-ink", "#1D4ED8", "Akzenttext"),
    ("--amber", "#D9480F", "Warnung / Zeitcap"), ("--amber-soft", "#FCEEE5", "Warnfläche"),
    ("--amber-ink", "#C2410C", "Warntext"),
    ("--green", "#047857", "Bestätigung / WHOOP"), ("--green-soft", "#E1F3EC", "Bestätigungsfläche"),
    ("--strava", "#FC4C02", "Strava"), ("--strava-soft", "#FFF0EB", "Strava-Fläche"),
    ("--gray", "#5C6573", "Neutral"), ("--gray-soft", "#ECEFF3", "Neutralfläche"),
]
sw = "".join(
    f'<div class="ds-swatch"><div class="ds-swatch-color" style="background:{v}"></div>'
    f'<div class="ds-swatch-meta"><div class="ds-swatch-name">{n}</div>'
    f'<div class="ds-swatch-val">{v} · {d}</div></div></div>'
    for n, v, d in COLORS)
write("foundations/colors.html", "Foundations", "Farb-Tokens",
      f'<div class="ds-label">Farb-Tokens</div><div class="ds-grid">{sw}</div>'
      '<p class="ds-hint">Definiert in <code>:root</code>. Jede Farbe hat eine kräftige Variante '
      'für Text/Rahmen und eine <code>-soft</code>-Fläche für Hintergründe.</p>')

write("foundations/typography.html", "Foundations", "Typografie",
      '<div class="ds-label">Display — Space Grotesk</div>'
      '<div style="font-family:var(--disp);font-size:30px;font-weight:700;letter-spacing:-.02em">Wochenplan</div>'
      '<div style="font-family:var(--disp);font-size:21px;font-weight:700;letter-spacing:-.015em;margin-top:8px">8 Runden auf Zeit</div>'
      '<div style="font-family:var(--disp);font-size:16px;font-weight:600;margin-top:8px">Shoulder to Overhead</div>'
      '<div class="ds-label">Body — Inter</div>'
      '<div style="font-size:16px">Fließtext für Coaching-Hinweise und Beschreibungen.</div>'
      '<div style="font-size:13px;color:var(--ink2);margin-top:6px">Kleiner Fließtext in Karten-Notizen.</div>'
      '<div class="ds-label">Mono — JetBrains Mono</div>'
      '<div style="font-family:var(--mono);font-size:17px;font-weight:700">8 × 1 · 52,5 kg</div>'
      '<div style="font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink3);margin-top:8px">Label Uppercase</div>'
      '<p class="ds-hint">Mono trägt alle Zahlen — Lasten, Reps, Zeiten. Ziffern müssen in der Box '
      'auf einen Blick lesbar sein. Achtung: Großes O und Null sind kaum unterscheidbar, '
      'Abkürzungen wie S2O daher ausschreiben.</p>')

write("foundations/elevation.html", "Foundations", "Flächen & Radien",
      '<div class="ds-label">Karte — Radius 13px, Shadow</div>'
      '<div class="exc"><div class="exc-name">Standardkarte</div>'
      '<div class="exc-note">border 1px var(--line) · radius 13px · var(--shadow)</div></div>'
      '<div class="ds-label">Akzentfläche</div>'
      '<div class="blk-note">Hinweisbox in <code>--blue-soft</code>, Radius 11px, ohne Rahmen.</div>'
      '<div class="ds-label">Chip — Radius 10px</div>'
      '<div class="exc-data"><div class="chip"><div class="chip-label">Sätze × Wdh</div><div class="chip-val">8 × 1</div></div>'
      '<div class="chip rpe"><div class="chip-label">RPE</div><div class="chip-val">≤8</div></div></div>')

# ── Wochenplan ────────────────────────────────────────────────────────────
def day_card(cls, badge_cls, badge, day, date, einheit, sub, rx, pill, note, open_link=False):
    ol = ('<div class="dc-open">Routine öffnen <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" '
          'stroke-width="2.2"><path d="M6 3l5 5-5 5"/></svg></div>') if open_link else ''
    return (f'<div class="day-card {cls}"><div class="dc-head"><span class="dc-day">{day}</span>'
            f'<span class="dc-date">{date}</span><span class="badge {badge_cls}">{badge}</span></div>'
            f'<div class="dc-body"><div class="dc-einheit">{einheit}</div>'
            f'<div class="dc-sub">{sub}</div>'
            f'<div class="dc-rx"><span class="dc-rx-main">{rx}</span><span class="rpe-pill">{pill}</span></div>'
            f'<div class="dc-note">{note}</div>{ol}</div></div>')

write("components/day-card.html", "Wochenplan", "Tages-Karte",
      '<div class="ds-label">Box-Tag</div>' +
      day_card("t-box", "badge-box", "📦 Class", "Samstag", "18.07.",
               "Accessory Strength + AMRAP Engine",
               "E3:00×3: Dips · Lateral Raise · Side Plank → 5 Runden: Push-ups · Air Squats · V-ups",
               "RPE-only", "RPE ~6-7", "Kurzer Coaching-Hinweis zur Einordnung des Tages.") +
      '<div class="ds-label">Eigener Fokus-Tag — mit Routine-Link</div>' +
      day_card("t-own", "badge-own", "🏋️ Focus A", "Dienstag", "14.07.",
               "Pull/Gymnastics + Front Squat",
               "Strict Pull-up · Toes-to-Bar · Front Rack Squat · Hollow Hold",
               "Auf Anfrage", "RPE ≤7", "Fokus-Tage öffnen eine detaillierte Routine.", True) +
      '<div class="ds-label">Ruhetag</div>'
      '<div class="day-card t-rest"><div class="dc-head"><span class="dc-day">Montag</span>'
      '<span class="dc-date">13.07.</span><span class="badge badge-rest">❌ Recovery</span></div>'
      '<div class="dc-body"><div class="dc-einheit" style="color:var(--ink3)">Kein Training</div>'
      '<div class="dc-note">Ruhetage sind harte Ruhetage — keine optionale Aufweichung.</div></div></div>'
      '<p class="ds-hint">Der farbige Balken links (<code>t-box</code>, <code>t-own</code>, '
      '<code>t-rest</code>, <code>t-ride</code>) kodiert den Tagestyp.</p>')

write("components/badges.html", "Wochenplan", "Badges & RPE-Pill",
      '<div class="ds-label">Tagestyp-Badges</div>'
      '<div style="display:flex;flex-wrap:wrap;gap:8px">'
      '<span class="badge badge-box">📦 Class</span>'
      '<span class="badge badge-own">🏋️ Focus A</span>'
      '<span class="badge badge-own">💪 Focus B</span>'
      '<span class="badge badge-rest">❌ Recovery</span>'
      '<span class="badge badge-ride">🚴 Ride</span></div>'
      '<div class="ds-label">RPE-Pill</div>'
      '<div class="dc-rx"><span class="dc-rx-main">Last/Level-Angabe</span>'
      '<span class="rpe-pill">RPE ≤8</span></div>'
      '<div class="ds-label">Level-Hervorhebung im Fließtext</div>'
      '<div class="dc-rx"><span class="dc-rx-main">WOD <span class="rv">L3 — Bar 60 kg, Box 70 cm</span></span></div>')

# ── Routine ───────────────────────────────────────────────────────────────
write("components/block-header.html", "Routine", "Block-Kopf",
      '<div class="ds-label">Blöcke werden mit Buchstabe, Titel und Kurzbeschreibung geführt</div>'
      '<div class="blk"><div class="blk-head"><div class="blk-letter">A</div><div>'
      '<div class="blk-title">Warm-up</div><div class="blk-sub">~10 min · Positionen wecken</div>'
      '</div></div></div>'
      '<div class="blk"><div class="blk-head"><div class="blk-letter">B</div><div>'
      '<div class="blk-title">Clean &amp; Jerk — Singles</div><div class="blk-sub">E1:30 × 8 · Woche 1/2</div>'
      '</div></div><div class="blk-note">Hinweisbox am Blockende für Coaching-Kontext.</div></div>')

write("components/exercise-card.html", "Routine", "Übungskarte",
      '<div class="ds-label">Kraftsatz — volle Chip-Reihe</div>'
      '<div class="exc"><div class="exc-name">Clean &amp; Jerk</div>'
      '<div class="exc-data">'
      '<div class="chip"><div class="chip-label">Sätze × Wdh</div><div class="chip-val">8 × 1</div></div>'
      '<div class="chip"><div class="chip-label">Last</div><div class="chip-val">60 · 65 · 70 kg</div></div>'
      '<div class="chip rpe"><div class="chip-label">RPE</div><div class="chip-val">≤8</div></div></div>'
      '<div class="exc-meta"><span><b>Tempo</b>zügig</span><span><b>Pause</b>E1:30</span></div>'
      '<div class="exc-note">Abbruchkriterium statt starrer Vorgabe — Technik vor Last.</div></div>'
      '<div class="ds-label">Zeit-basiert — nur Dauer</div>'
      '<div class="exc"><div class="exc-name">Hüftbeuger-Stretch</div>'
      '<div class="exc-data"><div class="chip"><div class="chip-label">Dauer</div>'
      '<div class="chip-val">2 × 45 sec/Seite</div></div></div>'
      '<div class="exc-note">Mobility-Blöcke nutzen dieselbe Karte ohne Last/RPE.</div></div>'
      '<p class="ds-hint">Chips erscheinen nur, wenn die Spalte in den Daten vorhanden ist — '
      'unbekannte Spaltennamen werden stillschweigend verworfen.</p>')

write("components/wod-card.html", "Routine", "WOD-Karte",
      '<div class="ds-label">Metcon als geschlossene Einheit</div>'
      '<div class="wod"><div class="wod-struct">8 Runden auf Zeit</div>'
      '<div class="wod-tags"><span class="wod-tag">For Time</span>'
      '<span class="wod-tag cap">Cap 15 min</span></div>'
      '<div class="wod-lines">'
      '<div class="wod-line"><div class="wod-reps">4</div><div class="wod-move">Box Jumps</div>'
      '<div class="wod-detail">70 cm</div></div>'
      '<div class="wod-line"><div class="wod-reps">5</div><div class="wod-move">Chest-to-Bar Pull-up</div>'
      '<div class="wod-detail">BW</div></div>'
      '<div class="wod-line"><div class="wod-reps">6</div><div class="wod-move">Shoulder to Overhead</div>'
      '<div class="wod-detail">52,5 kg</div></div></div>'
      '<div class="wod-total">Gesamt: 32 Box Jumps · 40 Chest-to-Bar · 48 Shoulder to Overhead</div></div>'
      '<div class="blk-note">Coaching-Hinweis zu Skalierung und Pacing steht unter der Karte.</div>'
      '<p class="ds-hint">Ein WOD wird am Stück abgearbeitet: Struktur, Reps, Lasten und Zeitcap '
      'müssen zusammen sichtbar sein — nicht als Kette einzelner Übungskarten. '
      'Unter 420 px rutscht die Last auf eine eigene Zeile.</p>')

write("components/whoop-box.html", "Routine", "WHOOP-Log",
      '<div class="ds-label">Übertragsliste für die Uhr</div>'
      '<div class="whoop-box"><div class="whoop-label">⌚ Format 2 — WHOOP Log</div>'
      '<ul class="whoop-list">'
      '<li><div class="w-name">Clean and Jerk</div><div class="w-detail">8 × 1 · 60-75 kg</div></li>'
      '<li><div class="w-name">Box Jump</div><div class="w-detail">8 × 4 · 70 cm</div></li>'
      '<li><div class="w-name">Chest to Bar Pull Up</div><div class="w-detail">8 × 5 · BW</div></li>'
      '</ul></div>'
      '<p class="ds-hint">Nutzt die Bezeichnungen der WHOOP-Übungsbibliothek, nicht die '
      'Anzeigenamen aus der Routine.</p>')

# ── Notizen & Navigation ──────────────────────────────────────────────────
write("components/note-panel.html", "Notizen", "Notiz & rpe_feel",
      '<div class="ds-label">Erfassung nach der Einheit</div>'
      '<div class="note-panel open">'
      '<div class="rpe-row">'
      '<button class="rpe-btn">😵</button><button class="rpe-btn">😮‍💨</button>'
      '<button class="rpe-btn selected">😐</button><button class="rpe-btn">💪</button>'
      '<button class="rpe-btn">🔥</button></div>'
      '<textarea class="note-textarea" placeholder="Was lief gut / schlecht? Lasten, Energie, Technik…"></textarea>'
      '<div class="note-actions"><button class="note-save-btn">Speichern</button>'
      '<span class="note-status">Gespeichert</span></div></div>'
      '<p class="ds-hint">Die Skala ist <code>rpe_feel</code> (subjektive Sessionqualität 1–5, '
      'höher = besser) — nicht zu verwechseln mit der Load-RPE in den Übungskarten.</p>')

write("components/navigation.html", "Navigation", "Kopfzeile & Rücksprung",
      '<div class="ds-label">Kopfzeile mit Wochenauswahl</div>'
      '<div class="topbar"><div class="brand">AI Coach</div>'
      '<div class="week-select-wrap"><span class="week-select-label">Woche wählen</span>'
      '<select id="weekSelect"><option>Woche 5 · 13.–19. Juli 2026</option></select>'
      '<svg class="select-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" '
      'stroke-width="2"><path d="M4 6l4 4 4-4"/></svg></div></div>'
      '<div class="ds-label">Breadcrumb</div>'
      '<div class="crumb"><span class="lnk">Woche 5 · 13.–19. Juli 2026</span>'
      '<span class="sep">/</span>Focus-Tag C</div>'
      '<div class="ds-label">Seitenkopf</div>'
      '<div class="page-header"><div class="eyebrow">Sonntag · 19.07.2026</div>'
      '<h1>🏋️ Opengym-Session</h1><div class="sub">Clean &amp; Jerk Singles · kurzer WOD</div></div>'
      '<div class="ds-label">Rücksprung</div>'
      '<div class="nav-back"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" '
      'stroke-width="2"><path d="M10 3L5 8l5 5"/></svg>Zurück zum Wochenplan</div>')

# README wandert unverändert mit ins Bundle — sie erklärt im Designer-Projekt,
# woher das CSS stammt und wie Änderungen zurück in die App kommen.
(OUT / "README.md").write_text(
    (ROOT / "design" / "README.md").read_text(encoding="utf-8"), encoding="utf-8")

# ── Selbstprüfung: jede benutzte Klasse muss im Produktions-CSS existieren ──
defined = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", CSS))
problems = 0
for f in sorted(OUT.rglob("*.html")):
    markup = f.read_text(encoding="utf-8").split("</style>", 1)[1]
    used = {c for m in re.findall(r'class="([^"]+)"', markup) for c in m.split()}
    unknown = sorted(c for c in used if c not in defined and not c.startswith("ds-"))
    if unknown:
        print(f"  FEHLER {f.relative_to(OUT)}: unbekannte Klassen {unknown}")
        problems += 1

files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*.html"))
print(f"{len(files)} Previews nach {OUT.relative_to(ROOT)}/ gebaut:")
for f in files:
    print("  ", f)
if problems:
    sys.exit(f"\n{problems} Datei(en) mit undefinierten Klassen — Markup gegen das CSS prüfen.")
print("Selbstprüfung: alle Klassen im Produktions-CSS definiert.")
