function DestinationCard(props) {
  const destination = props.destination;
  const isSelected =
    props.itinerary.destination &&
    props.itinerary.destination.id === destination.id;

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
            onClick={() => props.chooseDestination(destination)}
          >
            {isSelected ? "Deselectionner" : "Choisir"}
          </button>
          <button
            className="button"
            onClick={() => props.showDestinationDetails(destination.id)}
          >
            Voir details
          </button>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;
