<?php
require_once "config/db.php";

echo json_encode([
    "success" => true,
    "message" => "Connexion à la base de données réussie"
]);
?>