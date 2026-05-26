import { createContext, useContext, useMemo, useState } from "react";

const TripContext = createContext(null);

const emptyItinerary = {
  destination: null,
  transport: null,
  accommodation: null,
  activities: [],
  startDate: "2026-06-12",
  endDate: "2026-06-19",
  status: "en preparation"
};

function loadState(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getNights(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
}

function calculateTotal(itinerary) {
  const nights = getNights(itinerary.startDate, itinerary.endDate);
  const transportTotal = itinerary.transport?.price ?? 0;
  const accommodationTotal =
    (itinerary.accommodation?.pricePerNight ?? 0) * nights;
  const activitiesTotal = itinerary.activities.reduce(
    (total, activity) => total + activity.price,
    0
  );

  return {
    nights,
    transportTotal,
    accommodationTotal,
    activitiesTotal,
    total: transportTotal + accommodationTotal + activitiesTotal
  };
}

export function TripProvider({ children }) {
  const [itinerary, setItineraryState] = useState(() =>
    loadState("voyagevista-itinerary", emptyItinerary)
  );
  const [reservations, setReservationsState] = useState(() =>
    loadState("voyagevista-reservations", [])
  );
  const [notifications, setNotificationsState] = useState(() =>
    loadState("voyagevista-notifications", [])
  );
  const [availability, setAvailabilityState] = useState(() =>
    loadState("voyagevista-availability", {})
  );

  function setItinerary(next) {
    setItineraryState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      saveState("voyagevista-itinerary", value);
      return value;
    });
  }

  function setReservations(next) {
    setReservationsState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      saveState("voyagevista-reservations", value);
      return value;
    });
  }

  function setNotifications(next) {
    setNotificationsState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      saveState("voyagevista-notifications", value);
      return value;
    });
  }

  function setAvailability(next) {
    setAvailabilityState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      saveState("voyagevista-availability", value);
      return value;
    });
  }

  function chooseDestination(destination) {
    setItinerary((current) => {
      if (current.destination?.id === destination.id) {
        return {
          ...current,
          destination: null,
          transport: null,
          accommodation: null,
          activities: []
        };
      }

      return {
        ...current,
        destination,
        transport:
          current.transport?.destinationId === destination.id
            ? current.transport
            : null,
        accommodation:
          current.accommodation?.destinationId === destination.id
            ? current.accommodation
            : null,
        activities: current.activities.filter(
          (activity) => activity.destinationId === destination.id
        )
      };
    });
  }

  function chooseTransport(transport) {
    setItinerary((current) => ({
      ...current,
      transport: current.transport?.id === transport.id ? null : transport
    }));
  }

  function chooseAccommodation(accommodation) {
    setItinerary((current) => ({
      ...current,
      accommodation:
        current.accommodation?.id === accommodation.id ? null : accommodation
    }));
  }

  function removeDestination() {
    setItinerary((current) => ({
      ...current,
      destination: null,
      transport: null,
      accommodation: null,
      activities: []
    }));
  }

  function removeTransport() {
    setItinerary((current) => ({ ...current, transport: null }));
  }

  function removeAccommodation() {
    setItinerary((current) => ({ ...current, accommodation: null }));
  }

  function setStayDates(startDate, endDate) {
    setItinerary((current) => ({ ...current, startDate, endDate }));
  }

  function addActivity(activity) {
    setItinerary((current) => {
      if (current.activities.some((item) => item.id === activity.id)) {
        return current;
      }

      return { ...current, activities: [...current.activities, activity] };
    });
  }

  function removeActivity(activityId) {
    setItinerary((current) => ({
      ...current,
      activities: current.activities.filter((activity) => activity.id !== activityId)
    }));
  }

  function validateReservation(paymentDetails = {}) {
    const totals = calculateTotal(itinerary);
    const status = "confirmee";
    const reservation = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status,
      paymentMode: "paiement simule",
      paymentDetails,
      itinerary,
      totals
    };

    setReservations((current) => [reservation, ...current]);
    setNotifications((current) => [
      {
        id: Date.now() + 1,
        message: `Votre reservation pour ${
          itinerary.destination?.name ?? "votre voyage"
        } a ete confirmee - dossier VV-${reservation.id}`,
        reservationId: reservation.id,
        details: {
          destination: itinerary.destination?.name,
          dates: `${itinerary.startDate} au ${itinerary.endDate}`,
          total: totals.total,
          paymentMethod: paymentDetails.cardLabel ?? "Carte simulee"
        },
        read: false,
        createdAt: new Date().toISOString()
      },
      ...current
    ]);
    setAvailability((current) => {
      const next = { ...current };
      itinerary.activities.forEach((activity) => {
        const currentPlaces = next[activity.id] ?? activity.placesAvailable;
        next[activity.id] = Math.max(currentPlaces - 1, 0);
      });
      return next;
    });
    setItinerary({ ...emptyItinerary, status: "reserve" });

    return reservation;
  }

  function markNotificationRead(notificationId) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }

  const totals = useMemo(() => calculateTotal(itinerary), [itinerary]);

  const value = {
    itinerary,
    reservations,
    notifications,
    availability,
    totals,
    chooseDestination,
    chooseTransport,
    chooseAccommodation,
    removeDestination,
    removeTransport,
    removeAccommodation,
    setStayDates,
    addActivity,
    removeActivity,
    validateReservation,
    markNotificationRead
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used inside TripProvider");
  }
  return context;
}
