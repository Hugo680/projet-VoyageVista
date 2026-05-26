import { useNavigate } from "react-router-dom";
import { useTravel } from "../context/TravelContext";

function PaymentPage() {
  const { validerReservation, calculerTotal } = useTravel();
  const navigate = useNavigate();

  const payerMaintenant = (e) => {
    e.preventDefault();

    const reservation = validerReservation();

    if (reservation) {
      alert("Paiement simulé accepté. Votre réservation est confirmée !");
      navigate("/mes-reservations");
    }
  };

  return (
    <main className="page">
      <h1>Paiement simulé</h1>

      <section className="summary-box">
        <h2>Total à payer : {calculerTotal()} €</h2>

        <form className="payment-form" onSubmit={payerMaintenant}>
          <label>
            Nom sur la carte
            <input type="text" placeholder="Mathys Dupont" required />
          </label>

          <label>
            Numéro de carte
            <input type="text" placeholder="0000 0000 0000 0000" required />
          </label>

          <label>
            Date d’expiration
            <input type="text" placeholder="12/29" required />
          </label>

          <label>
            CVV
            <input type="text" placeholder="123" required />
          </label>

          <button type="submit">Payer maintenant</button>
        </form>
      </section>
    </main>
  );
}

export default PaymentPage;