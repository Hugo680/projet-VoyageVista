import { useTrip } from "../context/TripContext";

function Notifications() {
  const { notifications, markNotificationRead } = useTrip();

  return (
    <section>
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Messages lies a vos reservations.</p>
      </div>

      <div className="list">
        {notifications.map((notification) => (
          <article
            className={`list-card ${notification.read ? "is-read" : ""}`}
            key={notification.id}
          >
            <div>
              <span className="tag">{notification.read ? "lue" : "nouvelle"}</span>
              <h3>{notification.message}</h3>
              <p>{new Date(notification.createdAt).toLocaleString("fr-FR")}</p>
            </div>
            {!notification.read && (
              <button
                className="button secondary"
                onClick={() => markNotificationRead(notification.id)}
              >
                Marquer comme lue
              </button>
            )}
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
