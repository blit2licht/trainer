#!/usr/bin/env bash
# Prüft, ob die Live-Seite die Wochen-ID aus website/data.js ausliefert.
# Die ID wird aus dem aktuellen Arbeitsstand gelesen, das Skript passt damit
# für das Deployment und für den Rückbau. Fünf Versuche im Abstand von 12 s.
set -euo pipefail

# data.js ist generiert (JSON-Schreibweise "id": "...").
WEEK_ID="$(sed -n 's/^[[:space:]]*"id": "\([^"]*\)",/\1/p' website/data.js | head -n 1)"
if [ -z "$WEEK_ID" ]; then
  echo "::error::Keine Wochen-ID in website/data.js gefunden."
  exit 1
fi
echo "Erwartete Wochen-ID: $WEEK_ID"

# grep ohne -q: es muss die ganze Antwort lesen, sonst bricht curl mit SIGPIPE
# ab und pipefail meldet einen Fehler, obwohl die ID da ist.
for attempt in 1 2 3 4 5; do
  if curl --fail --silent --show-error --max-time 20 \
    https://training.martinwitte.de/data.js | grep --fixed-strings "\"$WEEK_ID\"" > /dev/null; then
    exit 0
  fi
  sleep 12
done
echo "Wochen-ID $WEEK_ID wird nicht ausgeliefert."
exit 1
