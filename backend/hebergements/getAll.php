<?php
require_once __DIR__ . "/../config/cors.php";

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

$destination_id = $_GET["destination_id"] ?? null;

try {
    $hasLatitude = $pdo->query("SHOW COLUMNS FROM hebergements LIKE 'latitude'")->fetch();
    $coordinatesSelect = $hasLatitude ? "hebergements.latitude, hebergements.longitude" : "NULL AS latitude, NULL AS longitude";

    if ($destination_id) {
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
                " . $coordinatesSelect . "
            FROM hebergements
            INNER JOIN destinations ON hebergements.destination_id = destinations.id
            WHERE hebergements.destination_id = ?
            ORDER BY hebergements.prix_nuit ASC
        ");
        $stmt->execute([$destination_id]);
    } else {
        $stmt = $pdo->query("
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
                " . $coordinatesSelect . "
            FROM hebergements
            INNER JOIN destinations ON hebergements.destination_id = destinations.id
            ORDER BY hebergements.prix_nuit ASC
        ");
    }

    $hebergements = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "hebergements" => $hebergements
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des hébergements"
    ]);
}
?> 