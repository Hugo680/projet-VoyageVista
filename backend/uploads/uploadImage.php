<?php
require_once __DIR__ . "/../config/cors.php";

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../middleware/auth_admin.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Methode non autorisee"
    ]);
    exit;
}

if (!isset($_FILES["image"])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Aucune image recue"
    ]);
    exit;
}

$file = $_FILES["image"];

if ($file["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de l'envoi de l'image"
    ]);
    exit;
}

$extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
$allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];

if (!in_array($extension, $allowedExtensions, true)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Format d'image non autorise"
    ]);
    exit;
}

$safeBaseName = preg_replace('/[^a-zA-Z0-9_-]/', '-', pathinfo($file["name"], PATHINFO_FILENAME));
$fileName = $safeBaseName . "-" . time() . "." . $extension;
$targetPath = __DIR__ . "/" . $fileName;

if (!move_uploaded_file($file["tmp_name"], $targetPath)) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Impossible d'enregistrer l'image"
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "message" => "Image envoyee avec succes",
    "image" => "uploads/" . $fileName
]);
?>
