// src/data/mockData.js

export const destinations = [
  {
    id: 1,
    nom: "Bali",
    pays: "Indonésie",
    image: "/images/bali.jpg"
  },
  {
    id: 2,
    nom: "Maldives",
    pays: "Maldives",
    image: "/images/maldives.jpg"
  },
  {
    id: 3,
    nom: "Dubaï",
    pays: "Émirats arabes unis",
    image: "/images/dubai.jpg"
  }
];

export const transports = [
  {
    id: 1,
    type: "Avion",
    compagnie: "Air France",
    destinationId: 1,
    prix: 850
  },
  {
    id: 2,
    type: "Avion",
    compagnie: "Emirates",
    destinationId: 2,
    prix: 1200
  },
  {
    id: 3,
    type: "Jet privé",
    compagnie: "VoyageVista Private",
    destinationId: 3,
    prix: 3500
  }
];

export const hebergements = [
  {
    id: 1,
    nom: "Villa luxe vue mer",
    destinationId: 1,
    prixParNuit: 250,
    image: "/images/villa-bali.jpg"
  },
  {
    id: 2,
    nom: "Resort 5 étoiles",
    destinationId: 2,
    prixParNuit: 450,
    image: "/images/resort-maldives.jpg"
  },
  {
    id: 3,
    nom: "Suite royale avec majordome",
    destinationId: 3,
    prixParNuit: 900,
    image: "/images/suite-dubai.jpg"
  }
];

export const activites = [
  {
    id: 1,
    nom: "Plongée sous-marine privée",
    description: "Explorez les fonds marins avec un guide professionnel.",
    prix: 120,
    date: "2026-06-15",
    placesDisponibles: 8,
    destinationId: 1,
    type: "aventure",
    image: "/images/plongee.jpg"
  },
  {
    id: 2,
    nom: "Massage balinais premium",
    description: "Moment de détente dans un spa haut de gamme.",
    prix: 90,
    date: "2026-06-16",
    placesDisponibles: 12,
    destinationId: 1,
    type: "détente",
    image: "/images/spa.jpg"
  },
  {
    id: 3,
    nom: "Visite culturelle privée",
    description: "Découverte des temples et traditions locales.",
    prix: 75,
    date: "2026-06-17",
    placesDisponibles: 5,
    destinationId: 1,
    type: "culture",
    image: "/images/temple.jpg"
  },
  {
    id: 4,
    nom: "Dîner romantique sur plage privée",
    description: "Expérience gastronomique de luxe au bord de l’eau.",
    prix: 250,
    date: "2026-07-10",
    placesDisponibles: 4,
    destinationId: 2,
    type: "détente",
    image: "/images/diner-plage.jpg"
  },
  {
    id: 5,
    nom: "Safari désert en 4x4 premium",
    description: "Excursion privée dans le désert avec guide.",
    prix: 300,
    date: "2026-08-05",
    placesDisponibles: 6,
    destinationId: 3,
    type: "aventure",
    image: "/images/safari.jpg"
  }
];