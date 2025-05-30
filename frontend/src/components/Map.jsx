"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const icons = {
  critique: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  modere: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  mineur: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  réparé: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  "non réparable": new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
};

const ActiveFiltersSummary = ({ filters, onRemove }) => {
  const renderBadges = [];

  const addBadge = (key, value) => {
    renderBadges.push(
      <span
        key={`${key}-${value}`}
        className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-1 rounded-full"
      >
        {`${key} : ${value}`}
        <button
          onClick={() => onRemove(key, value)}
          className="ml-1 text-blue-500 hover:text-blue-700"
        >
          ✕
        </button>
      </span>
    );
  };

  if (!filters) return null;

  if (filters.gravite?.length)
    filters.gravite.forEach((g) => addBadge("Gravité", g));

  if (filters.statut?.length)
    filters.statut.forEach((s) => addBadge("Statut", s));

  if (filters.typeDefaut?.length)
    filters.typeDefaut.forEach((t) => addBadge("Type", t));

  if (filters.zone && filters.zone !== "all") addBadge("Zone", filters.zone);

  if (filters.trajet && filters.trajet !== "all")
    addBadge("Trajet", filters.trajet);

  if (filters.date) addBadge("Date", filters.date);

  if (filters.searchQuery) addBadge("Recherche", filters.searchQuery);

  return <div className="mb-4 flex flex-wrap">{renderBadges}</div>;
};

// Composant pour centrer la carte sur un défaut spécifique
function CenterMapOnDefect({ defaut }) {
  const map = useMap();

  useEffect(() => {
    if (defaut) {
      map.setView(defaut.coords, 15);
    }
  }, [defaut, map]);

  return null;
}

