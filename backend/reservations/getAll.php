<?php
require_once __DIR__ . "/../config/cors.php";

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../middleware/auth_admin.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Méthode non autorisée"
    ]);
    exit;
}

try {
    $stmt = $pdo->query("
        SELECT
            reservations.id,
            reservations.statut,
            reservations.prix_total,
            reservations.date_reservation,
            users.id AS user_id,
            users.nom AS user_nom,
            users.email AS user_email,
            users.role AS user_role,
            itineraires.id AS itineraire_id,
            itineraires.date_debut,
            itineraires.date_fin,
            itineraires.statut AS itineraire_statut,
            destinations.id AS destination_id,
            destinations.nom AS destination_nom,
            destinations.pays AS destination_pays,
            transports.id AS transport_id,
            transports.type AS transport_type,
            transports.depart AS transport_depart,
            transports.arrivee AS transport_arrivee,
            transports.date_depart AS transport_date_depart,
            transports.prix AS transport_prix,
            hebergements.id AS hebergement_id,
            hebergements.nom AS hebergement_nom,
            hebergements.type AS hebergement_type,
            hebergements.prix_nuit AS hebergement_prix_nuit
        FROM reservations
        INNER JOIN users ON reservations.user_id = users.id
        INNER JOIN itineraires ON reservations.itineraire_id = itineraires.id
        LEFT JOIN destinations ON itineraires.destination_id = destinations.id
        LEFT JOIN transports ON itineraires.transport_id = transports.id
        LEFT JOIN hebergements ON itineraires.hebergement_id = hebergements.id
        ORDER BY reservations.date_reservation DESC
    ");
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

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

    foreach ($reservations as $key => $reservation) {
        $activitesStmt->execute([$reservation["itineraire_id"]]);
        $reservations[$key]["activites"] = $activitesStmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode([
        "success" => true,
        "reservations" => $reservations
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des réservations"
    ]);
}
?>
