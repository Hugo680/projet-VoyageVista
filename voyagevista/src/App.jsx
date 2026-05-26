import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";
import Transports from "./pages/Transports";
import Accommodations from "./pages/Accommodations";
import Activities from "./pages/Activities";
import Itinerary from "./pages/Itinerary";
import Cart from "./pages/Cart";
import Reservations from "./pages/Reservations";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import { TripProvider } from "./context/TripContext";

function App() {
  return (
    <TripProvider>
      <BrowserRouter>
        <Navbar />

        <main className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetails />} />
            <Route path="/transports" element={<Transports />} />
            <Route path="/hebergements" element={<Accommodations />} />
            <Route path="/activites" element={<Activities />} />
            <Route path="/itineraire" element={<Itinerary />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>
      </BrowserRouter>
    </TripProvider>
  );
}

export default App;
