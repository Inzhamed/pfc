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

  const [defauts, setDefauts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/defauts")
      .then((res) => res.json())
      .then((data) => setDefauts(data))
      .catch((err) =>
        console.error("Erreur lors de la récupération des défauts:", err)
      );
  }, []);

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
          key={defaut._id?.$oid || defaut._id}
          position={[defaut.latitude, defaut.longitude]}
          icon={icons[defaut.niveau_defaut] || icons.mineur}
        >
          <Popup>
            <div className="p-2 max-w-xs text-sm space-y-1 dark:text-white">
              <p className="font-semibold">
                🔧 Type :
                <span className="text-blue-600 dark:text-blue-300">
                  {" "}
                  {defaut.type_defaut}
                </span>
              </p>
              <p>
                🗓️ Date :{" "}
                <span className="text-muted-foreground">{defaut.date}</span>
              </p>
              <p>
                📍 Région : <span className="font-medium">{defaut.région}</span>
              </p>
              <p>
                📊 Gravité : <GraviteBadge niveau={defaut.niveau_defaut} />
              </p>
              <p>
                🔁 Statut :
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    defaut.statut === "résolu"
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
