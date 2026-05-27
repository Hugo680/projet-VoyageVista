<?php
require_once __DIR__ . "/../config/cors.php";

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../middleware/auth_admin.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? null;
$destination_id = $data["destination_id"] ?? null;
$type = trim($data["type"] ?? "");
$depart = trim($data["depart"] ?? "");
$arrivee = trim($data["arrivee"] ?? "");
$prix = $data["prix"] ?? null;
$places_disponibles = $data["places_disponibles"] ?? null;

$types_valides = ["avion", "train", "bus", "voiture"];

if (!$id || !$destination_id || $type === "" || $depart === "" || $arrivee === "" || $prix === null || $places_disponibles === null) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Tous les champs obligatoires doivent être remplis"
    ]);
    exit;
}

if (!in_array($type, $types_valides)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Type de transport invalide"
    ]);
    exit;
}

if (!is_numeric($prix) || $prix < 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Le prix doit être un nombre positif"
    ]);
    exit;
}

if (!is_numeric($places_disponibles) || $places_disponibles < 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Le nombre de places disponibles doit être positif"
    ]);
    exit;
}

try {
    $checkTransport = $pdo->prepare("SELECT id FROM transports WHERE id = ?");
    $checkTransport->execute([$id]);

    if (!$checkTransport->fetch()) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Transport introuvable"
        ]);
        exit;
    }

    $checkDestination = $pdo->prepare("SELECT id FROM destinations WHERE id = ?");
    $checkDestination->execute([$destination_id]);

    if (!$checkDestination->fetch()) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Destination introuvable"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE transports
        SET destination_id = ?, type = ?, depart = ?, arrivee = ?, prix = ?, places_disponibles = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $destination_id,
        $type,
        $depart,
        $arrivee,
        $prix,
        $places_disponibles,
        $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Transport modifié avec succès"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la modification du transport"
    ]);
}
?>
