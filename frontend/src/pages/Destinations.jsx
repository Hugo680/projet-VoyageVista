import { useEffect, useState } from "react";
import DestinationCard from "../components/DestinationCard";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import { getDestinations } from "../services/api";

function Destinations(props) {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [error, setError] = useState("");

  useEffect(function () {
    async function loadDestinations() {
      try {
        setDestinations(await getDestinations());
      } catch (apiError) {
        setError(apiError.message);
      }
    }

    loadDestinations();
  }, []);

  let filteredDestinations = destinations.filter(function (destination) {
    const value = search.toLowerCase();
    const matchSearch =
      search === "" ||
      destination.name.toLowerCase().includes(value) ||
      destination.country.toLowerCase().includes(value);
    const matchType = typeFilter === "" || destination.type === typeFilter;
    const matchPrice =
      maxPrice === "" || destination.minPrice <= Number(maxPrice);

    return matchSearch && matchType && matchPrice;
  });

  if (sortBy === "price-asc") {
    filteredDestinations.sort(function (a, b) {
      return a.minPrice - b.minPrice;
    });
  }

  if (sortBy === "price-desc") {
    filteredDestinations.sort(function (a, b) {
      return b.minPrice - a.minPrice;
    });
  }

  if (sortBy === "popularity") {
    filteredDestinations.sort(function (a, b) {
      return b.popularity - a.popularity;
    });
  }

  return (
    <section>
      <div className="page-header">
        <h1>Catalogue des destinations</h1>
        <p>Recherchez une destination par nom, pays, type ou budget.</p>
      </div>

      <FilterPanel>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Rechercher par nom ou pays..."
        />

        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
          <option value="">Tous les types</option>
          <option value="plage">Plage</option>
          <option value="montagne">Montagne</option>
          <option value="ville">Ville</option>
          <option value="aventure">Aventure</option>
          <option value="detente">Detente</option>
        </select>

        <input
          type="number"
          placeholder="Prix maximum"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />

        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="">Trier par</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix decroissant</option>
          <option value="popularity">Popularite</option>
        </select>
      </FilterPanel>

      <div className="cards-grid">
        {filteredDestinations.map(function (destination) {
          return (
            <DestinationCard
              key={destination.id}
              destination={destination}
              itinerary={props.itinerary}
              chooseDestination={props.chooseDestination}
              showDestinationDetails={props.showDestinationDetails}
            />
          );
        })}
      </div>

      {error && <p className="empty-message">{error}</p>}

      {filteredDestinations.length === 0 && (
        <p className="empty-message">Aucune destination ne correspond a votre recherche.</p>
      )}
    </section>
  );
}

export default Destinations;
