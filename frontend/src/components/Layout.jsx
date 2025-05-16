"use client"

import { useState, useEffect } from "react"
import Sidebar from "./sidebar"
import { Bell, Moon, Sun } from "lucide-react"
import { Button } from "../components/ui/button"

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(3)

  useEffect(() => {
    // Vérifier si le mode sombre était activé précédemment
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
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

  return (
    <div className="flex h-screen">
      <Sidebar darkMode={darkMode} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barre supérieure SNTF */}
        <header
  className={`w-full py-4 px-6 shadow-md transition-colors duration-300 ${
    darkMode ? "bg-gray-800 text-gray-100" : "bg-[#0a3172] text-white"
  }`}
>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
    
            </div>
            <div className="text-sm opacity-90">Système de Détection des Défauts de Rails</div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-5 h-5 cursor-pointer hover:text-blue-200 transition-colors" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full">
                    {notifications}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="text-white hover:bg-blue-800/40"
                aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className={`flex-1 overflow-auto ${darkMode ? "bg-[#0f172a] text-white" : "bg-gray-50 text-gray-800"}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
