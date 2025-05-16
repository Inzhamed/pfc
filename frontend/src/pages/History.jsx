"use client"

import { useState, useEffect, useMemo } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Search, Filter, FileText, User, Clock, Loader2, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const sampleData = [
  {
    id: "D-2023-001",
    type: "joint",
    status: "réparé",
    date: "2023-05-15",
    line: "ALGER-ORAN",
    technician: {
      name: "Karim Bensaid",
      matricule: "TECH-7890",
      function: "Technicien expert",
      interventionDate: "2023-05-16",
    },
    location: {
      pk: "PK 15+780",
      lat: 36.7654,
      lng: 3.0567,
    },
  },
  {
    id: "D-2023-002",
    type: "squat",
    status: "non réparable",
    date: "2023-06-22",
    line: "Ligne B",
    technician: {
      name: "Leila Amrani",
      matricule: "TECH-4561",
      function: "Chef d'équipe",
      interventionDate: "2023-06-25",
    },
    location: {
      pk: "PK 8+230",
      lat: 36.7123,
      lng: 3.0987,
    },
  },
]

const typeConfig = {
  joint: { label: "Joint", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  squat: { label: "Squat", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  ssquat: { label: "SSquat", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
}

const statusConfig = {
  réparé: { label: "Réparé", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  reporté: { label: "Reporté", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  "non réparable": { label: "Non réparable", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },
}

export default function History() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedID, setSelectedID] = useState(null)
  const [filters, setFilters] = useState({ status: "all", search: "" })
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Vérifier si le mode sombre est activé
    const savedTheme = localStorage.getItem("theme")
    setDarkMode(savedTheme === "dark")

    // Écouter les changements de thème
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setDarkMode(document.documentElement.classList.contains("dark"))
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    // Simulate API fetch
    setLoading(true)
    setTimeout(() => {
      setData(sampleData)
      setLoading(false)
    }, 800)

    return () => observer.disconnect()
  }, [])

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        (filters.status === "all" || item.status === filters.status) &&
        (!filters.search || item.id.toLowerCase().includes(filters.search.toLowerCase())),
    )
  }, [data, filters])

  const selectedItem = useMemo(() => data.find((item) => item.id === selectedID), [data, selectedID])

  const formatDate = (dateString) => format(new Date(dateString), "dd MMMM yyyy", { locale: fr })

  const openMap = (lat, lng) => window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank")

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Titre de page cohérent avec report.jsx */}
      <div className={`mb-8 pb-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${darkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
              <AlertTriangle className={`w-6 h-6 ${darkMode ? "text-blue-300" : "text-blue-700"}`} />
            </div>
            <h2 className="text-2xl font-bold">Historique des Défauts</h2>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Rechercher par ID..."
            className={`pl-10 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100"}`}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Button
          variant="outline"
          className={`${darkMode ? "border-gray-600 hover:bg-gray-700" : "border-blue-200 hover:bg-blue-50"}`}
          onClick={() => setFilters({ status: "all", search: "" })}
        >
          <Filter className="mr-2 h-5 w-5" />
          Réinitialiser
        </Button>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : (
        <>
          <div
            className={`rounded-lg border ${darkMode ? "border-gray-700 bg-gray-800" : "border-blue-100 bg-white"} shadow-sm`}
          >
            <Table>
              <TableHeader className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <TableRow>
                  <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>ID</TableHead>
                  <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Type</TableHead>
                  <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Statut</TableHead>
                  <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Date</TableHead>
                  <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow
                    key={item.id}
                    className={darkMode ? "hover:bg-gray-700 border-gray-700" : "hover:bg-gray-50 border-gray-200"}
                  >
                    <TableCell className="font-mono font-medium">{item.id}</TableCell>
                    <TableCell>
                      <Badge className={typeConfig[item.type]?.color}>{typeConfig[item.type]?.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[item.status]?.color}>{statusConfig[item.status]?.label}</Badge>
                    </TableCell>
                    <TableCell className={darkMode ? "text-gray-300" : "text-gray-600"}>
                      {formatDate(item.date)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className={darkMode ? "border-gray-600 hover:bg-gray-700" : "border-blue-200 hover:bg-blue-50"}
                        onClick={() => setSelectedID(item.id)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Modal de détails */}
          {selectedItem && (
            <Dialog open={!!selectedID} onOpenChange={() => setSelectedID(null)}>
              <DialogContent className={`max-w-4xl ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <DialogHeader>
                  <DialogTitle className={darkMode ? "text-blue-300" : "text-blue-900"}>
                    <div className="flex items-center gap-3">
                      <span className={`font-mono ${darkMode ? "bg-blue-900/30" : "bg-blue-100"} px-4 py-2 rounded-md`}>
                        {selectedItem.id}
                      </span>
                      <Badge className={typeConfig[selectedItem.type]?.color}>
                        {typeConfig[selectedItem.type]?.label}
                      </Badge>
                    </div>
                  </DialogTitle>
                  <DialogDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    {selectedItem.line} • Détecté le {formatDate(selectedItem.date)}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-blue-100"}>
                    <CardHeader className="pb-3">
                      <h3
                        className={`text-lg font-semibold ${darkMode ? "text-blue-300" : "text-blue-900"} flex items-center gap-2`}
                      >
                        <User className="h-5 w-5" />
                        Responsable technique
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className={darkMode ? "text-sm text-gray-400 mb-1" : "text-sm text-gray-600 mb-1"}>
                          Nom complet
                        </p>
                        <p className={darkMode ? "text-white" : "text-gray-900"}>{selectedItem.technician.name}</p>
                      </div>
                      <div>
                        <p className={darkMode ? "text-sm text-gray-400 mb-1" : "text-sm text-gray-600 mb-1"}>
                          Matricule
                        </p>
                        <p className={`font-mono ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {selectedItem.technician.matricule}
                        </p>
                      </div>
                      <div>
                        <p className={darkMode ? "text-sm text-gray-400 mb-1" : "text-sm text-gray-600 mb-1"}>
                          Fonction
                        </p>
                        <p className={darkMode ? "text-white" : "text-gray-900"}>{selectedItem.technician.function}</p>
                      </div>
                      <div>
                        <p className={darkMode ? "text-sm text-gray-400 mb-1" : "text-sm text-gray-600 mb-1"}>
                          Date intervention
                        </p>
                        <p className={`${darkMode ? "text-white" : "text-gray-900"} flex items-center gap-2`}>
                          <Clock className="h-4 w-4" />
                          {formatDate(selectedItem.technician.interventionDate)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-blue-100"}>
                    <CardHeader className="pb-3">
                      <h3 className={`text-lg font-semibold ${darkMode ? "text-blue-300" : "text-blue-900"}`}>
                        Localisation du défaut
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className={darkMode ? "text-sm text-gray-400 mb-1" : "text-sm text-gray-600 mb-1"}>
                          Point kilométrique
                        </p>
                        <p className={`font-mono ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {selectedItem.location.pk}
                        </p>
                      </div>
                      <div>
                        <p className={darkMode ? "text-sm text-gray-400 mb-1" : "text-sm text-gray-600 mb-1"}>
                          Ligne ferroviaire
                        </p>
                        <p className={darkMode ? "text-white" : "text-gray-900"}>{selectedItem.line}</p>
                      </div>
                      <Button
                        onClick={() => openMap(selectedItem.location.lat, selectedItem.location.lng)}
                        className="w-full mt-4 bg-[#0a3172] hover:bg-[#0a3172]/90 text-white h-11"
                      >
                        Voir sur Google Maps
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  )
}
