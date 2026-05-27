function Navbar(props) {
  const unreadCount = props.notifications.filter(function (notification) {
    return notification.read === false;
  }).length;

  const cartCount =
    Number(Boolean(props.itinerary.destination)) +
    Number(Boolean(props.itinerary.transport)) +
    Number(Boolean(props.itinerary.accommodation)) +
    props.itinerary.activities.length;

  function getClass(pageName) {
    return props.page === pageName ? "active" : "";
  }

  return (
    <header className="navbar">
      <button className="logo logo-button" onClick={() => props.goTo("home")}>
        <img
          className="logo-mark"
          src="/voyagevista-logo-premium-cropped.png"
          alt="VoyageVista"
        />
      </button>

      <nav className="nav-links">
        <button className={getClass("home")} onClick={() => props.goTo("home")}>
          Accueil
        </button>
        <button
          className={getClass("connexion")}
          onClick={() => props.goTo("connexion")}
        >
          {props.connected ? props.user?.name || "Compte" : "Connexion"}
        </button>
        <button
          className={getClass("destinations")}
          onClick={() => props.goTo("destinations")}
        >
          Destinations
        </button>
        <button
          className={getClass("transports")}
          onClick={() => props.goTo("transports")}
        >
          Transports
        </button>
        <button
          className={getClass("hebergements")}
          onClick={() => props.goTo("hebergements")}
        >
          Hebergements
        </button>
        <button
          className={getClass("activites")}
          onClick={() => props.goTo("activites")}
        >
          Activites
        </button>
        <button
          className={getClass("itineraire")}
          onClick={() => props.goTo("itineraire")}
        >
          Itineraire
        </button>
        {props.connected && (
          <button
            className={getClass("reservations")}
            onClick={() => props.goTo("reservations")}
          >
            Reservations
          </button>
        )}
        {props.connected && (
          <button
            className={getClass("notifications")}
            onClick={() => props.goTo("notifications")}
          >
            Notifications {unreadCount}
          </button>
        )}
        {props.user && props.user.role === "admin" && (
          <button
            className={getClass("admin")}
            onClick={() => props.goTo("admin")}
          >
            Admin
          </button>
        )}
        <button className="nav-cart" onClick={() => props.goTo("panier")}>
          Panier {cartCount}
        </button>
        {props.connected && (
          <button onClick={props.logout}>
            Deconnexion
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
