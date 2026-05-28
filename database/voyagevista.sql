DROP DATABASE IF EXISTS voyagevista;
CREATE DATABASE voyagevista;
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

-- Données de test VoyageVista

INSERT INTO users (nom, email, password, role)
VALUES
('Hugo', 'hugo@test.com', '$2y$10$U7zYROjrMYMrQ/jwNlWdI.JkiXBKjAKS.SbTuMwRTa678cF2pPsLy', 'admin');

INSERT INTO destinations (id, nom, pays, description, image, prix_min, categorie)
VALUES
(1, 'Bali', 'Indonésie', 'Rizières, plages et temples pour un séjour entre détente et culture.', 'bali.jpg', 980.00, 'plage'),
(2, 'Tokyo', 'Japon', 'Une capitale vibrante entre quartiers futuristes, traditions japonaises et gastronomie.', 'tokyo.jpg', 1250.00, 'ville'),
(3, 'Chamonix', 'France', 'Destination montagne avec randonnées, air alpin et panorama sur le Mont-Blanc.', 'chamonix.jpg', 620.00, 'montagne'),
(4, 'Marrakech', 'Maroc', 'Souks, jardins, excursions dans l’Atlas et ambiance orientale pour un séjour aventure.', 'marrakech.jpg', 540.00, 'aventure'),
(5, 'Reykjavik', 'Islande', 'Sources chaudes, paysages volcaniques, nature sauvage et aurores boréales.', 'reykjavik.jpg', 1100.00, 'detente');

INSERT INTO transports (destination_id, type, depart, arrivee, prix, places_disponibles)
VALUES
(1, 'avion', 'Paris', 'Bali', 720.00, 18),
(2, 'avion', 'Paris', 'Tokyo', 840.00, 9),
(3, 'train', 'Lyon', 'Chamonix', 68.00, 42),
(4, 'avion', 'Marseille', 'Marrakech', 160.00, 24),
(5, 'avion', 'Paris', 'Reykjavik', 390.00, 16);

INSERT INTO hebergements (destination_id, nom, type, prix_nuit, capacite, disponible, image)
VALUES
(1, 'Bali Beach Hotel', 'Hotel', 115.00, 2, TRUE, 'bali-hotel.jpg'),
(1, 'Ubud Garden Villa', 'Villa', 165.00, 4, TRUE, 'ubud-villa.jpg'),

(2, 'Tokyo Central Hotel', 'Hotel', 180.00, 3, TRUE, 'tokyo-hotel.jpg'),
(2, 'Shibuya Smart Stay', 'Appartement', 130.00, 2, TRUE, 'shibuya-stay.jpg'),

(3, 'Chalet Mont-Blanc', 'Chalet', 220.00, 6, TRUE, 'chalet-mont-blanc.jpg'),
(3, 'Alpine Lodge', 'Chalet', 145.00, 3, TRUE, 'alpine-lodge.jpg'),

(4, 'Riad Soleil', 'Riad', 95.00, 2, TRUE, 'riad-soleil.jpg'),
(4, 'Atlas Desert Camp', 'Riad', 125.00, 4, TRUE, 'atlas-camp.jpg'),

(5, 'Northern Lights Lodge', 'Chalet', 240.00, 4, TRUE, 'northern-lights-lodge.jpg'),
(5, 'Reykjavik City Guesthouse', 'Hotel', 155.00, 2, TRUE, 'reykjavik-guesthouse.jpg');

INSERT INTO activites (destination_id, nom, description, prix, date_activite, places_disponibles, image)
VALUES
(1, 'Cours de surf', 'Session encadrée sur une plage accessible aux débutants.', 45.00, '2026-06-14', 8, 'bali.jpg'),
(1, 'Visite guidée des temples', 'Parcours guidé entre temples, villages et paysages de rizières.', 30.00, '2026-06-15', 12, 'bali.jpg'),

(2, 'Tour gastronomique', 'Découverte de petites adresses locales et spécialités japonaises.', 75.00, '2026-06-20', 6, 'tokyo.jpg'),
(2, 'Musée digital immersif', 'Expérience visuelle interactive dans un musée contemporain.', 28.00, '2026-06-21', 14, 'tokyo.jpg'),

(3, 'Randonnée guidée Mont-Blanc', 'Sortie panoramique accompagnée face au massif du Mont-Blanc.', 55.00, '2026-06-10', 10, 'chamonix.jpg'),
(3, 'Initiation escalade', 'Découverte de l’escalade encadrée par un guide de montagne.', 70.00, '2026-06-11', 8, 'chamonix.jpg'),

(4, 'Excursion dans l’Atlas', 'Journée dans les villages de montagne avec pause déjeuner locale.', 65.00, '2026-06-22', 5, 'marrakech.jpg'),
(4, 'Atelier cuisine marocaine', 'Préparation de plats traditionnels marocains avec un chef local.', 40.00, '2026-06-23', 10, 'marrakech.jpg'),

(5, 'Lagons géothermiques', 'Moment de relaxation dans des eaux chaudes naturelles.', 90.00, '2026-06-25', 9, 'reykjavik.jpg'),
(5, 'Chasse aux aurores', 'Sortie nocturne accompagnée pour observer les lumières du nord.', 110.00, '2026-06-26', 4, 'reykjavik.jpg');
