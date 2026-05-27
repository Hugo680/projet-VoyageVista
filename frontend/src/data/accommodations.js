import baliResort from "../assets/images/bali-ocean-resort.jpg";
import tokyoHotel from "../assets/images/tokyo-central-hotel.jpg";
import chaletImage from "../assets/images/chalet-mont-blanc.jpg";
import riadImage from "../assets/images/riad-soleil.jpg";
import lodgeImage from "../assets/images/northern-lights-lodge.jpg";

export const accommodations = [
  {
    id: 1,
    destinationId: 1,
    name: "Bali Ocean Resort",
    type: "hotel",
    pricePerNight: 145,
    capacity: 2,
    available: true,
    image: baliResort,
    description: "Resort proche de la plage avec piscine et spa."
  },
  {
    id: 2,
    destinationId: 2,
    name: "Tokyo Central Hotel",
    type: "hotel",
    pricePerNight: 180,
    capacity: 3,
    available: true,
    image: tokyoHotel,
    description: "Hotel moderne situe pres des transports et quartiers animes."
  },
  {
    id: 3,
    destinationId: 3,
    name: "Chalet Mont-Blanc",
    type: "chalet",
    pricePerNight: 220,
    capacity: 6,
    available: false,
    image: chaletImage,
    description: "Chalet chaleureux avec vue sur les sommets."
  },
  {
    id: 4,
    destinationId: 4,
    name: "Riad Soleil",
    type: "riad",
    pricePerNight: 95,
    capacity: 2,
    available: true,
    image: riadImage,
    description: "Riad calme dans la medina avec terrasse."
  },
  {
    id: 5,
    destinationId: 5,
    name: "Northern Lights Lodge",
    type: "lodge",
    pricePerNight: 240,
    capacity: 4,
    available: true,
    image: lodgeImage,
    description: "Lodge confortable pour observer les aurores boreales."
  }
];
