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

$itineraire_id = $data["itineraire_id"] ?? null;
$activite_id = $data["activite_id"] ?? null;
$user_id = $_SESSION["user"]["id"];

if (!$itineraire_id || !$activite_id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Itinéraire et activité obligatoires"
    ]);
    exit;
}

try {
    $checkItineraire = $pdo->prepare("SELECT id, statut FROM itineraires WHERE id = ? AND user_id = ?");
    $checkItineraire->execute([$itineraire_id, $user_id]);
    $itineraire = $checkItineraire->fetch(PDO::FETCH_ASSOC);

    if (!$itineraire) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Itinéraire introuvable"
        ]);
        exit;
    }

    if ($itineraire["statut"] !== "en_creation") {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Seul un itinéraire en création peut être modifié"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM itineraire_activites WHERE itineraire_id = ? AND activite_id = ?");
    $stmt->execute([$itineraire_id, $activite_id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Activité non associée à cet itinéraire"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Activité retirée de l'itinéraire avec succès"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors du retrait de l'activité de l'itinéraire"
    ]);
}
?>
