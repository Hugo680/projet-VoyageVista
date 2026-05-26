import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [connected, setConnected] = useState(
    localStorage.getItem("voyagevista-user") === "connected"
  );

  function handleLogin(event) {
    event.preventDefault();
    localStorage.setItem("voyagevista-user", "connected");
    setConnected(true);
  }

  return (
    <section className="auth-layout">
      <div className="page-header">
        <h1>Connexion</h1>
        <p>Etape de connexion simulee pour le parcours utilisateur.</p>
      </div>

      <form className="summary-panel auth-panel" onSubmit={handleLogin}>
        <label>
          Email
          <input type="email" defaultValue="client@voyagevista.fr" />
        </label>
        <label>
          Mot de passe
          <input type="password" defaultValue="voyagevista" />
        </label>
        <button className="button" type="submit">
          Se connecter
        </button>
        {connected && (
          <p className="available">
            Connexion reussie. Vous pouvez continuer votre reservation.
          </p>
        )}
        <Link className="button secondary" to="/destinations">
          Continuer vers les destinations
        </Link>
      </form>
    </section>
  );
}

export default Login;
