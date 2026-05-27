# Specifications fonctionnelles

## Roles
- Visiteur: consulte les destinations, transports, hebergements et activites.
- Utilisateur connecte: compose un itineraire, ajoute des activites, valide un panier et consulte ses reservations.
- Administrateur futur: pourra gerer les destinations, disponibilites, prix et reservations.

## Fonctionnalites
- Connexion simulee pour demarrer le parcours utilisateur.
- Catalogue des destinations avec recherche, filtres et details.
- Catalogue des transports avec filtres par depart, arrivee, date et type.
- Catalogue des hebergements avec filtres par prix, type et disponibilite.
- Page Activites avec image, nom, description, prix, date, places disponibles, destination associee et bouton d'ajout.
- Itineraire utilisateur avec destination, transport, hebergement, activites, dates et prix total.
- Panier avec resume complet, paiement simule et validation de reservation.
- Historique des reservations.
- Notifications apres validation et marquage comme lue.

## Parcours utilisateur
L'utilisateur arrive sur le site, se connecte, choisit une destination, choisit un transport, choisit un hebergement, ajoute des activites, consulte son itineraire, valide le panier, recoit une notification, puis consulte ses reservations.

## Regles metier
- Une seule destination principale peut etre active dans l'itineraire.
- Changer de destination conserve seulement les transports, hebergements et activites compatibles avec cette destination.
- Une activite ne peut pas etre ajoutee deux fois au meme itineraire.
- Une activite sans place disponible ne peut pas etre ajoutee.
- Le prix total est calcule avec: prix transport + prix hebergement par nuit x nombre de nuits + somme des activites.
- Le nombre de nuits minimum est 1.
- La validation du panier cree une reservation avec statut confirmee.
- La date de reservation est enregistree automatiquement.
- Les disponibilites des activites choisies sont reduites apres validation.
- Une notification est creee apres validation.

## Limites actuelles
- Le paiement est simule.
- Les donnees sont mockees cote front.
- Les reservations, notifications et itineraire sont stockes en localStorage.
