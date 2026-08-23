<?php
// Als config.php ausschließlich auf dem IONOS-Server ablegen.
// Diese Datei niemals mit echten Werten committen.
define('DB_HOST', 'localhost');
define('DB_NAME', 'datenbank');
define('DB_USER', 'benutzer');
define('DB_PASS', 'passwort');

// Optional für cron_summary.php:
define('CRON_KEY', 'langer-zufaelliger-wert');

// Shared-Secret für save_verdict.php (Trainer 3.0, Entscheid 7).
// Muss mit dem im localStorage des Handys hinterlegten Wert übereinstimmen.
define('VERDICT_SECRET', 'langer-zufaelliger-verdict-wert');
