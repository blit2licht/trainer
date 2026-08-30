#!/bin/bash
# Installiert den Werkstatt-Helper als LaunchAgent: startet beim Login,
# läuft still im Hintergrund (nur 127.0.0.1:8125), Neustart bei Absturz.
# Danach ist die Werkstatt jederzeit unter http://localhost:8125 erreichbar.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
PLIST="$HOME/Library/LaunchAgents/de.martinwitte.werkstatt.plist"

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>de.martinwitte.werkstatt</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/python3</string>
    <string>${REPO}/scripts/werkstatt_serve.py</string>
  </array>
  <key>WorkingDirectory</key><string>${REPO}</string>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>/tmp/werkstatt.log</string>
  <key>StandardErrorPath</key><string>/tmp/werkstatt.log</string>
</dict>
</plist>
EOF

launchctl unload "$PLIST" 2>/dev/null || true
launchctl load "$PLIST"
sleep 1
curl -sf http://localhost:8125/ping >/dev/null \
  && echo "Werkstatt läuft: http://localhost:8125 (startet ab jetzt bei jedem Login mit)" \
  || { echo "Helper antwortet nicht — Log: /tmp/werkstatt.log"; exit 1; }
