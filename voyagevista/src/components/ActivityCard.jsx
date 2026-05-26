import { useTrip } from "../context/TripContext";

function ActivityCard({ activity }) {
  const { itinerary, availability, addActivity, removeActivity } = useTrip();
  const isSelected = itinerary.activities.some((item) => item.id === activity.id);
  const placesAvailable = availability[activity.id] ?? activity.placesAvailable;

  return (
    <article className="card">
      <img src={activity.image} alt={activity.name} />
      <div className="card-content">
        <span className="tag">{activity.type}</span>
        <h3>{activity.name}</h3>
        <p>{activity.description}</p>
        <p className="country">{activity.destinationName} - {activity.date}</p>
        <p>{placesAvailable} places disponibles</p>

        <div className="card-footer">
          <strong>{activity.price} EUR</strong>
          {isSelected ? (
            <button className="button danger" onClick={() => removeActivity(activity.id)}>
              Retirer
            </button>
          ) : (
            <button
              className="button"
              disabled={placesAvailable === 0}
              onClick={() => addActivity({ ...activity, placesAvailable })}
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
