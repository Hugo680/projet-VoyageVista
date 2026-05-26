import { useTravel } from "../context/TravelContext";

function ReservationsPage() {
  const { reservations } = useTravel();

  return (
    <main className="page">
      <h1>Mes réservations</h1>

      {reservations.length === 0 ? (
        <section className="summary-box">
          <p>Aucune réservation pour le moment.</p>
        </section>
      ) : (
        reservations.map((reservation) => (
          <article key={reservation.id} className="reservation-card">
            <h2>{reservation.destination.nom}</h2>

            <p>
              <strong>Date de réservation :</strong>{" "}
              {reservation.dateReservation}
            </p>

            <p>
              <strong>Statut :</strong> {reservation.statut}
            </p>

            <p>
              <strong>Transport :</strong>{" "}
              {reservation.transport.type} - {reservation.transport.compagnie}
            </p>

            <p>
              <strong>Hébergement :</strong>{" "}
              {reservation.hebergement.nom}
            </p>

            <p>
              <strong>Nombre de nuits :</strong>{" "}
              {reservation.nombreNuits}
            </p>

            <h3>Activités</h3>

            {reservation.activites.length === 0 ? (
              <p>Aucune activité choisie.</p>
            ) : (
              <ul>
                {reservation.activites.map((activite) => (
                  <li key={activite.id}>
                    {activite.nom} - {activite.prix} €
                  </li>
                ))}
              </ul>
            )}

            <h3>Total : {reservation.prixTotal} €</h3>
          </article>
        ))
      )}
    </main>
  );
}

export default ReservationsPage;