"use client"

import { useRef, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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
  FileDown,
  Printer,
  Train,
  AlertTriangle,
  Loader2,
  History,
} from "lucide-react"

// Composant pour un champ de formulaire
const FormField = ({ id, label, icon, type = "text", options, placeholder, isDark, isSubmitted }) => {
  const isSelect = type === "select"
  const InputComponent = isSelect ? "select" : type === "textarea" ? "textarea" : Input
  const props = {
    id,
    disabled: isSubmitted,
    ...(type === "textarea" ? { rows: 4 } : {}),
    ...(type === "date" ? { type: "date" } : {}),
    ...(type !== "select" && type !== "textarea" ? { placeholder } : {}),
    className: `${isSelect || type === "textarea" ? "w-full p-3 rounded-md" : ""} border-2 ${
      isDark ? "border-gray-700 bg-gray-700 text-white" : "border-blue-100 focus:border-blue-300 bg-white"
    }`,
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={`font-medium flex gap-2 items-center ${isDark ? "text-gray-200" : "text-gray-700"}`}
      >
        {icon}
        {label}
      </label>
      {isSelect ? (
        <select {...props} defaultValue="">
          <option value="" disabled>
            {placeholder}
          </option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <InputComponent {...props} />
      )}
    </div>
  )
}

export default function Reports() {
  const today = new Date().toISOString().split("T")[0]
  const reportRef = useRef(null)
  const [isClient, setIsClient] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [defectData, setDefectData] = useState(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Définition des champs du formulaire
  const formFields = [
    {
      id: "technician-name",
      label: "Nom du technicien",
      icon: <User className="w-4 h-4" />,
      placeholder: "Ex: Bouchra Amari",
    },
    {
      id: "technician-id",
      label: "Matricule (format TECH-XXXX)",
      icon: <BadgeCheck className="w-4 h-4" />,
      placeholder: "Ex: TECH-2025",
    },
    {
      id: "technician-role",
      label: "Fonction",
      icon: <User className="w-4 h-4" />,
      placeholder: "Ex: Technicienne d'inspection",
    },
    { id: "report-date", label: "Date", icon: <CalendarDays className="w-4 h-4" />, type: "date", defaultValue: today },
    {
      id: "location",
      label: "Localisation du défaut",
      icon: <MapPin className="w-4 h-4" />,
      placeholder: "Ex : Voie 3 - KM 47.3",
    },
    {
      id: "line",
      label: "Ligne ferroviaire",
      icon: <Train className="w-4 h-4" />,
      type: "select",
      placeholder: "Choisir une ligne...",
      options: [
        { value: "ALGER-ORAN", label: "ALGER-ORAN" },
        { value: "ALGER-CONSTANTINE", label: "ALGER-CONSTANTINE" },
        { value: "ORAN-BEJAIA", label: "ORAN-BEJAIA" },
      ],
    },
    { id: "pk", label: "Point Kilométrique (PK)", icon: <MapPin className="w-4 h-4" />, placeholder: "Ex: PK 15+780" },
    {
      id: "defect-type",
      label: "Type de défaut",
      icon: <AlertTriangle className="w-4 h-4" />,
      type: "select",
      placeholder: "Choisir un type de défaut...",
      options: [
        { value: "joint", label: "Joint" },
        { value: "squat", label: "Squat" },
        { value: "ssquat", label: "SSquat" },
      ],
    },
    {
      id: "description",
      label: "Description",
      icon: <FileText className="w-4 h-4" />,
      type: "textarea",
      placeholder: "Décris ce qui a été fait ou observé...",
    },
    {
      id: "action",
      label: "Action réalisée",
      icon: <CheckCircle className="w-4 h-4" />,
      type: "select",
      placeholder: "Choisir une action...",
      options: [
        { value: "réparé", label: "Réparé" },
        { value: "reporté", label: "Reporté" },
        { value: "non réparable", label: "Non réparable" },
      ],
    },
  ]

  useEffect(() => {
    setIsClient(true)
    setIsDark(document.documentElement.classList.contains("dark"))

    // Observer les changements de thème
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    // Récupérer et traiter les données du défaut
    const storedDefectData = localStorage.getItem("defectData")
    if (storedDefectData) {
      const parsedData = JSON.parse(storedDefectData)
      setDefectData(parsedData)

      // Pré-remplir le formulaire
      setTimeout(() => {
        if (parsedData) {
          const fieldMap = {
            location: parsedData.location?.pk || "",
            line: parsedData.line || "",
            pk: parsedData.location?.pk || "",
            "defect-type": parsedData.type || "",
            description: parsedData.description || "",
          }

          Object.entries(fieldMap).forEach(([id, value]) => {
            const element = document.getElementById(id)
            if (element) element.value = value
          })
        }
      }, 500)
    }

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

      // Créer le contenu du PDF
      const pdfContainer = document.createElement("div")
      Object.assign(pdfContainer.style, {
        width: "210mm",
        padding: "15mm",
        backgroundColor: "white",
        color: "#333",
        fontFamily: "Arial, sans-serif",
      })

      // En-tête du PDF
      pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0a3172; padding-bottom: 15px;">
          <h1 style="font-size: 26px; color: #0a3172; margin: 0;">SNTF - Rapport de Panne</h1>
          <p style="color: #666; margin-top: 5px;">Système de Détection des Défauts de Rails</p>
        </div>
      `

      // Fonction pour ajouter un champ au PDF
      const addField = (label, value) => `
        <div style="margin-bottom: 20px;">
          <p style="font-weight: bold; margin-bottom: 8px; color: #0a3172;">${label}</p>
          <p style="border: 1px solid #ccc; padding: 10px; border-radius: 4px; background-color: #f9f9f9;">${value || "Non spécifié"}</p>
        </div>
      `

      // Ajouter les informations du technicien
      pdfContainer.innerHTML += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
          <div style="width: 48%;">
            ${addField("Nom du technicien", document.getElementById("technician-name")?.value)}
            ${addField("Fonction", document.getElementById("technician-role")?.value)}
          </div>
          <div style="width: 48%;">
            ${addField("Matricule", document.getElementById("technician-id")?.value)}
            ${addField("Date", document.getElementById("report-date")?.value || today)}
          </div>
        </div>
      `

      // Ajouter les détails du défaut
      const fields = [
        { label: "Localisation du défaut", id: "location" },
        { label: "Ligne ferroviaire", id: "line" },
        { label: "Point Kilométrique (PK)", id: "pk" },
        { label: "Type de défaut", id: "defect-type" },
        { label: "Description", id: "description" },
        { label: "Action réalisée", id: "action" },
      ]

      fields.forEach((field) => {
        pdfContainer.innerHTML += addField(field.label, document.getElementById(field.id)?.value)
      })

      // Pied de page
      pdfContainer.innerHTML += `
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
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
        pagebreak: { mode: "avoid-all" },
      }

      await html2pdf().from(pdfContainer).set(opt).save()
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleSubmitReport = async () => {
    // Si le rapport a déjà été soumis, rediriger vers l'historique
    if (isSubmitted) {
      navigate("/history")
      return
    }

    // Si le rapport est en cours de soumission, ne rien faire
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      // Récupérer les valeurs du formulaire
      const getFieldValue = (id) => document.getElementById(id)?.value || ""
      const requiredFields = ["technician-name", "technician-id", "defect-type", "action"]

      // Vérifier les champs obligatoires
      const missingFields = requiredFields.filter((id) => !getFieldValue(id))
      if (missingFields.length > 0) {
        toast({
          title: "Champs manquants",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        })
        alert("Champs manquants: Veuillez remplir tous les champs obligatoires")
        setIsSubmitting(false)
        return
      }

      // Vérifier que le nom du technicien ne contient que des caractères alphabétiques
      const technicianName = getFieldValue("technician-name")
      // Cette regex accepte les lettres (y compris accentuées), espaces, tirets et apostrophes
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']+$/
      if (!nameRegex.test(technicianName)) {
        toast({
          title: "Format incorrect",
          description: "Le nom du technicien ne doit contenir que des caractères alphabétiques",
          variant: "destructive",
        })
        alert("Format incorrect: Le nom du technicien ne doit contenir que des caractères alphabétiques")
        setIsSubmitting(false)
        return
      }

      // Vérifier le format du matricule (TECH-XXXX)
      const matricule = getFieldValue("technician-id")
      console.log("Matricule saisi:", matricule) // Log pour débogage

      // Utiliser une expression régulière simple pour vérifier le format
      if (!matricule.startsWith("TECH-") || !/^TECH-\d{4}$/.test(matricule)) {
        console.log("Validation du matricule échouée") // Log pour débogage
        toast({
          title: "Format incorrect",
          description: "Le matricule doit être au format TECH-XXXX (ex: TECH-2025)",
          variant: "destructive",
        })
        alert("Format incorrect: Le matricule doit être au format TECH-XXXX (ex: TECH-2025)")
        setIsSubmitting(false)
        return
      }

      // Vérifier la date
      const reportDate = getFieldValue("report-date")
      if (!reportDate) {
        toast({
          title: "Date manquante",
          description: "Veuillez sélectionner une date pour le rapport",
          variant: "destructive",
        })
        alert("Date manquante: Veuillez sélectionner une date pour le rapport")
        setIsSubmitting(false)
        return
      }

      // Vérifier que la date n'est pas dans le futur
      const selectedDate = new Date(reportDate)
      const currentDate = new Date()
      // Réinitialiser les heures, minutes, secondes pour comparer uniquement les dates
      currentDate.setHours(0, 0, 0, 0)
      if (selectedDate > currentDate) {
        toast({
          title: "Date invalide",
          description: "La date du rapport ne peut pas être dans le futur",
          variant: "destructive",
        })
        alert("Date invalide: La date du rapport ne peut pas être dans le futur")
        setIsSubmitting(false)
        return
      }

      console.log("Toutes les validations ont réussi") // Log pour débogage

      // Préparer les données pour l'API
      const reportData = {
        id:
          defectData?.id ||
          `D-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")}`,
        type: getFieldValue("defect-type").toLowerCase(),
        status: getFieldValue("action").toLowerCase(),
        date: getFieldValue("report-date") || today,
        line: getFieldValue("line"),
        description: getFieldValue("description"),
        technician: {
          name: getFieldValue("technician-name"),
          matricule: getFieldValue("technician-id"),
          function: getFieldValue("technician-role"),
          interventionDate: getFieldValue("report-date") || today,
        },
        location: {
          pk: getFieldValue("pk"),
          lat: defectData?.location?.lat || 36.7654,
          lng: defectData?.location?.lng || 3.0567,
        },
      }

      try {
        // Envoyer les données à l'API
        const response = await fetch("http://localhost:8000/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reportData),
        })

        if (!response.ok) throw new Error("Erreur lors de l'enregistrement du rapport")
      } catch (error) {
        console.error("Erreur API:", error)
        // Continuer même si l'API échoue, en utilisant le localStorage
      }

      // Stocker les données du rapport dans le localStorage
      const existingReports = JSON.parse(localStorage.getItem("railDefectReports") || "[]")
      const updatedReports = [reportData, ...existingReports]
      localStorage.setItem("railDefectReports", JSON.stringify(updatedReports))

      // Stocker le statut du défaut pour la mise à jour sur la carte
      if (defectData?.id) {
        localStorage.setItem(
          "reportStatus",
          JSON.stringify({
            defectId: defectData.id,
            status: getFieldValue("action").toLowerCase(),
          }),
        )
      }

      // Marquer le rapport comme soumis
      setIsSubmitted(true)

      // Afficher un message de succès
      toast({
        title: "Rapport enregistré",
        description: "Le rapport a été enregistré avec succès dans l'historique",
        variant: "default",
      })
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
                className={`inline-flex items-center justify-center p-3 rounded-full ${isDark ? "bg-blue-900/30" : "bg-blue-50"}`}
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
              {/* Première section: 2 colonnes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.slice(0, 4).map((field) => (
                  <FormField key={field.id} {...field} isDark={isDark} isSubmitted={isSubmitted} />
                ))}
              </div>

              {/* Reste des champs */}
              {formFields.slice(4).map((field) => (
                <FormField key={field.id} {...field} isDark={isDark} isSubmitted={isSubmitted} />
              ))}
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
            ) : isSubmitted ? (
              <>
                <History className="mr-2 h-4 w-4" />
                Voir l'historique
              </>
            ) : (
              "Confirmer le rapport"
            )}
          </Button>
        </div>

        {/* Message de succès */}
        {isSubmitted && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
            <strong className="font-bold">Succès!</strong>
            <span className="block sm:inline">
              {" "}
              Votre rapport a été enregistré avec succès. Cliquez à nouveau sur le bouton pour voir l'historique.
            </span>
          </div>
        )}

        {/* Pied de page */}
        <footer className={`mt-8 pt-4 text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <p>© SNTF - Système de Détection des Défauts de Rails</p>
        </footer>
      </div>
    </div>
  )
}
