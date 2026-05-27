import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

function Login(props) {
  const [mode, setMode] = useState("login");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("hugo@test.com");
  const [password, setPassword] = useState("123456");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setMessageType("");

    if (nextMode === "register") {
      setPassword("");
      setConfirmPassword("");
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const result = await loginUser({ email: email, password: password });
      await props.onLoginSuccess(result.user);
      setMessage("Connexion reussie. Vous pouvez continuer votre reservation.");
      setMessageType("success");
      props.goTo("home");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (nom.trim() === "" || email.trim() === "" || password === "") {
      setMessage("Tous les champs sont obligatoires.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        nom: nom.trim(),
        email: email.trim(),
        password: password
      });

      setMode("login");
      setPassword("");
      setConfirmPassword("");
      setMessage("Compte cree avec succes, vous pouvez vous connecter.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="page-header">
        <h1>{mode === "login" ? "Connexion" : "Inscription"}</h1>
        <p>
          {mode === "login"
            ? "Connectez-vous pour reserver et retrouver vos voyages."
            : "Creez un compte client pour preparer votre voyage."}
        </p>
      </div>

      <form
        className="summary-panel auth-panel"
        onSubmit={mode === "login" ? handleLogin : handleRegister}
      >
        <div className="auth-tabs">
          <button
            className={mode === "login" ? "button" : "button secondary"}
            type="button"
            onClick={() => switchMode("login")}
          >
            Se connecter
          </button>
          <button
            className={mode === "register" ? "button" : "button secondary"}
            type="button"
            onClick={() => switchMode("register")}
          >
            Creer un compte
          </button>
        </div>

        {mode === "register" && (
          <label>
            Nom
            <input
              type="text"
              value={nom}
              onChange={(event) => setNom(event.target.value)}
              required
            />
          </label>
        )}

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

        {mode === "register" && (
          <label>
            Confirmation du mot de passe
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
        )}

        <button className="button" type="submit" disabled={loading}>
          {loading
            ? mode === "login"
              ? "Connexion..."
              : "Creation..."
            : mode === "login"
              ? "Se connecter"
              : "Creer mon compte"}
        </button>

        {message && (
          <p className={messageType === "success" ? "available" : "unavailable"}>
            {message}
          </p>
        )}

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
