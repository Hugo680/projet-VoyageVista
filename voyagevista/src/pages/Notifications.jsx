import { Link } from "react-router-dom";
import { useTrip } from "../context/TripContext";

function Notifications() {
  const { notifications, markNotificationRead } = useTrip();

  return (
    <section>
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Messages et confirmations lies a vos reservations.</p>
      </div>

      <div className="list">
        {notifications.map((notification) => (
          <article
            className={`list-card notification-card ${
              notification.read ? "is-read" : ""
            }`}
            key={notification.id}
          >
            <div className="list-card-main">
              <span className="tag">{notification.read ? "lue" : "nouvelle"}</span>
              <h3>{notification.message}</h3>
              {notification.details && (
                <div className="notification-details">
                  <span>Destination: {notification.details.destination}</span>
                  <span>Dates: {notification.details.dates}</span>
                  <span>Total: {notification.details.total} EUR</span>
                  <span>Paiement: {notification.details.paymentMethod}</span>
                </div>
              )}
              <p>{new Date(notification.createdAt).toLocaleString("fr-FR")}</p>
            </div>
            <div className="notification-actions">
              <Link className="button secondary" to="/reservations">
                Voir le dossier
              </Link>
              {!notification.read && (
                <button
                  className="button"
                  onClick={() => markNotificationRead(notification.id)}
                >
                  Marquer comme lue
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {notifications.length === 0 && (
        <p className="empty-message">Aucune notification pour le moment.</p>
      )}
    </section>
  );
}

export default Notifications;
