"use client"
<<<<<<< Updated upstream
import { useState, useEffect, useMemo } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Train, Search, Filter, FileText, User, Clock, Loader2, Moon, Sun, AlertTriangle } from "lucide-react"
=======

import { useState, useEffect, useMemo } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Train, Search, Filter, FileText, User, Clock, Loader2, Moon, Sun, AlertTriangle, MapPin } from "lucide-react"
>>>>>>> Stashed changes
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
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
<<<<<<< Updated upstream
=======
    description: "Fissure longitudinale sur joint de rail de 20cm",
>>>>>>> Stashed changes
    technician: {
      name: "Karim Bensaid",
      matricule: "TECH-7890",
      function: "Technicien expert",
      interventionDate: "2023-05-16"
    },
    location: {
      pk: "PK 15+780",
      lat: 36.7654,
      lng: 3.0567
    }
  },
  {
    id: "D-2023-002",
    type: "squat",
    status: "non réparable",
    date: "2023-06-22",
<<<<<<< Updated upstream
    line: "Ligne B",
=======
    line: "ALGER-CONSTANTINE",
    description: "Déformation importante due au squatting",
>>>>>>> Stashed changes
    technician: {
      name: "Leila Amrani",
      matricule: "TECH-4561",
      function: "Chef d'équipe",
      interventionDate: "2023-06-25"
    },
    location: {
      pk: "PK 8+230",
      lat: 36.7123,
      lng: 3.0987
    }
  }
]

