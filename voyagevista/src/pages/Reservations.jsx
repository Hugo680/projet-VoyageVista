import { useTrip } from "../context/TripContext";

function Reservations() {
  const { reservations } = useTrip();

  return (
    <section>
      <div className="page-header">
        <h1>Mes reservations</h1>
        <p>Historique des voyages valides.</p>
      </div>

      <div className="list">
        {reservations.map((reservation) => (
          <article className="list-card" key={reservation.id}>
            <div>
              <span className="tag">{reservation.status}</span>
              <h3>{reservation.itinerary.destination?.name}</h3>
              <p>
                {reservation.itinerary.startDate} au {reservation.itinerary.endDate}
              </p>
              <p>
                Transport: {reservation.itinerary.transport?.company} -{" "}
                Hebergement: {reservation.itinerary.accommodation?.name}
              </p>
              <p>
                Activites:{" "}
                {reservation.itinerary.activities.map((activity) => activity.name).join(", ") ||
                  "aucune"}
              </p>
            </div>
            <div className="list-card-right">
              <strong>{reservation.totals.total} EUR</strong>
              <span>{new Date(reservation.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
          </article>
        ))}
      </div>

      {reservations.length === 0 && (
        <p className="empty-message">Aucune reservation pour le moment.</p>
      )}
    </section>
  );
}

export default Reservations;
