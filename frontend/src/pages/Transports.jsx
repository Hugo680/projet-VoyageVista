import { useEffect, useState } from "react";
import TransportCard from "../components/TransportCard";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import { getTransports } from "../services/api";

function Transports(props) {
  const [transports, setTransports] = useState([]);
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");

  useEffect(function () {
    async function loadTransports() {
      try {
        setTransports(await getTransports());
      } catch (apiError) {
        setError(apiError.message);
      }
    }

    loadTransports();
  }, []);

  const filteredTransports = transports.filter(function (transport) {
    const matchDeparture =
      departureCity === "" ||
      transport.departureCity.toLowerCase().includes(departureCity.toLowerCase());
    const matchArrival =
      arrivalCity === "" ||
      transport.arrivalCity.toLowerCase().includes(arrivalCity.toLowerCase());
    const matchDate = date === "" || transport.date === date;
    const matchType = type === "" || transport.type === type;

    return matchDeparture && matchArrival && matchDate && matchType;
  });

  return (
    <section>
      <div className="page-header">
        <h1>Transports</h1>
        <p>Recherchez un trajet selon la ville, la date et le type.</p>
      </div>

      <FilterPanel>
        <SearchBar
          value={departureCity}
          onChange={setDepartureCity}
          placeholder="Ville de depart"
        />

        <SearchBar
          value={arrivalCity}
          onChange={setArrivalCity}
          placeholder="Destination"
        />

        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />

        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">Tous les types</option>
          <option value="avion">Avion</option>
          <option value="train">Train</option>
          <option value="bus">Bus</option>
          <option value="voiture">Voiture</option>
        </select>
      </FilterPanel>

      <div className="list">
        {filteredTransports.map(function (transport) {
          return (
            <TransportCard
              key={transport.id}
              transport={transport}
              itinerary={props.itinerary}
              chooseTransport={props.chooseTransport}
            />
          );
        })}
      </div>

      {filteredTransports.length === 0 && (
        <p className="empty-message">Aucun transport ne correspond a votre recherche.</p>
      )}
      {error && <p className="empty-message">{error}</p>}
    </section>
  );
}

export default Transports;
