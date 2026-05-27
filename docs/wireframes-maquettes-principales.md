# Wireframes / maquettes principales

## Accueil
Structure:
- barre de navigation avec Accueil, Connexion, Destinations, Transports, Hebergements, Activites, Itineraire, Reservations, Notifications et Panier ;
- bloc hero avec presentation de VoyageVista ;
- boutons d'acces vers les destinations et l'itineraire ;
- quatre cartes d'acces rapide: Destinations, Transports, Hebergements, Activites.

Representation:
```text
[Navbar]
[Hero presentation VoyageVista] [Image + rappel parcours]
[Destinations] [Transports] [Hebergements] [Activites]
```

## Catalogue destinations
Structure:
- titre et description ;
- zone de filtres: recherche nom/pays, type, prix maximum, tri ;
- grille de cartes destination ;
- chaque carte contient image, type, nom, pays, description courte, prix minimum, bouton Choisir et bouton Voir details.

Representation:
```text
[Titre catalogue]
[Recherche] [Type] [Prix max] [Tri]
[Carte destination] [Carte destination] [Carte destination]
```

## Detail destination
Structure:
- hero detail avec grande image, pays, description complete et bouton de selection ;
- liste des transports lies ;
- grille des hebergements lies ;
- grille des activites liees.

Representation:
```text
[Image destination] [Infos completes + Selectionner]
[Transports lies]
[Hebergements lies]
[Activites liees]
```

## Transports
Structure:
- titre et introduction ;
- filtres: ville de depart, destination, date, type ;
- liste de cartes transport ;
- chaque carte contient image, type, villes depart/arrivee, date, compagnie, places disponibles, prix et bouton Choisir.

Representation:
```text
[Filtres transport]
[Image] [Infos trajet + places] [Prix + Choisir]
[Image] [Infos trajet + places] [Prix + Choisir]
```

## Hebergements
Structure:
- titre et introduction ;
- filtres: prix maximum, type d'hebergement, disponibilite ;
- grille de cartes hebergement ;
- chaque carte contient image, nom, type, description, capacite, disponibilite, prix par nuit et bouton Choisir.

Representation:
```text
[Filtres hebergement]
[Carte hotel/logement] [Carte hotel/logement] [Carte hotel/logement]
```
