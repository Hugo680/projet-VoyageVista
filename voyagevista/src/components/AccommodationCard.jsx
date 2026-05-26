import { useTrip } from "../context/TripContext";

function AccommodationCard({ accommodation }) {
  const { itinerary, chooseAccommodation } = useTrip();
  const isSelected = itinerary.accommodation?.id === accommodation.id;

  return (
    <article className="card">
      <img src={accommodation.image} alt={accommodation.name} />
      <div className="card-content">
        <span className="tag">{accommodation.type}</span>
        <h3>{accommodation.name}</h3>
        <p>{accommodation.description}</p>
        <p>Capacite: {accommodation.capacity} personne(s)</p>
        <p className={accommodation.available ? "available" : "unavailable"}>
          {accommodation.available ? "Disponible" : "Indisponible"}
        </p>

        <div className="card-footer">
          <strong>{accommodation.pricePerNight} EUR / nuit</strong>
          <button
            className="button"
            disabled={!accommodation.available}
            onClick={() => chooseAccommodation(accommodation)}
          >
            {isSelected ? "Deselectionner" : "Choisir"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default AccommodationCard;
