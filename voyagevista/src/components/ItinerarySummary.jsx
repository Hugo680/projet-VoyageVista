import { Link } from "react-router-dom";
import { useTrip } from "../context/TripContext";

function ItinerarySummary({ showActions = true }) {
  const {
    itinerary,
    totals,
    removeActivity,
    removeDestination,
    removeTransport,
    removeAccommodation,
    setStayDates
  } = useTrip();

  return (
    <div className="summary-layout">
      <section className="summary-panel">
        <h2>Sejour</h2>
        <div className="date-grid">
          <label>
            Depart
            <input
              type="date"
              value={itinerary.startDate}
              onChange={(event) =>
                setStayDates(event.target.value, itinerary.endDate)
              }
            />
          </label>
          <label>
            Retour
            <input
              type="date"
              value={itinerary.endDate}
              onChange={(event) =>
                setStayDates(itinerary.startDate, event.target.value)
              }
            />
          </label>
        </div>
        <p>{totals.nights} nuit(s)</p>
      </section>

      <section className="summary-panel">
        <h2>Choix du voyage</h2>
        <div className="summary-row">
          <span>Destination</span>
          <strong>{itinerary.destination?.name ?? "Non choisie"}</strong>
          {showActions && itinerary.destination && (
            <button className="text-button" onClick={removeDestination}>
              Retirer
            </button>
          )}
        </div>
        <div className="summary-row">
          <span>Transport</span>
          <strong>
            {itinerary.transport
              ? `${itinerary.transport.departureCity} - ${itinerary.transport.arrivalCity}`
              : "Non choisi"}
          </strong>
          {showActions && itinerary.transport && (
            <button className="text-button" onClick={removeTransport}>
              Retirer
            </button>
          )}
        </div>
        <div className="summary-row">
          <span>Hebergement</span>
          <strong>{itinerary.accommodation?.name ?? "Non choisi"}</strong>
          {showActions && itinerary.accommodation && (
            <button className="text-button" onClick={removeAccommodation}>
              Retirer
            </button>
          )}
        </div>
      </section>

      <section className="summary-panel">
        <h2>Activites</h2>
        {itinerary.activities.length === 0 && <p>Aucune activite ajoutee.</p>}
        {itinerary.activities.map((activity) => (
          <div className="summary-row" key={activity.id}>
            <span>{activity.name}</span>
            <strong>{activity.price} EUR</strong>
            {showActions && (
              <button className="text-button" onClick={() => removeActivity(activity.id)}>
                Retirer
              </button>
            )}
          </div>
        ))}
      </section>

      <section className="summary-panel total-panel">
        <h2>Prix total</h2>
        <div className="summary-row">
          <span>Transport</span>
          <strong>{totals.transportTotal} EUR</strong>
        </div>
        <div className="summary-row">
          <span>Hebergement</span>
          <strong>{totals.accommodationTotal} EUR</strong>
        </div>
        <div className="summary-row">
          <span>Activites</span>
          <strong>{totals.activitiesTotal} EUR</strong>
        </div>
        <div className="summary-row grand-total">
          <span>Total general</span>
          <strong>{totals.total} EUR</strong>
        </div>

        {showActions && (
          <Link className="button" to="/panier">
            Aller au panier
          </Link>
        )}
      </section>
    </div>
  );
}

export default ItinerarySummary;
