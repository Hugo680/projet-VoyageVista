<?php
require_once __DIR__ . "/../config/cors.php";

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
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

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Aucune donnée reçue"
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
        "message" => "ID de réservation obligatoire"
    ]);
    exit;
}

try {
    $checkReservation = $pdo->prepare("SELECT id, user_id, statut FROM reservations WHERE id = ?");
    $checkReservation->execute([$reservation_id]);
    $reservation = $checkReservation->fetch(PDO::FETCH_ASSOC);

    if (!$reservation) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Réservation introuvable"
        ]);
        exit;
    }

    if ($role !== "admin" && $reservation["user_id"] != $user_id) {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Vous ne pouvez annuler que vos propres réservations"
        ]);
        exit;
    }

    if ($reservation["statut"] === "annulee") {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Cette réservation est déjà annulée"
        ]);
        exit;
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("UPDATE reservations SET statut = ? WHERE id = ?");
    $stmt->execute(["annulee", $reservation_id]);

    $createNotification = $pdo->prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)");
    $createNotification->execute([
        $reservation["user_id"],
        "Votre réservation a été annulée.",
        "reservation"
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Réservation annulée avec succès"
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de l'annulation de la réservation"
    ]);
}
?>
