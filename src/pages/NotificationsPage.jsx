import { useTravel } from "../context/TravelContext";

function NotificationsPage() {
  const { notifications, marquerNotificationCommeLue } = useTravel();

  return (
    <main className="page">
      <h1>Mes notifications</h1>

      {notifications.length === 0 ? (
        <section className="summary-box">
          <p>Aucune notification pour le moment.</p>
        </section>
      ) : (
        notifications.map((notification) => (
          <article
            key={notification.id}
            className={
              notification.lu
                ? "notification-card notification-read"
                : "notification-card notification-unread"
            }
          >
            <p>{notification.message}</p>
            <p>
              <strong>Date :</strong> {notification.date}
            </p>

            <p>
              <strong>Statut :</strong>{" "}
              {notification.lu ? "Lue" : "Non lue"}
            </p>

            {!notification.lu && (
              <button onClick={() => marquerNotificationCommeLue(notification.id)}>
                Marquer comme lue
              </button>
            )}
          </article>
        ))
      )}
    </main>
  );
}

export default NotificationsPage;