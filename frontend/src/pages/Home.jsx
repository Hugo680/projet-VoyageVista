import TravelMap from "../components/TravelMap";

function Home(props) {
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
            <button className="button secondary" onClick={() => props.goTo("destinations")}>
              Choisir une destination
            </button>
            <button className="button" onClick={() => props.goTo("itineraire")}>
              Voir mon itineraire
            </button>
          </div>
        </div>

        <TravelMap itinerary={props.itinerary} />
      </div>

      <div className="home-grid">
        <button className="home-card" onClick={() => props.goTo("destinations")}>
          <h3>Destinations</h3>
          <p>Selectionnez le lieu principal du sejour.</p>
        </button>
        <button className="home-card" onClick={() => props.goTo("transports")}>
          <h3>Transports</h3>
          <p>Choisissez le trajet qui rejoint votre destination.</p>
        </button>
        <button className="home-card" onClick={() => props.goTo("hebergements")}>
          <h3>Hebergements</h3>
          <p>Ajoutez un logement et calculez les nuits.</p>
        </button>
        <button className="home-card" onClick={() => props.goTo("activites")}>
          <h3>Activites</h3>
          <p>Completez le sejour avec des experiences.</p>
        </button>
      </div>
    </section>
  );
}

export default Home;