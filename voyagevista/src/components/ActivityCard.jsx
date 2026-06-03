function ActivityCard(props) {
  const activity = props.activity;
  const isSelected = props.itinerary.activities.some(function (item) {
    return item.id === activity.id;
  });
  const placesAvailable =
    props.activityAvailability[activity.id] !== undefined
      ? props.activityAvailability[activity.id]
      : activity.placesAvailable;

  return (
    <article className="card">
      <img src={activity.image} alt={activity.name} />
      <div className="card-content">
        <span className="tag">{activity.type}</span>
        <h3>{activity.name}</h3>
        <p>{activity.description}</p>
        <p className="country">
          {activity.destinationName} - {activity.date}
        </p>
        <p>{placesAvailable} places disponibles</p>

        <div className="card-footer">
          <strong>{activity.price} EUR</strong>
          {isSelected ? (
            <button
              className="button danger"
              onClick={() => props.removeActivity(activity.id)}
            >
              Retirer
            </button>
          ) : (
            <button
              className="button"
              disabled={placesAvailable === 0}
              onClick={() => props.addActivity(activity)}
            >
              Ajouter a mon itineraire
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ActivityCard;
