<?php
require_once __DIR__ . "/../config/cors.php";

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

$id = $_GET["id"] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID d'hébergement manquant"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT
            hebergements.id,
            hebergements.destination_id,
            destinations.nom AS destination_nom,
            hebergements.nom,
            hebergements.type,
            hebergements.prix_nuit,
            hebergements.capacite,
            hebergements.disponible,
            hebergements.image,
                hebergements.latitude,
                hebergements.longitude
        FROM hebergements
        INNER JOIN destinations ON hebergements.destination_id = destinations.id
        WHERE hebergements.id = ?
    ");

    $stmt->execute([$id]);
    $hebergement = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$hebergement) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Hébergement introuvable"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "hebergement" => $hebergement
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération de l'hébergement"
    ]);
}
?>