import baliImage from "../assets/images/bali.jpg";
import tokyoImage from "../assets/images/tokyo.jpg";
import chamonixImage from "../assets/images/chamonix.jpg";
import marrakechImage from "../assets/images/marrakech.jpg";
import reykjavikImage from "../assets/images/reykjavik.jpg";

export const destinations = [
  {
    id: 1,
    name: "Bali",
    country: "Indonesie",
    type: "plage",
    minPrice: 980,
    popularity: 95,
    image: baliImage,
    description: "Rizieres, plages et temples pour un sejour entre detente et culture.",
    longDescription:
      "Bali combine plages tropicales, villages artisanaux, temples et paysages verts. C'est une destination ideale pour alterner repos, excursions et activites nautiques."
  },
  {
    id: 2,
    name: "Tokyo",
    country: "Japon",
    type: "ville",
    minPrice: 1250,
    popularity: 92,
    image: tokyoImage,
    description: "Une capitale vibrante entre quartiers futuristes et traditions.",
    longDescription:
      "Tokyo propose une immersion intense dans la culture japonaise, des marches animes aux sanctuaires calmes, avec une scene culinaire exceptionnelle."
  },
  {
    id: 3,
    name: "Chamonix",
    country: "France",
    type: "montagne",
    minPrice: 620,
    popularity: 84,
    image: chamonixImage,
    description: "Air alpin, randonnees et panorama sur le Mont-Blanc.",
    longDescription:
      "Chamonix est parfaite pour les voyageurs qui aiment la montagne, les sports d'hiver, les sentiers panoramiques et les chalets chaleureux."
  },
  {
    id: 4,
    name: "Marrakech",
    country: "Maroc",
    type: "aventure",
    minPrice: 540,
    popularity: 88,
    image: marrakechImage,
    description: "Souks, jardins et excursions aux portes du desert.",
    longDescription:
      "Marrakech offre une experience coloree entre medina, palais, cuisine locale et departs faciles vers l'Atlas ou le desert."
  },
  {
    id: 5,
    name: "Reykjavik",
    country: "Islande",
    type: "detente",
    minPrice: 1100,
    popularity: 80,
    image: reykjavikImage,
    description: "Sources chaudes, paysages volcaniques et aurores boreales.",
    longDescription:
      "Reykjavik est une base ideale pour explorer cascades, lagons geothermiques, champs de lave et lumieres nordiques."
  }
];
