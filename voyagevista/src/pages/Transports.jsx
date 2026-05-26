import { useEffect, useMemo, useState } from "react";
import { getTransports } from "../services/api";
import TransportCard from "../components/TransportCard";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";

function Transports() {
  const [transports, setTransports] = useState([]);
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    async function loadTransports() {
      const data = await getTransports();
      setTransports(data);
    }

    loadTransports();
  }, []);

  const filteredTransports = useMemo(() => {
    return transports.filter((transport) => {
      const matchDeparture =
        departureCity === "" ||
        transport.departureCity
          .toLowerCase()
          .includes(departureCity.toLowerCase());

      const matchArrival =
        arrivalCity === "" ||
        transport.arrivalCity.toLowerCase().includes(arrivalCity.toLowerCase());

      const matchDate = date === "" || transport.date === date;

      const matchType = type === "" || transport.type === type;

      return matchDeparture && matchArrival && matchDate && matchType;
    });
  }, [transports, departureCity, arrivalCity, date, type]);

  return (
    <section>
      <div className="page-header">
        <h1>Transports</h1>
        <p>
          Recherchez un trajet selon votre ville de départ, votre destination,
          la date et le type de transport.
        </p>
      </div>

      <FilterPanel>
        <SearchBar
          value={departureCity}
          onChange={setDepartureCity}
          placeholder="Ville de départ"
        />

        <SearchBar
          value={arrivalCity}
          onChange={setArrivalCity}
          placeholder="Destination"
        />

        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />

        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">Tous les types</option>
          <option value="avion">Avion</option>
          <option value="train">Train</option>
          <option value="bus">Bus</option>
          <option value="voiture">Voiture</option>
        </select>
      </FilterPanel>

      <div className="list">
        {filteredTransports.map((transport) => (
          <TransportCard key={transport.id} transport={transport} />
        ))}
      </div>

      {filteredTransports.length === 0 && (
        <p className="empty-message">
          Aucun transport ne correspond à votre recherche.
        </p>
      )}
    </section>
  );
}

export default Transports;