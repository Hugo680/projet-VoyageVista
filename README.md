# VoyageVista

VoyageVista est un projet Web dynamique 2026 de planification de voyages et de séjours.

L'application permet à un utilisateur de créer un compte, se connecter, consulter un catalogue de destinations, choisir un transport, un hébergement et des activités, créer un itinéraire, valider un panier avec paiement simulé, consulter ses réservations et recevoir des notifications.

Une interface administrateur permet aussi de gérer les contenus du site.

## Technologies utilisées

- React
- Vite
- JavaScript
- PHP
- MySQL
- PDO
- MAMP
- HTML / CSS

## Prérequis

- MAMP
- Node.js et npm
- Un navigateur récent
- Git, si le projet est récupéré depuis un dépôt

## Installation du projet

### Étape 1 - Placer le projet dans MAMP

Le dossier du projet doit être placé ici :

```text
C:\MAMP\htdocs\VoyageVista
```

Le nom du dossier doit être exactement :

```text
VoyageVista
```

Si le dossier porte un autre nom, l'URL backend devra être modifiée dans :

```text
frontend/src/services/api.js
```

### Étape 2 - Lancer MAMP

Dans MAMP, démarrer :

- Apache
- MySQL

### Étape 3 - Importer la base de données

Ouvrir phpMyAdmin, puis importer le fichier :

```text
database/voyagevista.sql
```

Le script SQL crée automatiquement la base :

```text
voyagevista
```

### Étape 4 - Vérifier la connexion MySQL

La configuration se trouve dans :

```text
backend/config/db.php
```

Configuration attendue avec MAMP :

```php
$host = "localhost";
$dbname = "voyagevista";
$username = "root";
$password = "root";
```

Si MySQL utilise un autre mot de passe localement, modifier uniquement `$password`.

## Lancer le backend

Le backend PHP est servi par Apache avec MAMP.

Tester dans le navigateur :

```text
http://localhost/VoyageVista/backend/destinations/getAll.php
```

Résultat attendu : une réponse JSON avec `success: true` et une liste de destinations.

Tester aussi :

```text
http://localhost/VoyageVista/backend/auth/session.php
```

## Lancer le frontend

Depuis un terminal :

```powershell
cd C:\MAMP\htdocs\VoyageVista\frontend
npm install
npm run dev
```

Ouvrir ensuite l'URL affichée par Vite, par exemple :

```text
http://localhost:5173/
```

Si le port change, utiliser le port affiché dans le terminal.

## Comptes de test

Compte administrateur :

```text
Email : hugo@test.com
Mot de passe : 123456
Rôle : admin
```

Compte client :

```text
Un client peut être créé depuis la page Inscription.
Les nouveaux comptes créés depuis le site ont automatiquement le rôle client.
```

## Parcours de test conseillé

### Côté client

1. Créer un compte client ou se connecter.
2. Consulter les destinations.
3. Choisir une destination.
4. Choisir un transport.
5. Choisir un hébergement.
6. Ajouter des activités.
7. Vérifier l'itinéraire.
8. Valider le panier avec le paiement simulé.
9. Consulter les réservations.
10. Annuler une réservation si besoin.
11. Consulter les notifications.

### Côté administrateur

1. Se connecter avec `hugo@test.com`.
2. Accéder à la page Admin.
3. Consulter les statistiques.
4. Ajouter, modifier ou supprimer une destination.
5. Ajouter, modifier ou supprimer un transport.
6. Ajouter, modifier ou supprimer un hébergement.
7. Ajouter, modifier ou supprimer une activité.
8. Consulter ou annuler une réservation.

## Fonctionnalités principales

- Authentification
- Inscription client
- Sessions PHP
- Rôles client / admin
- Catalogue dynamique de destinations
- Recherche, filtres et tris
- Transports
- Hébergements
- Activités
- Itinéraires
- Panier
- Paiement simulé
- Réservations
- Annulation de réservation avec remise à jour des places
- Notifications
- Dashboard administrateur
- CRUD administrateur

## Organisation des dossiers

```text
VoyageVista/
├── backend/
├── database/
│   └── voyagevista.sql
├── docs/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── README.md
└── .gitignore
```

- `backend/` : routes PHP, configuration, middleware et logique serveur.
- `frontend/` : application React / Vite.
- `database/` : script SQL de création et remplissage de la base.
- `docs/` : documents de conception du projet.
- `README.md` : instructions d'installation et de lancement.

## Remarques importantes

- `node_modules/` n'est pas fourni et doit être recréé avec `npm install`.
- `frontend/dist/` est généré par `npm run build` et n'est pas nécessaire pour le développement.
- Le paiement est simulé : aucune vraie transaction bancaire n'est réalisée.
- Les numéros complets de carte et les CVV ne sont pas stockés.
- Quand une réservation est annulée, son statut passe à `annulee` et les places des activités sont libérées.
- Le projet est prévu pour un usage local avec MAMP.

## Problèmes fréquents

### `vite` n'est pas reconnu

Relancer l'installation des dépendances :

```powershell
cd C:\MAMP\htdocs\VoyageVista\frontend
npm install
npm run dev
```

### Backend `Not Found`

Vérifier que le projet est bien placé dans :

```text
C:\MAMP\htdocs\VoyageVista
```

### Connexion MySQL impossible

Vérifier que MySQL est lancé dans MAMP, puis vérifier :

```text
backend/config/db.php
```

Adapter `$password` si le mot de passe MySQL local n'est pas `root`.

### CORS ou `Failed to fetch`

Vérifier que :

- MAMP est lancé ;
- le dossier du projet s'appelle bien `VoyageVista` ;
- l'URL backend dans `frontend/src/services/api.js` est correcte ;
- le backend est accessible depuis le navigateur.

## Build final optionnel

Pour générer une version de production du frontend :

```powershell
cd C:\MAMP\htdocs\VoyageVista\frontend
npm run build
```

## Auteurs

Projet réalisé par : Hugo, Ilian, Mathys
