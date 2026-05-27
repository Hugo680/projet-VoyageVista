import { useEffect, useState } from "react";
import TransportCard from "../components/TransportCard";
import AccommodationCard from "../components/AccommodationCard";
import ActivityCard from "../components/ActivityCard";
import {
  getActivitiesByDestination,
  getAccommodationsByDestination,
  getDestinationById,
  getTransportsByDestination
} from "../services/api";

function DestinationDetails(props) {
  const [destination, setDestination] = useState(null);
  const [linkedTransports, setLinkedTransports] = useState([]);
  const [linkedAccommodations, setLinkedAccommodations] = useState([]);
  const [linkedActivities, setLinkedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(
    function () {
      async function loadDetails() {
        setLoading(true);
        setError("");

        try {
          const [nextDestination, nextTransports, nextAccommodations, nextActivities] =
            await Promise.all([
              getDestinationById(props.destinationId),
              getTransportsByDestination(props.destinationId),
              getAccommodationsByDestination(props.destinationId),
              getActivitiesByDestination(props.destinationId)
            ]);
          setDestination(nextDestination);
          setLinkedTransports(nextTransports);
          setLinkedAccommodations(nextAccommodations);
          setLinkedActivities(nextActivities);
        } catch (apiError) {
          setError(apiError.message);
        } finally {
          setLoading(false);
        }
      }

      if (props.destinationId) {
        loadDetails();
      }
    },
    [props.destinationId]
  );

  if (loading) {
    return (
      <section>
        <p>Chargement de la destination...</p>
      </section>
    );
  }

  if (!destination) {
    return (
      <section>
        <p>{error || "Destination introuvable."}</p>
        <button className="button" onClick={() => props.goTo("destinations")}>
          Retour au catalogue
        </button>
      </section>
    );
  }

  return (
    <section>
      <div className="details-hero">
        <img src={destination.image} alt={destination.name} />

        <div>
          <span className="tag">{destination.type}</span>
          <h1>{destination.name}</h1>
          <p className="country">{destination.country}</p>
          <p>{destination.longDescription}</p>
          <strong>Prix minimum : {destination.minPrice} EUR</strong>

          <button
            className="button main-action"
            onClick={() => props.chooseDestination(destination)}
          >
            Ajouter cette destination a mon itineraire
          </button>
        </div>
      </div>

      <div className="section-title">
        <h2>Transports lies</h2>
      </div>

      <div className="list">
        {linkedTransports.map(function (transport) {
          return (
            <TransportCard
              key={transport.id}
              transport={transport}
              itinerary={props.itinerary}
              chooseTransport={props.chooseTransport}
            />
          );
        })}
      </div>

      <div className="section-title">
        <h2>Hebergements lies</h2>
      </div>

      <div className="cards-grid">
        {linkedAccommodations.map(function (accommodation) {
          return (
            <AccommodationCard
              key={accommodation.id}
              accommodation={accommodation}
              itinerary={props.itinerary}
              chooseAccommodation={props.chooseAccommodation}
            />
          );
        })}
      </div>

      <div className="section-title">
        <h2>Activites liees</h2>
      </div>

      <div className="cards-grid">
        {linkedActivities.map(function (activity) {
          return (
            <ActivityCard
              key={activity.id}
              activity={activity}
              itinerary={props.itinerary}
              activityAvailability={props.activityAvailability}
              addActivity={props.addActivity}
              removeActivity={props.removeActivity}
            />
          );
        })}
      </div>
    </section>
  );
}

export default DestinationDetails;
