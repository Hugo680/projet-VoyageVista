<?php
require_once __DIR__ . "/../config/cors.php";

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Méthode non autorisée"
    ]);
    exit;
}

if (!isset($_SESSION["user"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Utilisateur non connecté"
    ]);
    exit;
}

$user_id = $_SESSION["user"]["id"];

try {
    $stmt = $pdo->prepare("
        SELECT
            itineraires.id,
            itineraires.destination_id,
            destinations.nom AS destination_nom,
            destinations.pays AS destination_pays,
            itineraires.transport_id,
            transports.type AS transport_type,
            transports.depart AS transport_depart,
            transports.arrivee AS transport_arrivee,
            transports.date_depart AS transport_date_depart,
            transports.prix AS transport_prix,
            itineraires.hebergement_id,
            hebergements.nom AS hebergement_nom,
            hebergements.type AS hebergement_type,
            hebergements.prix_nuit AS hebergement_prix_nuit,
            itineraires.date_debut,
            itineraires.date_fin,
            itineraires.statut
        FROM itineraires
        LEFT JOIN destinations ON itineraires.destination_id = destinations.id
        LEFT JOIN transports ON itineraires.transport_id = transports.id
        LEFT JOIN hebergements ON itineraires.hebergement_id = hebergements.id
        WHERE itineraires.user_id = ?
        ORDER BY itineraires.id DESC
    ");
    $stmt->execute([$user_id]);
    $itineraires = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $activitesStmt = $pdo->prepare("
        SELECT
            activites.id,
            activites.destination_id,
            activites.nom,
            activites.description,
            activites.prix,
            activites.date_activite,
            activites.places_disponibles,
            activites.image
        FROM itineraire_activites
        INNER JOIN activites ON itineraire_activites.activite_id = activites.id
        WHERE itineraire_activites.itineraire_id = ?
        ORDER BY activites.date_activite ASC, activites.nom ASC
    ");

    foreach ($itineraires as $key => $itineraire) {
        $activitesStmt->execute([$itineraire["id"]]);
        $itineraires[$key]["activites"] = $activitesStmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode([
        "success" => true,
        "itineraires" => $itineraires
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des itinéraires"
    ]);
}
?>
