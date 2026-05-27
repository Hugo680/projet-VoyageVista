<?php
require_once __DIR__ . "/../config/cors.php";

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../middleware/auth_admin.php";

$data = json_decode(file_get_contents("php://input"), true);

$nom = trim($data["nom"] ?? "");
$pays = trim($data["pays"] ?? "");
$description = trim($data["description"] ?? "");
$image = trim($data["image"] ?? "");
$prix_min = $data["prix_min"] ?? null;
$categorie = trim($data["categorie"] ?? "");

if ($nom === "" || $pays === "" || $description === "" || $prix_min === null || $categorie === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Tous les champs obligatoires doivent être remplis"
    ]);
    exit;
}

if (!is_numeric($prix_min) || $prix_min < 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Le prix minimum doit être un nombre positif"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO destinations (nom, pays, description, image, prix_min, categorie)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $nom,
        $pays,
        $description,
        $image,
        $prix_min,
        $categorie
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Destination ajoutée avec succès",
        "destination_id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de l'ajout de la destination"
    ]);
}
?>
