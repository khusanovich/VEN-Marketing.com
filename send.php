<?php
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Destination
define('TO_EMAIL', 'info@VEN-Marketing.info');
define('TO_NAME',  'VEN Marketing');

// Sanitise input
function clean(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

$name    = clean($_POST['name']    ?? '');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$company = clean($_POST['company'] ?? '');
$service = clean($_POST['service'] ?? '');
$message = clean($_POST['message'] ?? '');

// Basic validation
if (!$name || !$email || !$message) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Required fields missing']);
    exit;
}

// Build email
$subject = 'New inquiry from VEN-Marketing.com — ' . $name;

$body  = "New service inquiry received via VEN-Marketing.com\r\n";
$body .= str_repeat('=', 50) . "\r\n\r\n";
$body .= "Name:     {$name}\r\n";
$body .= "Email:    {$email}\r\n";
if ($company) $body .= "Company:  {$company}\r\n";
if ($service) $body .= "Service:  {$service}\r\n";
$body .= "\r\nMessage:\r\n{$message}\r\n";
$body .= "\r\n" . str_repeat('=', 50) . "\r\n";
$body .= "Sent: " . date('Y-m-d H:i:s T') . "\r\n";

$headers  = "From: VEN Marketing Website <no-reply@ven-marketing.com>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail(TO_EMAIL, $subject, $body, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mail delivery failed']);
}
