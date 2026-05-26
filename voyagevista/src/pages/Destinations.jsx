import { useEffect, useMemo, useState } from "react";
import { getDestinations } from "../services/api";
import DestinationCard from "../components/DestinationCard";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    async function loadDestinations() {
      const data = await getDestinations();
      setDestinations(data);
    }

    loadDestinations();
  }, []);

  const filteredDestinations = useMemo(() => {
    let results = [...destinations];

    if (search.trim() !== "") {
      const value = search.toLowerCase();

      results = results.filter(
        (destination) =>
          destination.name.toLowerCase().includes(value) ||
          destination.country.toLowerCase().includes(value)
      );
    }

    if (typeFilter !== "") {
      results = results.filter(
        (destination) => destination.type === typeFilter
      );
    }

    if (maxPrice !== "") {
      results = results.filter(
        (destination) => destination.minPrice <= Number(maxPrice)
      );
    }

    if (sortBy === "price-asc") {
      results.sort((a, b) => a.minPrice - b.minPrice);
    }

    if (sortBy === "price-desc") {
      results.sort((a, b) => b.minPrice - a.minPrice);
    }

    if (sortBy === "popularity") {
      results.sort((a, b) => b.popularity - a.popularity);
    }

    return results;
  }, [destinations, search, typeFilter, maxPrice, sortBy]);

  return (
    <section>
      <div className="page-header">
        <h1>Catalogue des destinations</h1>
        <p>
          Recherchez une destination par nom, pays, type de voyage ou budget.
        </p>
      </div>

      <FilterPanel>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Rechercher par nom ou pays..."
        />

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
        >
          <option value="">Tous les types</option>
          <option value="plage">Plage</option>
          <option value="montagne">Montagne</option>
          <option value="ville">Ville</option>
          <option value="aventure">Aventure</option>
          <option value="detente">Détente</option>
        </select>

        <input
          type="number"
          placeholder="Prix maximum"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="">Trier par</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="popularity">Popularité</option>
        </select>
      </FilterPanel>

      <div className="cards-grid">
        {filteredDestinations.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <p className="empty-message">
          Aucune destination ne correspond à votre recherche.
        </p>
      )}
    </section>
  );
}

export default Destinations;
