<?php
require_once __DIR__ . "/../config/cors.php";

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

$id = $_GET["id"] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID d'activité manquant"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT
            activites.id,
            activites.destination_id,
            destinations.nom AS destination_nom,
            activites.nom,
            activites.description,
            activites.prix,
            activites.date_activite,
            activites.places_disponibles,
            activites.image
        FROM activites
        INNER JOIN destinations ON activites.destination_id = destinations.id
        WHERE activites.id = ?
    ");

    $stmt->execute([$id]);
    $activite = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$activite) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Activité introuvable"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "activite" => $activite
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération de l'activité"
    ]);
}
?>