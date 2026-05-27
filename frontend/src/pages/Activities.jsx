import { useEffect, useState } from "react";
import ActivityCard from "../components/ActivityCard";
import FilterPanel from "../components/FilterPanel";
import { getActivities, getDestinations } from "../services/api";

function Activities(props) {
  const [activities, setActivities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [destinationId, setDestinationId] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [date, setDate] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [type, setType] = useState("");
  const [error, setError] = useState("");

  useEffect(function () {
    async function loadActivities() {
      try {
        const [nextActivities, nextDestinations] = await Promise.all([
          getActivities(),
          getDestinations()
        ]);
        setActivities(nextActivities);
        setDestinations(nextDestinations);
      } catch (apiError) {
        setError(apiError.message);
      }
    }

    loadActivities();
  }, []);

  const filteredActivities = activities.filter(function (activity) {
    const placesAvailable =
      props.activityAvailability[activity.id] !== undefined
        ? props.activityAvailability[activity.id]
        : activity.placesAvailable;
    const matchDestination =
      destinationId === "" || activity.destinationId === Number(destinationId);
    const matchPrice = maxPrice === "" || activity.price <= Number(maxPrice);
    const matchDate = date === "" || activity.date === date;
    const matchAvailability = !availableOnly || placesAvailable > 0;
    const matchType = type === "" || activity.type === type;

    return matchDestination && matchPrice && matchDate && matchAvailability && matchType;
  });

  return (
    <section>
      <div className="page-header">
        <h1>Activites</h1>
        <p>Ajoutez des experiences a votre sejour selon vos dates et envies.</p>
      </div>

      <FilterPanel>
        <select value={destinationId} onChange={(event) => setDestinationId(event.target.value)}>
          <option value="">Toutes les destinations</option>
          {destinations.map(function (destination) {
            return (
              <option key={destination.id} value={destination.id}>
                {destination.name}
              </option>
            );
          })}
        </select>

        <input
          type="number"
          placeholder="Prix maximum"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />

        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />

        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">Tous les types</option>
          <option value="aventure">Aventure</option>
          <option value="culture">Culture</option>
          <option value="detente">Detente</option>
          <option value="gastronomie">Gastronomie</option>
          <option value="nature">Nature</option>
          <option value="sport">Sport</option>
        </select>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => setAvailableOnly(event.target.checked)}
          />
          Places disponibles
        </label>
      </FilterPanel>

      <div className="cards-grid">
        {filteredActivities.map(function (activity) {
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

      {error && <p className="empty-message">{error}</p>}
    </section>
  );
}

export default Activities;
