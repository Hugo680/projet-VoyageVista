# Routes API preparees

Ces routes sont preparees dans `src/services/api.js`. Pour l'instant, l'application utilise les donnees mockees.

## Activites
- `GET /activities.php`: retourne toutes les activites.
- `GET /activities-by-destination.php?destination_id=1`: retourne les activites d'une destination.

## Destinations
- `GET /destinations.php`: retourne toutes les destinations.
- `GET /destination.php?id=1`: retourne le detail d'une destination.

## Transports
- `GET /transports.php`: retourne tous les transports.
- `GET /transports-by-destination.php?destination_id=1`: retourne les transports lies a une destination.

## Hebergements
- `GET /accommodations.php`: retourne tous les hebergements.
- `GET /accommodations-by-destination.php?destination_id=1`: retourne les hebergements lies a une destination.

## Itineraire
- `POST /itinerary/add.php`: ajoute un element a l'itineraire utilisateur.
- `GET /itinerary.php`: retourne l'itineraire de l'utilisateur connecte.

## Reservations
- `POST /reservations/validate.php`: valide une reservation et cree son statut.
- `GET /reservations.php`: retourne les reservations de l'utilisateur.

## Notifications
- `GET /notifications.php`: retourne les notifications utilisateur.
- `POST /notifications/read.php`: marque une notification comme lue.

## Exemple de payload de validation
```json
{
  "userId": 1,
  "destinationId": 1,
  "transportId": 1,
  "accommodationId": 1,
  "activityIds": [1, 2],
  "startDate": "2026-06-12",
  "endDate": "2026-06-19",
  "total": 1780
}
```
