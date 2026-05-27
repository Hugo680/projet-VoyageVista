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

$id = $data["id"] ?? null;
$destination_id = $data["destination_id"] ?? null;
$transport_id = $data["transport_id"] ?? null;
$hebergement_id = $data["hebergement_id"] ?? null;
$date_debut = trim($data["date_debut"] ?? "");
$date_fin = trim($data["date_fin"] ?? "");
$user_id = $_SESSION["user"]["id"];

if (!$id || !$destination_id || !$transport_id || !$hebergement_id || $date_debut === "" || $date_fin === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Tous les champs obligatoires doivent être remplis"
    ]);
    exit;
}

if ($date_fin < $date_debut) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "La date de fin doit être supérieure ou égale à la date de début"
    ]);
    exit;
}

try {
    $checkItineraire = $pdo->prepare("SELECT id, statut FROM itineraires WHERE id = ? AND user_id = ?");
    $checkItineraire->execute([$id, $user_id]);
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

    $checkDestination = $pdo->prepare("SELECT id FROM destinations WHERE id = ?");
    $checkDestination->execute([$destination_id]);

    if (!$checkDestination->fetch()) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Destination introuvable"
        ]);
        exit;
    }

    $checkTransport = $pdo->prepare("SELECT id FROM transports WHERE id = ? AND destination_id = ?");
    $checkTransport->execute([$transport_id, $destination_id]);

    if (!$checkTransport->fetch()) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Transport introuvable pour cette destination"
        ]);
        exit;
    }

    $checkHebergement = $pdo->prepare("SELECT id FROM hebergements WHERE id = ? AND destination_id = ?");
    $checkHebergement->execute([$hebergement_id, $destination_id]);

    if (!$checkHebergement->fetch()) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Hébergement introuvable pour cette destination"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE itineraires
        SET destination_id = ?, transport_id = ?, hebergement_id = ?, date_debut = ?, date_fin = ?
        WHERE id = ? AND user_id = ?
    ");

    $stmt->execute([
        $destination_id,
        $transport_id,
        $hebergement_id,
        $date_debut,
        $date_fin,
        $id,
        $user_id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Itinéraire modifié avec succès"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la modification de l'itinéraire"
    ]);
}
?>
