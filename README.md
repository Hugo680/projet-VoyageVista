# VoyageVista - Backend

Projet Web dynamique 2026  
Plateforme de planification de voyages et de séjours.

## Description du projet

VoyageVista est une application web permettant à un utilisateur de préparer un voyage complet.

L’utilisateur peut consulter des destinations, choisir un transport, choisir un hébergement, ajouter des activités, créer un itinéraire, valider une réservation et recevoir des notifications.

Le backend a été développé en PHP avec une base de données MySQL.

## Technologies utilisées

- PHP
- MySQL
- MAMP
- PDO
- Sessions PHP
- JSON
- React prévu pour le frontend

## Installation locale

### 1. Cloner le projet

```bash
git clone <url-du-repo>
```

### 2. Placer le projet dans MAMP

Le projet doit être placé dans le dossier suivant :

```text
C:\MAMP\htdocs\VoyageVista
```

### 3. Démarrer MAMP

Lancer MAMP puis démarrer les serveurs Apache et MySQL.

### 4. Importer la base de données

Ouvrir phpMyAdmin puis importer le fichier suivant :

```text
database/voyagevista.sql
```

La base créée s’appelle :

```text
voyagevista
```

### 5. Configurer la connexion MySQL

Le fichier de connexion à la base de données est :

```text
backend/config/db.php
```

Configuration utilisée avec MAMP :

```php
$host = "localhost";
$dbname = "voyagevista";
$username = "root";
$password = "root";
```

### 6. URL locale du backend

```text
http://localhost/VoyageVista/backend/
```

## Structure du backend

```text
backend/
├── auth/
├── config/
├── middleware/
├── destinations/
├── transports/
├── hebergements/
├── activites/
├── itineraires/
├── reservations/
└── notifications/
```

## Authentification

### Inscription

```text
POST /backend/auth/register.php
```

Exemple JSON :

```json
{
  "nom": "Hugo",
  "email": "hugo@test.com",
  "password": "123456"
}
```

### Connexion

```text
POST /backend/auth/login.php
```

Exemple JSON :

```json
{
  "email": "hugo@test.com",
  "password": "123456"
}
```

### Vérifier la session

```text
GET /backend/auth/session.php
```

### Déconnexion

```text
POST /backend/auth/logout.php
```

## Rôles utilisateurs

Deux rôles sont utilisés :

```text
client
admin
```

Les routes de création, modification et suppression des données principales sont réservées aux administrateurs grâce au middleware :

```text
backend/middleware/auth_admin.php
```

## Routes destinations

### Récupérer toutes les destinations

```text
GET /backend/destinations/getAll.php
```

### Récupérer une destination

```text
GET /backend/destinations/getOne.php?id=1
```

### Créer une destination

```text
POST /backend/destinations/create.php
```

Exemple JSON :

```json
{
  "nom": "Bali",
  "pays": "Indonésie",
  "description": "Destination idéale pour un séjour entre plages, temples et nature.",
  "image": "bali.jpg",
  "prix_min": 850,
  "categorie": "plage"
}
```

### Modifier une destination

```text
POST /backend/destinations/update.php
```

Exemple JSON :

```json
{
  "id": 1,
  "nom": "Bali",
  "pays": "Indonésie",
  "description": "Destination idéale pour un séjour entre plages, temples, nature et culture.",
  "image": "bali.jpg",
  "prix_min": 900,
  "categorie": "plage"
}
```

### Supprimer une destination

```text
POST /backend/destinations/delete.php
```

Exemple JSON :

```json
{
  "id": 1
}
```

## Routes transports

### Récupérer tous les transports

```text
GET /backend/transports/getAll.php
```

### Récupérer les transports d’une destination

```text
GET /backend/transports/getAll.php?destination_id=3
```

### Récupérer un transport

```text
GET /backend/transports/getOne.php?id=1
```

### Créer un transport

```text
POST /backend/transports/create.php
```

Exemple JSON :

```json
{
  "destination_id": 3,
  "type": "avion",
  "depart": "Paris",
  "arrivee": "Bali",
  "date_depart": "2026-07-10",
  "prix": 650,
  "places_disponibles": 25
}
```

### Modifier un transport

```text
POST /backend/transports/update.php
```

Exemple JSON :

```json
{
  "id": 1,
  "destination_id": 3,
  "type": "avion",
  "depart": "Paris",
  "arrivee": "Bali",
  "date_depart": "2026-07-15",
  "prix": 700,
  "places_disponibles": 20
}
```

### Supprimer un transport

```text
POST /backend/transports/delete.php
```

Exemple JSON :

```json
{
  "id": 1
}
```

## Routes hébergements

### Récupérer tous les hébergements

```text
GET /backend/hebergements/getAll.php
```

### Récupérer les hébergements d’une destination

```text
GET /backend/hebergements/getAll.php?destination_id=3
```

### Récupérer un hébergement

```text
GET /backend/hebergements/getOne.php?id=1
```

