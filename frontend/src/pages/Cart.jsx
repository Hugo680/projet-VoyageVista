import { useState } from "react";
import ItinerarySummary from "../components/ItinerarySummary";
import { saveStoredPaymentDetails } from "../services/paymentStorage";

const initialPayment = {
  holderName: "",
  cardNumber: "",
  expiry: "12/29",
  cvv: "",
  iban: "",
  billingEmail: ""
};

function maskCard(cardNumber) {
  const digits = cardNumber.replace(/\D/g, "");
  const lastFour = digits.slice(-4) || "0000";
  return "Carte bleue se terminant par " + lastFour;
}

function maskIban(iban) {
  const compactIban = iban.replace(/\s/g, "");
  const start = compactIban.slice(0, 7);
  const formattedStart = start.length > 4 ? start.slice(0, 4) + " " + start.slice(4) : start;
  return formattedStart ? formattedStart + " **** **** ****" : "FR76 300 **** **** ****";
}

function Cart(props) {
  const [payment, setPayment] = useState(initialPayment);
  const [paid, setPaid] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [message, setMessage] = useState("");
  const [validating, setValidating] = useState(false);

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

  async function handleValidate() {
    const enteredPaymentDetails = {
      holderName: payment.holderName,
      cardLabel: maskCard(payment.cardNumber),
      ibanLabel: maskIban(payment.iban),
      billingEmail: payment.billingEmail,
      cvvChecked: payment.cvv.length >= 3
    };

    setValidating(true);
    setMessage("");

    try {
      const reservation = await props.validateReservation(enteredPaymentDetails);
      const paymentDetails = saveStoredPaymentDetails(reservation.id, {
        paymentLabel: enteredPaymentDetails.cardLabel,
        paymentIbanMasked: enteredPaymentDetails.ibanLabel,
        paymentHolder: enteredPaymentDetails.holderName || "Non renseigne",
        paymentAuthorization: "AUTH-" + reservation.id
      });

      setConfirmed({ ...reservation, paymentDetails: paymentDetails });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setValidating(false);
    }
  }

  if (confirmed) {
    return (
      <section className="confirmation-panel">
        <span className="tag">Dossier VV-{confirmed.id}</span>
        <h1>Reservation confirmee</h1>
        <p>
          Votre voyage pour {confirmed.itinerary.destination.name} est maintenant
          enregistre avec le paiement simule {confirmed.paymentDetails.paymentLabel}.
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
            disabled={!paid || !canValidate || validating}
            type="button"
            onClick={handleValidate}
          >
            {validating ? "Validation..." : "Valider la reservation"}
          </button>
          {message && <p className="unavailable">{message}</p>}
        </div>
      </form>
    </section>
  );
}

export default Cart;
