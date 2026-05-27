function Login(props) {
  function handleLogin(event) {
    event.preventDefault();
    props.setConnected(true);
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
        {props.connected && (
          <p className="available">
            Connexion reussie. Vous pouvez continuer votre reservation.
          </p>
        )}
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
