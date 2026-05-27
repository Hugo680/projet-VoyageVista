import baliImage from "../assets/images/bali.jpg";
import tokyoImage from "../assets/images/tokyo.jpg";
import chamonixImage from "../assets/images/chamonix.jpg";
import marrakechImage from "../assets/images/marrakech.jpg";
import reykjavikImage from "../assets/images/reykjavik.jpg";

export const activities = [
  {
    id: 1,
    destinationId: 1,
    destinationName: "Bali",
    name: "Cours de surf",
    type: "sport",
    price: 45,
    date: "2026-06-14",
    placesAvailable: 8,
    image: baliImage,
    description: "Session encadree sur une plage accessible aux debutants."
  },
  {
    id: 2,
    destinationId: 1,
    destinationName: "Bali",
    name: "Visite des temples",
    type: "culture",
    price: 30,
    date: "2026-06-15",
    placesAvailable: 12,
    image: baliImage,
    description: "Parcours guide entre temples, villages et paysages de rizieres."
  },
  {
    id: 3,
    destinationId: 2,
    destinationName: "Tokyo",
    name: "Tour gastronomique",
    type: "culture",
    price: 75,
    date: "2026-06-20",
    placesAvailable: 6,
    image: tokyoImage,
    description: "Decouverte de petites adresses locales et specialites japonaises."
  },
  {
    id: 4,
    destinationId: 2,
    destinationName: "Tokyo",
    name: "Musee digital immersif",
    type: "detente",
    price: 28,
    date: "2026-06-21",
    placesAvailable: 14,
    image: tokyoImage,
    description: "Experience visuelle interactive dans un musee contemporain."
  },
  {
    id: 5,
    destinationId: 3,
    destinationName: "Chamonix",
    name: "Randonnee guidee",
    type: "aventure",
    price: 55,
    date: "2026-06-10",
    placesAvailable: 10,
    image: chamonixImage,
    description: "Sortie panoramique accompagnee face au massif du Mont-Blanc."
  },
  {
    id: 6,
    destinationId: 4,
    destinationName: "Marrakech",
    name: "Excursion dans l'Atlas",
    type: "aventure",
    price: 65,
    date: "2026-06-22",
    placesAvailable: 5,
    image: marrakechImage,
    description: "Journee dans les villages de montagne avec pause dejeuner locale."
  },
  {
    id: 7,
    destinationId: 5,
    destinationName: "Reykjavik",
    name: "Lagons geothermiques",
    type: "detente",
    price: 90,
    date: "2026-06-25",
    placesAvailable: 9,
    image: reykjavikImage,
    description: "Moment de relaxation dans des eaux chaudes naturelles."
  },
  {
    id: 8,
    destinationId: 5,
    destinationName: "Reykjavik",
    name: "Chasse aux aurores",
    type: "aventure",
    price: 110,
    date: "2026-06-26",
    placesAvailable: 4,
    image: reykjavikImage,
    description: "Sortie nocturne accompagnee pour observer les lumieres du nord."
  }
];
