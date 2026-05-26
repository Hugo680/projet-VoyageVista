import { useEffect, useMemo, useState } from "react";
import ActivityCard from "../components/ActivityCard";
import FilterPanel from "../components/FilterPanel";
import { getActivities, getDestinations } from "../services/api";

function Activities() {
  const [activities, setActivities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [destinationId, setDestinationId] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [date, setDate] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [type, setType] = useState("");

  useEffect(() => {
    async function loadData() {
      setActivities(await getActivities());
      setDestinations(await getDestinations());
    }

    loadData();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchDestination =
        destinationId === "" || activity.destinationId === Number(destinationId);
      const matchPrice = maxPrice === "" || activity.price <= Number(maxPrice);
      const matchDate = date === "" || activity.date === date;
      const matchAvailability = !availableOnly || activity.placesAvailable > 0;
      const matchType = type === "" || activity.type === type;

      return (
        matchDestination &&
        matchPrice &&
        matchDate &&
        matchAvailability &&
        matchType
      );
    });
  }, [activities, destinationId, maxPrice, date, availableOnly, type]);

  return (
    <section>
      <div className="page-header">
        <h1>Activites</h1>
        <p>Ajoutez des experiences a votre sejour selon vos dates et envies.</p>
      </div>

      <FilterPanel>
        <select
          value={destinationId}
          onChange={(event) => setDestinationId(event.target.value)}
        >
          <option value="">Toutes les destinations</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Prix maximum"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />

        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">Tous les types</option>
          <option value="aventure">Aventure</option>
          <option value="culture">Culture</option>
          <option value="detente">Detente</option>
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
        {filteredActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </section>
  );
}

export default Activities;
