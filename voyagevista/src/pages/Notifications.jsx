function Notifications(props) {
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
          return (
            <article
              className={
                "list-card notification-card " + (notification.read ? "is-read" : "")
              }
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
