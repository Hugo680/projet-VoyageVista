<?php
session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../middleware/auth_admin.php";

try {
    $stats = [];

    $tables = [
        "users" => "utilisateurs",
        "destinations" => "destinations",
        "transports" => "transports",
        "hebergements" => "hebergements",
        "activites" => "activites",
        "itineraires" => "itineraires",
        "reservations" => "reservations",
        "notifications" => "notifications"
    ];

    foreach ($tables as $table => $label) {
        $stmt = $pdo->query("SELECT COUNT(*) AS total FROM $table");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stats[$label] = (int) $result["total"];
    }

    $stmt = $pdo->query("
        SELECT COUNT(*) AS total
        FROM reservations
        WHERE statut = 'confirmee'
    ");
    $confirmedReservations = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt = $pdo->query("
        SELECT COUNT(*) AS total
        FROM reservations
        WHERE statut = 'annulee'
    ");
    $cancelledReservations = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt = $pdo->query("
        SELECT COALESCE(SUM(prix_total), 0) AS total
        FROM reservations
        WHERE statut = 'confirmee'
    ");
    $revenue = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "message" => "Statistiques du dashboard admin récupérées avec succès",
        "stats" => $stats,
        "reservations" => [
            "confirmees" => (int) $confirmedReservations["total"],
            "annulees" => (int) $cancelledReservations["total"]
        ],
        "revenu_total" => (float) $revenue["total"]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des statistiques du dashboard"
    ]);
}
?>