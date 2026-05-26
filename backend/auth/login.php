<?php
session_start();

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if ($email === "" || $password === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email et mot de passe obligatoires"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, nom, email, password, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user["password"])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Email ou mot de passe incorrect"
        ]);
        exit;
    }

    $_SESSION["user"] = [
        "id" => $user["id"],
        "nom" => $user["nom"],
        "email" => $user["email"],
        "role" => $user["role"]
    ];

    echo json_encode([
        "success" => true,
        "message" => "Connexion réussie",
        "user" => $_SESSION["user"]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la connexion"
    ]);
}
?>