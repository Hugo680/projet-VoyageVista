<?php
require_once __DIR__ . "/../config/cors.php";

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Methode non autorisee"
    ]);
    exit;
}

if (!isset($_SESSION["user"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Utilisateur non connecte"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Aucune donnee recue"
    ]);
    exit;
}

$reservation_id = $data["reservation_id"] ?? null;
$user_id = $_SESSION["user"]["id"];
$role = $_SESSION["user"]["role"] ?? "client";

if (!$reservation_id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID de reservation obligatoire"
    ]);
    exit;
}

try {
    $checkReservation = $pdo->prepare("
        SELECT
            reservations.id,
            reservations.user_id,
            reservations.statut,
            reservations.prix_total,
            itineraires.id AS itineraire_id,
            itineraires.date_debut,
            itineraires.date_fin,
            destinations.nom AS destination_nom
        FROM reservations
        INNER JOIN itineraires ON reservations.itineraire_id = itineraires.id
        LEFT JOIN destinations ON itineraires.destination_id = destinations.id
        WHERE reservations.id = ?
    ");
    $checkReservation->execute([$reservation_id]);
    $reservation = $checkReservation->fetch(PDO::FETCH_ASSOC);

    if (!$reservation) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Reservation introuvable"
        ]);
        exit;
    }

    if ($role !== "admin" && $reservation["user_id"] != $user_id) {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Vous ne pouvez annuler que vos propres reservations"
        ]);
        exit;
    }

    if ($reservation["statut"] === "annulee") {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Cette reservation est deja annulee"
        ]);
        exit;
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("UPDATE reservations SET statut = ? WHERE id = ?");
    $stmt->execute(["annulee", $reservation_id]);
    $restoreActivityPlaces = $pdo->prepare("
        UPDATE activites
        INNER JOIN itineraire_activites ON activites.id = itineraire_activites.activite_id
        SET activites.places_disponibles = activites.places_disponibles + 1
        WHERE itineraire_activites.itineraire_id = ?
    ");
    $restoreActivityPlaces->execute([$reservation["itineraire_id"]]);

    $destination = $reservation["destination_nom"] ?: "votre voyage";
    $message = "Votre reservation pour " . $destination . " a ete annulee - dossier VV-" . $reservation_id;

    $createNotification = $pdo->prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)");
    $createNotification->execute([
        $reservation["user_id"],
        $message,
        "reservation"
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Reservation annulee avec succes"
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de l'annulation de la reservation"
    ]);
}
?>
