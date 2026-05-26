import { useTrip } from "../context/TripContext";

function TransportCard({ transport }) {
  const { itinerary, chooseTransport } = useTrip();
  const isSelected = itinerary.transport?.id === transport.id;

  return (
    <article className="list-card transport-card">
      <img className="transport-image" src={transport.image} alt={transport.type} />
      <div className="list-card-main">
        <span className="tag">{transport.type}</span>
        <h3>
          {transport.departureCity} vers {transport.arrivalCity}
        </h3>
        <p>
          Depart le {transport.date} a {transport.departureTime} - arrivee a{" "}
          {transport.arrivalTime}
        </p>
        <p>{transport.company}</p>
        <p>{transport.placesAvailable} places disponibles</p>
      </div>

      <div className="list-card-right">
        <strong>{transport.price} EUR</strong>
        <span>{transport.duration}</span>
        <button className="button" onClick={() => chooseTransport(transport)}>
          {isSelected ? "Deselectionner" : "Choisir"}
        </button>
      </div>
    </article>
  );
}

export default TransportCard;
