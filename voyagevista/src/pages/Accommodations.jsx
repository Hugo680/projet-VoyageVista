import { useEffect, useMemo, useState } from "react";
import { getAccommodations } from "../services/api";
import AccommodationCard from "../components/AccommodationCard";
import FilterPanel from "../components/FilterPanel";

function Accommodations() {
  const [accommodations, setAccommodations] = useState([]);
  const [maxPrice, setMaxPrice] = useState("");
  const [type, setType] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    async function loadAccommodations() {
      const data = await getAccommodations();
      setAccommodations(data);
    }

    loadAccommodations();
  }, []);

  const filteredAccommodations = useMemo(() => {
    return accommodations.filter((accommodation) => {
      const matchPrice =
        maxPrice === "" || accommodation.pricePerNight <= Number(maxPrice);

      const matchType = type === "" || accommodation.type === type;

      const matchAvailability =
        !availableOnly || accommodation.available === true;

      return matchPrice && matchType && matchAvailability;
    });
  }, [accommodations, maxPrice, type, availableOnly]);

  return (
    <section>
      <div className="page-header">
        <h1>Hébergements</h1>
        <p>
          Consultez les hôtels, chalets, riads et logements disponibles pour
          votre séjour.
        </p>
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
          <option value="hotel">Hôtel</option>
          <option value="chalet">Chalet</option>
          <option value="riad">Riad</option>
          <option value="lodge">Lodge</option>
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
        {filteredAccommodations.map((accommodation) => (
          <AccommodationCard
            key={accommodation.id}
            accommodation={accommodation}
          />
        ))}
      </div>

      {filteredAccommodations.length === 0 && (
        <p className="empty-message">
          Aucun hébergement ne correspond à votre recherche.
        </p>
      )}
    </section>
  );
}

export default Accommodations;
