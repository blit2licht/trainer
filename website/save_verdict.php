<?php
// Trainer 3.0 — Verdict schreiben (datenmodell.md §4, Übergabe 5.3 + Entscheid 7).
// POST JSON: { secret, iso_date, ex_id, verdict, miss_reason?, source? }
// Shared-Secret-Absicherung (Entscheid 7): Secret liegt im localStorage des
// Handys und in config.php als VERDICT_SECRET. Kein Login-System.
// Antwort = gespeicherter Zeilenstand (Serverstand), damit das Handy nie die
// Tap-Annahme zeigt, sondern den DB-Zustand (handy-konzept §1).

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

foreach (['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'VERDICT_SECRET'] as $required_constant) {
    if (!defined($required_constant)) {
        http_response_code(503);
        echo json_encode(['error' => 'Server configuration incomplete']);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

// Shared-Secret prüfen (zeitkonstant).
$secret = (string) ($data['secret'] ?? '');
if (!hash_equals((string) VERDICT_SECRET, $secret)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$iso_date    = trim((string) ($data['iso_date'] ?? ''));
$ex_id       = trim((string) ($data['ex_id'] ?? ''));
$verdict     = trim((string) ($data['verdict'] ?? ''));
$miss_reason = isset($data['miss_reason']) ? trim((string) $data['miss_reason']) : '';
$source      = trim((string) ($data['source'] ?? 'button'));

// Validierung — Parser raten nie (Prinzip 1.7).
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $iso_date)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid iso_date, expected YYYY-MM-DD']);
    exit;
}
if (!preg_match('/^[a-z0-9_]{1,32}$/', $ex_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid ex_id']);
    exit;
}
if (!in_array($verdict, ['hit', 'miss', 'clear'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'verdict must be hit, miss or clear']);
    exit;
}
// miss_reason nur bei miss zulässig; bei hit immer NULL.
$miss_reason_val = null;
if ($verdict === 'miss' && $miss_reason !== '') {
    if (!in_array($miss_reason, ['technik', 'last'], true)) {
        http_response_code(400);
        echo json_encode(['error' => 'miss_reason must be technik or last']);
        exit;
    }
    $miss_reason_val = $miss_reason;
}
if (!in_array($source, ['button', 'whoop_derived', 'recap_answer'], true)) {
    $source = 'button';
}

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // 'clear' löscht die Zeile — zurück auf unknown (= Abwesenheit der Zeile,
    // datenmodell §4). Rücknahme-Kanal für Fehltaps am Handy.
    if ($verdict === 'clear') {
        $del = $pdo->prepare('DELETE FROM verdicts WHERE iso_date = :d AND ex_id = :e');
        $del->execute([':d' => $iso_date, ':e' => $ex_id]);
        echo json_encode([
            'success' => true, 'cleared' => true,
            'iso_date' => $iso_date, 'ex_id' => $ex_id,
        ]);
        exit;
    }

    // Last-write-wins über den PRIMARY KEY (iso_date, ex_id).
    $sql = 'INSERT INTO verdicts (iso_date, ex_id, verdict, miss_reason, source)
            VALUES (:d, :e, :v, :m, :s)
            ON DUPLICATE KEY UPDATE
              verdict = VALUES(verdict),
              miss_reason = VALUES(miss_reason),
              source = VALUES(source),
              updated_at = CURRENT_TIMESTAMP';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':d' => $iso_date,
        ':e' => $ex_id,
        ':v' => $verdict,
        ':m' => $miss_reason_val,
        ':s' => $source,
    ]);

    // Serverstand zurückgeben — das Handy zeigt diesen, nie die Tap-Annahme.
    $read = $pdo->prepare(
        'SELECT iso_date, ex_id, verdict, miss_reason, source, updated_at
         FROM verdicts WHERE iso_date = :d AND ex_id = :e'
    );
    $read->execute([':d' => $iso_date, ':e' => $ex_id]);
    $row = $read->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'verdict' => $row]);

} catch (Throwable $e) {
    error_log('Verdicts database error: ' . $e->getMessage());
    http_response_code(503);
    echo json_encode(['error' => 'Database unavailable', 'code' => (string) $e->getCode()]);
}
