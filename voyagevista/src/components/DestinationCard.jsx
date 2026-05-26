import { Link } from "react-router-dom";
import { useTrip } from "../context/TripContext";

function DestinationCard({ destination }) {
  const { itinerary, chooseDestination } = useTrip();
  const isSelected = itinerary.destination?.id === destination.id;

  return (
    <article className="card">
      <img src={destination.image} alt={destination.name} />
      <div className="card-content">
        <span className="tag">{destination.type}</span>
        <h2>{destination.name}</h2>
        <p className="country">{destination.country}</p>
        <p>{destination.description}</p>

        <div className="card-footer">
          <strong>A partir de {destination.minPrice} EUR</strong>
          <button
            className="button secondary"
            onClick={() => chooseDestination(destination)}
          >
            {isSelected ? "Deselectionner" : "Choisir"}
          </button>
          <Link className="button" to={`/destinations/${destination.id}`}>
            Voir details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;
