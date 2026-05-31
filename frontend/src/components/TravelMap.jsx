import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAccommodations, getDestinations } from "../services/api";

const destinationColors = ["#173f35", "#b68a35", "#7a2333", "#25635a", "#8d6720"];

function hasCoordinates(item) {
  return Number.isFinite(item.latitude) && Number.isFinite(item.longitude) && item.latitude !== 0 && item.longitude !== 0;
}

function TravelMap() {
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef([]);
  const [destinations, setDestinations] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState(null);
  const [error, setError] = useState("");

  useEffect(function () {
    async function loadMapData() {
      try {
        const [nextDestinations, nextAccommodations] = await Promise.all([
          getDestinations(),
          getAccommodations()
        ]);

        setDestinations(nextDestinations.filter(hasCoordinates));
        setAccommodations(nextAccommodations.filter(hasCoordinates));
      } catch (apiError) {
        setError(apiError.message);
      }
    }

    loadMapData();
  }, []);

  useEffect(function () {
    if (!mapElement.current || mapRef.current) {
      return;
    }

    mapRef.current = L.map(mapElement.current, {
      scrollWheelZoom: false,
      zoomControl: false
    }).setView([28, 22], 2);

    L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(mapRef.current);
  }, []);

  useEffect(
    function () {
      if (!mapRef.current || destinations.length === 0) {
        return;
      }

      layersRef.current.forEach(function (layer) {
        layer.remove();
      });
      layersRef.current = [];

      const bounds = [];

      destinations.forEach(function (destination, index) {
        const color = destinationColors[index % destinationColors.length];
        const position = [destination.latitude, destination.longitude];
        const hotelCount = accommodations.filter(function (accommodation) {
          return accommodation.destinationId === destination.id;
        }).length;

        const countryCircle = L.circle(position, {
          radius: selectedDestinationId === destination.id ? 260000 : 170000,
          color: color,
          fillColor: color,
          fillOpacity: selectedDestinationId === destination.id ? 0.22 : 0.12,
          weight: selectedDestinationId === destination.id ? 3 : 2
        }).addTo(mapRef.current);

        countryCircle.bindPopup(
          "<strong>" + destination.name + "</strong><br>" +
          destination.country + "<br>" +
          hotelCount + " hebergement(s) disponible(s)"
        );

        countryCircle.on("click", function () {
          setSelectedDestinationId(destination.id);
          mapRef.current.flyTo(position, 8, { duration: 0.9 });
          countryCircle.openPopup();
        });

        layersRef.current.push(countryCircle);
        bounds.push(position);
      });

      accommodations.forEach(function (accommodation) {
        const position = [accommodation.latitude, accommodation.longitude];
        const marker = L.circleMarker(position, {
          radius: selectedDestinationId === accommodation.destinationId ? 8 : 6,
          color: "#fffdf8",
          fillColor: "#7a2333",
          fillOpacity: 0.95,
          weight: 2
        }).addTo(mapRef.current);

        marker.bindPopup(
          "<strong>" + accommodation.name + "</strong><br>" +
          accommodation.destinationName + "<br>" +
          accommodation.type + " - " + accommodation.pricePerNight + " EUR / nuit"
        );

        marker.on("click", function () {
          setSelectedDestinationId(accommodation.destinationId);
          mapRef.current.flyTo(position, 12, { duration: 0.8 });
          marker.openPopup();
        });

        layersRef.current.push(marker);
        bounds.push(position);
      });

      if (bounds.length > 0 && !selectedDestinationId) {
        mapRef.current.fitBounds(bounds, { padding: [24, 24] });
      }
    },
    [destinations, accommodations, selectedDestinationId]
  );

  function focusDestination(destination) {
    setSelectedDestinationId(destination.id);

    if (mapRef.current) {
      mapRef.current.flyTo([destination.latitude, destination.longitude], 8, { duration: 0.9 });
    }
  }

  return (
    <div className="travel-map-panel">
      <div className="travel-map-header">
        <div>
          <span className="hero-badge">Carte interactive</span>
          <h2>Destinations disponibles</h2>
        </div>
      </div>

      <div className="travel-map" ref={mapElement}></div>

      <div className="travel-map-destinations">
        {destinations.map(function (destination) {
          return (
            <button
              className={selectedDestinationId === destination.id ? "map-chip active" : "map-chip"}
              key={destination.id}
              onClick={function () {
                focusDestination(destination);
              }}
            >
              {destination.name}
            </button>
          );
        })}
      </div>

      {error && <p className="map-error">{error}</p>}
    </div>
  );
}

export default TravelMap;