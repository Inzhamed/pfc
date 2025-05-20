"use client"

import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

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
}

// Composant pour centrer la carte sur un défaut spécifique
function CenterMapOnDefect({ defaut }) {
  const map = useMap()

  useEffect(() => {
    if (defaut) {
      map.setView(defaut.coords, 15)
    }
  }, [defaut, map])

  return null
}

function GraviteBadge({ niveau }) {
  const styles = {
    critique: "bg-red-500 text-white",
    modere: "bg-orange-500 text-white",
    mineur: "bg-green-500 text-white",
  }
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles[niveau] || "bg-gray-300"}`}>
      {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
    </span>
  )
}

export default function Map({ highlightDefectId = null }) {
  const [railData, setRailData] = useState(null)
  const navigate = useNavigate()
  const [highlightedDefaut, setHighlightedDefaut] = useState(null)
  const markerRefs = useRef({})

  // Convertir les défauts en format compatible avec l'historique
  const convertDefautToReport = (defaut) => {
    const typeMap = {
      Joint: "joint",
      Squad: "squat",
      SSquad: "ssquat",
    }

    const statusMap = {
      Résolu: "réparé",
      "En attente": "reporté",
    }

    return {
      id: `D-2023-${defaut.id.toString().padStart(3, "0")}`,
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
        pk: `PK ${Math.floor(10 + Math.random() * 90)}+${Math.floor(100 + Math.random() * 900)}`,
        lat: defaut.coords[0],
        lng: defaut.coords[1],
      },
    }
  }

  useEffect(() => {
    fetch("/rails.geojson")
      .then((res) => res.json())
      .then((data) => setRailData(data))
      .catch((err) => console.error("Erreur chargement GeoJSON:", err))
  }, [])

  const styleRail = {
    color: "#0a3172",
    weight: 4,
    opacity: 0.9,
  }

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
  ]

  // Fonction pour générer un rapport à partir d'un défaut
  const handleGenerateReport = (defaut) => {
    const reportData = convertDefautToReport(defaut)
    localStorage.setItem("defectData", JSON.stringify(reportData))
    navigate("/reports")
  }

  // Effet pour mettre en évidence un défaut spécifique
  useEffect(() => {
    if (highlightDefectId) {
      console.log("ID du défaut à mettre en évidence:", highlightDefectId)

      // Extraire le numéro du défaut à partir de l'ID (format D-2023-001)
      const defautIdMatch = highlightDefectId.match(/\d+$/)
      if (defautIdMatch) {
        const defautId = Number.parseInt(defautIdMatch[0], 10)
        console.log("Numéro du défaut extrait:", defautId)

        // Trouver le défaut correspondant
        const defaut = defauts.find((d) => d.id === defautId)

        if (defaut) {
          console.log("Défaut trouvé:", defaut)
          setHighlightedDefaut(defaut)

          // Ouvrir le popup du marqueur correspondant
          setTimeout(() => {
            if (markerRefs.current[defautId]) {
              markerRefs.current[defautId].openPopup()
            }
          }, 1000)
        } else {
          console.log("Aucun défaut trouvé avec l'ID:", defautId)
        }
      }
    }
  }, [highlightDefectId])

  return (
    <MapContainer center={[36.75, 3.05]} zoom={13} scrollWheelZoom={true} className="h-[600px] w-full rounded-xl z-0">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />

      {railData && <GeoJSON data={railData} style={styleRail} />}

      {/* Composant pour centrer la carte sur le défaut sélectionné */}
      {highlightedDefaut && <CenterMapOnDefect defaut={highlightedDefaut} />}

      {defauts.map((defaut) => (
        <Marker
          key={defaut.id}
          position={defaut.coords}
          icon={icons[defaut.niveau] || icons.mineur}
          ref={(ref) => {
            markerRefs.current[defaut.id] = ref
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