### Créer un hébergement

```text
POST /backend/hebergements/create.php
```

Exemple JSON :

```json
{
  "destination_id": 3,
  "nom": "Bali Beach Hotel",
  "type": "hôtel",
  "prix_nuit": 120,
  "capacite": 2,
  "disponible": true,
  "image": "bali-hotel.jpg"
}
```

### Modifier un hébergement

```text
POST /backend/hebergements/update.php
```

Exemple JSON :

```json
{
  "id": 1,
  "destination_id": 3,
  "nom": "Bali Beach Resort",
  "type": "resort",
  "prix_nuit": 150,
  "capacite": 3,
  "disponible": true,
  "image": "bali-resort.jpg"
}
```

### Supprimer un hébergement

```text
POST /backend/hebergements/delete.php
```

Exemple JSON :

```json
{
  "id": 1
}
```

## Routes activités

### Récupérer toutes les activités

```text
GET /backend/activites/getAll.php
```

### Récupérer les activités d’une destination

```text
GET /backend/activites/getAll.php?destination_id=3
```

### Récupérer une activité

```text
GET /backend/activites/getOne.php?id=1
```

### Créer une activité

```text
POST /backend/activites/create.php
```

Exemple JSON :

```json
{
  "destination_id": 3,
  "nom": "Visite guidée des temples",
  "description": "Découverte guidée des temples traditionnels de Bali avec un guide local.",
  "prix": 55,
  "date_activite": "2026-07-17",
  "places_disponibles": 12,
  "image": "temples-bali.jpg"
}
```

### Modifier une activité

```text
POST /backend/activites/update.php
```

Exemple JSON :

```json
{
  "id": 1,
  "destination_id": 3,
  "nom": "Visite guidée des temples",
  "description": "Découverte des temples traditionnels de Bali.",
  "prix": 60,
  "date_activite": "2026-07-18",
  "places_disponibles": 10,
  "image": "temples-bali.jpg"
}
```

### Supprimer une activité

```text
POST /backend/activites/delete.php
```

Exemple JSON :

```json
{
  "id": 1
}
```

## Routes itinéraires

### Créer un itinéraire

```text
POST /backend/itineraires/create.php
```

Exemple JSON :

```json
{
  "destination_id": 3,
  "transport_id": 2,
  "hebergement_id": 1,
  "date_debut": "2026-07-15",
  "date_fin": "2026-07-20"
}
```

### Récupérer mes itinéraires

```text
GET /backend/itineraires/getMine.php
```

### Modifier un itinéraire

```text
POST /backend/itineraires/update.php
```

Exemple JSON :

```json
{
  "id": 1,
  "destination_id": 3,
  "transport_id": 2,
  "hebergement_id": 1,
  "date_debut": "2026-07-16",
  "date_fin": "2026-07-21"
}
```

### Ajouter une activité à un itinéraire

```text
POST /backend/itineraires/addActivite.php
```

Exemple JSON :

```json
{
  "itineraire_id": 1,
  "activite_id": 2
}
```

### Retirer une activité d’un itinéraire

```text
POST /backend/itineraires/removeActivite.php
```

Exemple JSON :

```json
{
  "itineraire_id": 1,
  "activite_id": 2
}
```

## Routes réservations

### Confirmer une réservation

```text
POST /backend/reservations/create.php
```

Exemple JSON :

```json
{
  "itineraire_id": 1
}
```

### Récupérer mes réservations

```text
GET /backend/reservations/getMine.php
```

### Récupérer toutes les réservations admin

```text
GET /backend/reservations/getAll.php
```

### Annuler une réservation

```text
POST /backend/reservations/cancel.php
```

Exemple JSON :

```json
{
  "reservation_id": 1
}
```

## Routes notifications

### Récupérer mes notifications

```text
GET /backend/notifications/getMine.php
```

### Marquer une notification comme lue

```text
POST /backend/notifications/markAsRead.php
```

Exemple JSON :

```json
{
  "notification_id": 1
}
```

### Marquer toutes les notifications comme lues

```text
POST /backend/notifications/markAllAsRead.php
```

## Sécurité mise en place

- Mots de passe hashés avec `password_hash`.
- Vérification des mots de passe avec `password_verify`.
- Sessions PHP avec `session_start`.
- Vérification de l’utilisateur connecté sur les routes privées.
- Middleware admin pour protéger les routes réservées aux administrateurs.
- Requêtes SQL préparées avec PDO.
- Validation minimale des champs côté serveur.
- Messages d’erreur JSON propres.

## Compte de test

Exemple de compte utilisé en local :

```text
Email : hugo@test.com
Mot de passe : 123456
Rôle : admin
```

## Remarques

Les fichiers `test_*.html` utilisés pendant le développement sont temporaires et ne doivent pas être conservés dans le rendu final.

Les autres membres du groupe peuvent utiliser les routes API documentées ci-dessus pour brancher le frontend React.