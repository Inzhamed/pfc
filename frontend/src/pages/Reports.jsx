"use client"

import { useRef, useEffect, useState } from "react"
import html2pdf from "html2pdf.js"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
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
  Moon,
  Sun,
  Train,
  AlertTriangle,
} from "lucide-react"

export default function Reports() {
  const today = new Date().toISOString().split("T")[0]
  const reportRef = useRef(null)
  const [isClient, setIsClient] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Vérifier si le mode sombre était activé précédemment
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    // Appliquer ou supprimer la classe dark sur l'élément HTML
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

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
              <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${document.getElementById("technician-name")?.value || "Non spécifié"}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Fonction</p>
              <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${document.getElementById("technician-role")?.value || "Non spécifié"}</p>
            </div>
          </div>
          
          <div style="width: 48%;">
            <div style="margin-bottom: 20px;">
              <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Matricule</p>
              <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${document.getElementById("technician-id")?.value || "Non spécifié"}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Date</p>
              <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${document.getElementById("report-date")?.value || today}</p>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Localisation du défaut</p>
          <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${document.getElementById("location")?.value || "Non spécifié"}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Type de défaut</p>
          <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${document.getElementById("defect-type")?.value || "Non spécifié"}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Description</p>
          <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9; min-height: 80px;">${document.getElementById("description")?.value || "Non spécifié"}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Action réalisée</p>
          <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${document.getElementById("action")?.value || "Non spécifié"}</p>
        </div>
        
        <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>SNTF - Système de Détection des Défauts de Rails</p>
          <p>Document généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</p>
        </div>
      `

      // Ajouter l'image si elle existe
      const photoInput = document.getElementById("photo")
      if (photoInput && photoInput.files && photoInput.files[0]) {
        pdfContainer.innerHTML += `
          <div style="margin-top: 20px;">
            <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">Photo</p>
            <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">Photo jointe au rapport</p>
          </div>
        `
      }

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

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      {/* En-tête avec logo et titre */}
      <header className={`w-full py-4 px-6 ${darkMode ? "bg-gray-800" : "bg-[#0a3172]"} text-white shadow-md`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Train className="w-6 h-6" />
            <h1 className="text-xl font-bold">SNTF</h1>
          </div>
          <div className="text-sm opacity-90">Système de Détection des Défauts de Rails</div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Titre de la page */}
        <div className={`mb-8 pb-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${darkMode ? "bg-blue-900" : "bg-blue-100"}`}>
                <AlertTriangle className={`w-6 h-6 ${darkMode ? "text-blue-300" : "text-blue-700"}`} />
              </div>
              <h2 className="text-2xl font-bold">Rapport de Panne</h2>
            </div>

            <div className="flex space-x-3">
              <Button
                variant={darkMode ? "outline" : "ghost"}
                onClick={toggleTheme}
                className="flex items-center gap-2"
                aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
              >
                {darkMode ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span className="hidden sm:inline">Mode clair</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span className="hidden sm:inline">Mode sombre</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleGeneratePDF}
                className="flex items-center gap-2"
                disabled={isGeneratingPDF}
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">{isGeneratingPDF ? "Génération..." : "Générer PDF"}</span>
              </Button>
              <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
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
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-blue-100"
            }`}
          >
            <div className="flex justify-center mb-6">
              <div
                className={`inline-flex items-center justify-center p-3 rounded-full ${
                  darkMode ? "bg-blue-900/30" : "bg-blue-50"
                }`}
              >
                <ClipboardList className={`w-8 h-8 ${darkMode ? "text-blue-300" : "text-[#0a3172]"}`} />
              </div>
            </div>

            <h1
              className={`text-2xl md:text-3xl font-bold text-center mb-8 ${
                darkMode ? "text-white" : "text-[#0a3172]"
              }`}
            >
              Rapport d'intervention
            </h1>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="technician-name"
                    className={`font-medium flex gap-2 items-center ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                  >
                    <User className="w-4 h-4" />
                    Nom du technicien
                  </label>
                  <Input
                    id="technician-name"
                    placeholder="Ex: Bouchra Amari"
                    className={`border-2 ${darkMode ? "border-gray-700" : "border-blue-100 focus:border-blue-300"}`}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="technician-id"
                    className={`font-medium flex gap-2 items-center ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                  >
                    <BadgeCheck className="w-4 h-4" />
                    Matricule
                  </label>
                  <Input
                    id="technician-id"
                    placeholder="Ex: TECH-4092"
                    className={`border-2 ${darkMode ? "border-gray-700" : "border-blue-100 focus:border-blue-300"}`}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="technician-role"
                    className={`font-medium flex gap-2 items-center ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                  >
                    <User className="w-4 h-4" />
                    Fonction
                  </label>
                  <Input
                    id="technician-role"
                    placeholder="Ex: Technicienne d'inspection"
                    className={`border-2 ${darkMode ? "border-gray-700" : "border-blue-100 focus:border-blue-300"}`}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="report-date"
                    className={`font-medium flex gap-2 items-center ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    Date
                  </label>
                  <Input
                    id="report-date"
                    type="date"
                    defaultValue={today}
                    className={`border-2 ${darkMode ? "border-gray-700" : "border-blue-100 focus:border-blue-300"}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className={`font-medium flex gap-2 items-center ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  <MapPin className="w-4 h-4" />
                  Localisation du défaut
                </label>
                <Input
                  id="location"
                  placeholder="Ex : Voie 3 - KM 47.3"
                  className={`border-2 ${darkMode ? "border-gray-700" : "border-blue-100 focus:border-blue-300"}`}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="defect-type"
                  className={`font-medium flex gap-2 items-center ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Type de défaut
                </label>
                <select
                  id="defect-type"
                  className={`w-full p-3 rounded-md border-2 ${
                    darkMode
                      ? "bg-gray-700 border-gray-700 text-white"
                      : "bg-white border-blue-100 focus:border-blue-300"
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choisir un type de défaut...
                  </option>
                  <option value="Joint">Joint</option>
                  <option value="Squat">Squat</option>
                  <option value="Ssquat">SSquat</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className={`font-medium flex gap-2 items-center ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  <FileText className="w-4 h-4" />
                  Description
                </label>
                <textarea
                  id="description"
                  className={`w-full p-3 rounded-md border-2 ${
                    darkMode
                      ? "bg-gray-700 border-gray-700 text-white"
                      : "bg-white border-blue-100 focus:border-blue-300"
                  }`}
                  placeholder="Décris ce qui a été fait ou observé..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="action"
                  className={`font-medium flex gap-2 items-center ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Action réalisée
                </label>
                <select
                  id="action"
                  className={`w-full p-3 rounded-md border-2 ${
                    darkMode
                      ? "bg-gray-700 border-gray-700 text-white"
                      : "bg-white border-blue-100 focus:border-blue-300"
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choisir une action...
                  </option>
                  <option value="Réparé">Réparé</option>
                  <option value="Reporté">Reporté</option>
                  <option value="Non réparable">Non réparable</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="photo"
                  className={`font-medium flex gap-2 items-center ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Photo (optionnelle)
                </label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className={`border-2 ${darkMode ? "border-gray-700" : "border-blue-100 focus:border-blue-300"}`}
                />
              </div>
            </form>
          </div>
        )}

        {/* Pied de page */}
        <footer className={`mt-8 pt-4 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <p>© SNTF - Système de Détection des Défauts de Rails</p>
        </footer>
      </div>
    </div>
  )
}
