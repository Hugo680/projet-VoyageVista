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

$destination_id = $data["destination_id"] ?? null;
$nom = trim($data["nom"] ?? "");
$description = trim($data["description"] ?? "");
$prix = $data["prix"] ?? null;
$date_activite = trim($data["date_activite"] ?? "");
$places_disponibles = $data["places_disponibles"] ?? null;
$image = trim($data["image"] ?? "");

if (!$destination_id || $nom === "" || $description === "" || $prix === null || $date_activite === "" || $places_disponibles === null) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Tous les champs obligatoires doivent être remplis"
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
        INSERT INTO activites (destination_id, nom, description, prix, date_activite, places_disponibles, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $destination_id,
        $nom,
        $description,
        $prix,
        $date_activite,
        $places_disponibles,
        $image
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Activité ajoutée avec succès",
        "activite_id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de l'ajout de l'activité"
    ]);
}
?>