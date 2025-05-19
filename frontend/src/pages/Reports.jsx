"use client"

import { useRef, useEffect, useState } from "react"
import html2pdf from "html2pdf.js"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { useToast } from "../hooks/use-toast"
import {
  ClipboardList,
  User,
  BadgeCheck,
  CalendarDays,
  MapPin,
  FileText,
  CheckCircle,
  ImageIcon,
  FileDown,
  Printer,
  Train,
  AlertTriangle,
  Loader2,
} from "lucide-react"

export default function Reports() {
  const today = new Date().toISOString().split("T")[0]
  const reportRef = useRef(null)
  const [isClient, setIsClient] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)
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

    return () => observer.disconnect()
  }, [])

  const handlePrint = () => {
    if (!reportRef.current) return
    const printContent = reportRef.current.innerHTML
    const printWindow = window.open("", "", "width=800,height=600")
    printWindow.document.write(`
      <html>
        <head>
          <title>Rapport de Panne - SNTF</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 2rem; }
            .header { text-align: center; margin-bottom: 2rem; }
            .header h1 { color: #0a3172; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SNTF - Rapport de Panne</h1>
          </div>
          ${printContent}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const handleGeneratePDF = async () => {
    if (!reportRef.current || isGeneratingPDF) return

    try {
      setIsGeneratingPDF(true)

      // Créer un nouveau div pour le PDF avec une mise en page optimisée
      const pdfContainer = document.createElement("div")
      pdfContainer.style.width = "210mm"
      pdfContainer.style.padding = "15mm"
      pdfContainer.style.backgroundColor = "white"
      pdfContainer.style.color = "#333"
      pdfContainer.style.fontFamily = "Arial, sans-serif"

      // Créer le contenu du PDF avec une mise en page améliorée
      pdfContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0a3172; padding-bottom: 15px;">
        <h1 style="font-size: 26px; color: #0a3172; margin: 0;">SNTF - Rapport de Panne</h1>
        <p style="color: #666; margin-top: 5px;">Système de Détection des Défauts de Rails</p>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
        <div style="width: 48%;">
          <div style="margin-bottom: 20px;">
            <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Nom du technicien</p>
            <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${
              document.getElementById("technician-name")?.value || "Non spécifié"
            }</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Fonction</p>
            <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${
              document.getElementById("technician-role")?.value || "Non spécifié"
            }</p>
          </div>
        </div>
        
        <div style="width: 48%;">
          <div style="margin-bottom: 20px;">
            <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Matricule</p>
            <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${
              document.getElementById("technician-id")?.value || "Non spécifié"
            }</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Date</p>
            <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${
              document.getElementById("report-date")?.value || today
            }</p>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Localisation du défaut</p>
        <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${
          document.getElementById("location")?.value || "Non spécifié"
        }</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Ligne ferroviaire</p>
        <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${
          document.getElementById("line")?.value || "Non spécifié"
        }</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Point Kilométrique (PK)</p>
        <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${
          document.getElementById("pk")?.value || "Non spécifié"
        }</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Type de défaut</p>
        <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${
          document.getElementById("defect-type")?.value || "Non spécifié"
        }</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Description</p>
        <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9; min-height: 80px;">${
          document.getElementById("description")?.value || "Non spécifié"
        }</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Action réalisée</p>
        <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${
          document.getElementById("action")?.value || "Non spécifié"
        }</p>
      </div>
      
      ${
        document.getElementById("image")?.files?.length > 0
          ? `
          <div style="margin-bottom: 20px;">
            <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Image jointe</p>
            <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">
              Image disponible dans le rapport original
            </p>
          </div>
          `
          : ""
      }
      
      <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>SNTF - Système de Détection des Défauts de Rails</p>
        <p>Document généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</p>
      </div>
    `

      // Options pour html2pdf
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `SNTF-Rapport-Panne-${today}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
        pagebreak: { mode: "avoid-all" },
      }

      // Générer le PDF
      await html2pdf().from(pdfContainer).set(opt).save()
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleSubmitReport = async () => {
    try {
      setIsSubmitting(true)

      // Récupérer les valeurs du formulaire
      const technicianName = document.getElementById("technician-name")?.value
      const technicianId = document.getElementById("technician-id")?.value
      const technicianRole = document.getElementById("technician-role")?.value
      const reportDate = document.getElementById("report-date")?.value || today
      const location = document.getElementById("location")?.value
      const line = document.getElementById("line")?.value
      const pk = document.getElementById("pk")?.value
      const defectType = document.getElementById("defect-type")?.value
      const description = document.getElementById("description")?.value
      const action = document.getElementById("action")?.value

      // Vérifier les champs obligatoires
      if (!technicianName || !technicianId || !defectType || !action) {
        toast({
          title: "Champs manquants",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        })
        return
      }

      // Préparer les données pour l'API
      const reportData = {
        id: `D-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        type: defectType.toLowerCase(),
        status: action.toLowerCase(),
        date: reportDate,
        line: line,
        description: description,
        technician: {
          name: technicianName,
          matricule: technicianId,
          function: technicianRole,
          interventionDate: reportDate,
        },
        location: {
          pk: pk,
          lat: 36.7654, // Valeurs par défaut, à remplacer par des valeurs réelles si disponibles
          lng: 3.0567,
        },
      }

      // Envoyer les données à l'API
      const response = await fetch("http://localhost:8000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement du rapport")
      }

      // Afficher un message de succès
      toast({
        title: "Rapport enregistré",
        description: "Le rapport a été enregistré avec succès dans l'historique",
        variant: "default",
      })

      // Réinitialiser le formulaire (optionnel)
      // document.getElementById("report-form").reset()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du rapport:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du rapport",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Titre de la page */}
        <div className={`mb-8 pb-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${isDark ? "bg-blue-900" : "bg-blue-100"}`}>
                <AlertTriangle className={`w-6 h-6 ${isDark ? "text-blue-300" : "text-blue-700"}`} />
              </div>
              <h2 className="text-2xl font-bold">Rapport de Panne</h2>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleGeneratePDF}
                className={`flex items-center gap-2 ${isDark ? "border-gray-600 hover:bg-gray-700" : "border-blue-200 hover:bg-blue-50"}`}
                disabled={isGeneratingPDF}
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">{isGeneratingPDF ? "Génération..." : "Générer PDF"}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className={`flex items-center gap-2 ${isDark ? "border-gray-600 hover:bg-gray-700" : "border-blue-200 hover:bg-blue-50"}`}
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Imprimer</span>
              </Button>
            </div>
          </div>
        </div>

        {isClient && (
          <div
            ref={reportRef}
            className={`rounded-xl shadow-lg p-6 md:p-8 ${
              isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-blue-100"
            }`}
          >
            <div className="flex justify-center mb-6">
              <div
                className={`inline-flex items-center justify-center p-3 rounded-full ${
                  isDark ? "bg-blue-900/30" : "bg-blue-50"
                }`}
              >
                <ClipboardList className={`w-8 h-8 ${isDark ? "text-blue-300" : "text-[#0a3172]"}`} />
              </div>
            </div>

            <h1
              className={`text-2xl md:text-3xl font-bold text-center mb-8 ${isDark ? "text-white" : "text-[#0a3172]"}`}
            >
              Rapport d'intervention
            </h1>

            <form id="report-form" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="technician-name"
                    className={`font-medium flex gap-2 items-center ${isDark ? "text-gray-200" : "text-gray-700"}`}
                  >
                    <User className="w-4 h-4" />
                    Nom du technicien
                  </label>
                  <Input
                    id="technician-name"
                    placeholder="Ex: Bouchra Amari"
                    className={`border-2 ${isDark ? "border-gray-700 bg-gray-700 text-white" : "border-blue-100 focus:border-blue-300 bg-white"}`}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="technician-id"
                    className={`font-medium flex gap-2 items-center ${isDark ? "text-gray-200" : "text-gray-700"}`}
                  >
                    <BadgeCheck className="w-4 h-4" />
                    Matricule
                  </label>
                  <Input
                    id="technician-id"
                    placeholder="Ex: TECH-4092"
                    className={`border-2 ${isDark ? "border-gray-700 bg-gray-700 text-white" : "border-blue-100 focus:border-blue-300 bg-white"}`}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="technician-role"
                    className={`font-medium flex gap-2 items-center ${isDark ? "text-gray-200" : "text-gray-700"}`}
                  >
                    <User className="w-4 h-4" />
                    Fonction
                  </label>
                  <Input
                    id="technician-role"
                    placeholder="Ex: Technicienne d'inspection"
                    className={`border-2 ${isDark ? "border-gray-700 bg-gray-700 text-white" : "border-blue-100 focus:border-blue-300 bg-white"}`}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="report-date"
                    className={`font-medium flex gap-2 items-center ${isDark ? "text-gray-200" : "text-gray-700"}`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    Date
                  </label>
                  <Input
                    id="report-date"
                    type="date"
                    defaultValue={today}
                    className={`border-2 ${isDark ? "border-gray-700 bg-gray-700 text-white" : "border-blue-100 focus:border-blue-300 bg-white"}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className={`font-medium flex gap-2 items-center ${isDark ? "text-gray-200" : "text-gray-700"}`}
                >
                  <MapPin className="w-4 h-4" />
                  Localisation du défaut
                </label>
                <Input
                  id="location"
                  placeholder="Ex : Voie 3 - KM 47.3"
                  className={`border-2 ${isDark ? "border-gray-700 bg-gray-700 text-white" : "border-blue-100 focus:border-blue-300 bg-white"}`}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="line"
                  className={`font-medium flex gap-2 items-center ${isDark ? "text-gray-200" : "text-gray-700"}`}
                >
                  <Train className="w-4 h-4" />
                  Ligne ferroviaire
                </label>
                <select
                  id="line"
                  className={`w-full p-3 rounded-md border-2 ${
                    isDark ? "bg-gray-700 border-gray-700 text-white" : "bg-white border-blue-100 focus:border-blue-300"
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choisir une ligne...
                  </option>
                  <option value="ALGER-ORAN">ALGER-ORAN</option>
                  <option value="ALGER-CONSTANTINE">ALGER-CONSTANTINE</option>
                  <option value="ORAN-BEJAIA">ORAN-BEJAIA</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="pk"
                  className={`font-medium flex gap-2 items-center ${isDark ? "text-gray-200" : "text-gray-700"}`}
                >
                  <MapPin className="w-4 h-4" />
                  Point Kilométrique (PK)
                </label>
                <Input
                  id="pk"
                  placeholder="Ex: PK 15+780"
                  className={`border-2 ${isDark ? "border-gray-700 bg-gray-700 text-white" : "border-blue-100 focus:border-blue-300 bg-white"}`}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="defect-type"
                  className={`font-medium flex gap-2 items-center ${isDark ? "text-gray-200" : "text-gray-700"}`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Type de défaut
                </label>
                <select
                  id="defect-type"
                  className={`w-full p-3 rounded-md border-2 ${
                    isDark ? "bg-gray-700 border-gray-700 text-white" : "bg-white border-blue-100 focus:border-blue-300"
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choisir un type de défaut...
                  </option>
                  <option value="joint">Joint</option>
                  <option value="squat">Squat</option>
                  <option value="ssquat">SSquat</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className={`font-medium flex gap-2 items-center ${isDark ? "text-gray-200" : "text-gray-700"}`}
                >
                  <FileText className="w-4 h-4" />
                  Description
                </label>
                <textarea
                  id="description"
                  className={`w-full p-3 rounded-md border-2 ${
                    isDark ? "bg-gray-700 border-gray-700 text-white" : "bg-white border-blue-100 focus:border-blue-300"
                  }`}
                  placeholder="Décris ce qui a été fait ou observé..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="action"
                  className={`font-medium flex gap-2 items-center ${isDark ? "text-gray-200" : "text-gray-700"}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Action réalisée
                </label>
                <select
                  id="action"
                  className={`w-full p-3 rounded-md border-2 ${
                    isDark ? "bg-gray-700 border-gray-700 text-white" : "bg-white border-blue-100 focus:border-blue-300"
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choisir une action...
                  </option>
                  <option value="réparé">Réparé</option>
                  <option value="reporté">Reporté</option>
                  <option value="non réparable">Non réparable</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="Image"
                  className={`font-medium flex gap-2 items-center ${isDark ? "text-gray-200" : "text-gray-700"}`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Image (optionnelle)
                </label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className={`border-2 ${isDark ? "border-gray-700 bg-gray-700" : "border-blue-100 focus:border-blue-300 bg-white"}`}
                />
              </div>
            </form>
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <Button
            className={`px-8 py-6 text-lg font-semibold ${isDark ? "bg-blue-800 hover:bg-blue-900" : "bg-[#0a3172] hover:bg-[#0a3172]/90"} text-white`}
            onClick={handleSubmitReport}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Confirmer le rapport"
            )}
          </Button>
        </div>
        {/* Pied de page */}
        <footer className={`mt-8 pt-4 text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <p>© SNTF - Système de Détection des Défauts de Rails</p>
        </footer>
      </div>
    </div>
  )
}
