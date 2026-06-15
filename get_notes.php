<?php
header('Content-Type: application/json');

require_once __DIR__ . '/config.php';

// Auth
$key = $_SERVER['HTTP_X_API_KEY'] ?? '';
if ($key !== API_KEY) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$from = $_GET['from'] ?? '';
$to   = $_GET['to']   ?? '';

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $from) ||
    !preg_match('/^\d{4}-\d{2}-\d{2}$/', $to)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid date range. Use ?from=YYYY-MM-DD&to=YYYY-MM-DD']);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $stmt = $pdo->prepare(
        "SELECT session_key, note_date, rpe_feel, note_text, updated_at
         FROM session_notes
         WHERE note_date BETWEEN :from AND :to
         ORDER BY note_date ASC"
    );
    $stmt->execute([':from' => $from, ':to' => $to]);
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['notes' => $notes]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
