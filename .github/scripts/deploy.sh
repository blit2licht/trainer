#!/usr/bin/env bash
# Lädt website/ per SFTP auf den IONOS-Server. Der Deploy-Workflow nutzt das
# Skript zweimal: für das normale Deployment und für den Rückbau, nachdem ein
# fehlgeschlagenes Deployment revertet wurde.
# Erwartet SFTP_HOST, SFTP_USER und SFTP_PASS in der Umgebung.
set -euo pipefail

mkdir -p ~/.ssh
grep -qxF "StrictHostKeyChecking no" ~/.ssh/config 2>/dev/null \
  || echo "StrictHostKeyChecking no" >> ~/.ssh/config

# config.php existiert nur auf dem Server, CLAUDE.md sind Arbeitsregeln fürs Repo.
lftp -u "$SFTP_USER","$SFTP_PASS" "sftp://$SFTP_HOST" <<LFTP
mirror --reverse \
  --exclude-glob config.php \
  --exclude-glob config.template.php \
  --exclude-glob CLAUDE.md \
  ./website/ /
bye
LFTP
