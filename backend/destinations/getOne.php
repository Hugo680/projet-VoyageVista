<?php
require_once __DIR__ . "/../config/cors.php";

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

$id = $_GET["id"] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID de destination manquant"
    ]);
    exit;
}

try {
    $hasLatitude = $pdo->query("SHOW COLUMNS FROM destinations LIKE 'latitude'")->fetch();
    $coordinatesSelect = $hasLatitude ? "latitude, longitude" : "NULL AS latitude, NULL AS longitude";

    $stmt = $pdo->prepare("
        SELECT id, nom, pays, description, image, prix_min, categorie, " . $coordinatesSelect . ", created_at
        FROM destinations
        WHERE id = ?
    ");

    $stmt->execute([$id]);
    $destination = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$destination) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Destination introuvable"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "destination" => $destination
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération de la destination"
    ]);
}
?>