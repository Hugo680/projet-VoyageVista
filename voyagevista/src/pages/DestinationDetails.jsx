import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getDestinationById,
  getTransportsByDestination,
  getAccommodationsByDestination,
  getActivitiesByDestination
} from "../services/api";

import TransportCard from "../components/TransportCard";
import AccommodationCard from "../components/AccommodationCard";
import ActivityCard from "../components/ActivityCard";
import { useTrip } from "../context/TripContext";

function DestinationDetails() {
  const { id } = useParams();
  const { chooseDestination } = useTrip();

  const [destination, setDestination] = useState(null);
  const [transports, setTransports] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function loadData() {
      const destinationData = await getDestinationById(id);
      const transportsData = await getTransportsByDestination(id);
      const accommodationsData = await getAccommodationsByDestination(id);
      const activitiesData = await getActivitiesByDestination(id);

      setDestination(destinationData);
      setTransports(transportsData);
      setAccommodations(accommodationsData);
      setActivities(activitiesData);
    }

    loadData();
  }, [id]);

  if (!destination) {
    return (
      <section>
        <p>Destination introuvable.</p>
        <Link to="/destinations" className="button">
          Retour au catalogue
        </Link>
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
            onClick={() => chooseDestination(destination)}
          >
            Ajouter cette destination a mon itineraire
          </button>
        </div>
      </div>

      <div className="section-title">
        <h2>Transports lies</h2>
      </div>

      <div className="list">
        {transports.map((transport) => (
          <TransportCard key={transport.id} transport={transport} />
        ))}
      </div>

      <div className="section-title">
        <h2>Hebergements lies</h2>
      </div>

      <div className="cards-grid">
        {accommodations.map((accommodation) => (
          <AccommodationCard
            key={accommodation.id}
            accommodation={accommodation}
          />
        ))}
      </div>

      <div className="section-title">
        <h2>Activites liees</h2>
      </div>

      <div className="cards-grid">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </section>
  );
}

export default DestinationDetails;
