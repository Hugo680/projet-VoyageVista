import { getPaymentDetailsForReservation } from "../services/paymentStorage";

function Notifications(props) {
  function getNotificationReservation(notification) {
    if (!props.reservations || props.reservations.length === 0) {
      return null;
    }

    if (notification.reservationId) {
      const matchingReservation = props.reservations.find(function (reservation) {
        return reservation.id === Number(notification.reservationId);
      });

      if (matchingReservation) {
        return matchingReservation;
      }
    }

    if (notification.type === "reservation") {
      const isCancellation = notification.message.toLowerCase().includes("annul");
      const matchingStatus = props.reservations.find(function (reservation) {
        return isCancellation
          ? reservation.status === "annulee"
          : reservation.status === "confirmee";
      });

      return matchingStatus || props.reservations[0];
    }

    return null;
  }

  function getNotificationDetails(notification) {
    if (notification.details) {
      return notification.details;
    }

    const reservation = getNotificationReservation(notification);

    if (!reservation) {
      return null;
    }

    const lowerMessage = notification.message.toLowerCase();
    const isSpecificConfirmation = lowerMessage.includes("confirmee");
    const isCancellation =
      lowerMessage.includes("annul") ||
      (!isSpecificConfirmation && reservation.status === "annulee");

    const payment = getPaymentDetailsForReservation(reservation);

    return {
      destination: reservation.itinerary.destination.name,
      dates:
        reservation.itinerary.startDate + " au " + reservation.itinerary.endDate,
      total: reservation.totals.total,
      status: isCancellation ? "Annulee" : "Confirmee",
      isCancellation: isCancellation,
      paymentMethod:
        payment.paymentLabel
    };
  }

  function getNotificationMessage(notification) {
    const reservation = getNotificationReservation(notification);

    if (!reservation) {
      return notification.message;
    }

    if (notification.message && !notification.message.includes("a ete confirmee.")) {
      return notification.message;
    }

    const action =
      reservation.status === "annulee" ||
      notification.message.toLowerCase().includes("annul")
        ? "annulee"
        : "confirmee";

    return (
      "Votre reservation pour " +
      reservation.itinerary.destination.name +
      " a ete " +
      action +
      " - dossier VV-" +
      reservation.id
    );
  }

  return (
    <section>
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Messages et confirmations lies a vos reservations.</p>
        {props.notifications.length > 0 && (
          <button className="button secondary" onClick={props.markAllNotificationsRead}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="list">
        {props.notifications.map(function (notification) {
          const details = getNotificationDetails(notification);
          const message = getNotificationMessage(notification);

          return (
            <article
              className={
                "list-card notification-card " + (notification.read ? "is-read" : "")
              }
              key={notification.id}
            >
              <div className="list-card-main">
                <span className="tag">{notification.read ? "Lue" : "Nouvelle"}</span>
                <h3>{message}</h3>
                {details && (
                  <div className="notification-details">
                    <span>Destination: {details.destination}</span>
                    <span>Dates: {details.dates}</span>
                    <span>Total: {details.total} EUR</span>
                    {details.isCancellation ? (
                      <span>Statut: {details.status}</span>
                    ) : (
                      <span>Paiement: {details.paymentMethod}</span>
                    )}
                  </div>
                )}
                <p>{new Date(notification.createdAt).toLocaleString("fr-FR")}</p>
              </div>
              <div className="notification-actions">
                <button
                  className="button secondary"
                  onClick={() => props.goTo("reservations")}
                >
                  Voir le dossier
                </button>
                {!notification.read && (
                  <button
                    className="button"
                    onClick={() => props.markNotificationRead(notification.id)}
                  >
                    Marquer comme lue
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {props.notifications.length === 0 && (
        <p className="empty-message">Aucune notification pour le moment.</p>
      )}
    </section>
  );
}

export default Notifications;
