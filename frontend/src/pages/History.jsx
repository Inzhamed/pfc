"use client"

import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Search, Filter, FileText, User, Clock, Loader2, AlertTriangle, MapPin } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "../hooks/use-toast"

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
  const [isDark, setIsDark] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedID, setSelectedID] = useState(null)
  const [filters, setFilters] = useState({ status: "all", search: "" })
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    // Vérifier le thème au montage
    setIsDark(document.documentElement.classList.contains("dark"))

    // Observer les changements de classe sur l'élément html
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    // Charger les données depuis l'API
    fetchReports()

    return () => observer.disconnect()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    try {
      // D'abord, essayer de charger depuis le localStorage
      const localReports = JSON.parse(localStorage.getItem("railDefectReports") || "[]")
      
      if (localReports.length > 0) {
        setData(localReports)
        setLoading(false)
        return
      }
      
      // Si pas de données locales, essayer l'API
      const response = await fetch("http://localhost:8000/api/reports")
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données")
      }
      const reports = await response.json()
      setData(reports)
      
      // Sauvegarder dans localStorage pour utilisation future
      localStorage.setItem("railDefectReports", JSON.stringify(reports))
    } catch (error) {
      console.error("Erreur lors du chargement des rapports:", error)
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données des rapports",
        variant: "destructive",
      })
      // Utiliser des données de test en cas d'erreur
      setData([
        {
          id: "D-2023-001",
          type: "joint",
          status: "réparé",
          date: "2023-05-15",
          line: "ALGER-ORAN",
          description: "Fissure longitudinale sur joint de rail de 20cm",
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
          line: "ALGER-CONSTANTINE",
          description: "Déformation importante due au squatting",
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
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        (filters.status === "all" || item.status === filters.status) &&
        (!filters.search ||
          item.id.toLowerCase().includes(filters.search.toLowerCase()) ||
          (item.technician?.matricule && item.technician.matricule.toLowerCase().includes(filters.search.toLowerCase())) ||
          (item.technician?.name && item.technician.name.toLowerCase().includes(filters.search.toLowerCase()))),
    )
  }, [data, filters])

  const selectedItem = useMemo(() => data.find((item) => item.id === selectedID), [data, selectedID])

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr })
    } catch (error) {
      return dateString
    }
  }

  // Fonction pour rediriger vers le dashboard avec le défaut sélectionné
  const viewOnMap = (defect) => {
    // Stocker le statut du défaut pour la mise à jour sur la carte
    localStorage.setItem(
      "reportStatus",
      JSON.stringify({
        defectId: defect.id,
        status: defect.status,
      })
    )
    
    // Rediriger vers le dashboard avec l'ID du défaut
    navigate(`/dashboard?defectId=${defect.id}`)
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className={`mb-8 pb-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${isDark ? "bg-blue-900" : "bg-blue-100"}`}>
                <AlertTriangle className={`w-6 h-6 ${isDark ? "text-blue-300" : "text-blue-700"}`} />
              </div>
              <h2 className="text-2xl font-bold">Historique des Défauts</h2>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="relative w-full">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            />
            <Input
              placeholder="Rechercher par ID, matricule ou nom..."
              className={`pl-10 ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-blue-100"}`}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`${isDark ? "border-gray-600 hover:bg-gray-700" : "border-blue-200 hover:bg-blue-50"}`}
              onClick={() => setFilters({ status: "all", search: "" })}
            >
              <Filter className="mr-2 h-5 w-5" />
              Réinitialiser
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : (
          <>
            <div
              className={`rounded-lg border ${isDark ? "border-gray-700 bg-gray-800" : "border-blue-100 bg-white"} shadow-sm`}
            >
              <Table>
                <TableHeader className={isDark ? "bg-gray-700" : "bg-gray-50"}>
                  <TableRow>
                    <TableHead className={isDark ? "text-gray-200" : "text-gray-700"}>ID</TableHead>
                    <TableHead className={isDark ? "text-gray-200" : "text-gray-700"}>Matricule</TableHead>
                    <TableHead className={isDark ? "text-gray-200" : "text-gray-700"}>Type</TableHead>
                    <TableHead className={isDark ? "text-gray-200" : "text-gray-700"}>Statut</TableHead>
                    <TableHead className={isDark ? "text-gray-200" : "text-gray-700"}>Date</TableHead>
                    <TableHead className={isDark ? "text-gray-200" : "text-gray-700"}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <TableRow key={item.id} className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                        <TableCell className="font-mono font-medium">{item.id}</TableCell>
                        <TableCell className="font-mono">{item.technician?.matricule || "N/A"}</TableCell>
                        <TableCell>
                          <Badge className={typeConfig[item.type]?.color || "bg-gray-100 text-gray-800"}>
                            {typeConfig[item.type]?.label || item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[item.status]?.color || "bg-gray-100 text-gray-800"}>
                            {statusConfig[item.status]?.label || item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className={isDark ? "text-gray-300" : "text-gray-600"}>
                          {formatDate(item.date)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className={
                              isDark ? "border-gray-600 hover:bg-gray-700" : "border-blue-200 hover:bg-blue-50"
                            }
                            onClick={() => setSelectedID(item.id)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertTriangle className={`h-8 w-8 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                          <p className={isDark ? "text-gray-400" : "text-gray-500"}>Aucun rapport trouvé</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {selectedItem && (
              <Dialog open={!!selectedID} onOpenChange={() => setSelectedID(null)}>
                <DialogContent
                  className={`max-w-[95vw] max-h-[90vh] overflow-y-auto ${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
                >
                  <DialogHeader>
                    <DialogTitle className={isDark ? "text-blue-300" : "text-blue-900"}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-mono ${isDark ? "bg-blue-900/30" : "bg-blue-100"} px-3 py-1 rounded-md text-sm`}
                        >
                          {selectedItem.id}
                        </span>
                        <Badge className={typeConfig[selectedItem.type]?.color || "bg-gray-100 text-gray-800"}>
                          {typeConfig[selectedItem.type]?.label || selectedItem.type}
                        </Badge>
                        <Badge className={statusConfig[selectedItem.status]?.color || "bg-gray-100 text-gray-800"}>
                          {statusConfig[selectedItem.status]?.label || selectedItem.status}
                        </Badge>
                      </div>
                    </DialogTitle>
                    <DialogDescription className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {selectedItem.line} • Détecté le {formatDate(selectedItem.date)}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Carte Technicien */}
                      <Card className={isDark ? "bg-gray-700 border-gray-600" : "bg-white border-blue-100"}>
                        <CardHeader className="pb-3">
                          <h3
                            className={`flex items-center gap-2 text-sm font-semibold ${isDark ? "text-blue-300" : "text-blue-900"}`}
                          >
                            <User className="h-4 w-4" />
                            Responsable technique
                          </h3>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-1`}>
                              Nom du technicien
                            </p>
                            <p className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                              {selectedItem.technician?.name || "Non spécifié"}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-1`}>Matricule</p>
                            <p className={`text-sm font-mono ${isDark ? "text-white" : "text-gray-900"}`}>
                              {selectedItem.technician?.matricule || "Non spécifié"}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-1`}>Fonction</p>
                            <p className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                              {selectedItem.technician?.function || "Non spécifié"}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-1`}>Date </p>
                            <p className={`text-sm ${isDark ? "text-white" : "text-gray-900"} flex items-center gap-2`}>
                              <Clock className="h-3 w-3" />
                              {formatDate(selectedItem.technician?.interventionDate || selectedItem.date)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Carte Localisation */}
                      <Card className={isDark ? "bg-gray-700 border-gray-600" : "bg-white border-blue-100"}>
                        <CardHeader className="pb-3">
                          <h3
                            className={`flex items-center gap-2 text-sm font-semibold ${isDark ? "text-blue-300" : "text-blue-900"}`}
                          >
                            <MapPin className="h-4 w-4" />
                            Localisation
                          </h3>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-1`}>
                              Ligne ferroviaire
                            </p>
                            <p className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{selectedItem.line}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-1`}>
                              Point kilométrique
                            </p>
                            <p className={`text-sm font-mono ${isDark ? "text-white" : "text-gray-900"}`}>
                              {selectedItem.location?.pk || "Non spécifié"}
                            </p>
                          </div>
                         
                          <Button
                            onClick={() => viewOnMap(selectedItem)}
                            className={`w-full mt-2 text-xs h-8 ${isDark ? "bg-blue-800 hover:bg-blue-900" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                            size="sm"
                          >
                            <MapPin className="mr-2 h-3 w-3" />
                            Voir sur Carte
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Carte Description */}
                                        <Card className={isDark ? "bg-gray-700 border-gray-600" : "bg-white border-blue-100"}>
                                          <CardHeader className="pb-3">
                                            <h3
                                              className={`flex items-center gap-2 text-sm font-semibold ${isDark ? "text-blue-300" : "text-blue-900"}`}
                                            >
                                              <FileText className="h-4 w-4" />
                                              Description du défaut
                                            </h3>
                                          </CardHeader>
                                          <CardContent>
                                            <div
                                              className={`p-3 rounded text-sm ${isDark ? "bg-gray-600/30 text-gray-200" : "bg-gray-50 text-gray-700"}`}
                                            >
                                              {selectedItem.description ? (
                                                selectedItem.description.split("\n").map((line, idx) => (
                                                  <span key={idx}>
                                                    {line}
                                                    <br />
                                                  </span>
                                                ))
                                              ) : (
                                                <span>Description non spécifiée</span>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )
                    }
