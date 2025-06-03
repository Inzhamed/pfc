"use client"

import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Button } from "@/components/ui/button"
import { FileText, MapPin, Calendar, AlertTriangle } from "lucide-react"

// Fonction de test pour vérifier la configuration du routeur
const testNavigation = () => {
  console.log("🧪 Test de navigation:")
  console.log("- URL actuelle:", window.location.href)
  console.log("- Base URL:", window.location.origin)

  // Tester si la route /reports existe
  fetch("/reports", { method: "HEAD" })
    .then((response) => {
      console.log("- Route /reports accessible:", response.ok)
    })
    .catch((error) => {
      console.log("- Erreur d'accès à /reports:", error.message)
    })
}

// Configuration des icônes pour différents types et niveaux de défauts (fusionnée)
const icons = {
  // Icônes par type
  Joint: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  Squat: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  SSquat: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  Squad: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  // Icônes par niveau de gravité
  Critique: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  critique: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  Modéré: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
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
  Mineur: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
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
  // Icônes par statut
  réparé: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  "non réparable": new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  default: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
}

// Composant pour centrer la carte sur un défaut spécifique (version améliorée)
function FlyToDefaut({ defaut, markerRefs }) {
  const map = useMap()

  useEffect(() => {
    if (defaut) {
      map.flyTo(defaut.coords, 15, { duration: 1.5 })

      setTimeout(() => {
        const marker = markerRefs.current[defaut._id]
        if (marker) marker.openPopup()
      }, 800)
    }
  }, [defaut, map, markerRefs])

  return null
}

// Composant pour afficher le badge de gravité (version améliorée)
function GraviteBadge({ niveau }) {
  const styles = {
    critique: "bg-red-500 text-white",
    modéré: "bg-orange-500 text-white",
    modere: "bg-orange-500 text-white",
    mineur: "bg-green-500 text-white",
    léger: "bg-green-500 text-white",
    inconnu: "bg-gray-500 text-white",
    résolu: "bg-blue-500 text-white",
    "non résolu": "bg-red-500 text-white",
    réparé: "bg-green-500 text-white",
    "non réparable": "bg-gray-500 text-white",
  }

  const normalizedNiveau = niveau?.toLowerCase() || "inconnu"

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${
        styles[normalizedNiveau] || "bg-gray-300 text-gray-800"
      }`}
    >
      {niveau?.charAt(0).toUpperCase() + niveau?.slice(1) || "Inconnu"}
    </span>
  )
}

// Composant pour afficher le badge de statut
function StatutBadge({ statut }) {
  const styles = {
    "en attente": "bg-yellow-500 text-white",
    "en cours": "bg-blue-500 text-white",
    résolu: "bg-green-500 text-white",
    "non résolu": "bg-red-500 text-white",
    réparé: "bg-green-500 text-white",
    "non réparable": "bg-gray-500 text-white",
  }

  const normalizedStatut = statut?.toLowerCase() || "non résolu"

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${
        styles[normalizedStatut] || "bg-gray-300 text-gray-800"
      }`}
    >
      {statut?.charAt(0).toUpperCase() + statut?.slice(1) || "Non résolu"}
    </span>
  )
}

// Composant ActiveFiltersSummary intégré
const ActiveFiltersSummary = ({ filters, onRemove }) => {
  const renderBadges = []

  const addBadge = (key, value) => {
    renderBadges.push(
      <span
        key={`${key}-${value}`}
        className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-1 rounded-full"
      >
        {`${key} : ${value}`}
        <button onClick={() => onRemove(key, value)} className="ml-1 text-blue-500 hover:text-blue-700">
          ✕
        </button>
      </span>,
    )
  }

  if (!filters) return null

  if (filters.gravite?.length) filters.gravite.forEach((g) => addBadge("Gravité", g))
  if (filters.statut?.length) filters.statut.forEach((s) => addBadge("Statut", s))
  if (filters.typeDefaut?.length) filters.typeDefaut.forEach((t) => addBadge("Type", t))
  if (filters.zone && filters.zone !== "all") addBadge("Zone", filters.zone)
  if (filters.trajet && filters.trajet !== "all") addBadge("Trajet", filters.trajet)
  if (filters.date) addBadge("Date", filters.date)
  if (filters.searchQuery) addBadge("Recherche", filters.searchQuery)

  return <div className="mb-4 flex flex-wrap">{renderBadges}</div>
}

