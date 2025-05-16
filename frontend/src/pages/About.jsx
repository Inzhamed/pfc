"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import emailjs from "emailjs-com"
import { Info, Users, Target, CheckCircle, Send } from "lucide-react"

export default function AboutContact() {
  const [activeTab, setActiveTab] = useState("about")
  const [formStatus, setFormStatus] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const formRef = useRef()

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

    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormStatus("sending")

    emailjs
      .sendForm("service_rtlykqm", "template_bhsneit", formRef.current, "QNM8y_Yus59xXBYos")
      .then(() => {
        setFormStatus("success")
        e.target.reset()
        setTimeout(() => setFormStatus(null), 3000)
      })
      .catch((error) => {
        console.error("EmailJS Error:", error)
        setFormStatus("error")
      })
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`${darkMode ? "bg-blue-900/30" : "bg-blue-100"} p-2 rounded-full shadow`}>
          <Info className={`w-6 h-6 ${darkMode ? "text-blue-300" : "text-blue-700"}`} />
        </div>
        <h2 className="text-2xl font-bold">À propos du système</h2>
      </div>

      <div className={`mb-6 border-b ${darkMode ? "border-gray-700" : "border-gray-300"} flex gap-6`}>
        <button
          onClick={() => setActiveTab("about")}
          className={`pb-2 ${activeTab === "about" ? "font-bold border-b-2 border-blue-600" : "hover:text-blue-500"}`}
        >
          À propos
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`pb-2 ${activeTab === "contact" ? "font-bold border-b-2 border-blue-600" : "hover:text-blue-500"}`}
        >
          Contact
        </button>
      </div>

      {activeTab === "about" ? (
        <section
          className={`space-y-6 ${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow ${darkMode ? "border-gray-700" : "border border-blue-100"}`}
        >
          <p className="text-lg">
            Ce système vise à améliorer la sécurité ferroviaire grâce à une surveillance intelligente des rails.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div
              className={`flex flex-col items-center text-center p-4 ${darkMode ? "bg-gray-700/50" : "bg-blue-50"} rounded-lg`}
            >
              <Target className={`${darkMode ? "text-blue-300" : "text-blue-700"} mb-2`} />
              <h4 className="font-semibold">Technologies</h4>
              <p className="text-sm">Capteurs, vision, IA pour anticiper les défauts.</p>
            </div>
            <div
              className={`flex flex-col items-center text-center p-4 ${darkMode ? "bg-gray-700/50" : "bg-blue-50"} rounded-lg`}
            >
              <Users className={`${darkMode ? "text-blue-300" : "text-blue-700"} mb-2`} />
              <h4 className="font-semibold">Équipe</h4>
              <p className="text-sm">Ingénieurs spécialisés en maintenance ferroviaire.</p>
            </div>
            <div
              className={`flex flex-col items-center text-center p-4 ${darkMode ? "bg-gray-700/50" : "bg-blue-50"} rounded-lg`}
            >
              <CheckCircle className={`${darkMode ? "text-green-300" : "text-green-700"} mb-2`} />
              <h4 className="font-semibold">Sécurité</h4>
              <p className="text-sm">Réduction significative des incidents sur voie.</p>
            </div>
          </div>
        </section>
      ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`space-y-4 ${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow ${darkMode ? "border-gray-700" : "border border-blue-100"}`}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              name="name"
              required
              placeholder="Nom complet"
              className={darkMode ? "bg-gray-700 border-gray-600" : ""}
            />
            <Input
              name="email"
              required
              type="email"
              placeholder="Adresse email"
              className={darkMode ? "bg-gray-700 border-gray-600" : ""}
            />
          </div>
          <Input
            name="subject"
            required
            placeholder="Sujet"
            className={darkMode ? "bg-gray-700 border-gray-600" : ""}
          />
          <Textarea
            name="message"
            required
            placeholder="Message..."
            rows={4}
            className={darkMode ? "bg-gray-700 border-gray-600" : ""}
          />
          <Button type="submit" className="bg-[#0a3172] hover:bg-[#0a3172]/90 text-white">
            {formStatus === "sending" ? (
              "Envoi..."
            ) : formStatus === "success" ? (
              "Envoyé ✅"
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer
              </>
            )}
          </Button>
          {formStatus === "error" && <p className="text-red-500">Erreur lors de l'envoi du message.</p>}
        </form>
      )}
    </div>
  )
}
