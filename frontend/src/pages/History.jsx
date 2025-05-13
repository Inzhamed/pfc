"use client"
import { useState, useEffect, useMemo } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Train, Search, Filter, FileText, User, Clock, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
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
    line: "Ligne B",
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
  joint: { label: "Joint", color: "bg-blue-100 text-blue-800" },
  squat: { label: "Squat", color: "bg-amber-100 text-amber-800" },
  ssquat: { label: "SSquat", color: "bg-purple-100 text-purple-800" }
}

const statusConfig = {
  "réparé": { label: "Réparé", color: "bg-green-100 text-green-800" },
  "reporté": { label: "reporté", color: "bg-red-100 text-red-800" },
  "non réparable": { label: "Non réparable", color: "bg-gray-100 text-gray-800" }
}

export default function History() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedID, setSelectedID] = useState(null)
  const [filters, setFilters] = useState({
    status: "all",
    search: ""
  })

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setData(sampleData)
      setLoading(false)
    }, 800)
  }, [])

  const filteredData = useMemo(() => {
    return data.filter(item => 
      (filters.status === "all" || item.status === filters.status) &&
      (!filters.search || item.id.toLowerCase().includes(filters.search.toLowerCase()))
    )
  }, [data, filters])

  const selectedItem = useMemo(() => 
    data.find(item => item.id === selectedID), [data, selectedID]
  )

  const formatDate = (dateString) => 
    dateString ? format(new Date(dateString), "dd MMMM yyyy", { locale: fr }) : "Non spécifié"

  const openMap = (lat, lng) => 
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50">
      <Card className="shadow-sm border-0">
      <div className="w-full fixed top-0 left-0 bg-blue-950 shadow-md z-50"> {/* Nouveau conteneur fixe */}
      <div className="w-full fixed top-0 left-0 bg-blue-950 shadow-md z-50">
  <CardHeader className="text-white py-5 min-h-[120px]">
    <div className="max-w-7xl mx-auto w-full px-6">
      <CardTitle className="flex items-center text-3xl">
        <Train className="mr-4 h-9 w-9" />
        SNTF
      </CardTitle>
      <CardDescription className="text-blue-100 text-lg mt-3">
        Système de Détection des Défauts de Rails
      </CardDescription>
    </div>
  </CardHeader>
</div>
</div>

        <CardContent className="p-0 bg-white">
          <div className="p-6 max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher par ID..."
                  className="pl-10 h-11 text-base"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
              <Button 
                variant="outline" 
                className="h-11 border-blue-300 text-blue-700 hover:bg-blue-50 px-6"
                onClick={() => setFilters({ status: "all", search: "" })}
              >
                <Filter className="mr-2 h-5 w-5" />
                Réinitialiser
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="text-gray-700 font-semibold">ID</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Statut</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Date</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono font-medium">{item.id}</TableCell>
                        <TableCell>
                          <Badge className={`${typeConfig[item.type]?.color} px-3 py-1 rounded-md`}>
                            {typeConfig[item.type]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusConfig[item.status]?.color} px-3 py-1 rounded-md`}>
                            {statusConfig[item.status]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{formatDate(item.date)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                              onClick={() => setSelectedID(item.id)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {selectedItem && (
                  <Dialog open={!!selectedID} onOpenChange={() => setSelectedID(null)}>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle className="text-blue-800 text-xl">
                          <div className="flex items-center gap-3">
                            <span className="font-mono bg-blue-50 px-4 py-2 rounded-md">
                              {selectedItem.id}
                            </span>
                            <Badge className={`${typeConfig[selectedItem.type]?.color} px-3 py-1`}>
                              {typeConfig[selectedItem.type]?.label}
                            </Badge>
                          </div>
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">
                          {selectedItem.line} • Détecté le {formatDate(selectedItem.date)}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-3">
                            <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                              <User className="h-5 w-5" />
                              Responsable technique
                            </h3>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Nom complet</p>
                              <p className="font-medium">{selectedItem.technician.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Matricule</p>
                              <p className="font-mono font-medium">{selectedItem.technician.matricule}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Fonction</p>
                              <p className="font-medium">{selectedItem.technician.function}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Date intervention</p>
                              <p className="font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {formatDate(selectedItem.technician.interventionDate)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-3">
                            <h3 className="text-lg font-semibold text-blue-800">
                              Localisation du défaut
                            </h3>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Point kilométrique</p>
                              <p className="font-mono font-medium">{selectedItem.location.pk}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Ligne ferroviaire</p>
                              <p className="font-medium">{selectedItem.line}</p>
                            </div>
                            <Button
                              onClick={() => openMap(selectedItem.location.lat, selectedItem.location.lng)}
                              className="w-full mt-4 bg-blue-800 hover:bg-blue-700 text-white h-11"
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
        </CardContent>
      </Card>
    </div>
  )
}