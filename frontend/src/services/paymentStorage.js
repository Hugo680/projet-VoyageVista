export const PAYMENT_DETAILS_KEY = "voyagevista_payment_details";

export function getStoredPaymentDetails(reservationId) {
  try {
    const stored = JSON.parse(localStorage.getItem(PAYMENT_DETAILS_KEY) || "{}");
    return stored[String(reservationId)] || null;
  } catch (error) {
    return null;
  }
}

export function saveStoredPaymentDetails(reservationId, paymentDetails) {
  const key = String(reservationId);
  let stored = {};

  try {
    stored = JSON.parse(localStorage.getItem(PAYMENT_DETAILS_KEY) || "{}");
  } catch (error) {
    stored = {};
  }

  stored[key] = {
    paymentLabel: paymentDetails.paymentLabel,
    paymentIbanMasked: paymentDetails.paymentIbanMasked,
    paymentHolder: paymentDetails.paymentHolder,
    paymentAuthorization: paymentDetails.paymentAuthorization
  };

  localStorage.setItem(PAYMENT_DETAILS_KEY, JSON.stringify(stored));
  return stored[key];
}

export function getPaymentDetailsForReservation(reservation) {
  const stored = getStoredPaymentDetails(reservation.id);

  return {
    paymentLabel:
      stored?.paymentLabel ||
      reservation.paymentLabel ||
      "Carte bleue se terminant par 1234",
    paymentIbanMasked:
      stored?.paymentIbanMasked ||
      reservation.paymentIban ||
      "FR76 300 **** **** ****",
    paymentHolder:
      stored?.paymentHolder ||
      reservation.paymentHolder ||
      "Non renseigne",
    paymentAuthorization:
      stored?.paymentAuthorization ||
      reservation.paymentAuthorization ||
      "AUTH-" + reservation.id
  };
}
