import baliImage from "../assets/images/bali.jpg";
import chamonixImage from "../assets/images/chamonix.jpg";
import marrakechImage from "../assets/images/marrakech.jpg";
import reykjavikImage from "../assets/images/reykjavik.jpg";
import tokyoImage from "../assets/images/tokyo.jpg";
import planeImage from "../assets/images/plane.jpg";
import trainImage from "../assets/images/train.jpg";
import busImage from "../assets/images/bus.jpg";
import carImage from "../assets/images/car.jpg";
import baliResortImage from "../assets/images/bali-ocean-resort.jpg";
import chaletImage from "../assets/images/chalet-mont-blanc.jpg";
import riadImage from "../assets/images/riad-soleil.jpg";
import lodgeImage from "../assets/images/northern-lights-lodge.jpg";
import tokyoHotelImage from "../assets/images/tokyo-central-hotel.jpg";
import travelPlanningImage from "../assets/images/travel-planning.jpg";

export const API_BASE_URL = "http://localhost/VoyageVista/backend";

const imageMap = {
  "bali.jpg": baliImage,
  bali: baliImage,
  "chamonix.jpg": chamonixImage,
  chamonix: chamonixImage,
  "marrakech.jpg": marrakechImage,
  marrakech: marrakechImage,
  "reykjavik.jpg": reykjavikImage,
  reykjavik: reykjavikImage,
  "tokyo.jpg": tokyoImage,
  tokyo: tokyoImage,
  "plane.jpg": planeImage,
  avion: planeImage,
  "train.jpg": trainImage,
  train: trainImage,
  "bus.jpg": busImage,
  bus: busImage,
  "car.jpg": carImage,
  voiture: carImage,
  "bali-ocean-resort.jpg": baliResortImage,
  "chalet-mont-blanc.jpg": chaletImage,
  "riad-soleil.jpg": riadImage,
  "northern-lights-lodge.jpg": lodgeImage,
  "tokyo-central-hotel.jpg": tokyoHotelImage
};

function getImageForName(name, fallbackType) {
  const rawName = String(name || "").trim();
  const key = rawName.toLowerCase();
  const typeKey = String(fallbackType || "").toLowerCase();

  if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("/")) {
    return rawName;
  }

  if (key.startsWith("uploads/")) {
    return `${API_BASE_URL}/${rawName}`;
  }

  return imageMap[key] || imageMap[typeKey] || travelPlanningImage;
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const text = await response.text();

  if (!text) {
    throw new Error(`Reponse vide depuis ${url}`);
  }

  let data;

  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(`Reponse non JSON depuis ${url}`);
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || `Erreur API ${response.status}`);
  }

  return data;
}

