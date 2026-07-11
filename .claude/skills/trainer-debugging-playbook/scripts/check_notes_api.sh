#!/usr/bin/env bash
# check_notes_api.sh — ruft website/get_notes.php mit einem from/to-Bereich auf
# und übersetzt den HTTP-Status in die exakte Ursache laut PHP-Quelle.
#
# Aufruf:
#   check_notes_api.sh                    # Default: aktuelle Woche Mo–So
#   check_notes_api.sh 2026-07-06 2026-07-12
#
# Status-Bedeutungen (verifiziert gegen website/get_notes.php, Stand 2026-07-11):
#   200 = OK. Leeres notes[] heißt: keine Notizen im Zeitraum — KEIN Fehler.
#   400 = from/to fehlt oder nicht YYYY-MM-DD (Regex ^\d{4}-\d{2}-\d{2}$).
#   405 = falsche HTTP-Methode (get_notes.php: nur GET; save_note.php: nur POST).
#   503 = config.php fehlt / ungültig / Konstanten unvollständig ODER DB-Fehler
#         (der JSON-Body unterscheidet die Fälle, siehe Fallunterscheidung unten).
#
# Exit-Codes: 0 = HTTP 200, 1 = anderer HTTP-Status, 3 = curl-/Netzfehler.
set -u

BASE="${NOTES_BASE_URL:-https://training.martinwitte.de}"

# Aktuelle Woche Mo–So berechnen (GNU date; %u: 1=Mo … 7=So)
TODAY="$(date +%F)"
DOW="$(date +%u)"
DEFAULT_FROM="$(date -d "$TODAY -$((DOW-1)) days" +%F)"
DEFAULT_TO="$(date -d "$TODAY +$((7-DOW)) days" +%F)"
FROM="${1:-$DEFAULT_FROM}"
TO="${2:-$DEFAULT_TO}"

URL="$BASE/get_notes.php?from=$FROM&to=$TO"
echo "GET $URL"

RESP="$(curl --silent --show-error --max-time 20 --write-out $'\n%{http_code}' "$URL" 2>&1)"
CURL_RC=$?
if [[ $CURL_RC -ne 0 ]]; then
  echo "FAIL (Netz): curl-Exit $CURL_RC — $RESP"
  echo "  → Erreichbarkeit prüfen (Site down / DNS / TLS / Proxy), nicht die API-Logik."
  exit 3
fi

STATUS="${RESP##*$'\n'}"
BODY="${RESP%$'\n'*}"
echo "HTTP $STATUS"
echo "Body: $BODY"

case "$STATUS" in
  200) echo "OK — leeres notes[] = keine Notizen im Zeitraum, kein Defekt." ;;
  400) echo "Ursache: from/to fehlt oder nicht YYYY-MM-DD. Parameter korrigieren, erneut versuchen." ;;
  405) echo "Ursache: falsche HTTP-Methode — get_notes.php akzeptiert nur GET." ;;
  503) echo "Ursache laut Body unterscheiden:"
       echo "  'Server configuration missing'    → config.php fehlt auf dem Server (wird beim Deploy per --exclude-glob NIE mit hochgeladen!)"
       echo "  'Server configuration invalid'    → config.php wirft beim Laden einen Fehler"
       echo "  'Server configuration incomplete' → DB_HOST/DB_NAME/DB_USER/DB_PASS nicht alle definiert"
       echo "  'Database unavailable' + code     → PDO-/MariaDB-Fehler (IONOS-DB prüfen)" ;;
  401) echo "Ursache: Basic Auth aktiv?! Darf nicht sein — Basic Auth wurde am 21.06.2026 entfernt (Commit 840903d), bricht iOS-Standalone UND Deploy-Verify." ;;
  500) echo "Ursache: PHP-Fehler oder .htaccess-Defekt — Triage 'Site-weit HTTP 500' in SKILL.md." ;;
  *)   echo "Unerwarteter Status — Body lesen, dann website/get_notes.php-Quelle prüfen." ;;
esac

[[ "$STATUS" == "200" ]] && exit 0 || exit 1
