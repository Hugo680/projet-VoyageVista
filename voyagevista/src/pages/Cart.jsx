import { useState } from "react";
import ItinerarySummary from "../components/ItinerarySummary";

const initialPayment = {
  holderName: "ILIAN MARTIN",
  cardNumber: "4970 0000 0000 1234",
  expiry: "12/29",
  cvv: "123",
  iban: "FR76 3000 6000 0112 3456 7890 189",
  billingEmail: "client@voyagevista.fr"
};

function maskCard(cardNumber) {
  const digits = cardNumber.replace(/\D/g, "");
  const lastFour = digits.slice(-4) || "0000";
  return "Carte bleue se terminant par " + lastFour;
}

function Cart(props) {
  const [payment, setPayment] = useState(initialPayment);
  const [paid, setPaid] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const canValidate =
    props.itinerary.destination &&
    props.itinerary.transport &&
    props.itinerary.accommodation;

  function updatePayment(field, value) {
    setPaid(false);
    setPayment({ ...payment, [field]: value });
  }

  function handlePayment(event) {
    event.preventDefault();
    setPaid(true);
  }

  function handleValidate() {
    const paymentDetails = {
      holderName: payment.holderName,
      cardLabel: maskCard(payment.cardNumber),
      ibanLabel: payment.iban ? payment.iban.slice(0, 8) + " **** **** ****" : "",
      billingEmail: payment.billingEmail,
      cvvChecked: payment.cvv.length >= 3,
      authorizationCode: "AUTH-" + Date.now().toString().slice(-6)
    };

    const reservation = props.validateReservation(paymentDetails);
    setConfirmed(reservation);
  }

  if (confirmed) {
    return (
      <section className="confirmation-panel">
        <span className="tag">Dossier VV-{confirmed.id}</span>
        <h1>Reservation confirmee</h1>
        <p>
          Votre voyage pour {confirmed.itinerary.destination.name} est maintenant
          enregistre avec le paiement simule {confirmed.paymentDetails.cardLabel}.
        </p>
        <button className="button" onClick={() => props.goTo("reservations")}>
          Voir mes reservations
        </button>
      </section>
    );
  }

  return (
    <section>
      <div className="page-header">
        <h1>Panier</h1>
        <p>Verifiez, modifiez puis validez votre reservation.</p>
      </div>

      <ItinerarySummary
        itinerary={props.itinerary}
        totals={props.totals}
        setStayDates={props.setStayDates}
        removeDestination={props.removeDestination}
        removeTransport={props.removeTransport}
        removeAccommodation={props.removeAccommodation}
        removeActivity={props.removeActivity}
        goTo={props.goTo}
        showActions={true}
      />

      <form className="payment-panel" onSubmit={handlePayment}>
        <div className="payment-heading">
          <div>
            <span className="tag">Paiement simule</span>
            <h2>Informations de paiement</h2>
          </div>
          <strong>{props.totals.total} EUR</strong>
        </div>

        <div className="payment-grid">
          <label>
            Nom du porteur
            <input
              value={payment.holderName}
              onChange={(event) => updatePayment("holderName", event.target.value)}
              required
            />
          </label>

          <label>
            Numero de carte
            <input
              value={payment.cardNumber}
              onChange={(event) => updatePayment("cardNumber", event.target.value)}
              required
            />
          </label>

          <label>
            Expiration
            <input
              value={payment.expiry}
              onChange={(event) => updatePayment("expiry", event.target.value)}
              required
            />
          </label>

          <label>
            CVV
            <input
              value={payment.cvv}
              onChange={(event) => updatePayment("cvv", event.target.value)}
              maxLength="4"
              required
            />
          </label>

          <label className="wide-field">
            IBAN de facturation
            <input
              value={payment.iban}
              onChange={(event) => updatePayment("iban", event.target.value)}
            />
          </label>

          <label className="wide-field">
            Email de confirmation
            <input
              type="email"
              value={payment.billingEmail}
              onChange={(event) => updatePayment("billingEmail", event.target.value)}
              required
            />
          </label>
        </div>

        <p className="fine-print">
          Simulation uniquement: le CVV n'est pas conserve dans la reservation.
        </p>

        <div className="payment-actions">
          <button className="button secondary" disabled={!canValidate} type="submit">
            Payer maintenant
          </button>
          {paid && <p className="available">Paiement simule accepte.</p>}
          <button
            className="button"
            disabled={!paid || !canValidate}
            type="button"
            onClick={handleValidate}
          >
            Valider la reservation
          </button>
        </div>
      </form>
    </section>
  );
}

export default Cart;
