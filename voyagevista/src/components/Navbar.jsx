import { NavLink, Link } from "react-router-dom";
import { useTrip } from "../context/TripContext";

function Navbar() {
  const { itinerary, notifications } = useTrip();
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const cartCount =
    Number(Boolean(itinerary.destination)) +
    Number(Boolean(itinerary.transport)) +
    Number(Boolean(itinerary.accommodation)) +
    itinerary.activities.length;

  return (
    <header className="navbar">
      <Link className="logo" to="/">
        <img
          className="logo-mark"
          src="/voyagevista-logo-premium-cropped.png"
          alt="VoyageVista"
        />
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/connexion">Connexion</NavLink>
        <NavLink to="/destinations">Destinations</NavLink>
        <NavLink to="/transports">Transports</NavLink>
        <NavLink to="/hebergements">Hebergements</NavLink>
        <NavLink to="/activites">Activites</NavLink>
        <NavLink to="/itineraire">Itineraire</NavLink>
        <NavLink to="/reservations">Reservations</NavLink>
        <NavLink to="/notifications">Notifications {unreadCount}</NavLink>
        <NavLink className="nav-cart" to="/panier">
          Panier {cartCount}
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
