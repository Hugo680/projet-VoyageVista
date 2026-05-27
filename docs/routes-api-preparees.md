# Routes API branchees

Le frontend React utilise `src/services/api.js` pour appeler le backend PHP/MySQL a l'adresse `http://localhost/VoyageVista/backend`.
Les requetes de session utilisent `credentials: "include"` et les donnees recues sont mappees vers les noms attendus par les composants React.

## Authentification
- `POST /auth/login.php`: connecte l'utilisateur.
- `POST /auth/register.php`: cree un compte utilisateur.
- `POST /auth/logout.php`: deconnecte l'utilisateur.
- `GET /auth/session.php`: verifie la session courante.

## Destinations
- `GET /destinations/getAll.php`: retourne toutes les destinations.
- `GET /destinations/getOne.php?id=1`: retourne le detail d'une destination.

## Transports
- `GET /transports/getAll.php`: retourne tous les transports.
- `GET /transports/getAll.php?destination_id=1`: retourne les transports lies a une destination.

## Hebergements
- `GET /hebergements/getAll.php`: retourne tous les hebergements.
- `GET /hebergements/getAll.php?destination_id=1`: retourne les hebergements lies a une destination.

## Activites
- `GET /activites/getAll.php`: retourne toutes les activites.
- `GET /activites/getAll.php?destination_id=1`: retourne les activites d'une destination.

## Itineraires
- `POST /itineraires/create.php`: cree l'itineraire backend.
- `GET /itineraires/getMine.php`: retourne les itineraires de l'utilisateur.
- `POST /itineraires/update.php`: modifie un itineraire.
- `POST /itineraires/addActivite.php`: ajoute une activite a l'itineraire.
- `POST /itineraires/removeActivite.php`: retire une activite de l'itineraire.

## Reservations
- `POST /reservations/create.php`: valide une reservation a partir de `{ "itineraire_id": 1 }`.
- `GET /reservations/getMine.php`: retourne les reservations de l'utilisateur.
- `POST /reservations/cancel.php`: annule une reservation.

## Notifications
- `GET /notifications/getMine.php`: retourne les notifications utilisateur.
- `POST /notifications/markAsRead.php`: marque une notification comme lue.
- `POST /notifications/markAllAsRead.php`: marque toutes les notifications comme lues.

## Administration
- `GET /admin/dashboard.php`: retourne les indicateurs administrateur.

## Exemple de validation
Le paiement reste simule cote frontend. La validation cree d'abord l'itineraire, ajoute les activites, puis envoie seulement l'identifiant de l'itineraire:

```json
{
  "itineraire_id": 1
}
```
