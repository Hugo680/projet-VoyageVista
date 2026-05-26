import { Link } from "react-router-dom";
import heroImage from "../assets/images/hero-voyage.jpg";

function Home() {
  return (
    <section>
      <div className="hero">
        <div className="hero-content">
          <span className="hero-badge">VoyageVista</span>
          <h1>Composez un voyage complet, fluide et elegant</h1>
          <p>
            Connectez votre destination, votre transport, votre hebergement et
            vos activites dans un itineraire clair avant validation.
          </p>

          <div className="hero-actions">
            <Link className="button secondary" to="/destinations">
              Choisir une destination
            </Link>
            <Link className="button" to="/itineraire">
              Voir mon itineraire
            </Link>
          </div>
        </div>

        <div className="hero-image-card">
          <img src={heroImage} alt="Paysage de voyage" />
          <div className="hero-box">
            <h2>Parcours utilisateur</h2>
            <ul>
              <li>Connexion, choix destination, transport et hebergement.</li>
              <li>Ajout d'activites sans doublons.</li>
              <li>Panier, paiement simule et reservation confirmee.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="home-grid">
        <Link className="home-card" to="/destinations">
          <h3>Destinations</h3>
          <p>Selectionnez le lieu principal du sejour.</p>
        </Link>
        <Link className="home-card" to="/transports">
          <h3>Transports</h3>
          <p>Choisissez le trajet qui rejoint votre destination.</p>
        </Link>
        <Link className="home-card" to="/hebergements">
          <h3>Hebergements</h3>
          <p>Ajoutez un logement et calculez les nuits.</p>
        </Link>
        <Link className="home-card" to="/activites">
          <h3>Activites</h3>
          <p>Completez le sejour avec des experiences.</p>
        </Link>
      </div>
    </section>
  );
}

export default Home;
