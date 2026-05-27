import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";
import Transports from "./pages/Transports";
import Accommodations from "./pages/Accommodations";
import Activities from "./pages/Activities";
import Itinerary from "./pages/Itinerary";
import Cart from "./pages/Cart";
import Reservations from "./pages/Reservations";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";

const emptyItinerary = {
  destination: null,
  transport: null,
  accommodation: null,
  activities: [],
  startDate: "2026-06-12",
  endDate: "2026-06-19"
};

function getNights(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
}

function calculateTotal(itinerary) {
  const nights = getNights(itinerary.startDate, itinerary.endDate);
  const transportTotal = itinerary.transport ? itinerary.transport.price : 0;
  const accommodationTotal = itinerary.accommodation
    ? itinerary.accommodation.pricePerNight * nights
    : 0;
  let activitiesTotal = 0;

  itinerary.activities.forEach(function (activity) {
    activitiesTotal = activitiesTotal + activity.price;
  });

  return {
    nights: nights,
    transportTotal: transportTotal,
    accommodationTotal: accommodationTotal,
    activitiesTotal: activitiesTotal,
    total: transportTotal + accommodationTotal + activitiesTotal
  };
}

function App() {
  const [page, setPage] = useState("home");
  const [detailDestinationId, setDetailDestinationId] = useState(null);
  const [itinerary, setItinerary] = useState(emptyItinerary);
  const [reservations, setReservations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activityAvailability, setActivityAvailability] = useState({});
  const [connected, setConnected] = useState(false);

  const totals = calculateTotal(itinerary);

  function goTo(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showDestinationDetails(destinationId) {
    setDetailDestinationId(destinationId);
    goTo("destination-details");
  }

  function chooseDestination(destination) {
    if (itinerary.destination && itinerary.destination.id === destination.id) {
      setItinerary({
        ...itinerary,
        destination: null,
        transport: null,
        accommodation: null,
        activities: []
      });
    } else {
      setItinerary({
        ...itinerary,
        destination: destination,
        transport:
          itinerary.transport && itinerary.transport.destinationId === destination.id
            ? itinerary.transport
            : null,
        accommodation:
          itinerary.accommodation &&
          itinerary.accommodation.destinationId === destination.id
            ? itinerary.accommodation
            : null,
        activities: itinerary.activities.filter(function (activity) {
          return activity.destinationId === destination.id;
        })
      });
    }
  }

  function chooseTransport(transport) {
    setItinerary({
      ...itinerary,
      transport:
        itinerary.transport && itinerary.transport.id === transport.id
          ? null
          : transport
    });
  }

  function chooseAccommodation(accommodation) {
    setItinerary({
      ...itinerary,
      accommodation:
        itinerary.accommodation && itinerary.accommodation.id === accommodation.id
          ? null
          : accommodation
    });
  }

  function removeDestination() {
    setItinerary({
      ...itinerary,
      destination: null,
      transport: null,
      accommodation: null,
      activities: []
    });
  }

  function removeTransport() {
    setItinerary({ ...itinerary, transport: null });
  }

  function removeAccommodation() {
    setItinerary({ ...itinerary, accommodation: null });
  }

  function setStayDates(startDate, endDate) {
    setItinerary({ ...itinerary, startDate: startDate, endDate: endDate });
  }

  function addActivity(activity) {
    const alreadyAdded = itinerary.activities.some(function (item) {
      return item.id === activity.id;
    });

    if (!alreadyAdded) {
      setItinerary({
        ...itinerary,
        activities: [...itinerary.activities, activity]
      });
    }
  }

  function removeActivity(activityId) {
    setItinerary({
      ...itinerary,
      activities: itinerary.activities.filter(function (activity) {
        return activity.id !== activityId;
      })
    });
  }

  function validateReservation(paymentDetails) {
    const reservation = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: "confirmee",
      paymentMode: "paiement simule",
      paymentDetails: paymentDetails,
      itinerary: itinerary,
      totals: totals
    };

    setReservations([reservation, ...reservations]);

    setNotifications([
      {
        id: Date.now() + 1,
        message:
          "Votre reservation pour " +
          itinerary.destination.name +
          " a ete confirmee - dossier VV-" +
          reservation.id,
        reservationId: reservation.id,
        details: {
          destination: itinerary.destination.name,
          dates: itinerary.startDate + " au " + itinerary.endDate,
          total: totals.total,
          paymentMethod: paymentDetails.cardLabel
        },
        read: false,
        createdAt: new Date().toISOString()
      },
      ...notifications
    ]);

    const nextAvailability = { ...activityAvailability };
    itinerary.activities.forEach(function (activity) {
      const currentPlaces =
        nextAvailability[activity.id] !== undefined
          ? nextAvailability[activity.id]
          : activity.placesAvailable;
      nextAvailability[activity.id] = Math.max(currentPlaces - 1, 0);
    });
    setActivityAvailability(nextAvailability);

    setItinerary(emptyItinerary);
    return reservation;
  }

  function markNotificationRead(notificationId) {
    const updatedNotifications = notifications.map(function (notification) {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });

    setNotifications(updatedNotifications);
  }

  function renderPage() {
    if (page === "connexion") {
      return <Login connected={connected} setConnected={setConnected} goTo={goTo} />;
    }

    if (page === "destinations") {
      return (
        <Destinations
          itinerary={itinerary}
          chooseDestination={chooseDestination}
          showDestinationDetails={showDestinationDetails}
        />
      );
    }

    if (page === "destination-details") {
      return (
        <DestinationDetails
          destinationId={detailDestinationId}
          itinerary={itinerary}
          activityAvailability={activityAvailability}
          chooseDestination={chooseDestination}
          chooseTransport={chooseTransport}
          chooseAccommodation={chooseAccommodation}
          addActivity={addActivity}
          removeActivity={removeActivity}
          goTo={goTo}
        />
      );
    }

    if (page === "transports") {
      return (
        <Transports itinerary={itinerary} chooseTransport={chooseTransport} />
      );
    }

    if (page === "hebergements") {
      return (
        <Accommodations
          itinerary={itinerary}
          chooseAccommodation={chooseAccommodation}
        />
      );
    }

    if (page === "activites") {
      return (
        <Activities
          itinerary={itinerary}
          activityAvailability={activityAvailability}
          addActivity={addActivity}
          removeActivity={removeActivity}
        />
      );
    }

    if (page === "itineraire") {
      return (
        <Itinerary
          itinerary={itinerary}
          totals={totals}
          setStayDates={setStayDates}
          removeDestination={removeDestination}
          removeTransport={removeTransport}
          removeAccommodation={removeAccommodation}
          removeActivity={removeActivity}
          goTo={goTo}
        />
      );
    }

    if (page === "panier") {
      return (
        <Cart
          itinerary={itinerary}
          totals={totals}
          setStayDates={setStayDates}
          removeDestination={removeDestination}
          removeTransport={removeTransport}
          removeAccommodation={removeAccommodation}
          removeActivity={removeActivity}
          validateReservation={validateReservation}
          goTo={goTo}
        />
      );
    }

    if (page === "reservations") {
      return <Reservations reservations={reservations} />;
    }

    if (page === "notifications") {
      return (
        <Notifications
          notifications={notifications}
          markNotificationRead={markNotificationRead}
          goTo={goTo}
        />
      );
    }

    return <Home goTo={goTo} />;
  }

  return (
    <>
      <Navbar
        page={page}
        goTo={goTo}
        itinerary={itinerary}
        notifications={notifications}
      />

      <main className="main-container">{renderPage()}</main>
    </>
  );
}

export default App;
