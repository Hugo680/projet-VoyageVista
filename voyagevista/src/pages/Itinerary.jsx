import { Link } from "react-router-dom";
import ItinerarySummary from "../components/ItinerarySummary";

function Itinerary() {
  return (
    <section>
      <div className="page-header">
        <h1>Mon itineraire</h1>
        <p>Retrouvez votre destination, transport, hebergement et activites.</p>
      </div>

      <ItinerarySummary />

      <div className="quick-actions">
        <Link className="button secondary" to="/destinations">Choisir une destination</Link>
        <Link className="button secondary" to="/transports">Choisir un transport</Link>
        <Link className="button secondary" to="/hebergements">Choisir un hebergement</Link>
        <Link className="button secondary" to="/activites">Ajouter des activites</Link>
      </div>
    </section>
  );
}

export default Itinerary;
