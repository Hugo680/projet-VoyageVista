import { useTravel } from "../context/TravelContext";

function ItineraryPage() {
  const {
    destination,
    transport,
    hebergement,
    activitesChoisies,
    retirerActivite,
    nombreNuits,
    setNombreNuits,
    calculerTotal,
    remplirSejourFictif
  } = useTravel();

  return (
    <main className="page">
      <h1>Mon itinéraire</h1>
      <button onClick={remplirSejourFictif}>
        Utiliser un séjour fictif
      </button>

      <section className="summary-box">
        <h2>Destination</h2>
        {destination ? <p>{destination.nom}</p> : <p>Aucune destination sélectionnée.</p>}
      </section>

      <section className="summary-box">
        <h2>Transport</h2>
        {transport ? (
          <p>{transport.type} - {transport.compagnie} : {transport.prix} €</p>
        ) : (
          <p>Aucun transport sélectionné.</p>
        )}
      </section>

      <section className="summary-box">
        <h2>Hébergement</h2>
        {hebergement ? (
          <>
            <p>{hebergement.nom}</p>
            <p>{hebergement.prixParNuit} € / nuit</p>

            <label>
              Nombre de nuits :
              <input
                type="number"
                min="1"
                value={nombreNuits}
                onChange={(e) => setNombreNuits(Number(e.target.value))}
              />
            </label>
          </>
        ) : (
          <p>Aucun hébergement sélectionné.</p>
        )}
      </section>

      <section className="summary-box">
        <h2>Activités choisies</h2>

        {activitesChoisies.length === 0 ? (
          <p>Aucune activité ajoutée.</p>
        ) : (
          activitesChoisies.map((activite) => (
            <div key={activite.id} className="selected-activity">
              <p>
                {activite.nom} - {activite.prix} € - {activite.date}
              </p>

              <button onClick={() => retirerActivite(activite.id)}>
                Retirer
              </button>
            </div>
          ))
        )}
      </section>

      <section className="total-box">
        <h2>Total : {calculerTotal()} €</h2>
      </section>
    </main>
  );
}

export default ItineraryPage;