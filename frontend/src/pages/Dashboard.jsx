"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import Map from "@/components/Map"
import { useSearchParams } from "react-router-dom"
import { AlertCircle, Clock, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Composant pour une carte statistique
const StatCard = ({ title, value, icon, color, percent = 100 }) => {
  const isDark = document.documentElement.classList.contains("dark")
  return (
    <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100"}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`p-3 rounded-full ${isDark ? `${color}-900/30` : `${color}-100`}`}>{icon}</div>
        </div>
        <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-1 bg-${color}-600 rounded-full`} style={{ width: `${percent}%` }}></div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [searchParams] = useSearchParams()
  const defectId = searchParams.get("defectId")
  const [stats, setStats] = useState({ total: 0, critiques: 0, enAttente: 0 })
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Observer le thème
    setIsDark(document.documentElement.classList.contains("dark"))
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    // Charger les statistiques
    setTimeout(() => setStats({ total: 9, critiques: 3, enAttente: 5 }), 500)

    // Log du défaut sélectionné
    if (defectId) console.log(`Défaut sélectionné: ${defectId}`)

    return () => observer.disconnect()
  }, [defectId])

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-screen-xl mx-auto w-full">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-center md:text-left">Rail Defect Dashboard</h1>

        {/* Grilles de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total des défauts"
            value={stats.total}
            icon={<BarChart3 className={`h-6 w-6 ${isDark ? "text-blue-300" : "text-blue-700"}`} />}
            color="blue"
          />
          <StatCard
            title="Alertes critiques"
            value={stats.critiques}
            icon={<AlertCircle className={`h-6 w-6 ${isDark ? "text-red-300" : "text-red-700"}`} />}
            color="red"
            percent={(stats.critiques / stats.total) * 100}
          />
          <StatCard
            title="En attente"
            value={stats.enAttente}
            icon={<Clock className={`h-6 w-6 ${isDark ? "text-yellow-300" : "text-yellow-700"}`} />}
            color="yellow"
            percent={(stats.enAttente / stats.total) * 100}
          />
        </div>

        {/* Carte interactive */}
        <div className="w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden shadow">
          <Map highlightDefectId={defectId} />
        </div>
      </div>
    </Layout>
  )
}
