<?php
// Trainer 3.0 — Verdicts lesen (datenmodell.md §4, Entscheid 3).
// GET ?from=YYYY-MM-DD&to=YYYY-MM-DD
// Analog get_notes.php: Read-Endpoint ohne Secret. Die Seite lädt damit beim
// Öffnen den Verdict-Zustand der aktuellen Woche zurück und spiegelt den
// Serverstand (inkl. "offen" für vergangene Fokus-Tage ohne Zeile).
// unknown ist die Abwesenheit einer Zeile — es wird nie als Wert geliefert.

header('Content-Type: application/json');
header('X-Verdicts-Version: 1');

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
        'SELECT iso_date, ex_id, verdict, miss_reason, source, updated_at
         FROM verdicts
         WHERE iso_date BETWEEN :from AND :to
         ORDER BY iso_date ASC, ex_id ASC'
    );
    $stmt->execute([':from' => $from, ':to' => $to]);
    $verdicts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['verdicts' => $verdicts]);

} catch (Throwable $e) {
    error_log('Verdicts database error: ' . $e->getMessage());
    http_response_code(503);
    echo json_encode(['error' => 'Database unavailable', 'code' => (string) $e->getCode()]);
}
