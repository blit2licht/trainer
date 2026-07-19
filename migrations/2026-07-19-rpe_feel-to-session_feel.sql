-- Umbenennung: session_notes.rpe_feel → session_feel
--
-- Grund: "RPE" bezeichnete zwei verschiedene Dinge — die Load RPE aus dem Plan
-- (1–10, höher = härter, von Claude vorgegeben) und die Rückmeldung nach der
-- Einheit (1–5, höher = besser, von Martin gesetzt). Der geteilte Name war die
-- eigentliche Quelle der Verwirrung.
--
-- REIHENFOLGE IST EGAL. website/notes_db.php erkennt zur Laufzeit, welche
-- Spalte existiert. Das Deployment funktioniert also vor und nach diesem
-- Skript, es gibt kein Ausfallfenster.
--
-- Ausführen in phpMyAdmin (IONOS) oder per CLI:
--   mysql -h <host> -u <user> -p <datenbank> < 2026-07-19-rpe_feel-to-session_feel.sql

-- Vorher prüfen, wie die Spalte aktuell heißt:
--   SHOW COLUMNS FROM session_notes;

-- MySQL 8.0+ / MariaDB 10.5.2+ — behält Typ, NULL-Regel und Default bei:
ALTER TABLE session_notes RENAME COLUMN rpe_feel TO session_feel;

-- Ältere Server kennen RENAME COLUMN nicht. Dann stattdessen CHANGE benutzen
-- und den Typ aus SHOW COLUMNS exakt übernehmen (unten die erwartete Form —
-- vor dem Ausführen mit der Ausgabe abgleichen, sonst geht der Default verloren):
--
--   ALTER TABLE session_notes CHANGE rpe_feel session_feel TINYINT NOT NULL DEFAULT 0;

-- Danach kontrollieren:
--   SHOW COLUMNS FROM session_notes;
--   SELECT note_date, session_feel FROM session_notes ORDER BY note_date DESC LIMIT 5;

-- Aufräumen, sobald das gelaufen ist: notes_db.php entfernen, feel_column()
-- durch den festen Spaltennamen ersetzen, rpe_feel-Fallbacks in get_notes.php,
-- save_note.php und index.html löschen.
