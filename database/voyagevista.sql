CREATE DATABASE IF NOT EXISTS voyagevista;
USE voyagevista;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    pays VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    prix_min DECIMAL(10,2),
    categorie VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    type ENUM('avion', 'train', 'bus', 'voiture') NOT NULL,
    depart VARCHAR(100) NOT NULL,
    arrivee VARCHAR(100) NOT NULL,
    date_depart DATE NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    places_disponibles INT DEFAULT 0,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

CREATE TABLE hebergements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    type VARCHAR(100),
    prix_nuit DECIMAL(10,2) NOT NULL,
    capacite INT DEFAULT 1,
    disponible BOOLEAN DEFAULT TRUE,
    image VARCHAR(255),
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

CREATE TABLE activites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    date_activite DATE,
    places_disponibles INT DEFAULT 0,
    image VARCHAR(255),
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

CREATE TABLE itineraires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    destination_id INT,
    transport_id INT,
    hebergement_id INT,
    date_debut DATE,
    date_fin DATE,
    statut ENUM('en_creation', 'valide') DEFAULT 'en_creation',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL,
    FOREIGN KEY (transport_id) REFERENCES transports(id) ON DELETE SET NULL,
    FOREIGN KEY (hebergement_id) REFERENCES hebergements(id) ON DELETE SET NULL
);

CREATE TABLE itineraire_activites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itineraire_id INT NOT NULL,
    activite_id INT NOT NULL,
    FOREIGN KEY (itineraire_id) REFERENCES itineraires(id) ON DELETE CASCADE,
    FOREIGN KEY (activite_id) REFERENCES activites(id) ON DELETE CASCADE
);

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    itineraire_id INT NOT NULL,
    prix_total DECIMAL(10,2) NOT NULL,
    statut ENUM('en_attente', 'confirmee', 'annulee') DEFAULT 'confirmee',
    date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (itineraire_id) REFERENCES itineraires(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);