function GraviteBadge({ niveau }) {
  const styles = {
    critique: "bg-red-500 text-white",
    modere: "bg-orange-500 text-white",
    mineur: "bg-green-500 text-white",
    réparé: "bg-green-500 text-white",
    "non réparable": "bg-gray-500 text-white",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles[niveau] || "bg-gray-300"}`}>
      {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
    </span>
  )
}

export default function Map({ highlightDefectId = null, filters = null }) {
  const [railData, setRailData] = useState(null);
  const navigate = useNavigate();
  const [highlightedDefaut, setHighlightedDefaut] = useState(null);
  const markerRefs = useRef({});
  const [defauts, setDefauts] = useState([]);
  // Appliquer les filtres dynamiques aux défauts
  const defautsFiltres = defauts.filter((d) => {
    const query = filters.searchQuery?.toLowerCase();

if (
  query &&
  !(
    (d.description?.toLowerCase().includes(query)) ||
    (d.localisation?.toLowerCase().includes(query))
  )
) {
  return false;
}


    if (filters) {
      // Gravité
      if (filters.gravite.length > 0 && !filters.gravite.includes(d.niveau)) {
        return false;
      }

      // Statut
      if (filters.statut.length > 0 && !filters.statut.includes(d.statut)) {
        return false;
      }

      // Type de défaut
      if (
        filters.typeDefaut.length > 0 &&
        !filters.typeDefaut.includes(d.type)
      ) {
        return false;
      }

      // Zone (region)
      if (filters.zone !== "all" && d.localisation !== filters.zone) {
        return false;
      }

      // Trajet
      if (
        filters.trajet !== "all" &&
        d.description &&
        !d.description.toLowerCase().includes(filters.trajet)
      ) {
        return false;
      }

      // Date
      if (filters.date && d.date && !d.date.startsWith(filters.date)) {
        return false;
      }

      
    }

    return true;
  });

  // Convertir les défauts en format compatible avec l'historique
  const convertDefautToReport = (defaut) => {
    const typeMap = {
      Joint: "joint",
      Squad: "squat",
      SSquad: "ssquat",
    };

    const statusMap = {
      Résolu: "réparé",
      "En attente": "reporté",
    };

    return {
      id: `D-2023-${defaut._id.toString().padStart(3, "0")}`,
      type: typeMap[defaut.type] || defaut.type.toLowerCase(),
      status: statusMap[defaut.statut] || "reporté",
      date: defaut.date,
      line: `Ligne ${defaut.localisation.split(" ")[1] || "A"}`,
      description: `Défaut de type ${defaut.type} détecté dans la ${defaut.localisation}. Niveau de gravité: ${defaut.niveau}.`,
      technician: {
        name: "Technicien SNTF",
        matricule: `TECH-${Math.floor(1000 + Math.random() * 9000)}`,
        function: "Inspecteur de voie",
        interventionDate: defaut.date,
      },
      location: {
        pk: `PK ${Math.floor(10 + Math.random() * 90)}+${Math.floor(
          100 + Math.random() * 900
        )}`,
        lat: defaut.coords[0],
        lng: defaut.coords[1],
      },
    };
  };

  useEffect(() => {
    // Charger les données GeoJSON
    fetch("/rails.geojson")
      .then((res) => res.json())
      .then((data) => setRailData(data))
      .catch((err) => console.error("Erreur chargement GeoJSON:", err));

    // Charger les défauts depuis l'API FastAPI
    fetch("http://localhost:8000/defauts")
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((d) => ({
          _id: d._id?.$oid || d._id,

          type: d.type_defaut,
          statut: d.statut === "résolu" ? "Résolu" : "En attente",
          date: d.date,
          niveau: d.niveau_defaut,
          localisation: d.region || "Non spécifiée",
          coords: [d.latitude, d.longitude],
          image: d.image_url,
          description: d.description,
        }));

        let filtered = transformed;

        if (filters) {
          if (filters.niveau) {
            filtered = filtered.filter((d) => d.niveau === filters.niveau);
          }
          if (filters.type) {
            filtered = filtered.filter((d) => d.type === filters.type);
          }
          if (filters.statut) {
            filtered = filtered.filter((d) => d.statut === filters.statut);
          }
          if (filters.region) {
            filtered = filtered.filter(
              (d) => d.localisation === filters.region
            );
          }
        }

        setDefauts(filtered);
      })
      .catch((err) => console.error("Erreur chargement défauts:", err));

    // Vérifier si un rapport a été soumis et mettre à jour le statut du défaut
    const reportStatus = localStorage.getItem("reportStatus");
    if (reportStatus) {
      const { defectId, status } = JSON.parse(reportStatus);
      updateDefectStatus(defectId, status);
      localStorage.removeItem("reportStatus");
    }
  }, []);

  // Fonction pour mettre à jour le statut d'un défaut
  const updateDefectStatus = (defectId, status) => {
    // Extraire l'ID numérique du défaut (format D-2023-001)
    const defautIdMatch = defectId.match(/\d+$/);
    if (defautIdMatch) {
      const defautId = Number.parseInt(defautIdMatch[0], 10);

      setDefauts((prevDefauts) => {
        const updatedDefauts = prevDefauts.map((defaut) => {
          if (defaut._id === defautId) {
            // Convertir le statut du rapport au format du défaut
            let newStatut = "En attente";
            if (status === "réparé") newStatut = "Résolu";
            else if (status === "non réparable") newStatut = "Non réparable";

            // Mettre à jour le niveau si le statut est "réparé" ou "non réparable"
            const newNiveau =
              status === "réparé"
                ? "réparé"
                : status === "non réparable"
                ? "non réparable"
                : defaut.niveau;

            return { ...defaut, statut: newStatut, niveau: newNiveau };
          }
          return defaut;
        });

        // Sauvegarder les défauts mis à jour dans le localStorage
        localStorage.setItem("railDefects", JSON.stringify(updatedDefauts));
        return updatedDefauts;
      });
    }
  };

  const styleRail = {
    color: "#0a3172",
    weight: 4,
    opacity: 0.9,
  }

  // Fonction pour générer un rapport à partir d'un défaut
  const handleGenerateReport = (defaut) => {
    const reportData = convertDefautToReport(defaut);
    localStorage.setItem("defectData", JSON.stringify(reportData));
    navigate("/reports");
  };

  const handleStatutUpdate = (defautId, nouveauStatut) => {
    fetch(`http://localhost:8000/defauts/${defautId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ statut: nouveauStatut }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors de la mise à jour");
        }
        return res.json();
      })
      .then((updatedDefaut) => {
        setDefauts((prevDefauts) =>
          prevDefauts.map((defaut) =>
            defaut._id === defautId
              ? { ...defaut, statut: updatedDefaut.statut }
              : defaut
          )
        );
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        alert("Échec de la mise à jour du statut");
      });
  };

  // Effet pour mettre en évidence un défaut spécifique
  useEffect(() => {
  if (highlightDefectId) {
    const defaut = defauts.find((d) => d._id === highlightDefectId);
    if (defaut) {
      setHighlightedDefaut(defaut);
    }
  }


  }, [highlightDefectId, defauts]);

  function FlyToDefaut({ defaut, markerRefs }) {
  const map = useMap();

  useEffect(() => {
    if (defaut) {
      map.flyTo(defaut.coords, 15, { duration: 1.5 });

      setTimeout(() => {
        const marker = markerRefs.current[defaut._id];
        if (marker) marker.openPopup();
      }, 800);
    }
  }, [defaut]);

  return null;
}


  return (
    <MapContainer center={[36.75, 3.05]} zoom={13} scrollWheelZoom={true} className="h-[600px] w-full rounded-xl z-0">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />

      {railData && <GeoJSON data={railData} style={styleRail} />}

      {/* Composant pour centrer la carte sur le défaut sélectionné */}
      {highlightedDefaut && (
  <FlyToDefaut defaut={highlightedDefaut} markerRefs={markerRefs} />
)}


      {defautsFiltres.map((defaut) => (
        <Marker
          key={defaut._id}
          position={defaut.coords}
          icon={icons[defaut.niveau] || icons.mineur}
          ref={(ref) => {
            markerRefs.current[defaut._id] = ref;
          }}
        >
          <Popup>
            <div className="p-2 max-w-xs text-sm space-y-1 dark:text-white">
              <p className="font-semibold">
                🔧 Type :<span className="text-blue-600 dark:text-blue-300"> {defaut.type}</span>
              </p>
              <p>
                🗓️ Date : <span className="text-muted-foreground">{defaut.date}</span>
              </p>
              <p>
                📍 Lieu : <span className="font-medium">{defaut.localisation}</span>
              </p>
              <p>
                📊 Gravité : <GraviteBadge niveau={defaut.niveau} />
              </p>
              {defaut.image && (
                <img
                  src={defaut.image}
                  alt="Image du défaut"
                  className="w-full h-24 object-cover rounded mt-2"
                />
              )}
              {defaut.description && (
                <p className="text-xs mt-2 italic text-muted-foreground">
                  {defaut.description}
                </p>
              )}

              <div>
                🔁 Statut :
                <select
                  value={defaut.statut}
                  onChange={(e) => {
                    handleStatutUpdate(defaut._id, e.target.value);
                  }}
                  className="ml-2 text-xs px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                >
                  <option value="non résolu">Non résolu</option>
                  <option value="résolu">Résolu</option>
                </select>
              </div>

              <div className="mt-3">
                <Button
                  onClick={() => handleGenerateReport(defaut)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1"
                  size="sm"
                >
                  <FileText className="mr-1 h-3 w-3" />
                  Générer un rapport
                </Button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
