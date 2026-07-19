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
// Übergang: rpe_feel als Fallback, solange gecachte Frontends den alten
// Feldnamen senden.
$session_feel = intval($data['session_feel'] ?? $data['rpe_feel'] ?? 0);

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

$session_feel = max(0, min(5, $session_feel));

// Upsert
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $col = feel_column($pdo);
    $sql = "INSERT INTO session_notes (session_key, note_date, `$col`, note_text)
            VALUES (:sk, :nd, :sf, :nt)
            ON DUPLICATE KEY UPDATE
                `$col`     = VALUES(`$col`),
                note_text  = VALUES(note_text),
                updated_at = NOW()";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':sk' => $session_key,
        ':nd' => $note_date,
        ':sf' => $session_feel,
        ':nt' => $note_text,
    ]);

    echo json_encode(['success' => true]);

} catch (Throwable $e) {
    error_log('Notes database error: ' . $e->getMessage());
    http_response_code(503);
    echo json_encode(['error' => 'Database unavailable', 'code' => (string) $e->getCode()]);
}
