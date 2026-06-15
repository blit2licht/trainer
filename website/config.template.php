<?php
// Als config.php ausschließlich auf dem IONOS-Server ablegen.
// Diese Datei niemals mit echten Werten committen.
define('DB_HOST', 'localhost');
define('DB_NAME', 'datenbank');
define('DB_USER', 'benutzer');
define('DB_PASS', 'passwort');

// Optional für cron_summary.php:
define('CRON_KEY', 'langer-zufaelliger-wert');
