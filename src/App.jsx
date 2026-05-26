import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { TravelProvider } from "./context/TravelContext";
import ActivitiesPage from "./pages/ActivitiesPage";
import ItineraryPage from "./pages/ItineraryPage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import ReservationsPage from "./pages/ReservationsPage";
import NotificationsPage from "./pages/NotificationsPage";

function App() {
  return (
    <TravelProvider>
      <BrowserRouter>
        <nav className="navbar">
          <h2>VoyageVista</h2>

          <div>
            <Link to="/activites">Activités</Link>
            <Link to="/itineraire">Mon itinéraire</Link>
            <Link to="/panier">Panier</Link>
            <Link to="/mes-reservations">Mes réservations</Link>
            <Link to="/notifications">Notifications</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ActivitiesPage />} />
          <Route path="/activites" element={<ActivitiesPage />} />
          <Route path="/itineraire" element={<ItineraryPage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/paiement" element={<PaymentPage />} />
          <Route path="/mes-reservations" element={<ReservationsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </BrowserRouter>
    </TravelProvider>
  );
}

export default App;