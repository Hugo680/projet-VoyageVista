<?php
require_once __DIR__ . "/../config/cors.php";

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

try {
    $stmt = $pdo->query("
        SELECT id, nom, pays, description, image, prix_min, categorie, latitude, longitude, created_at
        FROM destinations
        ORDER BY created_at DESC
    ");

    $destinations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "destinations" => $destinations
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des destinations"
    ]);
}
?>