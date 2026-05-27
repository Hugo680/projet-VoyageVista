import planeImage from "../assets/images/plane.jpg";
import trainImage from "../assets/images/train.jpg";
import busImage from "../assets/images/bus.jpg";
import carImage from "../assets/images/car.jpg";

export const transports = [
  {
    id: 1,
    destinationId: 1,
    type: "avion",
    company: "Air Vista",
    departureCity: "Paris",
    arrivalCity: "Bali",
    date: "2026-06-12",
    departureTime: "09:10",
    arrivalTime: "07:30",
    duration: "16h20",
    price: 720,
    placesAvailable: 18,
    image: planeImage
  },
  {
    id: 2,
    destinationId: 2,
    type: "avion",
    company: "Japan Sky",
    departureCity: "Paris",
    arrivalCity: "Tokyo",
    date: "2026-06-18",
    departureTime: "13:40",
    arrivalTime: "09:20",
    duration: "12h40",
    price: 840,
    placesAvailable: 9,
    image: planeImage
  },
  {
    id: 3,
    destinationId: 3,
    type: "train",
    company: "Alpine Express",
    departureCity: "Lyon",
    arrivalCity: "Chamonix",
    date: "2026-06-08",
    departureTime: "08:15",
    arrivalTime: "12:05",
    duration: "3h50",
    price: 68,
    placesAvailable: 42,
    image: trainImage
  },
  {
    id: 4,
    destinationId: 4,
    type: "avion",
    company: "Atlas Air",
    departureCity: "Marseille",
    arrivalCity: "Marrakech",
    date: "2026-06-21",
    departureTime: "11:00",
    arrivalTime: "13:45",
    duration: "2h45",
    price: 160,
    placesAvailable: 24,
    image: planeImage
  },
  {
    id: 5,
    destinationId: 5,
    type: "bus",
    company: "Nordic Routes",
    departureCity: "Reykjavik",
    arrivalCity: "Cercle d'or",
    date: "2026-06-24",
    departureTime: "07:45",
    arrivalTime: "10:00",
    duration: "2h15",
    price: 42,
    placesAvailable: 16,
    image: busImage
  },
  {
    id: 6,
    destinationId: 3,
    type: "voiture",
    company: "Road Trip",
    departureCity: "Geneve",
    arrivalCity: "Chamonix",
    date: "2026-06-15",
    departureTime: "10:30",
    arrivalTime: "11:45",
    duration: "1h15",
    price: 55,
    placesAvailable: 3,
    image: carImage
  }
];
