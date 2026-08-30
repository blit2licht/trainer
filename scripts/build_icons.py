#!/usr/bin/env python3
"""Erzeugt den kompletten Icon-Satz aus einer einzigen Geometrie.

Das Motiv ist das „T" aus Archivo Black, Breitenachse 62 (dieselbe Schrift und
dieselbe Schmalstellung wie die Display-Zeilen der App), als Negativform in der
Marker-Fläche. Weil dieses T aus genau zwei Rechtecken besteht, wird es hier
nicht als Schrift gesetzt, sondern nachgebaut: So lässt sich jede Zielgröße auf
das Pixelraster runden, und 16 px bleibt scharf statt matschig.

Die Proportionen stammen aus der ausgemessenen Glyphe:
    Breite/Hoehe = 0.6465, Querbalken = 0.23 der Hoehe, Stamm = 0.412 der Breite

Aufruf:  python3 scripts/build_icons.py

Schreibt nach website/ und website/icons/ sowie die Vektorquelle design/icon.svg.
Die beiden Dateien im Root (favicon.ico, apple-touch-icon.png) sind kein
Versehen: Auf dem Server liegen aus einer Vorgaengerseite noch Icons unter
/favicon.ico und /apple-touch-icon.png. Der Deploy spiegelt ohne --delete, kann
sie also nicht entfernen — er kann sie nur ueberschreiben. Darum gehoeren sie
ins Repo.
"""

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "website"
ICONS = WEB / "icons"
DESIGN = ROOT / "design"

AMBER = "#f9ac3a"  # --amber / --marker, oklch(80% 0.152 72)
INK = "#0c0907"  # --g1,             oklch(14.5% 0.007 62)

# Anteile der Kantenlaenge. GLYPH_H ist bewusst gross gewaehlt (64 %): Das T
# bleibt auch unter der Android-Kreismaske vollstaendig, geprueft bei 1024 px.
GLYPH_H = 0.640625
GLYPH_W = GLYPH_H * 0.6465
BAR_H = GLYPH_H * 0.23
STEM_W = GLYPH_W * 0.412


def render(size):
    """Ein Icon in Kantenlaenge `size`, auf ganze Pixel gerundet."""
    im = Image.new("RGB", (size, size), AMBER)
    d = ImageDraw.Draw(im)

    gh = round(GLYPH_H * size)
    gw = round(GLYPH_W * size)
    bar = max(1, round(BAR_H * size))
    stem = max(1, round(STEM_W * size))

    x0 = (size - gw) // 2
    y0 = (size - gh) // 2
    sx = x0 + (gw - stem) // 2

    d.rectangle([x0, y0, x0 + gw - 1, y0 + bar - 1], fill=INK)
    d.rectangle([sx, y0 + bar, sx + stem - 1, y0 + gh - 1], fill=INK)
    return im


def svg():
    """Dieselbe Geometrie als Vektorquelle, Kantenlaenge 512."""
    s = 512
    gh, gw = GLYPH_H * s, GLYPH_W * s
    bar, stem = BAR_H * s, STEM_W * s
    x0, y0 = (s - gw) / 2, (s - gh) / 2
    sx = x0 + (gw - stem) / 2
    fmt = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\n'
        f'  <rect width="512" height="512" fill="{AMBER}"/>\n'
        f'  <rect x="{fmt(x0)}" y="{fmt(y0)}" '
        f'width="{fmt(gw)}" height="{fmt(bar)}" fill="{INK}"/>\n'
        f'  <rect x="{fmt(sx)}" y="{fmt(y0 + bar)}" '
        f'width="{fmt(stem)}" height="{fmt(gh - bar)}" fill="{INK}"/>\n'
        "</svg>\n"
    )


def main():
    ICONS.mkdir(parents=True, exist_ok=True)

    targets = {
        ICONS / "icon-512.png": 512,
        ICONS / "icon-192.png": 192,
        ICONS / "apple-touch-icon.png": 180,
        ICONS / "favicon-32.png": 32,
        ICONS / "favicon-16.png": 16,
        # Root — ueberschreibt die Reste der Vorgaengerseite, siehe Modulkopf.
        WEB / "apple-touch-icon.png": 180,
        WEB / "apple-touch-icon-precomposed.png": 180,
    }
    for path, size in targets.items():
        render(size).save(path)
        print(f"{path.relative_to(ROOT)}  {size}x{size}")

    ico_sizes = [16, 32, 48, 64, 128, 256]
    frames = [render(n) for n in ico_sizes]
    frames[-1].save(
        WEB / "favicon.ico",
        sizes=[(n, n) for n in ico_sizes],
        append_images=frames[:-1],
    )
    print(f"website/favicon.ico  {'/'.join(str(n) for n in ico_sizes)}")

    (DESIGN / "icon.svg").write_text(svg())
    print("design/icon.svg")


if __name__ == "__main__":
    main()
