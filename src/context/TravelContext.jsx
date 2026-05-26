import { createContext, useContext, useState } from "react";
import { destinations, transports, hebergements } from "../data/mockData";
const TravelContext = createContext();

export function TravelProvider({ children }) {
  const [destination, setDestination] = useState(null);
  const [transport, setTransport] = useState(null);
  const [hebergement, setHebergement] = useState(null);
  const [activitesChoisies, setActivitesChoisies] = useState([]);
  const [nombreNuits, setNombreNuits] = useState(5);
  const [reservations, setReservations] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const ajouterActivite = (activite) => {
    const existeDeja = activitesChoisies.some((a) => a.id === activite.id);

    if (existeDeja) {
      alert("Cette activité est déjà dans votre itinéraire.");
      return;
    }

    if (activite.placesDisponibles <= 0) {
      alert("Cette activité n'est plus disponible.");
      return;
    }

    setActivitesChoisies([...activitesChoisies, activite]);
  };

  const retirerActivite = (id) => {
    setActivitesChoisies(activitesChoisies.filter((a) => a.id !== id));
  };

  const calculerTotal = () => {
    const prixTransport = transport ? transport.prix : 0;
    const prixHebergement = hebergement
      ? hebergement.prixParNuit * nombreNuits
      : 0;

    const prixActivites = activitesChoisies.reduce((total, activite) => {
      return total + activite.prix;
    }, 0);

    return prixTransport + prixHebergement + prixActivites;
  };

  const validerReservation = () => {
  if (!destination || !transport || !hebergement) {
    alert("Veuillez compléter votre séjour avant de réserver.");
    return null;
  }

  const nouvelleReservation = {
    id: Date.now(),
    destination,
    transport,
    hebergement,
    activites: activitesChoisies,
    nombreNuits,
    prixTotal: calculerTotal(),
    statut: "confirmée",
    dateReservation: new Date().toLocaleDateString()
  };

  const nouvelleNotification = {
    id: Date.now() + 1,
    message: `Votre réservation pour ${destination.nom} a été confirmée.`,
    lu: false,
    date: new Date().toLocaleDateString()
  };

  setReservations((anciennesReservations) => [
    ...anciennesReservations,
    nouvelleReservation
  ]);

  setNotifications((anciennesNotifications) => [
    ...anciennesNotifications,
    nouvelleNotification
  ]);

  return nouvelleReservation;
};

  const marquerNotificationCommeLue = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, lu: true }
          : notification
      )
    );
  };

  const remplirSejourFictif = () => {
  setDestination(destinations[0]);
  setTransport(transports[0]);
  setHebergement(hebergements[0]);
  setNombreNuits(5);

  alert("Séjour fictif ajouté : Bali, Air France, Villa luxe vue mer.");
};

  return (
    <TravelContext.Provider
      value={{
        destination,
        setDestination,
        transport,
        setTransport,
        hebergement,
        setHebergement,
        activitesChoisies,
        ajouterActivite,
        retirerActivite,
        nombreNuits,
        setNombreNuits,
        calculerTotal,
        validerReservation,
        reservations,
        notifications,
        marquerNotificationCommeLue,
        remplirSejourFictif
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useTravel() {
  return useContext(TravelContext);
}