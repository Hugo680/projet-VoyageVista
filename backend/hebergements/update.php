<?php
require_once __DIR__ . "/../config/cors.php";

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
$destination_id = $data["destination_id"] ?? null;
$nom = trim($data["nom"] ?? "");
$type = trim($data["type"] ?? "");
$prix_nuit = $data["prix_nuit"] ?? null;
$capacite = $data["capacite"] ?? null;
$disponible = $data["disponible"] ?? true;
$image = trim($data["image"] ?? "");
$latitude = $data["latitude"] ?? null;
$longitude = $data["longitude"] ?? null;

if (!$id || !$destination_id || $nom === "" || $type === "" || $prix_nuit === null || $capacite === null) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Tous les champs obligatoires doivent être remplis"
    ]);
    exit;
}

if (!is_numeric($prix_nuit) || $prix_nuit < 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Le prix par nuit doit être un nombre positif"
    ]);
    exit;
}

if (!is_numeric($capacite) || $capacite <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "La capacité doit être supérieure à 0"
    ]);
    exit;
}

try {
    $checkHebergement = $pdo->prepare("SELECT id FROM hebergements WHERE id = ?");
    $checkHebergement->execute([$id]);

    if (!$checkHebergement->fetch()) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Hébergement introuvable"
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
        UPDATE hebergements
        SET destination_id = ?, nom = ?, type = ?, prix_nuit = ?, capacite = ?, disponible = ?, image = ?, latitude = ?, longitude = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $destination_id,
        $nom,
        $type,
        $prix_nuit,
        $capacite,
        $disponible ? 1 : 0,
        $image,
        $latitude === "" ? null : $latitude,
        $longitude === "" ? null : $longitude,
        $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Hébergement modifié avec succès"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la modification de l'hébergement"
    ]);
}
?>