export default function Map({ highlightDefectId = null, filters = null, defauts: defautsProp = [], searchQuery = "" }) {
  const navigate = useNavigate()
  const [railData, setRailData] = useState(null)
  const [highlightedDefaut, setHighlightedDefaut] = useState(null)
  const markerRefs = useRef({})
  const [transformedDefauts, setTransformedDefauts] = useState([])

  // Appeler le test au chargement du composant
  useEffect(() => {
    testNavigation()
  }, [])

  // Fonction pour normaliser les types de défauts
  const normalizeDefectType = (type) => {
    if (!type) return ""

    const typeStr = String(type).toLowerCase().trim()

    if (typeStr.includes("joint")) return "Joint"
    if (typeStr.includes("ssquat") || typeStr.includes("ssquats")) return "SSquat"
    if (typeStr.includes("squat") || typeStr.includes("squats")) return "Squat"

    return type
  }

  // Transformer les données des défauts reçues en props
  useEffect(() => {
    if (defautsProp && defautsProp.length > 0) {
      const transformed = defautsProp.map((d) => {
        const normalizedType = normalizeDefectType(d.type_defaut)

        return {
          _id: d._id?.$oid || d._id,
          type: normalizedType,
          statut: d.statut || "non résolu",
          date: d.date,
          niveau: d.niveau_defaut,
          localisation: d.region || "Non spécifiée",
          coords: [
            typeof d.latitude === "string" ? Number.parseFloat(d.latitude) : d.latitude,
            typeof d.longitude === "string" ? Number.parseFloat(d.longitude) : d.longitude,
          ],
          image: d.image_url,
          image_data: d.image_data,
          image_format: d.image_format || "jpeg",
          description: d.description,
        }
      })

      console.log("🗺️ Défauts transformés pour la carte:", transformed.length)

      // Log détaillé du premier défaut avec image
      const defautAvecImage = transformed.find((d) => d.image || d.image_data)
      if (defautAvecImage) {
        console.log("📸 Premier défaut avec image:", {
          id: defautAvecImage._id,
          image: defautAvecImage.image,
          has_image_data: !!defautAvecImage.image_data,
          image_format: defautAvecImage.image_format,
        })
      }

      setTransformedDefauts(transformed)
    } else {
      setTransformedDefauts([])
    }
  }, [defautsProp])

  // Appliquer les filtres dynamiques aux défauts (logique du fichier 2)
  const defautsFiltres = transformedDefauts.filter((d) => {
    const query = searchQuery?.toLowerCase()

    if (
      query &&
      !(
        d.description?.toLowerCase().includes(query) ||
        d.localisation?.toLowerCase().includes(query) ||
        d.type?.toLowerCase().includes(query)
      )
    ) {
      return false
    }

    if (filters) {
      // Gravité/Niveau de défaut
      if (filters.gravite?.length > 0 && !filters.gravite.includes(d.niveau?.toLowerCase())) return false
      if (filters.niveau_defaut?.length > 0 && !filters.niveau_defaut.includes(d.niveau)) return false

      // Statut
      if (filters.statut?.length > 0 && !filters.statut.includes(d.statut?.toLowerCase())) return false

      // Type de défaut
      if (filters.typeDefaut?.length > 0 && !filters.typeDefaut.includes(d.type)) return false
      if (filters.type_defaut?.length > 0 && !filters.type_defaut.includes(d.type)) return false

      // Zone/Région
      if (filters.zone !== "all" && filters.zone && d.localisation !== filters.zone) return false
      if (filters.region !== "all" && filters.region && d.localisation !== filters.region) return false

      // Trajet
      if (
        filters.trajet !== "all" &&
        filters.trajet &&
        d.description &&
        !d.description.toLowerCase().includes(filters.trajet)
      ) {
        return false
      }

      // Date
      if (filters.date && d.date && !d.date.startsWith(filters.date)) {
        return false
      }
    }

    return true
  })

  // Charger les données GeoJSON des rails
  useEffect(() => {
    fetch("/rails.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log("🛤️ Données GeoJSON chargées")
        setRailData(data)
      })
      .catch((err) => console.error("Erreur chargement GeoJSON:", err))

    // Vérifier si un rapport a été soumis et mettre à jour le statut du défaut
    const reportStatus = localStorage.getItem("reportStatus")
    if (reportStatus) {
      const { defectId, status } = JSON.parse(reportStatus)
      updateDefectStatus(defectId, status)
      localStorage.removeItem("reportStatus")
    }
  }, [])

  // Fonction pour mettre à jour le statut d'un défaut (du fichier 2)
  const updateDefectStatus = (defectId, status) => {
    // Extraire l'ID numérique du défaut (format D-2023-001)
    const defautIdMatch = defectId.match(/\d+$/)
    if (defautIdMatch) {
      const defautId = Number.parseInt(defautIdMatch[0], 10)

      setTransformedDefauts((prevDefauts) => {
        const updatedDefauts = prevDefauts.map((defaut) => {
          if (defaut._id === defautId) {
            // Convertir le statut du rapport au format du défaut
            let newStatut = "En attente"
            if (status === "réparé") newStatut = "Résolu"
            else if (status === "non réparable") newStatut = "Non réparable"

            // Mettre à jour le niveau si le statut est "réparé" ou "non réparable"
            const newNiveau =
              status === "réparé" ? "réparé" : status === "non réparable" ? "non réparable" : defaut.niveau

            return { ...defaut, statut: newStatut, niveau: newNiveau }
          }
          return defaut
        })

        // Sauvegarder les défauts mis à jour dans le localStorage
        localStorage.setItem("railDefects", JSON.stringify(updatedDefauts))
        return updatedDefauts
      })
    }
  }

  // Convertir un défaut en rapport pour la génération de rapport
  const convertDefautToReport = (defaut) => {
    const typeMap = {
      Joint: "joint",
      Squat: "squat",
      SSquat: "ssquat",
      Squad: "squat", // Alias pour Squat
    }

    const statusMap = {
      résolu: "réparé",
      Résolu: "réparé",
      "en attente": "reporté",
      "En attente": "reporté",
      "en cours": "en cours",
      "non résolu": "reporté",
    }

    // Générer un ID sécurisé
    const defautId = defaut._id || Math.random().toString(36).substr(2, 9)
    const reportId = `D-2023-${defautId.toString().padStart(3, "0")}`

    return {
      id: reportId,
      type: typeMap[defaut.type] || defaut.type?.toLowerCase(),
      status: statusMap[defaut.statut?.toLowerCase()] || "reporté",
      date: defaut.date,
      line: `Ligne ${defaut.localisation?.split(" ")[1] || "A"}`,
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

  // Générer un rapport à partir d'un défaut avec redirection ultra-robuste
  const handleGenerateReport = (defaut) => {
    try {
      // Validation des données du défaut
      if (!defaut) {
        console.error("❌ Données du défaut invalides:", defaut)
        alert("Erreur: Données du défaut manquantes. Impossible de générer le rapport.")
        return
      }

      console.log("🚀 Début de la génération du rapport pour:", defaut._id || "ID manquant")
      console.log("📋 Données du défaut:", defaut)

      const reportData = convertDefautToReport(defaut)
      localStorage.setItem("defectData", JSON.stringify(reportData))

      console.log("💾 Données sauvegardées dans localStorage:", reportData)

      // MÉTHODE 1: Essayer useNavigate d'abord
      try {
        console.log("🔄 Tentative 1: Redirection avec useNavigate")
        navigate("/reports")
        console.log("✅ useNavigate exécuté avec succès")
        return // Si ça marche, on s'arrête là
      } catch (navError) {
        console.error("❌ Erreur avec useNavigate:", navError)
      }

      // MÉTHODE 2: Fallback avec window.location.href
      setTimeout(() => {
        try {
          console.log("🔄 Tentative 2: Redirection avec window.location.href")
          window.location.href = "/reports"
          console.log("✅ window.location.href exécuté")
        } catch (windowError) {
          console.error("❌ Erreur avec window.location.href:", windowError)

          // MÉTHODE 3: Fallback avec document.location
          try {
            console.log("🔄 Tentative 3: Redirection avec document.location")
            document.location = "/reports"
            console.log("✅ document.location exécuté")
          } catch (docError) {
            console.error("❌ Erreur avec document.location:", docError)

            // MÉTHODE 4: Fallback avec window.open
            try {
              console.log("🔄 Tentative 4: Redirection avec window.open")
              window.open("/reports", "_self")
              console.log("✅ window.open exécuté")
            } catch (openError) {
              console.error("❌ Erreur avec window.open:", openError)

              // MÉTHODE 5: Dernière tentative - créer un lien et le cliquer
              try {
                console.log("🔄 Tentative 5: Redirection avec lien automatique")
                const link = document.createElement("a")
                link.href = "/reports"
                link.style.display = "none"
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                console.log("✅ Lien automatique exécuté")
              } catch (linkError) {
                console.error("❌ Erreur avec lien automatique:", linkError)

                // Si tout échoue, afficher un message d'aide
                alert(`Toutes les méthodes de redirection ont échoué. 
                
Veuillez :
1. Actualisez la page et réessayez
2. Naviguez manuellement vers /reports
3. Vérifiez la console pour plus de détails

Les données du rapport ont été sauvegardées.`)
              }
            }
          }
        }
      }, 100)
    } catch (error) {
      console.error("❌ Erreur générale lors de la génération du rapport:", error)

      // Afficher des informations de debugging
      console.log("🔍 Informations de debugging:")
      console.log("- URL actuelle:", window.location.href)
      console.log("- Origine:", window.location.origin)
      console.log("- Pathname:", window.location.pathname)
      console.log("- Navigate disponible:", typeof navigate)
      console.log("- Router context:", !!navigate)
      console.log("- Défaut reçu:", defaut)

      // Message d'erreur détaillé
      alert(`Erreur lors de la redirection vers la page de rapport.

Détails techniques:
- Erreur: ${error.message}
- URL actuelle: ${window.location.href}
- Navigate disponible: ${typeof navigate}

Solutions:
1. Actualisez la page et réessayez
2. Naviguez manuellement vers /reports
3. Vérifiez la console pour plus de détails

Les données du rapport ont été sauvegardées.`)
    }
  }

  // Mettre à jour le statut d'un défaut via API
  const handleStatutUpdate = async (defautId, nouveauStatut) => {
    try {
      const response = await fetch(`http://localhost:8000/defauts/${defautId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      const updatedDefaut = await response.json()

      setTransformedDefauts((prevDefauts) =>
        prevDefauts.map((defaut) => (defaut._id === defautId ? { ...defaut, statut: updatedDefaut.statut } : defaut)),
      )

      console.log("✅ Statut mis à jour avec succès")
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour:", error)
      alert("Échec de la mise à jour du statut")
    }
  }

  // Effet pour mettre en évidence un défaut spécifique (notifications)
  useEffect(() => {
    if (highlightDefectId) {
      console.log("🔍 Recherche du défaut à mettre en évidence:", highlightDefectId)

      // Chercher le défaut par ID
      const defaut = defautsFiltres.find((d) => {
        const id1 = String(d._id)
        const id2 = String(highlightDefectId)
        return id1 === id2
      })

      if (defaut) {
        console.log("✅ Défaut trouvé pour mise en évidence:", defaut)
        setHighlightedDefaut(defaut)
      } else {
        console.log("❌ Défaut non trouvé dans la liste:", highlightDefectId)
        console.log(
          "📋 Défauts disponibles:",
          defautsFiltres.map((d) => d._id),
        )
      }
    }
  }, [highlightDefectId, defautsFiltres])

  // Style pour les rails
  const styleRail = {
    color: "#0a3172",
    weight: 4,
    opacity: 0.9,
  }

  // Fonction pour obtenir l'icône appropriée selon le type et le niveau
  const getDefautIcon = (defaut) => {
    if (defaut.type && icons[defaut.type]) {
      return icons[defaut.type]
    }

    if (defaut.niveau && icons[defaut.niveau]) {
      return icons[defaut.niveau]
    }

    return icons.default
  }

  return (
    <MapContainer center={[36.75, 3.05]} zoom={13} scrollWheelZoom={true} className="h-[600px] w-full rounded-xl z-0">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />

      {/* Affichage des rails */}
      {railData && <GeoJSON data={railData} style={styleRail} />}

      {/* Composant pour centrer la carte sur le défaut sélectionné */}
      {highlightedDefaut && <FlyToDefaut defaut={highlightedDefaut} markerRefs={markerRefs} />}

      {/* Affichage des marqueurs de défauts filtrés */}
      {defautsFiltres.map((defaut) => {
        // Vérifier que les coordonnées sont valides
        if (!defaut.coords || defaut.coords.length !== 2 || isNaN(defaut.coords[0]) || isNaN(defaut.coords[1])) {
          console.warn("Coordonnées invalides pour le défaut:", defaut._id)
          return null
        }

        return (
          <Marker
            key={defaut._id || `marker-${Math.random()}`}
            position={defaut.coords}
            icon={getDefautIcon(defaut)}
            ref={(ref) => {
              if (defaut._id) {
                markerRefs.current[defaut._id] = ref
              }
            }}
          >
            <Popup className="custom-popup">
              <div className="p-3 max-w-xs text-sm space-y-3 dark:text-white">
                {/* En-tête avec type et ID */}
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-blue-600 dark:text-blue-300">
                    🔧 {defaut.type || "Type non défini"}
                  </h3>
                  <span className="text-xs text-gray-500">ID: {defaut._id}</span>
                </div>

                {/* Informations principales */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{defaut.date || "Date non définie"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{defaut.localisation}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                    <GraviteBadge niveau={defaut.niveau} />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">Statut:</span>
                    <StatutBadge statut={defaut.statut} />
                  </div>
                </div>

                {/* Affichage d'image avec gestion d'erreurs améliorée */}
                {defaut.image && (
                  <img
                    src={defaut.image_data ? `data:image/jpeg;base64,${defaut.image_data}` : defaut.image}
                    alt="Image du défaut"
                    className="w-full h-24 object-cover rounded mt-2"
                    onLoad={() => console.log("✅ Image chargée avec succès pour:", defaut._id)}
                    onError={(e) => {
                      console.error("❌ Erreur de chargement d'image pour:", defaut._id)
                      console.error("URL tentée:", e.target.src)
                      e.target.style.display = "none"

                      // Ajouter un message d'erreur
                      if (!e.target.parentNode.querySelector(".error-message")) {
                        const errorMsg = document.createElement("div")
                        errorMsg.className = "text-xs text-red-500 mt-1 error-message"
                        errorMsg.innerText = "Image non disponible"
                        e.target.parentNode.appendChild(errorMsg)
                      }
                    }}
                  />
                )}

                {/* Description */}
                {defaut.description && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <p className="text-xs italic text-gray-600 dark:text-gray-300">{defaut.description}</p>
                  </div>
                )}

                {/* Sélecteur de statut */}
                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <label className="block text-xs font-medium mb-1">Modifier le statut:</label>
                  <select
                    value={defaut.statut || "non résolu"}
                    onChange={(e) => {
                      handleStatutUpdate(defaut._id, e.target.value)
                    }}
                    className="w-full text-xs px-2 py-1 border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  >
                    <option value="non résolu">Non résolu</option>
                    <option value="en cours">En cours</option>
                    <option value="résolu">Résolu</option>
                  </select>
                </div>

                {/* Bouton de génération de rapport */}
                <div className="mt-3">
                  <Button
                    onClick={() => handleGenerateReport(defaut)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2"
                    size="sm"
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    Générer un rapport
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
