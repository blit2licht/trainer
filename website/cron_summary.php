<?php
// cron_summary.php
// IONOS Cron: Sonntag 20:00 — ruft diese URL auf
// URL: https://training.martinwitte.de/cron_summary.php?cron_key=DEIN-ZUFAELLIGER-KEY-HIER

require_once __DIR__ . '/config.php';

// Einfache Cron-Absicherung via URL-Key. CRON_KEY bevorzugen; API_KEY bleibt als Übergangs-Fallback.
$cron_key = $_GET['cron_key'] ?? '';
$expected_key = defined('CRON_KEY') ? CRON_KEY : (defined('API_KEY') ? API_KEY : '');
if (!$expected_key || !hash_equals($expected_key, $cron_key)) {
    http_response_code(403);
    exit('Forbidden');
}

// Aktuelle Woche: Montag bis Sonntag
$monday = date('Y-m-d', strtotime('monday this week'));
$sunday = date('Y-m-d', strtotime('sunday this week'));

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $stmt = $pdo->prepare(
        "SELECT session_key, note_date, rpe_feel, note_text
         FROM session_notes
         WHERE note_date BETWEEN :from AND :to
         ORDER BY note_date ASC"
    );
    $stmt->execute([':from' => $monday, ':to' => $sunday]);
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    exit('DB error: ' . $e->getMessage());
}

if (empty($notes)) {
    exit('Keine Notizen diese Woche — keine Mail gesendet.');
}

// RPE-Labels
$rpe_label = ['', '😵 Brutal', '😮‍💨 Schwer', '😐 Okay', '💪 Gut', '🔥 Stark'];

// Email bauen
$subject = "Training Recap · KW " . date('W') . " · " . date('d.m.Y', strtotime($monday)) . " – " . date('d.m.Y', strtotime($sunday));

$body = "Training Wochennotizen\n";
$body .= str_repeat("─", 40) . "\n\n";

foreach ($notes as $n) {
    $date_fmt = date('D d.m.', strtotime($n['note_date']));
    $rpe      = intval($n['rpe_feel']);
    $rpe_str  = $rpe > 0 ? ($rpe_label[$rpe] ?? "RPE $rpe") : '(kein RPE)';
    $text     = $n['note_text'] ?: '(keine Notiz)';

    $body .= "$date_fmt  |  $rpe_str\n";
    $body .= "$text\n\n";
}

$body .= str_repeat("─", 40) . "\n";
$body .= "training.martinwitte.de";

$headers  = "From: " . SUMMARY_FROM . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail(SUMMARY_TO, $subject, $body, $headers);

echo $sent
    ? "✓ Recap gesendet an " . SUMMARY_TO
    : "✗ Mail-Versand fehlgeschlagen";
