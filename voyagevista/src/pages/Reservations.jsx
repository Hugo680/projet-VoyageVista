import { useTrip } from "../context/TripContext";

function Reservations() {
  const { reservations } = useTrip();

  return (
    <section>
      <div className="page-header">
        <h1>Mes reservations</h1>
        <p>Historique detaille des voyages valides.</p>
      </div>

      <div className="list">
        {reservations.map((reservation) => (
          <article className="list-card reservation-card" key={reservation.id}>
            <div className="list-card-main">
              <span className="tag">Dossier VV-{reservation.id}</span>
              <h3>{reservation.itinerary.destination?.name}</h3>
              <p>
                Sejour du {reservation.itinerary.startDate} au{" "}
                {reservation.itinerary.endDate}
              </p>
              <p>
                Transport: {reservation.itinerary.transport?.company} -{" "}
                {reservation.itinerary.transport?.departureCity} vers{" "}
                {reservation.itinerary.transport?.arrivalCity}
              </p>
              <p>
                Hebergement: {reservation.itinerary.accommodation?.name} (
                {reservation.totals.nights} nuit(s))
              </p>
              <p>
                Activites:{" "}
                {reservation.itinerary.activities
                  .map((activity) => activity.name)
                  .join(", ") || "aucune"}
              </p>
              {reservation.paymentDetails && (
                <div className="payment-recap">
                  <strong>Paiement</strong>
                  <span>{reservation.paymentDetails.cardLabel}</span>
                  <span>IBAN: {reservation.paymentDetails.ibanLabel}</span>
                  <span>Porteur: {reservation.paymentDetails.holderName}</span>
                  <span>Autorisation: {reservation.paymentDetails.authorizationCode}</span>
                </div>
              )}
            </div>
            <div className="list-card-right">
              <span className="tag">{reservation.status}</span>
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
