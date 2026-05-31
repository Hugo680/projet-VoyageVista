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

$itineraire_id = $data["itineraire_id"] ?? null;
$user_id = $_SESSION["user"]["id"];

if (!$itineraire_id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID d'itineraire obligatoire"
    ]);
    exit;
}

try {
    $checkItineraire = $pdo->prepare("
        SELECT
            itineraires.id,
            itineraires.user_id,
            itineraires.destination_id,
            itineraires.transport_id,
            itineraires.hebergement_id,
            itineraires.date_debut,
            itineraires.date_fin,
            itineraires.statut,
            destinations.nom AS destination_nom,
            transports.prix AS transport_prix,
            hebergements.prix_nuit AS hebergement_prix_nuit
        FROM itineraires
        LEFT JOIN destinations ON itineraires.destination_id = destinations.id
        LEFT JOIN transports ON itineraires.transport_id = transports.id
        LEFT JOIN hebergements ON itineraires.hebergement_id = hebergements.id
        WHERE itineraires.id = ? AND itineraires.user_id = ?
    ");
    $checkItineraire->execute([$itineraire_id, $user_id]);
    $itineraire = $checkItineraire->fetch(PDO::FETCH_ASSOC);

    if (!$itineraire) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Itineraire introuvable"
        ]);
        exit;
    }

    if ($itineraire["statut"] !== "en_creation") {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Seul un itineraire en creation peut etre reserve"
        ]);
        exit;
    }

    if (!$itineraire["destination_id"] || !$itineraire["transport_id"] || !$itineraire["hebergement_id"] || !$itineraire["date_debut"] || !$itineraire["date_fin"]) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "L'itineraire doit contenir une destination, un transport, un hebergement et des dates"
        ]);
        exit;
    }

    if ($itineraire["date_fin"] < $itineraire["date_debut"]) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "La date de fin doit etre superieure ou egale a la date de debut"
        ]);
        exit;
    }

    if ($itineraire["transport_prix"] === null) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Transport introuvable"
        ]);
        exit;
    }

    if ($itineraire["hebergement_prix_nuit"] === null) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Hebergement introuvable"
        ]);
        exit;
    }

    $checkActivites = $pdo->prepare("
        SELECT COUNT(*) AS total
        FROM itineraire_activites
        WHERE itineraire_id = ?
    ");
    $checkActivites->execute([$itineraire_id]);
    $totalActivites = (int) $checkActivites->fetch(PDO::FETCH_ASSOC)["total"];

    $sumActivites = $pdo->prepare("
        SELECT COUNT(activites.id) AS total_existantes, COALESCE(SUM(activites.prix), 0) AS prix_activites
        FROM itineraire_activites
        LEFT JOIN activites ON itineraire_activites.activite_id = activites.id
        WHERE itineraire_activites.itineraire_id = ?
    ");
    $sumActivites->execute([$itineraire_id]);
    $activites = $sumActivites->fetch(PDO::FETCH_ASSOC);

    if ((int) $activites["total_existantes"] !== $totalActivites) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Une ou plusieurs activites associees sont introuvables"
        ]);
        exit;
    }

    $dateDebut = new DateTime($itineraire["date_debut"]);
    $dateFin = new DateTime($itineraire["date_fin"]);
    $nuits = max(1, $dateDebut->diff($dateFin)->days);

    $prix_total = (float) $itineraire["transport_prix"]
        + ((float) $itineraire["hebergement_prix_nuit"] * $nuits)
        + (float) $activites["prix_activites"];

    $pdo->beginTransaction();
    $reservedTransport = $pdo->prepare("
        SELECT id, type, places_disponibles
        FROM transports
        WHERE id = ?
        FOR UPDATE
    ");
    $reservedTransport->execute([$itineraire["transport_id"]]);
    $transportToReserve = $reservedTransport->fetch(PDO::FETCH_ASSOC);

    if (!$transportToReserve || (int) $transportToReserve["places_disponibles"] <= 0) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Plus aucune place disponible pour ce transport"
        ]);
        exit;
    }

    $decreaseTransportPlaces = $pdo->prepare("
        UPDATE transports
        SET places_disponibles = places_disponibles - 1
        WHERE id = ?
    ");
    $decreaseTransportPlaces->execute([$transportToReserve["id"]]);
    $reservedActivities = $pdo->prepare("
        SELECT activites.id, activites.nom, activites.places_disponibles
        FROM itineraire_activites
        INNER JOIN activites ON itineraire_activites.activite_id = activites.id
        WHERE itineraire_activites.itineraire_id = ?
        FOR UPDATE
    ");
    $reservedActivities->execute([$itineraire_id]);
    $activitiesToReserve = $reservedActivities->fetchAll(PDO::FETCH_ASSOC);

    foreach ($activitiesToReserve as $activity) {
        if ((int) $activity["places_disponibles"] <= 0) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Plus aucune place disponible pour l'activite " . $activity["nom"]
            ]);
            exit;
        }
    }

    $decreaseActivityPlaces = $pdo->prepare("
        UPDATE activites
        SET places_disponibles = places_disponibles - 1
        WHERE id = ?
    ");

    foreach ($activitiesToReserve as $activity) {
        $decreaseActivityPlaces->execute([$activity["id"]]);
    }

    $createReservation = $pdo->prepare("
        INSERT INTO reservations (user_id, itineraire_id, prix_total, statut)
        VALUES (?, ?, ?, ?)
    ");
    $createReservation->execute([
        $user_id,
        $itineraire_id,
        $prix_total,
        "confirmee"
    ]);

    $reservation_id = $pdo->lastInsertId();

    $updateItineraire = $pdo->prepare("UPDATE itineraires SET statut = ? WHERE id = ? AND user_id = ?");
    $updateItineraire->execute(["valide", $itineraire_id, $user_id]);

    $destination = $itineraire["destination_nom"] ?: "votre voyage";
    $createNotification = $pdo->prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)");
    $createNotification->execute([
        $user_id,
        "Votre reservation pour " . $destination . " a ete confirmee - dossier VV-" . $reservation_id,
        "reservation"
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Reservation confirmee avec succes",
        "reservation_id" => $reservation_id,
        "prix_total" => $prix_total
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la confirmation de la reservation"
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors du calcul de la reservation"
    ]);
}
?>
