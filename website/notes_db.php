<?php
/* Übergangshelfer für die Umbenennung rpe_feel → session_feel.
 *
 * Grund: Der Code wird per GitHub Actions deployt, die Spalte muss von Hand
 * per ALTER TABLE umbenannt werden. Beides lässt sich nicht gleichzeitig
 * auslösen. Ohne diesen Helfer bräche das Speichern in der Lücke zwischen
 * beiden Schritten — je nachdem, was zuerst passiert.
 *
 * Die Endpunkte fragen deshalb zur Laufzeit, welche Spalte existiert. Damit
 * ist die Reihenfolge egal und es gibt kein Ausfallfenster.
 *
 * Nach erfolgter Migration kann diese Datei entfallen und der Spaltenname in
 * den drei Endpunkten fest verdrahtet werden.
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
