<?php
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

$isAllowedOrigin = false;

if ($origin === "http://localhost" || $origin === "http://127.0.0.1") {
    $isAllowedOrigin = true;
}

if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {
    $isAllowedOrigin = true;
}

if (preg_match('/^http:\/\/127\.0\.0\.1:\d+$/', $origin)) {
    $isAllowedOrigin = true;
}

if ($isAllowedOrigin) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
    header("Vary: Origin");
}

header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 86400");
header("X-CORS-Origin-Debug: " . $origin);

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}
?>
