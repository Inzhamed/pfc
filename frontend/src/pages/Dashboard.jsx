"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import Map from "@/components/Map"
import { useSearchParams } from "react-router-dom"
import { AlertCircle, Clock, CheckCircle, Wrench, Search, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Composant pour une carte statistique
const StatCard = ({ title, value, icon, color, percent = 100 }) => {
  const isDark = document.documentElement.classList.contains("dark")

  return (
    <Card className={isDark ? "bg-transparent border-gray-700" : "bg-white border-blue-100 shadow-none"}>
      <CardContent className="px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="leading-tight">
            <p className={`text-sm font-bold ${isDark ? "text-white" : "text-black"}`}>{title}</p>
            <h3 className="text-lg font-extrabold">{value}</h3>
          </div>
          <div className={`p-1 rounded ${isDark ? `${color}-900/30` : `${color}-100`}`}>{icon}</div>
        </div>
        <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-1 bg-${color}-600 rounded-full transition-all duration-300`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  )
}

// Composant simple pour remplacer Checkbox
const SimpleCheckbox = ({ id, checked, onChange, label }) => {
  const isDark = document.documentElement.classList.contains("dark")
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={id} className={`text-sm cursor-pointer ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        {label}
      </label>
    </div>
  )
}

// Composant simple pour remplacer Select
const SimpleSelect = ({ id, value, onChange, options, label }) => {
  const isDark = document.documentElement.classList.contains("dark")
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full rounded-md border ${
          isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
        } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// Composant pour afficher les filtres actifs (version améliorée)
const ActiveFiltersSummary = ({ filters, onRemove, onClearAll }) => {
  const renderBadges = []

  const addBadge = (key, value, displayKey) => {
    renderBadges.push(
      <Badge
        key={`${key}-${value}`}
        variant="secondary"
        className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200"
      >
        {`${displayKey}: ${value}`}
        <button
          onClick={() => onRemove(key, value)}
          className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100 font-bold"
        >
          ×
        </button>
      </Badge>,
    )
  }

  if (!filters) return null

  // Gravité/Niveau de défaut
  if (filters.gravite?.length) {
    filters.gravite.forEach((g) => addBadge("gravite", g, "Gravité"))
  }
  if (filters.niveau_defaut?.length) {
    filters.niveau_defaut.forEach((n) => addBadge("niveau_defaut", n, "Gravité"))
  }

  // Type de défaut
  if (filters.typeDefaut?.length) {
    filters.typeDefaut.forEach((t) => addBadge("typeDefaut", t, "Type"))
  }
  if (filters.type_defaut?.length) {
    filters.type_defaut.forEach((t) => addBadge("type_defaut", t, "Type"))
  }

  // Statut
  if (filters.statut?.length) {
    filters.statut.forEach((s) => addBadge("statut", s, "Statut"))
  }

  // Zone/Région
  if (filters.zone && filters.zone !== "all") {
    addBadge("zone", filters.zone, "Zone")
  }
  if (filters.region && filters.region !== "all") {
    addBadge("region", filters.region, "Région")
  }

  // Trajet
  if (filters.trajet && filters.trajet !== "all") {
    addBadge("trajet", filters.trajet, "Trajet")
  }

  // Date
  if (filters.date) {
    addBadge("date", filters.date, "Date")
  }

  // Recherche
  if (filters.searchQuery) {
    addBadge("searchQuery", filters.searchQuery, "Recherche")
  }
  if (filters.search) {
    addBadge("search", filters.search, "Recherche")
  }

  if (renderBadges.length === 0) return null

  return (
    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtres actifs ({renderBadges.length})</h3>
        <Button
          onClick={onClearAll}
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
        >
          Tout effacer
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">{renderBadges}</div>
    </div>
  )
}

export default function Dashboard() {
  const [searchParams] = useSearchParams()
  // Récupération améliorée du defectId depuis les paramètres URL
  const defectId = searchParams?.get("defectId") || searchParams?.get("id")

  const [stats, setStats] = useState({
    total: 0,
    critiques: 0,
    enAttente: 0,
    enCours: 0,
    resolus: 0,
  })

  const [isDark, setIsDark] = useState(false)

  // État des filtres fusionné (combine les deux approches)
  const [filters, setFilters] = useState({
    // Filtres du premier fichier
    gravite: [],
    statut: [],
    typeDefaut: [],
    zone: "all",
    trajet: "all",
    // Filtres du second fichier
    niveau_defaut: [],
    type_defaut: [],
    region: "all",
    date: "",
  })

  const [filteredDefauts, setFilteredDefauts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fonction pour normaliser les types de défauts
  const normalizeDefectType = (type) => {
    if (!type) return ""

    const typeStr = String(type).toLowerCase().trim()

    if (typeStr.includes("joint")) return "Joint"
    if (typeStr.includes("ssquat") || typeStr.includes("ssquats")) return "SSquat"
    if (typeStr.includes("squat") || typeStr.includes("squats")) return "Squat"

    return type
  }

  // Calculer les statistiques basées sur les défauts filtrés
  useEffect(() => {
    if (filteredDefauts && filteredDefauts.length > 0) {
      const total = filteredDefauts.length
      const critiques = filteredDefauts.filter(
        (d) => d.niveau_defaut?.toLowerCase() === "critique" || d.gravite?.toLowerCase() === "critique",
      ).length
      const enAttente = filteredDefauts.filter(
        (d) =>
          d.statut?.toLowerCase() === "en attente" ||
          d.statut?.toLowerCase() === "enattente" ||
          d.statut?.toLowerCase() === "non résolu",
      ).length
      const enCours = filteredDefauts.filter(
        (d) => d.statut?.toLowerCase() === "en cours" || d.statut?.toLowerCase() === "encours",
      ).length
      const resolus = filteredDefauts.filter(
        (d) => d.statut?.toLowerCase() === "résolu" || d.statut?.toLowerCase() === "resolu",
      ).length

      setStats({
        total,
        critiques,
        enAttente,
        enCours,
        resolus,
      })
    } else {
      setStats({
        total: 0,
        critiques: 0,
        enAttente: 0,
        enCours: 0,
        resolus: 0,
      })
    }
  }, [filteredDefauts])

  // Observer le thème et charger les données initiales
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    // Charger les données initiales
    fetchFilteredDefauts()

    // Log amélioré pour le défaut sélectionné
    if (defectId) {
      console.log(`🎯 Défaut sélectionné depuis les paramètres URL: ${defectId}`)
    }

    return () => observer.disconnect()
  }, [])

  // Fonction pour récupérer les défauts filtrés depuis l'API
  const fetchFilteredDefauts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()

      // Gestion des filtres de gravité (les deux formats)
      ;[...(filters.gravite || []), ...(filters.niveau_defaut || [])].forEach((g) => {
        params.append("niveau_defaut", g)
      })

      // Gestion des filtres de type (les deux formats)
      ;[...(filters.typeDefaut || []), ...(filters.type_defaut || [])].forEach((t) => {
        let apiType = t
        if (t === "Squat") apiType = "Squat"
        if (t === "SSquat") apiType = "SSquat"
        if (t === "Joint") apiType = "Joint"
        params.append("type_defaut", apiType)
      })

      // Gestion des filtres de statut
      ;(filters.statut || []).forEach((s) => {
        params.append("statut", s)
      })

      // Gestion des filtres de zone/région
      if (filters.zone && filters.zone !== "all") {
        params.append("region", filters.zone)
      }
      if (filters.region && filters.region !== "all") {
        params.append("region", filters.region)
      }

      // Gestion du trajet
      if (filters.trajet && filters.trajet !== "all") {
        params.append("trajet", filters.trajet)
      }

      // Gestion de la date
      if (filters.date) {
        params.append("date", filters.date)
      }

      // Gestion de la recherche
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim())
      }

      params.append("page", "1")
      params.append("limit", "1000")

      console.log("🔍 Paramètres envoyés à l'API:", params.toString())

      const response = await fetch(`http://localhost:8000/defauts/filter?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log("📊 Données reçues:", data.length, "défauts")

      const normalizedData = data.map((d) => ({
        ...d,
        type_defaut: normalizeDefectType(d.type_defaut),
      }))

      setFilteredDefauts(normalizedData)
    } catch (error) {
      console.error("Erreur lors de la récupération des défauts filtrés:", error)
      try {
        const response = await fetch("http://localhost:8000/defauts")
        const data = await response.json()

        const normalizedData = data.map((d) => ({
          ...d,
          type_defaut: normalizeDefectType(d.type_defaut),
        }))

        setFilteredDefauts(normalizedData)
      } catch (fallbackError) {
        console.error("Erreur lors du chargement des défauts:", fallbackError)
        setFilteredDefauts([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Gestionnaires de changement de filtres
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleArrayFilterChange = (key, value) => {
    setFilters((prev) => {
      const currentArray = prev[key] || []
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [key]: currentArray.filter((item) => item !== value),
        }
      } else {
        return {
          ...prev,
          [key]: [...currentArray, value],
        }
      }
    })
  }

  const handleRemoveFilter = (key, value) => {
    console.log("Suppression filtre:", key, value)
    setFilters((prev) => {
      const updatedFilters = { ...prev }

      if (Array.isArray(updatedFilters[key])) {
        updatedFilters[key] = updatedFilters[key].filter((item) => item !== value)
      } else {
        updatedFilters[key] = key === "zone" || key === "region" || key === "trajet" ? "all" : ""
      }

      return updatedFilters
    })

    // Supprimer aussi de searchQuery si c'est une recherche
    if (key === "searchQuery" || key === "search") {
      setSearchQuery("")
    }
  }

  const handleClearAllFilters = () => {
    setFilters({
      gravite: [],
      statut: [],
      typeDefaut: [],
      zone: "all",
      trajet: "all",
      niveau_defaut: [],
      type_defaut: [],
      region: "all",
      date: "",
    })
    setSearchQuery("")
  }

  const applyFilters = () => {
    console.log("Application des filtres:", filters)
    fetchFilteredDefauts()
  }

  // Auto-application des filtres avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchFilteredDefauts()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [filters, searchQuery])

  // Créer l'objet activeFilters pour le composant ActiveFiltersSummary
  const activeFilters = {
    ...filters,
    searchQuery: searchQuery.toLowerCase(),
    search: searchQuery.toLowerCase(),
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-screen-xl mx-auto w-full">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-center md:text-left">Rail Defect Dashboard</h1>

        {/* Affichage d'un message si un défaut spécifique est sélectionné */}
        {defectId && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              🎯 Défaut sélectionné : <strong>{defectId}</strong>
            </p>
          </div>
        )}

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className={`relative rounded-md shadow-sm ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`block w-full rounded-md border ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              } pl-10 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Rechercher par trajet, région, description ou type de défaut..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                onClick={applyFilters}
                disabled={isLoading}
                className={`h-full rounded-l-none ${
                  isDark ? "bg-[#0a3172] hover:bg-[#072758] text-white" : "bg-[#0a3172] hover:bg-[#072758] text-white"
                }`}
              >
                {isLoading ? "..." : "Rechercher"}
              </Button>
            </div>
          </div>
        </div>

        {/* Grilles de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Défauts critiques"
            value={stats.critiques}
            icon={<AlertCircle className={`h-6 w-6 ${isDark ? "text-red-300" : "text-red-700"}`} />}
            color="red"
            percent={stats.total > 0 ? (stats.critiques / stats.total) * 100 : 0}
          />
          <StatCard
            title="En attente"
            value={stats.enAttente}
            icon={<Clock className={`h-6 w-6 ${isDark ? "text-yellow-300" : "text-yellow-700"}`} />}
            color="yellow"
            percent={stats.total > 0 ? (stats.enAttente / stats.total) * 100 : 0}
          />
          <StatCard
            title="En cours de réparation"
            value={stats.enCours}
            icon={<Wrench className={`h-6 w-6 ${isDark ? "text-blue-300" : "text-blue-700"}`} />}
            color="blue"
            percent={stats.total > 0 ? (stats.enCours / stats.total) * 100 : 0}
          />
          <StatCard
            title="Résolus"
            value={stats.resolus}
            icon={<CheckCircle className={`h-6 w-6 ${isDark ? "text-green-300" : "text-green-700"}`} />}
            color="green"
            percent={stats.total > 0 ? (stats.resolus / stats.total) * 100 : 0}
          />
        </div>

        {/* Filtres actifs */}
        <ActiveFiltersSummary
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />

        {/* Bouton pour afficher/masquer les filtres sur mobile */}
        <div className="md:hidden mb-4">
          <Button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            variant="outline"
            className={`w-full ${isDark ? "border-gray-700" : "border-blue-200"}`}
          >
            <Filter className="mr-2 h-4 w-4" />
            {isFilterOpen ? "Masquer les filtres" : "Afficher les filtres"}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Carte interactive */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden shadow">
              <Map
                highlightDefectId={defectId}
                filters={activeFilters}
                defauts={filteredDefauts}
                searchQuery={searchQuery}
              />
            </div>
          </div>

          {/* Section des filtres */}
          <div className={`${isFilterOpen || "hidden md:block"} w-full md:w-1/3 lg:w-1/4 h-full`}>
            <Card className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100"} h-full`}>
              <CardContent className="p-4 flex flex-col h-full">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filtres
                </h2>

                <div className="space-y-4 flex-grow overflow-y-auto">
                  {/* Filtre par type de défaut */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Type de défaut</h3>
                    <div className="space-y-2">
                      <SimpleCheckbox
                        id="joint"
                        checked={filters.type_defaut.includes("Joint") || filters.typeDefaut.includes("Joint")}
                        onChange={() => {
                          handleArrayFilterChange("type_defaut", "Joint")
                          handleArrayFilterChange("typeDefaut", "Joint")
                        }}
                        label="Joint"
                      />
                      <SimpleCheckbox
                        id="squat"
                        checked={filters.type_defaut.includes("Squat") || filters.typeDefaut.includes("Squat")}
                        onChange={() => {
                          handleArrayFilterChange("type_defaut", "Squat")
                          handleArrayFilterChange("typeDefaut", "Squat")
                        }}
                        label="Squat"
                      />
                      <SimpleCheckbox
                        id="ssquat"
                        checked={filters.type_defaut.includes("SSquat") || filters.typeDefaut.includes("SSquat")}
                        onChange={() => {
                          handleArrayFilterChange("type_defaut", "SSquat")
                          handleArrayFilterChange("typeDefaut", "SSquat")
                        }}
                        label="SSquat"
                      />
                    </div>
                  </div>

                  <hr className={isDark ? "border-gray-700" : "border-gray-200"} />

                  {/* Filtre par niveau de défaut (gravité) */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Niveau de gravité</h3>
                    <div className="space-y-2">
                      <SimpleCheckbox
                        id="critique"
                        checked={filters.niveau_defaut.includes("Critique") || filters.gravite.includes("critique")}
                        onChange={() => {
                          handleArrayFilterChange("niveau_defaut", "Critique")
                          handleArrayFilterChange("gravite", "critique")
                        }}
                        label="Critique"
                      />
                      <SimpleCheckbox
                        id="modere"
                        checked={filters.niveau_defaut.includes("Modéré") || filters.gravite.includes("modere")}
                        onChange={() => {
                          handleArrayFilterChange("niveau_defaut", "Modéré")
                          handleArrayFilterChange("gravite", "modere")
                        }}
                        label="Modéré"
                      />
                      <SimpleCheckbox
                        id="mineur"
                        checked={filters.niveau_defaut.includes("Mineur") || filters.gravite.includes("mineur")}
                        onChange={() => {
                          handleArrayFilterChange("niveau_defaut", "Mineur")
                          handleArrayFilterChange("gravite", "mineur")
                        }}
                        label="Mineur"
                      />
                    </div>
                  </div>

                  <hr className={isDark ? "border-gray-700" : "border-gray-200"} />

                  {/* Filtre par statut */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Statut</h3>
                    <div className="space-y-2">
                      <SimpleCheckbox
                        id="enAttente"
                        checked={filters.statut.includes("enAttente")}
                        onChange={() => handleArrayFilterChange("statut", "enAttente")}
                        label="En attente"
                      />
                      <SimpleCheckbox
                        id="enCours"
                        checked={filters.statut.includes("enCours")}
                        onChange={() => handleArrayFilterChange("statut", "enCours")}
                        label="En cours de réparation"
                      />
                      <SimpleCheckbox
                        id="resolu"
                        checked={filters.statut.includes("resolu")}
                        onChange={() => handleArrayFilterChange("statut", "resolu")}
                        label="Résolu"
                      />
                    </div>
                  </div>

                  <hr className={isDark ? "border-gray-700" : "border-gray-200"} />

                  {/* Filtre par zone/région */}
                  <SimpleSelect
                    id="region"
                    value={filters.region !== "all" ? filters.region : filters.zone}
                    onChange={(value) => {
                      handleFilterChange("region", value)
                      handleFilterChange("zone", value)
                    }}
                    label="Zone/Région"
                    options={[
                      { value: "all", label: "Toutes les zones" },
                      { value: "A", label: "Zone A" },
                      { value: "B", label: "Zone B" },
                      { value: "C", label: "Zone C" },
                      { value: "Alger", label: "Alger" },
                      { value: "Oran", label: "Oran" },
                      { value: "Constantine", label: "Constantine" },
                      { value: "Annaba", label: "Annaba" },
                      { value: "Blida", label: "Blida" },
                      { value: "Sétif", label: "Sétif" },
                      { value: "Tlemcen", label: "Tlemcen" },
                      { value: "Béjaïa", label: "Béjaïa" },
                      { value: "Batna", label: "Batna" },
                    ]}
                  />

                  {/* Filtre par trajet */}
                  <SimpleSelect
                    id="trajet"
                    value={filters.trajet}
                    onChange={(value) => handleFilterChange("trajet", value)}
                    label="Trajet"
                    options={[
                      { value: "all", label: "Tous les trajets" },
                      { value: "alger-constantine", label: "Alger - Constantine" },
                      { value: "alger-oran", label: "Alger - Oran" },
                      { value: "oran-bejaia", label: "Oran - Bejaia" },
                    ]}
                  />

                  {/* Filtre par date */}
                  <div className="space-y-1">
                    <label
                      htmlFor="date"
                      className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      className={`block w-full rounded-md border ${
                        isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={filters.date}
                      onChange={(e) => handleFilterChange("date", e.target.value)}
                    />
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Button
                    onClick={applyFilters}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? "Chargement..." : "Appliquer les filtres"}
                  </Button>
                  <Button onClick={handleClearAllFilters} variant="outline" className="w-full">
                    Effacer tous les filtres
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Indicateur de statut */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {isLoading ? "Chargement des défauts..." : `${filteredDefauts.length} défaut(s) trouvé(s)`}
        </div>
      </div>
    </Layout>
  )
}
