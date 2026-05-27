import { useEffect, useState } from "react";
import AccommodationCard from "../components/AccommodationCard";
import FilterPanel from "../components/FilterPanel";
import { getAccommodations } from "../services/api";

function Accommodations(props) {
  const [accommodations, setAccommodations] = useState([]);
  const [maxPrice, setMaxPrice] = useState("");
  const [type, setType] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [error, setError] = useState("");

  useEffect(function () {
    async function loadAccommodations() {
      try {
        setAccommodations(await getAccommodations());
      } catch (apiError) {
        setError(apiError.message);
      }
    }

    loadAccommodations();
  }, []);

  const filteredAccommodations = accommodations.filter(function (accommodation) {
    const matchPrice =
      maxPrice === "" || accommodation.pricePerNight <= Number(maxPrice);
    const matchType = type === "" || accommodation.type === type;
    const matchAvailability = !availableOnly || accommodation.available === true;

    return matchPrice && matchType && matchAvailability;
  });

  return (
    <section>
      <div className="page-header">
        <h1>Hebergements</h1>
        <p>Consultez les hotels, chalets, riads et logements disponibles.</p>
      </div>

      <FilterPanel>
        <input
          type="number"
          placeholder="Prix maximum par nuit"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />

        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">Tous les types</option>
          <option value="Hotel">Hotel</option>
          <option value="Villa">Villa</option>
          <option value="Appartement">Appartement</option>
          <option value="Chalet">Chalet</option>
          <option value="Riad">Riad</option>
        </select>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => setAvailableOnly(event.target.checked)}
          />
          Disponibles uniquement
        </label>
      </FilterPanel>

      <div className="cards-grid">
        {filteredAccommodations.map(function (accommodation) {
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

      {filteredAccommodations.length === 0 && (
        <p className="empty-message">Aucun hebergement ne correspond a votre recherche.</p>
      )}
      {error && <p className="empty-message">{error}</p>}
    </section>
  );
}

export default Accommodations;
