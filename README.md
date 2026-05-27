# VoyageVista

Projet Web dynamique 2026 : application de planification de voyages avec frontend React/Vite, backend PHP et base de donnees MySQL.

## Structure

```text
VoyageVista/
├── backend/
├── database/
│   └── voyagevista.sql
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── docs/
├── README.md
└── .gitignore
```

## Installation

Placer le projet dans :

```text
C:\MAMP\htdocs\VoyageVista
```

Demarrer Apache et MySQL avec MAMP, puis importer :

```text
database/voyagevista.sql
```

La base s'appelle :

```text
voyagevista
```

Configuration MySQL locale dans `backend/config/db.php` :

```php
$host = "localhost";
$dbname = "voyagevista";
$username = "root";
$password = "root";
```

## Backend

URL locale :

```text
http://localhost/VoyageVista/backend/
```

Exemple de test direct :

```text
http://localhost/VoyageVista/backend/destinations/getAll.php
```

Le backend contient les modules :

```text
auth, admin, destinations, transports, hebergements, activites,
itineraires, reservations, notifications, middleware, config
```

## Frontend

Depuis la racine du projet :

```powershell
cd frontend
npm install
npm run dev
```

Frontend local :

```text
http://localhost:5173/
```

Si le port est deja pris, Vite affiche le port a utiliser. Le backend accepte les origines locales de developpement via `backend/config/cors.php`.

Build :

```powershell
cd frontend
npm run build
```

## Compte de test

```text
Email : hugo@test.com
Mot de passe : 123456
Role : admin
```

## Parcours principal

1. Connexion utilisateur.
2. Consultation des destinations.
3. Choix transport, hebergement et activites.
4. Consultation de l'itineraire.
5. Paiement simule dans le panier.
6. Creation de la reservation via le backend.
7. Consultation des reservations et notifications.

## Documentation

Les livrables de conception sont dans `docs/` :

- `journal-assistance-ia.md`
- `routes-api-preparees.md`
- `specifications-fonctionnelles.md`
- `storyboard-parcours-utilisateur.md`
- `wireframes-maquettes-principales.md`
