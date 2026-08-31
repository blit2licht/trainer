<?php
header('Content-Type: application/json');
header('X-Notes-Version: 2');

require_once __DIR__ . '/notes_db.php';

$config_path = __DIR__ . '/config.php';
if (!is_file($config_path)) {
    http_response_code(503);
    echo json_encode(['error' => 'Server configuration missing']);
    exit;
}
try {
    require_once $config_path;
} catch (Throwable $e) {
    http_response_code(503);
    echo json_encode(['error' => 'Server configuration invalid']);
    exit;
}

foreach (['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS'] as $required_constant) {
    if (!defined($required_constant)) {
        http_response_code(503);
        echo json_encode(['error' => 'Server configuration incomplete']);
        exit;
    }
}

// Method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Input
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

$session_key = trim($data['session_key'] ?? '');
$note_date   = trim($data['note_date']   ?? '');
$note_text   = trim($data['note_text']   ?? '');
// session_feel ist abgeschafft (Martin, 31.08.2026): Rückmeldung ist nur noch
// die Notiz. Ein noch mitgesendetes Feld wird ignoriert; die DB-Spalte bleibt
// als Historie stehen und wird nicht mehr beschrieben.
// Erledigt-Vektor der Fokus-Blöcke, z. B. "A,B,C". Nur Buchstaben und Kommas.
$blocks_done = strtoupper(preg_replace('/[^A-Za-z,]/', '', (string) ($data['blocks_done'] ?? '')));

if (!$session_key || !$note_date) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing session_key or note_date']);
    exit;
}

// Validate date
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $note_date)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid date format']);
    exit;
}

// Upsert
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $has_bd  = has_blocks_column($pdo);
    // Die Feel-Spalte (session_feel bzw. alt rpe_feel) bekommt bei NEUEN
    // Zeilen eine literale 0 (falls sie NOT NULL ohne Default ist), wird
    // aber nie mehr aktualisiert — historische Werte bleiben stehen.
    $col     = feel_column($pdo);

    $cols   = ['session_key', 'note_date', 'note_text', "`$col`"];
    $vals   = [':sk', ':nd', ':nt', '0'];
    $update = ['note_text = VALUES(note_text)'];
    $params = [':sk' => $session_key, ':nd' => $note_date, ':nt' => $note_text];

    if ($has_bd) {
        $cols[]   = 'blocks_done';
        $vals[]   = ':bd';
        $update[] = 'blocks_done = VALUES(blocks_done)';
        $params[':bd'] = $blocks_done;
    }
    $update[] = 'updated_at = NOW()';

    $sql = 'INSERT INTO session_notes (' . implode(', ', $cols) . ')
            VALUES (' . implode(', ', $vals) . ')
            ON DUPLICATE KEY UPDATE ' . implode(', ', $update);

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['success' => true]);

} catch (Throwable $e) {
    error_log('Notes database error: ' . $e->getMessage());
    http_response_code(503);
    echo json_encode(['error' => 'Database unavailable', 'code' => (string) $e->getCode()]);
}
