<?php
/* Laufzeit-Helfer für Schema-Zustände, die nur von Hand migriert werden
 * (der Code deployt per GitHub Actions, ALTER TABLE läuft separat).
 *
 * session_feel ist abgeschafft (Martin, 31.08.2026): Rückmeldung ist nur
 * noch die Notiz. Die Feel-Spalte (session_feel bzw. alt rpe_feel) bleibt
 * als Historie in der DB; save_note.php braucht feel_column() weiterhin,
 * um sie bei neuen Zeilen mit 0 zu belegen, falls sie NOT NULL ohne
 * Default ist. Entfällt erst, wenn die Spalte per ALTER TABLE einen
 * Default bekommt oder gedroppt wird.
 */

/**
 * Liefert den Namen der Feel-Spalte in session_notes.
 * Rückgabe stammt aus einer festen Whitelist und ist damit sicher in SQL
 * interpolierbar — Spaltennamen lassen sich nicht als Parameter binden.
 */
function feel_column(PDO $pdo): string
{
    static $col = null;
    if ($col !== null) {
        return $col;
    }
    try {
        $stmt = $pdo->query("SHOW COLUMNS FROM session_notes LIKE 'session_feel'");
        $col = $stmt->fetch(PDO::FETCH_ASSOC) ? 'session_feel' : 'rpe_feel';
    } catch (Throwable $e) {
        // Im Zweifel der alte Name — er existierte zuerst.
        $col = 'rpe_feel';
    }
    return $col;
}

/**
 * Liefert true, wenn die Spalte `blocks_done` in session_notes existiert.
 *
 * Gleiches Muster wie feel_column(): Der Code wird per GitHub Actions deployt,
 * die Spalte muss von Hand per ALTER TABLE angelegt werden. Bis dahin wird der
 * Erledigt-Vektor stillschweigend verworfen statt einen Fehler zu werfen —
 * Notiz und Session-Feel speichern unverändert weiter.
 *
 *   ALTER TABLE session_notes ADD COLUMN blocks_done VARCHAR(64) NULL AFTER note_text;
 */
function has_blocks_column(PDO $pdo): bool
{
    static $has = null;
    if ($has !== null) {
        return $has;
    }
    try {
        $stmt = $pdo->query("SHOW COLUMNS FROM session_notes LIKE 'blocks_done'");
        $has = (bool) $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (Throwable $e) {
        $has = false;
    }
    return $has;
}
