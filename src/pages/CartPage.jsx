import { useNavigate } from "react-router-dom";
import { useTravel } from "../context/TravelContext";

function CartPage() {
  const {
    destination,
    transport,
    hebergement,
    activitesChoisies,
    nombreNuits,
    calculerTotal
  } = useTravel();

  const navigate = useNavigate();

  return (
    <main className="page">
      <h1>Mon panier</h1>

      <section className="summary-box">
        <h2>Résumé complet du voyage</h2>

        <p>
          <strong>Destination :</strong>{" "}
          {destination ? destination.nom : "Non sélectionnée"}
        </p>

        <p>
          <strong>Transport :</strong>{" "}
          {transport
            ? `${transport.type} - ${transport.compagnie} (${transport.prix} €)`
            : "Non sélectionné"}
        </p>

        <p>
          <strong>Hébergement :</strong>{" "}
          {hebergement
            ? `${hebergement.nom} - ${hebergement.prixParNuit} € / nuit`
            : "Non sélectionné"}
        </p>

        <p>
          <strong>Nombre de nuits :</strong> {nombreNuits}
        </p>

        <h3>Activités</h3>

        {activitesChoisies.length === 0 ? (
          <p>Aucune activité ajoutée.</p>
        ) : (
          <ul>
            {activitesChoisies.map((activite) => (
              <li key={activite.id}>
                {activite.nom} - {activite.prix} € - {activite.date}
              </li>
            ))}
          </ul>
        )}

        <h2>Total : {calculerTotal()} €</h2>

        <button onClick={() => navigate("/paiement")}>
          Valider la réservation
        </button>
      </section>
    </main>
  );
}

export default CartPage;