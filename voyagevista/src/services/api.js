import { destinations } from "../data/destinations";
import { transports } from "../data/transports";
import { accommodations } from "../data/accommodations";
import { activities } from "../data/activities";

const USE_MOCK_DATA = true;
const API_BASE_URL = "http://localhost/voyagevista/api";

export async function getDestinations() {
  if (USE_MOCK_DATA) return destinations;

  const response = await fetch(`${API_BASE_URL}/destinations.php`);
  return response.json();
}

export async function getDestinationById(id) {
  if (USE_MOCK_DATA) {
    return destinations.find((destination) => destination.id === Number(id));
  }

  const response = await fetch(`${API_BASE_URL}/destination.php?id=${id}`);
  return response.json();
}

export async function getTransports() {
  if (USE_MOCK_DATA) return transports;

  const response = await fetch(`${API_BASE_URL}/transports.php`);
  return response.json();
}

export async function getTransportsByDestination(destinationId) {
  if (USE_MOCK_DATA) {
    return transports.filter(
      (transport) => transport.destinationId === Number(destinationId)
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/transports-by-destination.php?destination_id=${destinationId}`
  );
  return response.json();
}

export async function getAccommodations() {
  if (USE_MOCK_DATA) return accommodations;

  const response = await fetch(`${API_BASE_URL}/accommodations.php`);
  return response.json();
}

export async function getAccommodationsByDestination(destinationId) {
  if (USE_MOCK_DATA) {
    return accommodations.filter(
      (accommodation) => accommodation.destinationId === Number(destinationId)
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/accommodations-by-destination.php?destination_id=${destinationId}`
  );
  return response.json();
}

export async function getActivitiesByDestination(destinationId) {
  if (USE_MOCK_DATA) {
    return activities.filter(
      (activity) => activity.destinationId === Number(destinationId)
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/activities-by-destination.php?destination_id=${destinationId}`
  );
  return response.json();
}

export async function getActivities() {
  if (USE_MOCK_DATA) return activities;

  const response = await fetch(`${API_BASE_URL}/activities.php`);
  return response.json();
}

export async function addToItinerary(payload) {
  if (USE_MOCK_DATA) return { success: true, item: payload };

  const response = await fetch(`${API_BASE_URL}/itinerary/add.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function getUserItinerary() {
  if (USE_MOCK_DATA) return null;

  const response = await fetch(`${API_BASE_URL}/itinerary.php`);
  return response.json();
}

export async function validateReservation(payload) {
  if (USE_MOCK_DATA) return { success: true, reservation: payload };

  const response = await fetch(`${API_BASE_URL}/reservations/validate.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function getUserReservations() {
  if (USE_MOCK_DATA) return [];

  const response = await fetch(`${API_BASE_URL}/reservations.php`);
  return response.json();
}

export async function getNotifications() {
  if (USE_MOCK_DATA) return [];

  const response = await fetch(`${API_BASE_URL}/notifications.php`);
  return response.json();
}

export async function markNotificationAsRead(notificationId) {
  if (USE_MOCK_DATA) return { success: true, id: notificationId };

  const response = await fetch(`${API_BASE_URL}/notifications/read.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: notificationId })
  });
  return response.json();
}
