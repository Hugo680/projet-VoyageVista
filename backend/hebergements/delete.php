<?php
session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../middleware/auth_admin.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Aucune donnée reçue"
    ]);
    exit;
}

$id = $data["id"] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID d'hébergement manquant"
    ]);
    exit;
}

try {
    $check = $pdo->prepare("SELECT id FROM hebergements WHERE id = ?");
    $check->execute([$id]);

    if (!$check->fetch()) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Hébergement introuvable"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM hebergements WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode([
        "success" => true,
        "message" => "Hébergement supprimé avec succès"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la suppression de l'hébergement"
    ]);
}
?>