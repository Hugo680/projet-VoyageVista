<?php
require_once __DIR__ . "/cors.php";

header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$dbname = "voyagevista";
$username = "root";
$password = "root";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $username,
        $password
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur de connexion à la base de données"
    ]);
    exit;
}
?>
