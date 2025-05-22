"use client"

import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Home, FileText, History, Settings, Train, Info, X, Shield } from "lucide-react"

export default function Sidebar({ darkMode, isMobileOpen, setIsMobileOpen }) {
  const location = useLocation()
  const currentPath = location.pathname

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin")
    setIsAdmin(adminStatus === "true")
  }, [])

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
    { label: "Reports", path: "/reports", icon: <FileText size={18} /> },
    { label: "History", path: "/history", icon: <History size={18} /> },
    { label: "About", path: "/about", icon: <Info size={18} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ]

  // Ajoute le bouton Admin uniquement si c'est un administrateur
  if (isAdmin) {
    navItems.push({
      label: "Admin",
      path: "/admin",
      icon: <Shield size={18} />,
    })
  }

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex h-screen w-64 ${darkMode ? "bg-gray-800" : "bg-[#0a3172]"} text-white flex-col`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cdta-sTU1fcIDpushBOEvkgLbOVUIb3QTf0.jpeg"
              alt="CDTA Logo"
              className="h-6 w-auto"
            />
            <Train className="w-5 h-5" />
            <h2 className="text-lg font-bold">Rail Defect App</h2>
          </div>
        </div>
        <nav className="flex-1 p-4">
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
        </nav>
      </aside>

      {/* Sidebar Mobile */}
      {isMobileOpen && (
        <div className={`fixed inset-0 z-40 flex md:hidden`}>
          <div className={`w-64 ${darkMode ? "bg-gray-800" : "bg-[#0a3172]"} text-white flex flex-col`}>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cdta-sTU1fcIDpushBOEvkgLbOVUIb3QTf0.jpeg"
                  alt="CDTA Logo"
                  className="h-6 w-auto"
                />
                <Train className="w-5 h-5" />
                <h2 className="text-lg font-bold">Rail Defect App</h2>
              </div>
              <button onClick={() => setIsMobileOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4">
              {navItems.map(({ label, icon, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10"
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
        </div>
      )}
    </>
  )
}
