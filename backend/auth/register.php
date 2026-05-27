<?php
require_once __DIR__ . "/../config/cors.php";

session_start();

header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$nom = trim($data["nom"] ?? "");
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if ($nom === "" || $email === "" || $password === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Tous les champs sont obligatoires"
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email invalide"
    ]);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Le mot de passe doit contenir au moins 6 caractères"
    ]);
    exit;
}

try {
    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);

    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Cet email est déjà utilisé"
        ]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("
        INSERT INTO users (nom, email, password, role)
        VALUES (?, ?, ?, 'client')
    ");

    $stmt->execute([$nom, $email, $hashedPassword]);

    echo json_encode([
        "success" => true,
        "message" => "Compte créé avec succès"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la création du compte"
    ]);
}
?>