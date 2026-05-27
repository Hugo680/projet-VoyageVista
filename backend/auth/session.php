<?php
require_once __DIR__ . "/../config/cors.php";

session_start();

header("Content-Type: application/json; charset=UTF-8");
if (isset($_SESSION["user"])) {
    echo json_encode([
        "success" => true,
        "isLoggedIn" => true,
        "user" => $_SESSION["user"]
    ]);
} else {
    echo json_encode([
        "success" => true,
        "isLoggedIn" => false,
        "user" => null
    ]);
}
?>
