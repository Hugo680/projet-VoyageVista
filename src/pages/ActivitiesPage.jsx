import { useState } from "react";
import { activites, destinations } from "../data/mockData";
import { useTravel } from "../context/TravelContext";

function ActivitiesPage() {
  const { ajouterActivite } = useTravel();

  const [destinationFiltre, setDestinationFiltre] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [dateFiltre, setDateFiltre] = useState("");
  const [disponibleSeulement, setDisponibleSeulement] = useState(false);
  const [typeFiltre, setTypeFiltre] = useState("");

  const activitesFiltrees = activites.filter((activite) => {
    const filtreDestination =
      destinationFiltre === "" ||
      activite.destinationId === Number(destinationFiltre);

    const filtrePrix =
      prixMax === "" || activite.prix <= Number(prixMax);

    const filtreDate =
      dateFiltre === "" || activite.date === dateFiltre;

    const filtreDispo =
      !disponibleSeulement || activite.placesDisponibles > 0;

    const filtreType =
      typeFiltre === "" || activite.type === typeFiltre;

    return (
      filtreDestination &&
      filtrePrix &&
      filtreDate &&
      filtreDispo &&
      filtreType
    );
  });

  return (
    <main className="page">
      <h1>Activités disponibles</h1>
      <p className="intro">
        Choisissez des activités de luxe pour compléter votre séjour.
      </p>

      <section className="filters">
        <select
          value={destinationFiltre}
          onChange={(e) => setDestinationFiltre(e.target.value)}
        >
          <option value="">Toutes les destinations</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.nom}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Prix maximum"
          value={prixMax}
          onChange={(e) => setPrixMax(e.target.value)}
        />

        <input
          type="date"
          value={dateFiltre}
          onChange={(e) => setDateFiltre(e.target.value)}
        />

        <select
          value={typeFiltre}
          onChange={(e) => setTypeFiltre(e.target.value)}
        >
          <option value="">Tous les types</option>
          <option value="aventure">Aventure</option>
          <option value="culture">Culture</option>
          <option value="détente">Détente</option>
          <option value="sport">Sport</option>
        </select>

        <label className="checkbox-filter">
          <input
            type="checkbox"
            checked={disponibleSeulement}
            onChange={(e) => setDisponibleSeulement(e.target.checked)}
          />
          Disponibles uniquement
        </label>
      </section>

      <section className="activities-grid">
        {activitesFiltrees.length === 0 ? (
          <p>Aucune activité ne correspond aux filtres.</p>
        ) : (
          activitesFiltrees.map((activite) => {
            const destination = destinations.find(
              (d) => d.id === activite.destinationId
            );

            return (
              <article className="activity-card" key={activite.id}>
                <img src={activite.image} alt={activite.nom} />

                <div className="activity-content">
                  <h2>{activite.nom}</h2>
                  <p>{activite.description}</p>

                  <p>
                    <strong>Destination :</strong> {destination?.nom}
                  </p>

                  <p>
                    <strong>Prix :</strong> {activite.prix} €
                  </p>

                  <p>
                    <strong>Date :</strong> {activite.date}
                  </p>

                  <p>
                    <strong>Places :</strong> {activite.placesDisponibles}
                  </p>

                  <p>
                    <strong>Type :</strong> {activite.type}
                  </p>

                  <button onClick={() => ajouterActivite(activite)}>
                    Ajouter à mon itinéraire
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}

export default ActivitiesPage;