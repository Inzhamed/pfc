"use client"

import { Link, useLocation } from "react-router-dom"
import { Home, FileText, History, Settings, Train, Info } from "lucide-react"

export default function Sidebar({ darkMode }) {
  const location = useLocation()
  const currentPath = location.pathname

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
    { label: "Reports", path: "/reports", icon: <FileText size={18} /> },
    { label: "History", path: "/history", icon: <History size={18} /> },
    { label: "About", path: "/about", icon: <Info size={18} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ]

  return (
    <aside className={`hidden md:flex h-screen w-64 ${darkMode ? "bg-gray-800" : "bg-[#0a3172]"} text-white flex-col`}>
      <div className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-blue-800/30"}`}>
        <div className="flex items-center space-x-2">
          <Train className="w-5 h-5" />
          <h2 className="text-lg font-bold">Rail Defect App</h2>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="flex flex-col gap-2">
          {navItems.map(({ label, icon, path }) => {
            const isActive = currentPath === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 p-2 rounded-md transition-all border-l-4 ${
                  isActive
                    ? darkMode
                      ? "bg-gray-700 font-semibold text-white border-white"
                      : "bg-blue-800/40 font-semibold text-white border-white"
                    : darkMode
                      ? "hover:bg-gray-700 border-transparent"
                      : "hover:bg-blue-800/20 border-transparent"
                }`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
