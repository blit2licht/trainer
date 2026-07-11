#!/usr/bin/env bash
# verify_deploy.sh — prüft, ob die Live-Site die erwartete Wochen-ID ausliefert.
#
# Extrahiert die erste Wochen-ID aus website/data.js mit EXAKT demselben
# sed-Ausdruck wie .github/workflows/deploy.yml ("Determine expected week")
# und vergleicht gegen das live ausgelieferte data.js.
#
# Exit-Codes:
#   0 = PASS (Live-Site liefert erwartete Wochen-ID)
#   2 = Lokales Problem (data.js nicht gefunden / keine ID extrahierbar)
#   3 = Netzproblem (curl-Fehler: Site down, DNS, TLS, Proxy)
#   4 = Stale Content (Site erreichbar, aber falsche/alte Wochen-ID)
#
# Optional: DEPLOY_URL überschreibt die Ziel-URL (Default: Produktion).
set -u

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || echo "$SCRIPT_DIR/../../../..")"
DATA_JS="$REPO_ROOT/website/data.js"
URL="${DEPLOY_URL:-https://training.martinwitte.de/data.js}"

if [[ ! -f "$DATA_JS" ]]; then
  echo "FAIL (lokal): $DATA_JS nicht gefunden — Skript aus dem Repo heraus aufrufen." >&2
  exit 2
fi

# Identisch zu deploy.yml:
EXPECTED="$(sed -n 's/^[[:space:]]*id: "\([^"]*\)",/\1/p' "$DATA_JS" | head -n 1)"
if [[ -z "$EXPECTED" ]]; then
  echo "FAIL (lokal): keine Wochen-ID aus website/data.js extrahierbar." >&2
  echo "  → Format der id-Zeile prüfen: muss exakt '      id: \"YYYY-Wnn\",' sein," >&2
  echo "    sonst schlägt auch der Deploy-Workflow beim Schritt 'Determine expected week' fehl." >&2
  exit 2
fi
echo "Erwartete Wochen-ID (aus website/data.js): $EXPECTED"

BODY="$(curl --fail --silent --show-error --max-time 20 "$URL" 2>&1)"
CURL_RC=$?
if [[ $CURL_RC -ne 0 ]]; then
  echo "FAIL (Netz): curl konnte $URL nicht laden (curl-Exit $CURL_RC)."
  echo "  Details: $BODY"
  echo "  → Erreichbarkeitsproblem (Site down / DNS / TLS / HTTP-Fehlstatus),"
  echo "    KEIN Stale-Content-Problem. Bei HTTP 500 zuerst .htaccess verdächtigen."
  exit 3
fi

if grep --fixed-strings --quiet "$EXPECTED" <<<"$BODY"; then
  echo "PASS: Live-data.js unter $URL enthält $EXPECTED."
  exit 0
fi

LIVE_ID="$(sed -n 's/^[[:space:]]*id: "\([^"]*\)",/\1/p' <<<"$BODY" | head -n 1)"
echo "FAIL (Stale): Live-data.js enthält NICHT $EXPECTED."
echo "  Live ausgelieferte erste Wochen-ID: ${LIVE_ID:-<keine gefunden>}"
echo "  → SFTP-Upload im Actions-Log prüfen UND Auto-Revert prüfen:"
echo "    git fetch && git log origin/main -3 --oneline   (Revert-Commit von github-actions[bot]?)"
exit 4
