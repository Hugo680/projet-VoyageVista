import { destinations } from "../data/destinations";
import { transports } from "../data/transports";
import { accommodations } from "../data/accommodations";
import { activities } from "../data/activities";
import TransportCard from "../components/TransportCard";
import AccommodationCard from "../components/AccommodationCard";
import ActivityCard from "../components/ActivityCard";

function DestinationDetails(props) {
  const destination = destinations.find(function (item) {
    return item.id === Number(props.destinationId);
  });

  if (!destination) {
    return (
      <section>
        <p>Destination introuvable.</p>
        <button className="button" onClick={() => props.goTo("destinations")}>
          Retour au catalogue
        </button>
      </section>
    );
  }

  const linkedTransports = transports.filter(function (transport) {
    return transport.destinationId === destination.id;
  });

  const linkedAccommodations = accommodations.filter(function (accommodation) {
    return accommodation.destinationId === destination.id;
  });

  const linkedActivities = activities.filter(function (activity) {
    return activity.destinationId === destination.id;
  });

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
