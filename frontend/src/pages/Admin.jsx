import { useEffect, useState } from "react";
import {
  cancelReservation,
  createAccommodation,
  createActivity,
  createDestination,
  createTransport,
  deleteAccommodation,
  deleteActivity,
  deleteDestination,
  deleteTransport,
  getAdminAccommodations,
  getAdminActivities,
  getAdminDashboard,
  getAdminDestinations,
  getAdminTransports,
  getAllReservations,
  updateAccommodation,
  updateActivity,
  updateDestination,
  updateTransport,
  uploadImage
} from "../services/api";

const tabs = [
  { id: "destinations", label: "Destinations" },
  { id: "transports", label: "Transports" },
  { id: "hebergements", label: "Hebergements" },
  { id: "activites", label: "Activites" },
  { id: "reservations", label: "Reservations" }
];

const destinationCategories = [
  { value: "plage", label: "Plage" },
  { value: "ville", label: "Ville" },
  { value: "montagne", label: "Montagne" },
  { value: "aventure", label: "Aventure" },
  { value: "detente", label: "Detente" }
];

const accommodationTypes = [
  { value: "Hotel", label: "Hotel" },
  { value: "Villa", label: "Villa" },
  { value: "Appartement", label: "Appartement" },
  { value: "Chalet", label: "Chalet" },
  { value: "Riad", label: "Riad" }
];

const emptyDestination = {
  nom: "",
  pays: "",
  description: "",
  image: "",
  prix_min: "",
  categorie: "plage"
};

const emptyTransport = {
  destination_id: "",
  type: "avion",
  depart: "",
  arrivee: "",
  prix: "",
  places_disponibles: ""
};

const emptyAccommodation = {
  destination_id: "",
  nom: "",
  type: "Hotel",
  prix_nuit: "",
  capacite: "",
  disponible: true,
  image: ""
};

const emptyActivity = {
  destination_id: "",
  nom: "",
  description: "",
  prix: "",
  date_activite: "",
  places_disponibles: "",
  image: ""
};

function toPayload(form, numericFields) {
  const payload = { ...form };

  numericFields.forEach(function (field) {
    if (payload[field] !== "" && payload[field] !== null) {
      payload[field] = Number(payload[field]);
    }
  });

  return payload;
}

function getDestinationName(destinations, destinationId) {
  const destination = destinations.find(function (item) {
    return Number(item.id) === Number(destinationId);
  });

  return destination ? destination.nom : "Destination";
}

function normalizeAdminValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizeAccommodationAdminType(value) {
  const type = normalizeAdminValue(value);

  if (type === "villa") return "Villa";
  if (type === "appartement") return "Appartement";
  if (type === "chalet" || type === "lodge") return "Chalet";
  if (type === "riad" || type === "camp") return "Riad";

  return "Hotel";
}

