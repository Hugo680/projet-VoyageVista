<?php
require_once __DIR__ . "/../config/cors.php";

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

$id = $_GET["id"] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID de transport manquant"
    ]);
    exit;
}

try {
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
        WHERE transports.id = ?
    ");

    $stmt->execute([$id]);
    $transport = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$transport) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Transport introuvable"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "transport" => $transport
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération du transport"
    ]);
}
?>
