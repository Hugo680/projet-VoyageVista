<?php
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

$destination_id = $_GET["destination_id"] ?? null;

try {
    if ($destination_id) {
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
            WHERE activites.destination_id = ?
            ORDER BY activites.date_activite ASC
        ");
        $stmt->execute([$destination_id]);
    } else {
        $stmt = $pdo->query("
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
            ORDER BY activites.date_activite ASC
        ");
    }

    $activites = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "activites" => $activites
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des activités"
    ]);
}
?>