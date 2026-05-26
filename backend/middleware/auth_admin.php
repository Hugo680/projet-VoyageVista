<?php
if (!isset($_SESSION["user"]) || $_SESSION["user"]["role"] !== "admin") {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Accès refusé : administrateur uniquement"
    ]);
    exit;
}
?>