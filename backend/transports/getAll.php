<?php
require_once __DIR__ . "/../config/cors.php";

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

$destination_id = $_GET["destination_id"] ?? null;

try {
    if ($destination_id) {
        $stmt = $pdo->prepare("
            SELECT 
                transports.id,
                transports.destination_id,
                destinations.nom AS destination_nom,
                transports.type,
                transports.depart,
                transports.arrivee,
                transports.prix,
                transports.places_disponibles
            FROM transports
            INNER JOIN destinations ON transports.destination_id = destinations.id
            WHERE transports.destination_id = ?
            ORDER BY transports.id DESC
        ");
        $stmt->execute([$destination_id]);
    } else {
        $stmt = $pdo->query("
            SELECT 
                transports.id,
                transports.destination_id,
                destinations.nom AS destination_nom,
                transports.type,
                transports.depart,
                transports.arrivee,
                transports.prix,
                transports.places_disponibles
            FROM transports
            INNER JOIN destinations ON transports.destination_id = destinations.id
            ORDER BY transports.id DESC
        ");
    }

    $transports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "transports" => $transports
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des transports"
    ]);
}
?>
