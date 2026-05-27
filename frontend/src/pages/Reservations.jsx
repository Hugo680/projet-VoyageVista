import { getPaymentDetailsForReservation } from "../services/paymentStorage";

function Reservations(props) {
  function formatStatus(status) {
    if (status === "confirmee") return "Confirmee";
    if (status === "annulee") return "Annulee";
    return status || "Confirmee";
  }

  function getPaymentInfo(reservation) {
    const payment = getPaymentDetailsForReservation(reservation);

    return {
      label: payment.paymentLabel,
      iban: payment.paymentIbanMasked,
      holder: payment.paymentHolder,
      authorization: payment.paymentAuthorization
    };
  }

  return (
    <section>
      <div className="page-header">
        <h1>Mes reservations</h1>
        <p>Historique detaille des voyages valides.</p>
      </div>

      <div className="list">
        {props.reservations.map(function (reservation) {
          const payment = getPaymentInfo(reservation);

          return (
            <article className="list-card reservation-card" key={reservation.id}>
              <div className="list-card-main">
                <span className="tag">Dossier VV-{reservation.id}</span>
                <h3>{reservation.itinerary.destination.name}</h3>
                <p>
                  Sejour du {reservation.itinerary.startDate} au{" "}
                  {reservation.itinerary.endDate}
                </p>
                <p>
                  Transport: {reservation.itinerary.transport.company} /{" "}
                  {reservation.itinerary.transport.type} -{" "}
                  {reservation.itinerary.transport.departureCity} vers{" "}
                  {reservation.itinerary.transport.arrivalCity}
                </p>
                <p>
                  Hebergement: {reservation.itinerary.accommodation.name} (
                  {reservation.totals.nights} nuit(s))
                </p>
                <p>
                  Activites:{" "}
                  {reservation.itinerary.activities
                    .map(function (activity) {
                      return activity.name;
                    })
                    .join(", ") || "aucune"}
                </p>
                <div className="payment-recap">
                  <strong>Paiement</strong>
                  <span>{payment.label}</span>
                  <span>IBAN: {payment.iban}</span>
                  <span>Porteur: {payment.holder}</span>
                  <span>Autorisation: {payment.authorization}</span>
                </div>
              </div>
              <div className="list-card-right">
                <span className="tag">{formatStatus(reservation.status)}</span>
                <strong>{reservation.totals.total} EUR</strong>
                <span>{new Date(reservation.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
            </article>
          );
        })}
      </div>

      {props.reservations.length === 0 && (
        <p className="empty-message">Aucune reservation pour le moment.</p>
      )}
    </section>
  );
}

export default Reservations;
