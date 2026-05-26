import { useState } from "react";
import { Link } from "react-router-dom";
import ItinerarySummary from "../components/ItinerarySummary";
import { useTrip } from "../context/TripContext";

function Cart() {
  const { itinerary, validateReservation } = useTrip();
  const [paid, setPaid] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const canValidate =
    itinerary.destination && itinerary.transport && itinerary.accommodation;

  function handlePayment() {
    setPaid(true);
  }

  function handleValidate() {
    const reservation = validateReservation("paiement simule");
    setConfirmed(reservation);
  }

  if (confirmed) {
    return (
      <section className="confirmation-panel">
        <h1>Reservation confirmee</h1>
        <p>
          Votre voyage pour {confirmed.itinerary.destination?.name} est maintenant
          enregistre.
        </p>
        <Link className="button" to="/reservations">
          Voir mes reservations
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="page-header">
        <h1>Panier</h1>
        <p>Verifiez le resume complet du voyage avant validation.</p>
      </div>

      <ItinerarySummary showActions />

      <div className="payment-panel">
        <h2>Paiement simule</h2>
        <p>Aucun paiement reel n'est effectue sur cette maquette.</p>
        <button className="button secondary" disabled={!canValidate} onClick={handlePayment}>
          Payer maintenant
        </button>
        {paid && <p className="available">Paiement simule accepte.</p>}
        <button className="button" disabled={!paid} onClick={handleValidate}>
          Valider la reservation
        </button>
      </div>
    </section>
  );
}

export default Cart;
