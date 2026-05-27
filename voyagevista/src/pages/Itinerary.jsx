import ItinerarySummary from "../components/ItinerarySummary";

function Itinerary(props) {
  return (
    <section>
      <div className="page-header">
        <h1>Mon itineraire</h1>
        <p>Retrouvez votre destination, transport, hebergement et activites.</p>
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

      <div className="quick-actions">
        <button className="button secondary" onClick={() => props.goTo("destinations")}>
          Choisir une destination
        </button>
        <button className="button secondary" onClick={() => props.goTo("transports")}>
          Choisir un transport
        </button>
        <button className="button secondary" onClick={() => props.goTo("hebergements")}>
          Choisir un hebergement
        </button>
        <button className="button secondary" onClick={() => props.goTo("activites")}>
          Ajouter des activites
        </button>
      </div>
    </section>
  );
}

export default Itinerary;