const typeConfig = {
  joint: { label: "Joint", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  squat: { label: "Squat", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  ssquat: { label: "SSquat", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" }
}

const statusConfig = {
  "réparé": { label: "Réparé", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  "reporté": { label: "Reporté", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  "non réparable": { label: "Non réparable", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" }
}

export default function History() {
  const [darkMode, setDarkMode] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedID, setSelectedID] = useState(null)
  const [filters, setFilters] = useState({ status: "all", search: "" })

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }

<<<<<<< Updated upstream
    // Simulate API fetch
=======
    // Simuler un appel API
>>>>>>> Stashed changes
    setLoading(true)
    setTimeout(() => {
      setData(sampleData)
      setLoading(false)
    }, 800)
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const filteredData = useMemo(() => {
    return data.filter(item =>
      (filters.status === "all" || item.status === filters.status) &&
<<<<<<< Updated upstream
      (!filters.search || item.id.toLowerCase().includes(filters.search.toLowerCase()))
=======
      (!filters.search || 
        item.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.technician.matricule.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.technician.name.toLowerCase().includes(filters.search.toLowerCase()))
>>>>>>> Stashed changes
    )
  }, [data, filters])

  const selectedItem = useMemo(() => data.find(item => item.id === selectedID), [data, selectedID])

  const formatDate = (dateString) =>
    format(new Date(dateString), "dd MMMM yyyy", { locale: fr })

  const openMap = (lat, lng) => window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
<<<<<<< Updated upstream
      {/* Header identique à report.jsx */}
=======
>>>>>>> Stashed changes
      <header className={`w-full py-4 px-6 ${darkMode ? "bg-gray-800" : "bg-[#0a3172]"} text-white shadow-md`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Train className="w-6 h-6" />
            <h1 className="text-xl font-bold">SNTF</h1>
          </div>
          <div className="text-sm opacity-90">Système de Détection des Défauts de Rails</div>
          <Button
            variant={darkMode ? "outline" : "ghost"}
            onClick={toggleTheme}
            className="flex items-center gap-2"
            aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-4">
<<<<<<< Updated upstream
        {/* Titre de page cohérent avec report.jsx */}
=======
>>>>>>> Stashed changes
        <div className={`mb-8 pb-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${darkMode ? "bg-blue-900" : "bg-blue-100"}`}>
                <AlertTriangle className={`w-6 h-6 ${darkMode ? "text-blue-300" : "text-blue-700"}`} />
              </div>
              <h2 className="text-2xl font-bold">Historique des Défauts</h2>
            </div>
          </div>
        </div>

<<<<<<< Updated upstream
        {/* Filtres */}
=======
>>>>>>> Stashed changes
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="relative w-full">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            <Input
<<<<<<< Updated upstream
              placeholder="Rechercher par ID..."
=======
              placeholder="Rechercher par ID, matricule ou nom..."
>>>>>>> Stashed changes
              className={`pl-10 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-blue-100"}`}
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

<<<<<<< Updated upstream
        {/* Tableau */}
=======
>>>>>>> Stashed changes
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : (
          <>
            <div className={`rounded-lg border ${darkMode ? "border-gray-700 bg-gray-800" : "border-blue-100 bg-white"} shadow-sm`}>
              <Table>
                <TableHeader className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                  <TableRow>
                    <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>ID</TableHead>
<<<<<<< Updated upstream
=======
                    <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Matricule</TableHead>
>>>>>>> Stashed changes
                    <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Type</TableHead>
                    <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Statut</TableHead>
                    <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Date</TableHead>
                    <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                      <TableCell className="font-mono font-medium">{item.id}</TableCell>
<<<<<<< Updated upstream
=======
                      <TableCell className="font-mono">{item.technician.matricule}</TableCell>
>>>>>>> Stashed changes
                      <TableCell>
                        <Badge className={typeConfig[item.type]?.color}>
                          {typeConfig[item.type]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[item.status]?.color}>
                          {statusConfig[item.status]?.label}
                        </Badge>
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

<<<<<<< Updated upstream
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
                        <h3 className={`text-lg font-semibold ${darkMode ? "text-blue-300" : "text-blue-900"} flex items-center gap-2`}>
                          <User className="h-5 w-5" />
                          Responsable technique
                        </h3>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Nom complet</p>
                          <p className={darkMode ? "text-white" : "text-gray-900"}>{selectedItem.technician.name}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Matricule</p>
                          <p className={`font-mono ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedItem.technician.matricule}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Fonction</p>
                          <p className={darkMode ? "text-white" : "text-gray-900"}>{selectedItem.technician.function}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Date intervention</p>
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
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Point kilométrique</p>
                          <p className={`font-mono ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedItem.location.pk}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Ligne ferroviaire</p>
                          <p className={darkMode ? "text-white" : "text-gray-900"}>{selectedItem.line}</p>
                        </div>
                        <Button
                          onClick={() => openMap(selectedItem.location.lat, selectedItem.location.lng)}
                          className={`w-full mt-4 ${darkMode ? "bg-blue-800 hover:bg-blue-900" : "bg-blue-600 hover:bg-blue-700"} text-white h-11`}
                        >
                          Voir sur Google Maps
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
=======
            {selectedItem && (
              <Dialog open={!!selectedID} onOpenChange={() => setSelectedID(null)}>
  <DialogContent className={`max-w-[95vw] max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
    <DialogHeader>
      <DialogTitle className={darkMode ? "text-blue-300" : "text-blue-900"}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`font-mono ${darkMode ? "bg-blue-900/30" : "bg-blue-100"} px-3 py-1 rounded-md text-sm`}>
            {selectedItem.id}
          </span>
          <Badge className={typeConfig[selectedItem.type]?.color}>
            {typeConfig[selectedItem.type]?.label}
          </Badge>
          <Badge className={statusConfig[selectedItem.status]?.color}>
            {statusConfig[selectedItem.status]?.label}
          </Badge>
        </div>
      </DialogTitle>
      <DialogDescription className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        {selectedItem.line} • Détecté le {formatDate(selectedItem.date)}
      </DialogDescription>
    </DialogHeader>

    <div className="grid grid-cols-1 gap-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Carte Technicien */}
        <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-blue-100"}>
          <CardHeader className="pb-3">
            <h3 className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? "text-blue-300" : "text-blue-900"}`}>
              <User className="h-4 w-4" />
              Responsable technique
            </h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Nom du technicien</p>
              <p className={`text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedItem.technician.name}</p>
            </div>
            <div>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Matricule</p>
              <p className={`text-sm font-mono ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedItem.technician.matricule}</p>
            </div>
            <div>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Fonction</p>
              <p className={`text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedItem.technician.function}</p>
            </div>
            <div>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Date </p>
              <p className={`text-sm ${darkMode ? "text-white" : "text-gray-900"} flex items-center gap-2`}>
                <Clock className="h-3 w-3" />
                {formatDate(selectedItem.technician.interventionDate)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Carte Localisation */}
        <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-blue-100"}>
          <CardHeader className="pb-3">
            <h3 className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? "text-blue-300" : "text-blue-900"}`}>
              <MapPin className="h-4 w-4" />
              Localisation
            </h3>
          </CardHeader>
          <CardContent className="space-y-3">
           
            <div>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Ligne ferroviaire</p>
              <p className={`text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedItem.line}</p>
            </div>
             <div>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Point kilométrique</p>
              <p className={`text-sm font-mono ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedItem.location.pk}</p>
            </div>
            <div>
  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Image du défaut</p>
  {selectedItem.imageUrl ? (
    <div className="mt-2">
      <img 
        src={selectedItem.imageUrl} 
        alt="Image du défaut"
        className="rounded-md border max-h-40 object-cover"
      />
      <Button
        onClick={() => window.open(selectedItem.imageUrl, '_blank')}
        variant="link"
        className="text-xs p-0 mt-1 h-auto"
      >
        Voir en grand
      </Button>
    </div>
  ) : (
    <p className={`text-xs italic ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
      Aucune image disponible
    </p>
  )}
</div>
            <Button
              onClick={() => openMap(selectedItem.location.lat, selectedItem.location.lng)}
              className={`w-full mt-2 text-xs h-8 ${darkMode ? "bg-blue-800 hover:bg-blue-900" : "bg-blue-600 hover:bg-blue-700"} text-white`}
              size="sm"
            >
              <MapPin className="mr-2 h-3 w-3" />
              Localisation du défaut
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Carte Description */}
      <Card className={darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-blue-100"}>
        <CardHeader className="pb-3">
          <h3 className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? "text-blue-300" : "text-blue-900"}`}>
            <FileText className="h-4 w-4" />
            Description du défaut
          </h3>
        </CardHeader>
        <CardContent>
          <div className={`p-3 rounded text-sm ${darkMode ? "bg-gray-600/30 text-gray-200" : "bg-gray-50 text-gray-700"}`}>
            {selectedItem.description ? (
              selectedItem.description.split('\n').map((paragraph, i) => (
                <p key={i} className={i > 0 ? "mt-2" : ""}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p className={`italic ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Aucune description disponible
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  </DialogContent>
</Dialog>
>>>>>>> Stashed changes
            )}
          </>
        )}

<<<<<<< Updated upstream
        {/* Pied de page identique à report.jsx */}
=======
>>>>>>> Stashed changes
        <footer className={`mt-8 pt-4 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <p>© SNTF - Système de Détection des Défauts de Rails</p>
        </footer>
      </div>
    </div>
  )
}