function post(path, payload = {}) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/uploads/uploadImage.php`, {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Erreur lors de l'envoi de l'image");
  }

  return data;
}

function toNumber(value) {
  return value === null || value === undefined ? 0 : Number(value);
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function normalizeAccommodationType(type) {
  const value = normalizeText(type);

  if (value === "villa") return "Villa";
  if (value === "appartement") return "Appartement";
  if (value === "chalet" || value === "lodge") return "Chalet";
  if (value === "riad" || value === "camp") return "Riad";

  return "Hotel";
}

function inferActivityType(activity) {
  const text = normalizeText((activity.nom || "") + " " + (activity.description || ""));

  if (text.includes("surf") || text.includes("escalade")) return "sport";
  if (text.includes("gastronom") || text.includes("cuisine")) return "gastronomie";
  if (text.includes("temple") || text.includes("musee") || text.includes("visite")) return "culture";
  if (text.includes("randonnee") || text.includes("aurore") || text.includes("nature")) return "nature";
  if (text.includes("lagon") || text.includes("spa") || text.includes("detente")) return "detente";
  if (text.includes("atlas") || text.includes("excursion") || text.includes("aventure")) return "aventure";

  return "culture";
}

function getReservationIdFromMessage(message) {
  const match = String(message || "").match(/VV-(\d+)/i);
  return match ? toNumber(match[1]) : null;
}

function getNights(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Number.isFinite(diff) ? Math.max(diff, 1) : 1;
}

export function mapUser(user) {
  if (!user) return null;
  return {
    id: toNumber(user.id),
    name: user.nom || user.name || "",
    email: user.email || "",
    role: user.role || "client"
  };
}

export function mapDestination(destination) {
  return {
    id: toNumber(destination.id),
    name: destination.nom,
    country: destination.pays,
    type: normalizeText(destination.categorie),
    minPrice: toNumber(destination.prix_min),
    popularity: 80,
    image: getImageForName(destination.image || destination.nom, "destination"),
    description: destination.description || "",
    longDescription: destination.description || "",
    latitude: toNumber(destination.latitude),
    longitude: toNumber(destination.longitude)
  };
}

export function mapTransport(transport) {
  return {
    id: toNumber(transport.id),
    destinationId: toNumber(transport.destination_id),
    destinationName: transport.destination_nom || "",
    type: transport.type || "",
    company: "VoyageVista Transport",
    departureCity: transport.depart || "",
    arrivalCity: transport.arrivee || "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    price: toNumber(transport.prix),
    placesAvailable: toNumber(transport.places_disponibles),
    image: getImageForName(transport.image, transport.type)
  };
}

export function mapAccommodation(accommodation) {
  return {
    id: toNumber(accommodation.id),
    destinationId: toNumber(accommodation.destination_id),
    destinationName: accommodation.destination_nom || "",
    name: accommodation.nom || "",
    type: normalizeAccommodationType(accommodation.type),
    pricePerNight: toNumber(accommodation.prix_nuit),
    capacity: toNumber(accommodation.capacite),
    available: Boolean(Number(accommodation.disponible)),
    image: getImageForName(accommodation.image || accommodation.nom, accommodation.type),
    description: accommodation.description || "Hebergement selectionne pour ce sejour.",
    latitude: toNumber(accommodation.latitude),
    longitude: toNumber(accommodation.longitude)
  };
}

export function mapActivity(activity) {
  return {
    id: toNumber(activity.id),
    destinationId: toNumber(activity.destination_id),
    destinationName: activity.destination_nom || "",
    name: activity.nom || "",
    type: normalizeText(activity.type) || inferActivityType(activity),
    price: toNumber(activity.prix),
    date: activity.date_activite || "",
    placesAvailable: toNumber(activity.places_disponibles),
    image: getImageForName(activity.image || activity.nom, activity.type),
    description: activity.description || ""
  };
}

export function mapNotification(notification) {
  return {
    id: toNumber(notification.id),
    message: notification.message || "",
    type: notification.type || "info",
    reservationId: getReservationIdFromMessage(notification.message),
    read: Boolean(Number(notification.lu)),
    createdAt: notification.created_at || new Date().toISOString()
  };
}

export function mapReservation(reservation) {
  const activities = (reservation.activites || []).map(mapActivity);
  const startDate = reservation.date_debut || "";
  const endDate = reservation.date_fin || "";
  const nights = getNights(startDate, endDate);

  return {
    id: toNumber(reservation.id),
    createdAt: reservation.date_reservation || new Date().toISOString(),
    status: reservation.statut || "",
    paymentMode: "paiement simule",
    paymentLabel: "Carte bleue se terminant par 1234",
    paymentIban: "FR76 300 **** **** ****",
    paymentHolder: "",
    paymentAuthorization: "AUTH-" + reservation.id,
    paymentDetails: null,
    itinerary: {
      destination: {
        id: toNumber(reservation.destination_id),
        name: reservation.destination_nom || "Destination",
        country: reservation.destination_pays || ""
      },
      transport: {
        id: toNumber(reservation.transport_id),
        type: reservation.transport_type || "",
        company: "VoyageVista Transport",
        departureCity: reservation.transport_depart || "",
        arrivalCity: reservation.transport_arrivee || "",
        price: toNumber(reservation.transport_prix)
      },
      accommodation: {
        id: toNumber(reservation.hebergement_id),
        name: reservation.hebergement_nom || "Hebergement",
        type: reservation.hebergement_type || "",
        pricePerNight: toNumber(reservation.hebergement_prix_nuit)
      },
      activities: activities,
      startDate: startDate,
      endDate: endDate
    },
    totals: {
      nights: nights,
      transportTotal: toNumber(reservation.transport_prix),
      accommodationTotal: toNumber(reservation.hebergement_prix_nuit) * nights,
      activitiesTotal: activities.reduce(function (total, activity) {
        return total + activity.price;
      }, 0),
      total: toNumber(reservation.prix_total)
    }
  };
}

export async function getDestinations() {
  const data = await request("/destinations/getAll.php");
  return data.destinations.map(mapDestination);
}

export async function getDestinationById(id) {
  const data = await request(`/destinations/getOne.php?id=${encodeURIComponent(id)}`);
  return mapDestination(data.destination);
}

export async function getTransports() {
  const data = await request("/transports/getAll.php");
  return data.transports.map(mapTransport);
}

export async function getTransportsByDestination(destinationId) {
  const data = await request(
    `/transports/getAll.php?destination_id=${encodeURIComponent(destinationId)}`
  );
  return data.transports.map(mapTransport);
}

export async function getAccommodations() {
  const data = await request("/hebergements/getAll.php");
  return data.hebergements.map(mapAccommodation);
}

export async function getAccommodationsByDestination(destinationId) {
  const data = await request(
    `/hebergements/getAll.php?destination_id=${encodeURIComponent(destinationId)}`
  );
  return data.hebergements.map(mapAccommodation);
}

export async function getActivities() {
  const data = await request("/activites/getAll.php");
  return data.activites.map(mapActivity);
}

export async function getActivitiesByDestination(destinationId) {
  const data = await request(
    `/activites/getAll.php?destination_id=${encodeURIComponent(destinationId)}`
  );
  return data.activites.map(mapActivity);
}

export async function loginUser(payload) {
  const data = await post("/auth/login.php", payload);
  return { ...data, user: mapUser(data.user) };
}

export async function registerUser(payload) {
  return post("/auth/register.php", payload);
}

export async function logoutUser() {
  return post("/auth/logout.php");
}

export async function getSession() {
  const data = await request("/auth/session.php");
  return { ...data, user: mapUser(data.user) };
}

export async function createItinerary(payload) {
  return post("/itineraires/create.php", payload);
}

export async function getUserItineraries() {
  return request("/itineraires/getMine.php");
}

export async function updateItinerary(payload) {
  return post("/itineraires/update.php", payload);
}

export async function addActivityToItinerary(payload) {
  return post("/itineraires/addActivite.php", payload);
}

export async function removeActivityFromItinerary(payload) {
  return post("/itineraires/removeActivite.php", payload);
}

export async function createReservation(payload) {
  return post("/reservations/create.php", payload);
}

export async function getUserReservations() {
  const data = await request("/reservations/getMine.php");
  return data.reservations.map(mapReservation);
}

export async function cancelReservation(payload) {
  return post("/reservations/cancel.php", payload);
}

export async function getNotifications() {
  const data = await request("/notifications/getMine.php");
  return data.notifications.map(mapNotification);
}

export async function markNotificationAsRead(notificationId) {
  return post("/notifications/markAsRead.php", { notification_id: notificationId });
}

export async function markAllNotificationsAsRead() {
  return post("/notifications/markAllAsRead.php");
}

export async function getAdminDashboard() {
  return request("/admin/dashboard.php");
}

export async function getAdminDestinations() {
  const data = await request("/destinations/getAll.php");
  return data.destinations;
}

export async function createDestination(payload) {
  return post("/destinations/create.php", payload);
}

export async function updateDestination(payload) {
  return post("/destinations/update.php", payload);
}

export async function deleteDestination(payload) {
  return post("/destinations/delete.php", payload);
}

export async function getAdminTransports() {
  const data = await request("/transports/getAll.php");
  return data.transports;
}

export async function createTransport(payload) {
  return post("/transports/create.php", payload);
}

export async function updateTransport(payload) {
  return post("/transports/update.php", payload);
}

export async function deleteTransport(payload) {
  return post("/transports/delete.php", payload);
}

export async function getAdminAccommodations() {
  const data = await request("/hebergements/getAll.php");
  return data.hebergements;
}

export async function createAccommodation(payload) {
  return post("/hebergements/create.php", payload);
}

export async function updateAccommodation(payload) {
  return post("/hebergements/update.php", payload);
}

export async function deleteAccommodation(payload) {
  return post("/hebergements/delete.php", payload);
}

export async function getAdminActivities() {
  const data = await request("/activites/getAll.php");
  return data.activites;
}

export async function createActivity(payload) {
  return post("/activites/create.php", payload);
}

export async function updateActivity(payload) {
  return post("/activites/update.php", payload);
}

export async function deleteActivity(payload) {
  return post("/activites/delete.php", payload);
}

export async function getAllReservations() {
  const data = await request("/reservations/getAll.php");
  return data.reservations;
}

export async function validateReservationFromItinerary(itinerary) {
  const itineraryData = await createItinerary({
    destination_id: itinerary.destination.id,
    transport_id: itinerary.transport.id,
    hebergement_id: itinerary.accommodation.id,
    date_debut: itinerary.startDate,
    date_fin: itinerary.endDate
  });

  const itineraireId = itineraryData.itineraire_id;

  for (const activity of itinerary.activities) {
    await addActivityToItinerary({
      itineraire_id: itineraireId,
      activite_id: activity.id
    });
  }

  return createReservation({ itineraire_id: itineraireId });
}
