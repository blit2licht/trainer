# Befunde, die hier keine sind

Von Martin entschiedene Punkte. Künftige Critique-Läufe lassen sie stillschweigend fallen.

## Recovery-Kappung nicht am Ort der Nutzung

Befund (Critique 2026-08-20, P1): Die tagesspezifische Recovery-Anpassung steht
in einem geschlossenen Panel oben, während die Blöcke ungekappte Lasten zeigen —
dieselbe Größe mit zwei möglichen Werten.

**Kein Befund.** Martin, 2026-08-20: „das ist overengineering denn ich kann das
selbst gut einschätzen und daher bauen wir das nicht." Er kappt selbst; der Plan
nennt die Zielwerte. Weder ein Recovery-Eingabefeld noch Warnzeilen in den
Blöcken sind erwünscht. Siehe PRODUCT.md, Bestätigte Randbedingungen.

## Ruhetag-Zeile mit 80 % Deckkraft

Befund (Critique 2026-08-30, P2): `.strip.is-rest{opacity:.8}` drückt den
Kontrast von `--ink-3` auf `--ground-2` auf 2,89:1 und trifft damit auch die
24px-Tagesbuchstaben.

**Kein Befund.** Martin, 2026-08-31: „Die Rest-Day-80% sind absolut okay, die
Relevanz ist ja im Use-Case Nebensache, ich klicke ja immer nur den Tag der
aktives Training bedeutet. Mich interessiert nicht, was nicht relevant ist,
jedoch brauche ich die ausgegrauten Tage als Orientierungshilfe." Die Dämpfung
ist die Funktion, nicht der Fehler.

## Trefferflächen und Beschriftung der Verdict-Knöpfe

Befund (Critique 2026-08-30, P1): ✕ und ✓ stehen 64×46 px groß mit 10 px
Abstand rechtsbündig geclustert und tragen keine sichtbare Beschriftung.

**Kein Befund.** Martin, 2026-08-31: „Die unterschiedlichen Größen finde ich
hinnehmbar, auch die Enge ist okay, da gab es bisher kein Problem. Keine
Beschriftung ist auch absolut okay, das Icon ist eineindeutig." Die Sackgasse
nach einem Fehltap war der reale Teil des Befunds und ist am 31.08. behoben.

## Kontrast im Dunkelmodus

Befund (Critique 2026-08-30, P1): `--ink-3` auf `--ground` erreicht im
Dunkelmodus 2,98:1 an über zwanzig Textstellen.

**Prio 2, kein Blocker.** Martin, 2026-08-31: „Der Dark Modus ist da, sieht auch
sauber aus, hat aber Prio 2." Er nutzt den Hellmodus. Dort liegt derselbe Wert
bei 4,49:1 gegen eine Anforderung von 4,50:1, also innerhalb des Messrauschens.
Offen und noch nicht entschieden bleibt allein die Heute-Zeile im Hellmodus
(3,76:1, weil die Bernstein-Tönung den Grund aufhellt).