function AdminSection(props) {
  const [form, setForm] = useState(props.emptyForm);
  const [editingId, setEditingId] = useState(null);

  function updateField(name, value) {
    setForm({ ...form, [name]: value });
  }

  async function updateImageFromFile(event) {
    const file = event.target.files && event.target.files[0];

    if (file) {
      try {
        props.onMessage?.("Envoi de l'image en cours...", "available");
        const result = await uploadImage(file);
        updateField("image", result.image);
        props.onMessage?.(result.message || "Image envoyee.", "available");
      } catch (error) {
        props.onMessage?.(error.message, "unavailable");
      }
    }
  }

  function resetForm() {
    setForm(props.emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = toPayload(form, props.numericFields || []);

    if (editingId) {
      await props.onUpdate({ ...payload, id: editingId });
    } else {
      await props.onCreate(payload);
    }

    resetForm();
  }

  function startEdit(item) {
    const nextForm = {};

    Object.keys(props.emptyForm).forEach(function (field) {
      if (field === "disponible") {
        nextForm[field] = item[field] === true || Number(item[field]) === 1;
      } else if (props.title === "Hebergements" && field === "type") {
        nextForm[field] = normalizeAccommodationAdminType(item[field]);
      } else if (field === "categorie") {
        nextForm[field] = normalizeAdminValue(item[field]);
      } else {
        nextForm[field] = item[field] ?? "";
      }
    });

    setForm(nextForm);
    setEditingId(item.id);
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <h2>{props.title}</h2>
          <p>{props.description}</p>
        </div>
        {editingId && (
          <button className="button secondary" type="button" onClick={resetForm}>
            Annuler la modification
          </button>
        )}
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        {props.fields.map(function (field) {
          if (field.type === "select") {
            return (
              <label key={field.name}>
                {field.label}
                <select
                  value={form[field.name]}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  required={field.required !== false}
                >
                  {field.options.map(function (option) {
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    );
                  })}
                </select>
              </label>
            );
          }

          if (field.type === "checkbox") {
            return (
              <label className="checkbox-label" key={field.name}>
                <input
                  type="checkbox"
                  checked={Boolean(form[field.name])}
                  onChange={(event) => updateField(field.name, event.target.checked)}
                />
                {field.label}
              </label>
            );
          }

          if (field.type === "textarea") {
            return (
              <label className="wide-field" key={field.name}>
                {field.label}
                <textarea
                  value={form[field.name]}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  required={field.required !== false}
                />
              </label>
            );
          }

          if (field.name === "image") {
            return (
              <label key={field.name}>
                {field.label}
                <input
                  type="text"
                  value={form[field.name]}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  placeholder="exemple: bali.jpg"
                  required={field.required !== false}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={updateImageFromFile}
                  required={false}
                />
              </label>
            );
          }

          return (
            <label key={field.name}>
              {field.label}
              <input
                type={field.type || "text"}
                value={form[field.name]}
                onChange={(event) => updateField(field.name, event.target.value)}
                required={field.required !== false}
              />
            </label>
          );
        })}

        <button className="button" type="submit">
          {editingId ? "Modifier" : "Ajouter"}
        </button>
      </form>

      <div className="admin-list">
        {props.items.map(function (item) {
          return (
            <article className="admin-row" key={item.id}>
              <div>{props.renderItem(item)}</div>
              <div className="admin-row-actions">
                <button className="button secondary" type="button" onClick={() => startEdit(item)}>
                  Modifier
                </button>
                <button className="button danger" type="button" onClick={() => props.onDelete(item.id)}>
                  Supprimer
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Admin(props) {
  const [activeTab, setActiveTab] = useState("destinations");
  const [dashboard, setDashboard] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [transports, setTransports] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("available");

  const isAdmin = props.user && props.user.role === "admin";

  useEffect(
    function () {
      if (isAdmin) {
        loadAdminData();
      }
    },
    [isAdmin]
  );

  async function loadAdminData() {
    try {
      const [
        nextDashboard,
        nextDestinations,
        nextTransports,
        nextAccommodations,
        nextActivities,
        nextReservations
      ] = await Promise.all([
        getAdminDashboard(),
        getAdminDestinations(),
        getAdminTransports(),
        getAdminAccommodations(),
        getAdminActivities(),
        getAllReservations()
      ]);

      setDashboard(nextDashboard);
      setDestinations(nextDestinations);
      setTransports(nextTransports);
      setAccommodations(nextAccommodations);
      setActivities(nextActivities);
      setReservations(nextReservations);
    } catch (error) {
      showMessage(error.message, "unavailable");
    }
  }

  function showMessage(text, type) {
    setMessage(text);
    setMessageType(type);
  }

  async function runAdminAction(action, successMessage) {
    try {
      const result = await action();
      await loadAdminData();
      showMessage(result.message || successMessage, "available");
    } catch (error) {
      showMessage(error.message, "unavailable");
    }
  }

  const destinationOptions = [
    { value: "", label: "Choisir une destination" },
    ...destinations.map(function (destination) {
      return { value: destination.id, label: destination.nom };
    })
  ];

  if (!props.connected) {
    return (
      <section>
        <div className="page-header">
          <h1>Administration</h1>
          <p>Vous devez etre connecte pour acceder a l'administration.</p>
        </div>
        <button className="button" onClick={() => props.goTo("connexion")}>
          Aller a la connexion
        </button>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section>
        <div className="page-header">
          <h1>Administration</h1>
          <p>Acces refuse : administrateur uniquement.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="page-header">
        <h1>Administration</h1>
        <p>Gestion des contenus VoyageVista.</p>
      </div>

      {dashboard && (
        <div className="admin-stats">
          {[
            ["Utilisateurs", dashboard.stats?.utilisateurs],
            ["Destinations", dashboard.stats?.destinations],
            ["Transports", dashboard.stats?.transports],
            ["Hebergements", dashboard.stats?.hebergements],
            ["Activites", dashboard.stats?.activites],
            ["Itineraires", dashboard.stats?.itineraires],
            ["Reservations", dashboard.stats?.reservations],
            ["Notifications", dashboard.stats?.notifications],
            ["Confirmees", dashboard.reservations?.confirmees],
            ["Annulees", dashboard.reservations?.annulees],
            ["Revenu total", (dashboard.revenu_total || 0) + " EUR"]
          ].map(function (stat) {
            return (
              <article className="admin-stat-card" key={stat[0]}>
                <span>{stat[0]}</span>
                <strong>{stat[1] ?? 0}</strong>
              </article>
            );
          })}
        </div>
      )}

      <div className="admin-tabs">
        {tabs.map(function (tab) {
          return (
            <button
              className={activeTab === tab.id ? "button" : "button secondary"}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {message && <p className={messageType}>{message}</p>}

      {activeTab === "destinations" && (
        <AdminSection
          title="Destinations"
          description="Ajouter, modifier ou supprimer les destinations."
          emptyForm={emptyDestination}
          fields={[
            { name: "nom", label: "Nom" },
            { name: "pays", label: "Pays" },
            { name: "description", label: "Description", type: "textarea" },
            { name: "image", label: "Image", required: false },
            { name: "prix_min", label: "Prix minimum", type: "number" },
            {
              name: "categorie",
              label: "Categorie",
              type: "select",
              options: destinationCategories
            }
          ]}
          numericFields={["prix_min"]}
          items={destinations}
          onCreate={(payload) => runAdminAction(() => createDestination(payload), "Destination ajoutee.")}
          onUpdate={(payload) => runAdminAction(() => updateDestination(payload), "Destination modifiee.")}
          onDelete={(id) => runAdminAction(() => deleteDestination({ id: id }), "Destination supprimee.")}
          renderItem={(item) => (
            <>
              <strong>{item.nom}</strong>
              <p>{item.pays} - {item.categorie} - {item.prix_min} EUR</p>
            </>
          )}
          onMessage={showMessage}
        />
      )}

      {activeTab === "transports" && (
        <AdminSection
          title="Transports"
          description="Gerer les trajets proposes."
          emptyForm={emptyTransport}
          fields={[
            { name: "destination_id", label: "Destination", type: "select", options: destinationOptions },
            {
              name: "type",
              label: "Type",
              type: "select",
              options: ["avion", "train", "bus", "voiture"].map(function (type) {
                return { value: type, label: type };
              })
            },
            { name: "depart", label: "Depart" },
            { name: "arrivee", label: "Arrivee" },
            { name: "prix", label: "Prix", type: "number" },
            { name: "places_disponibles", label: "Places disponibles", type: "number" }
          ]}
          numericFields={["destination_id", "prix", "places_disponibles"]}
          items={transports}
          onCreate={(payload) => runAdminAction(() => createTransport(payload), "Transport ajoute.")}
          onUpdate={(payload) => runAdminAction(() => updateTransport(payload), "Transport modifie.")}
          onDelete={(id) => runAdminAction(() => deleteTransport({ id: id }), "Transport supprime.")}
          renderItem={(item) => (
            <>
              <strong>{item.depart} vers {item.arrivee}</strong>
              <p>{item.type} - {item.destination_nom} - {item.depart} vers {item.arrivee} - {item.prix} EUR</p>
            </>
          )}
          onMessage={showMessage}
        />
      )}

      {activeTab === "hebergements" && (
        <AdminSection
          title="Hebergements"
          description="Gerer les logements disponibles."
          emptyForm={emptyAccommodation}
          fields={[
            { name: "destination_id", label: "Destination", type: "select", options: destinationOptions },
            { name: "nom", label: "Nom" },
            { name: "type", label: "Type", type: "select", options: accommodationTypes },
            { name: "prix_nuit", label: "Prix par nuit", type: "number" },
            { name: "capacite", label: "Capacite", type: "number" },
            { name: "disponible", label: "Disponible", type: "checkbox", required: false },
            { name: "image", label: "Image", required: false }
          ]}
          numericFields={["destination_id", "prix_nuit", "capacite"]}
          items={accommodations}
          onCreate={(payload) => runAdminAction(() => createAccommodation(payload), "Hebergement ajoute.")}
          onUpdate={(payload) => runAdminAction(() => updateAccommodation(payload), "Hebergement modifie.")}
          onDelete={(id) => runAdminAction(() => deleteAccommodation({ id: id }), "Hebergement supprime.")}
          renderItem={(item) => (
            <>
              <strong>{item.nom}</strong>
              <p>{getDestinationName(destinations, item.destination_id)} - {normalizeAccommodationAdminType(item.type)} - {item.prix_nuit} EUR / nuit</p>
            </>
          )}
          onMessage={showMessage}
        />
      )}

      {activeTab === "activites" && (
        <AdminSection
          title="Activites"
          description="Gerer les experiences proposees."
          emptyForm={emptyActivity}
          fields={[
            { name: "destination_id", label: "Destination", type: "select", options: destinationOptions },
            { name: "nom", label: "Nom" },
            { name: "description", label: "Description", type: "textarea" },
            { name: "prix", label: "Prix", type: "number" },
            { name: "date_activite", label: "Date", type: "date" },
            { name: "places_disponibles", label: "Places disponibles", type: "number" },
            { name: "image", label: "Image", required: false }
          ]}
          numericFields={["destination_id", "prix", "places_disponibles"]}
          items={activities}
          onCreate={(payload) => runAdminAction(() => createActivity(payload), "Activite ajoutee.")}
          onUpdate={(payload) => runAdminAction(() => updateActivity(payload), "Activite modifiee.")}
          onDelete={(id) => runAdminAction(() => deleteActivity({ id: id }), "Activite supprimee.")}
          renderItem={(item) => (
            <>
              <strong>{item.nom}</strong>
              <p>{item.destination_nom} - {item.date_activite} - {item.prix} EUR - {item.places_disponibles} places</p>
            </>
          )}
          onMessage={showMessage}
        />
      )}

      {activeTab === "reservations" && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Reservations</h2>
              <p>Consulter et annuler les reservations.</p>
            </div>
          </div>
          <div className="admin-list">
            {reservations.map(function (reservation) {
              return (
                <article className="admin-row" key={reservation.id}>
                  <div>
                    <strong>Dossier VV-{reservation.id}</strong>
                    <p>
                      {reservation.user_nom} ({reservation.user_email}) - {reservation.destination_nom} - {reservation.statut}
                    </p>
                    <p>{reservation.prix_total} EUR - {new Date(reservation.date_reservation).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="admin-row-actions">
                    {reservation.statut === "annulee" ? (
                      <span className="tag">Reservation annulee</span>
                    ) : (
                      <button
                        className="button danger"
                        onClick={() =>
                          runAdminAction(
                            () => cancelReservation({ reservation_id: reservation.id }),
                            "Reservation annulee."
                          )
                        }
                        type="button"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
}

export default Admin;
