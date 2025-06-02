"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Map from "@/components/Map";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, Clock, CheckCircle, Wrench, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Composant pour une carte statistique
const StatCard = ({ title, value, icon, color, percent = 100 }) => {
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <Card
      className={
        isDark
          ? "bg-transparent border-gray-700"
          : "bg-white border-blue-100 shadow-none"
      }
    >
      <CardContent className="px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="leading-tight">
            <p
              className={`text-sm font-bold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {title}
            </p>
            <h3 className="text-lg font-extrabold">{value}</h3>
          </div>
          <div
            className={`p-1 rounded ${
              isDark ? `${color}-900/30` : `${color}-100`
            }`}
          >
            {icon}
          </div>
        </div>
        <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-1 bg-${color}-600 rounded-full`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant simple pour remplacer Checkbox
const SimpleCheckbox = ({ id, checked, onChange, label }) => {
  const isDark = document.documentElement.classList.contains("dark");
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label
        htmlFor={id}
        className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
      >
        {label}
      </label>
    </div>
  );
};

// Composant simple pour remplacer Select
const SimpleSelect = ({ id, value, onChange, options, label }) => {
  const isDark = document.documentElement.classList.contains("dark");
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className={`block text-sm font-medium ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full rounded-md border ${
          isDark
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300 text-gray-900"
        } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
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

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const defectId = searchParams.get("defectId");
  const [stats, setStats] = useState({
    total: 0,
    critiques: 0,
    enAttente: 0,
    enCours: 0,
    resolus: 0,
  });
  const [isDark, setIsDark] = useState(false);
  const [filters, setFilters] = useState({
    gravite: [],
    zone: "all",
    trajet: "all",
    date: "",
    statut: [],
    typeDefaut: [], // Ajout du filtre pour le type de défaut
  });
  const [filteredDefauts, setFilteredDefauts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setActiveFilters({
      ...filters,
      searchQuery: searchQuery.toLowerCase(),
    });
  }, [filters, searchQuery]);

  useEffect(() => {
    if (filteredDefauts && filteredDefauts.length > 0) {
      const total = filteredDefauts.length;
      const critiques = filteredDefauts.filter(
        (d) => d.niveau_defaut?.toLowerCase() === "critique"
      ).length;
      const enAttente = filteredDefauts.filter(
        (d) =>
          d.statut?.toLowerCase() === "en attente" ||
          d.statut?.toLowerCase() === "enattente"
      ).length;
      const enCours = filteredDefauts.filter(
        (d) =>
          d.statut?.toLowerCase() === "en cours" ||
          d.statut?.toLowerCase() === "encours"
      ).length;
      const resolus = filteredDefauts.filter(
        (d) =>
          d.statut?.toLowerCase() === "résolu" ||
          d.statut?.toLowerCase() === "resolu"
      ).length;

      setStats({
        total,
        critiques,
        enAttente,
        enCours,
        resolus,
      });
    } else {
      setStats({
        total: 0,
        critiques: 0,
        enAttente: 0,
        enCours: 0,
        resolus: 0,
      });
    }
  }, [filteredDefauts]);

  useEffect(() => {
    // Observer le thème
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Log du défaut sélectionné
    if (defectId) console.log(`Défaut sélectionné: ${defectId}`);

    return () => observer.disconnect();
  }, [defectId]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleGraviteChange = (value) => {
    setFilters((prev) => {
      const newGravite = [...prev.gravite];
      if (newGravite.includes(value)) {
        return {
          ...prev,
          gravite: newGravite.filter((g) => g !== value),
        };
      } else {
        return {
          ...prev,
          gravite: [...newGravite, value],
        };
      }
    });
  };

  const handleStatutChange = (value) => {
    setFilters((prev) => {
      const newStatut = [...prev.statut];
      if (newStatut.includes(value)) {
        return {
          ...prev,
          statut: newStatut.filter((s) => s !== value),
        };
      } else {
        return {
          ...prev,
          statut: [...newStatut, value],
        };
      }
    });
  };

  const handleTypeDefautChange = (value) => {
    setFilters((prev) => {
      const newTypeDefaut = [...prev.typeDefaut];
      if (newTypeDefaut.includes(value)) {
        return {
          ...prev,
          typeDefaut: newTypeDefaut.filter((t) => t !== value),
        };
      } else {
        return {
          ...prev,
          typeDefaut: [...newTypeDefaut, value],
        };
      }
    });
  };

  const applyFilters = () => {
    console.log("Filtres appliqués:", filters);
    setActiveFilters({
      ...filters,
      searchQuery: searchQuery.toLowerCase(),
    });
    fetchFilteredDefauts();
  };

  const resetFilters = () => {
    setFilters({
      gravite: [],
      zone: "all",
      trajet: "all",
      date: "",
      statut: [],
      typeDefaut: [], // Réinitialiser le filtre de type de défaut
    });
    setSearchQuery("");
    setActiveFilters(null);
  };

  const handleRemoveFilter = (key, value) => {
    console.log("Suppression filtre :", key, value);
    const updatedFilters = { ...filters };

    if (Array.isArray(updatedFilters[key])) {
      // Ex: gravite, statut, typeDefaut
      updatedFilters[key] = updatedFilters[key].filter(
        (item) => item !== value
      );
    } else {
      // Ex: zone, trajet, date
      updatedFilters[key] = key === "zone" || key === "trajet" ? "all" : "";
    }

    setFilters(updatedFilters);
  };

  const fetchFilteredDefauts = async () => {
    try {
      const params = new URLSearchParams();

      filters.gravite.forEach((g) => params.append("niveau_defaut", g));
      filters.typeDefaut.forEach((t) => params.append("type_defaut", t));
      filters.statut.forEach((s) => params.append("statut", s));
      if (filters.zone && filters.zone !== "all")
        params.append("region", filters.zone);
      if (filters.trajet && filters.trajet !== "all")
        params.append("trajet", filters.trajet);
      if (filters.date) params.append("date", filters.date);
      if (searchQuery) params.append("search", searchQuery);
      params.append("page", "1");
      params.append("limit", "100");

      const res = await fetch(
        `http://localhost:8000/defauts/filter?${params.toString()}`
      );
      const data = await res.json();
      setFilteredDefauts(data);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des défauts filtrés :",
        err
      );
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-screen-xl mx-auto w-full">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-center md:text-left">
          Rail Defect Dashboard
        </h1>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div
            className={`relative rounded-md shadow-sm ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                className={`h-5 w-5 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              />
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
              placeholder="Rechercher un trajet (ex: Alger Oran)"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                onClick={applyFilters}
                className={`h-full rounded-l-none ${
                  isDark
                    ? "bg-[#0a3172] hover:bg-[#072758] text-white"
                    : "bg-[#0a3172] hover:bg-[#072758] text-white"
                }`}
              >
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        {/* Grilles de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Défauts critiques"
            value={stats.critiques}
            icon={
              <AlertCircle
                className={`h-6 w-6 ${
                  isDark ? "text-red-300" : "text-red-700"
                }`}
              />
            }
            color="red"
            percent={(stats.critiques / stats.total) * 100}
          />
          <StatCard
            title="En attente"
            value={stats.enAttente}
            icon={
              <Clock
                className={`h-6 w-6 ${
                  isDark ? "text-yellow-300" : "text-yellow-700"
                }`}
              />
            }
            color="yellow"
            percent={(stats.enAttente / stats.total) * 100}
          />
          <StatCard
            title="En cours de réparation"
            value={stats.enCours}
            icon={
              <Wrench
                className={`h-6 w-6 ${
                  isDark ? "text-blue-300" : "text-blue-700"
                }`}
              />
            }
            color="blue"
            percent={(stats.enCours / stats.total) * 100}
          />
          <StatCard
            title="Résolus"
            value={stats.resolus}
            icon={
              <CheckCircle
                className={`h-6 w-6 ${
                  isDark ? "text-green-300" : "text-green-700"
                }`}
              />
            }
            color="green"
            percent={(stats.resolus / stats.total) * 100}
          />
        </div>

        <ActiveFiltersSummary
          filters={activeFilters}
          onRemove={handleRemoveFilter}
        />

        {/* Bouton pour afficher/masquer les filtres sur mobile */}
        <div className="md:hidden mb-4">
          <Button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            variant="outline"
            className={`w-full ${
              isDark ? "border-gray-700" : "border-blue-200"
            }`}
          >
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
              />
            </div>
          </div>

          {/* Section des filtres */}
          <div
            className={`${
              isFilterOpen || "hidden md:block"
            } w-full md:w-1/3 lg:w-1/4 h-full`}
          >
            <Card
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-blue-100"
              } h-full`}
            >
              <CardContent className="p-4 flex flex-col h-full">
                <h2 className="text-lg font-semibold mb-4">Filtres</h2>

                <div className="space-y-4 flex-grow">
                  {/* Filtre par gravité */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Gravité</h3>
                    <div className="flex flex-wrap gap-2">
                      <SimpleCheckbox
                        id="critique"
                        checked={filters.gravite.includes("critique")}
                        onChange={() => handleGraviteChange("critique")}
                        label={
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            Critique
                          </span>
                        }
                      />
                      <SimpleCheckbox
                        id="modere"
                        checked={filters.gravite.includes("modere")}
                        onChange={() => handleGraviteChange("modere")}
                        label={
                          <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                            Modéré
                          </span>
                        }
                      />
                      <SimpleCheckbox
                        id="mineur"
                        checked={filters.gravite.includes("mineur")}
                        onChange={() => handleGraviteChange("mineur")}
                        label={
                          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                            Mineur
                          </span>
                        }
                      />
                    </div>
                  </div>

                  {/* Filtre par type de défaut */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Type de défaut</h3>
                    <div className="flex flex-wrap gap-2">
                      <SimpleCheckbox
                        id="joint"
                        checked={filters.typeDefaut.includes("Joint")}
                        onChange={() => handleTypeDefautChange("Joint")}
                        label="Joint"
                      />
                      <SimpleCheckbox
                        id="squat"
                        checked={filters.typeDefaut.includes("Squad")}
                        onChange={() => handleTypeDefautChange("Squad")}
                        label="Squat"
                      />
                      <SimpleCheckbox
                        id="ssquat"
                        checked={filters.typeDefaut.includes("SSquad")}
                        onChange={() => handleTypeDefautChange("SSquad")}
                        label="SSquat"
                      />
                    </div>
                  </div>

                  <hr
                    className={isDark ? "border-gray-700" : "border-gray-200"}
                  />

                  {/* Filtre par zone */}
                  <SimpleSelect
                    id="zone"
                    value={filters.zone}
                    onChange={(value) => handleFilterChange("zone", value)}
                    label="Zone"
                    options={[
                      { value: "all", label: "Toutes les zones" },
                      { value: "A", label: "Zone A" },
                      { value: "B", label: "Zone B" },
                      { value: "C", label: "Zone C" },
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
                      {
                        value: "alger-constantine",
                        label: "Alger - Constantine",
                      },
                      { value: "alger-oran", label: "Alger - Oran" },
                      { value: "oran-bejaia", label: "Oran - Bejaia" },
                    ]}
                  />

                  <hr
                    className={isDark ? "border-gray-700" : "border-gray-200"}
                  />

                  {/* Filtre par date - Simplifié */}
                  <div className="space-y-1">
                    <label
                      htmlFor="date"
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      className={`block w-full rounded-md border ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={filters.date}
                      onChange={(e) =>
                        handleFilterChange("date", e.target.value)
                      }
                    />
                  </div>

                  <hr
                    className={isDark ? "border-gray-700" : "border-gray-200"}
                  />

                  {/* Filtre par statut */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Statut</h3>
                    <div className="space-y-2">
                      <SimpleCheckbox
                        id="enAttente"
                        checked={filters.statut.includes("enAttente")}
                        onChange={() => handleStatutChange("enAttente")}
                        label="En attente"
                      />
                      <SimpleCheckbox
                        id="enCours"
                        checked={filters.statut.includes("enCours")}
                        onChange={() => handleStatutChange("enCours")}
                        label="En cours de réparation"
                      />
                      <SimpleCheckbox
                        id="resolu"
                        checked={filters.statut.includes("resolu")}
                        onChange={() => handleStatutChange("resolu")}
                        label="Résolu"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 mt-auto">
                  <Button
                    onClick={applyFilters}
                    className={`flex-1 ${
                      isDark
                        ? "bg-[#0a3172] hover:bg-[#072758] text-white"
                        : "bg-[#0a3172] hover:bg-[#072758] text-white"
                    }`}
                  >
                    Appliquer
                  </Button>
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className={`flex-1 ${
                      isDark
                        ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                        : "border-gray-300 text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
