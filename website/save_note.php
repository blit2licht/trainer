<?php
header('Content-Type: application/json');

$config_path = __DIR__ . '/config.php';
if (!is_file($config_path)) {
    http_response_code(503);
    echo json_encode(['error' => 'Server configuration missing']);
    exit;
}
require_once $config_path;

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
$rpe_feel    = intval($data['rpe_feel']  ?? 0);
$note_text   = trim($data['note_text']   ?? '');

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

$rpe_feel = max(0, min(5, $rpe_feel));

// Upsert
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $sql = "INSERT INTO session_notes (session_key, note_date, rpe_feel, note_text)
            VALUES (:sk, :nd, :rf, :nt)
            ON DUPLICATE KEY UPDATE
                rpe_feel   = VALUES(rpe_feel),
                note_text  = VALUES(note_text),
                updated_at = NOW()";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':sk' => $session_key,
        ':nd' => $note_date,
        ':rf' => $rpe_feel,
        ':nt' => $note_text,
    ]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
