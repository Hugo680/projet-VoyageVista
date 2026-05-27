import { useState } from "react";
import { loginUser } from "../services/api";

function Login(props) {
  const [email, setEmail] = useState("hugo@test.com");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await loginUser({ email: email, password: password });
      await props.onLoginSuccess(result.user);
      setMessage("Connexion reussie. Vous pouvez continuer votre reservation.");
      props.goTo("home");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="page-header">
        <h1>Connexion</h1>
        <p>Connectez-vous pour reserver et retrouver vos voyages.</p>
      </div>

      <form className="summary-panel auth-panel" onSubmit={handleLogin}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        {message && <p className={props.connected ? "available" : "unavailable"}>{message}</p>}
        {props.connected && props.user && <p>Connecte en tant que {props.user.email}</p>}
        <button
          className="button secondary"
          type="button"
          onClick={() => props.goTo("destinations")}
        >
          Continuer vers les destinations
        </button>
      </form>
    </section>
  );
}

export default Login;
