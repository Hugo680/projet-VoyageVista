<?php
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
        SELECT id, message, type, lu, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$user_id]);
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "notifications" => $notifications
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des notifications"
    ]);
}
?>
