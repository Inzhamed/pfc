import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icons = {
  critique: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  modere: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  mineur: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
};

function GraviteBadge({ niveau }) {
  const styles = {
    critique: "bg-red-500 text-white",
    modere: "bg-orange-500 text-white",
    mineur: "bg-green-500 text-white",
  };
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        styles[niveau] || "bg-gray-300"
      }`}
    >
      {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
    </span>
  );
}

export default function Map() {
  const [railData, setRailData] = useState(null);

  useEffect(() => {
    fetch("/rails.geojson")
      .then((res) => res.json())
      .then((data) => setRailData(data))
      .catch((err) => console.error("Erreur chargement GeoJSON:", err));
  }, []);

  const styleRail = {
    color: "#0a3172",
    weight: 4,
    opacity: 0.9,
  };

  const defauts = [
    {
      id: 1,
      type: "Joint",
      statut: "En attente",
      date: "2025-05-01",
      niveau: "critique",
      localisation: "Zone A",
      coords: [36.7408318, 3.4112183],
    },
    {
      id: 2,
      type: "Squad",
      statut: "Résolu",
      date: "2025-05-02",
      niveau: "modere",
      localisation: "Zone B",
      coords: [36.7409917, 3.4108623],
    },
    {
      id: 3,
      type: "SSquad",
      statut: "En attente",
      date: "2025-05-03",
      niveau: "mineur",
      localisation: "Zone C",
      coords: [36.7411218, 3.4105854],
    },
    {
      id: 4,
      type: "Joint",
      statut: "Résolu",
      date: "2025-05-04",
      niveau: "critique",
      localisation: "Zone D",
      coords: [36.7347929, 3.343252],
    },
    {
      id: 5,
      type: "Squad",
      statut: "En attente",
      date: "2025-05-05",
      niveau: "modere",
      localisation: "Zone E",
      coords: [36.7349185, 3.3425539],
    },
    {
      id: 6,
      type: "SSquad",
      statut: "Résolu",
      date: "2025-05-06",
      niveau: "mineur",
      localisation: "Zone F",
      coords: [36.7350733, 3.3417762],
    },
    {
      id: 7,
      type: "Joint",
      statut: "En attente",
      date: "2025-05-07",
      niveau: "critique",
      localisation: "Zone G",
      coords: [36.7343564, 3.3213445],
    },
    {
      id: 8,
      type: "Squad",
      statut: "Résolu",
      date: "2025-05-08",
      niveau: "modere",
      localisation: "Zone H",
      coords: [36.7341181, 3.3204982],
    },
    {
      id: 9,
      type: "SSquad",
      statut: "En attente",
      date: "2025-05-09",
      niveau: "mineur",
      localisation: "Zone I",
      coords: [36.7334262, 3.3163072],
    },
  ];

  return (
    <MapContainer
      center={[36.75, 3.05]}
      zoom={13}
      scrollWheelZoom={true}
      className="h-[600px] w-full rounded-xl z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />

      {railData && <GeoJSON data={railData} style={styleRail} />}

      {defauts.map((defaut) => (
        <Marker
          key={defaut.id}
          position={defaut.coords}
          icon={icons[defaut.niveau] || icons.mineur}
        >
          <Popup>
            <div className="p-2 max-w-xs text-sm space-y-1 dark:text-white">
              <p className="font-semibold">
                🔧 Type :
                <span className="text-blue-600 dark:text-blue-300">
                  {" "}
                  {defaut.type}
                </span>
              </p>
              <p>
                🗓️ Date :{" "}
                <span className="text-muted-foreground">{defaut.date}</span>
              </p>
              <p>
                📍 Lieu :{" "}
                <span className="font-medium">{defaut.localisation}</span>
              </p>
              <p>
                📊 Gravité : <GraviteBadge niveau={defaut.niveau} />
              </p>
              <p>
                🔁 Statut :
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    defaut.statut === "Résolu"
                      ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-white"
                      : "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-white"
                  }`}
                >
                  {defaut.statut}
                </span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
