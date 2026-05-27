function TransportCard(props) {
  const transport = props.transport;
  const isSelected =
    props.itinerary.transport && props.itinerary.transport.id === transport.id;

  return (
    <article className="list-card transport-card">
      <img className="transport-image" src={transport.image} alt={transport.type} />
      <div className="list-card-main">
        <span className="tag">{transport.type}</span>
        <h3>
          {transport.departureCity} vers {transport.arrivalCity}
        </h3>
        <p>{transport.company}</p>
        <p>{transport.placesAvailable} places disponibles</p>
      </div>

      <div className="list-card-right">
        <strong>{transport.price} EUR</strong>
        <button className="button" onClick={() => props.chooseTransport(transport)}>
          {isSelected ? "Deselectionner" : "Choisir"}
        </button>
      </div>
    </article>
  );
}

export default TransportCard;
