<?php
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

$notification_id = $data["notification_id"] ?? null;
$user_id = $_SESSION["user"]["id"];

if (!$notification_id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID de notification obligatoire"
    ]);
    exit;
}

try {
    $checkNotification = $pdo->prepare("SELECT id FROM notifications WHERE id = ? AND user_id = ?");
    $checkNotification->execute([$notification_id, $user_id]);

    if (!$checkNotification->fetch()) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Notification introuvable"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE notifications SET lu = 1 WHERE id = ? AND user_id = ?");
    $stmt->execute([$notification_id, $user_id]);

    echo json_encode([
        "success" => true,
        "message" => "Notification marquée comme lue"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la mise à jour de la notification"
    ]);
}
?>
