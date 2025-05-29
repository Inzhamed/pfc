"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, Save, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Settings() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!passwordData.current_password) {
      newErrors.current_password = "Le mot de passe actuel est requis"
    }

    if (!passwordData.new_password) {
      newErrors.new_password = "Le nouveau mot de passe est requis"
    } else if (passwordData.new_password.length < 4) {
      newErrors.new_password = "Le mot de passe doit contenir au moins 4 caractères"
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe"
    } else if (passwordData.new_password !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setMessage("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        setMessage("Vous devez être connecté pour effectuer cette action")
        return
      }

      console.log("Token trouvé:", token) // Debug

      const response = await fetch("http://127.0.0.1:8000/api/settings/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      })

      const data = await response.json()
      console.log("Réponse du serveur:", data) // Debug

      if (!response.ok) {
        throw new Error(data.detail || "Échec de la modification du mot de passe")
      }

      setMessage("Votre mot de passe a été modifié avec succès")

      // Reset form
      setPasswordData({
        current_password: "",
        new_password: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Erreur:", error) // Debug
      setMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")

      // Appeler l'endpoint de déconnexion (optionnel)
      if (token) {
        await fetch("http://127.0.0.1:8000/api/settings/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }

      // Supprimer le token du localStorage
      localStorage.removeItem("token")

      // Rediriger vers la page de connexion
      navigate("/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      // Même en cas d'erreur, on supprime le token et on redirige
      localStorage.removeItem("token")
      navigate("/login")
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-screen-xl mx-auto w-full">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-center md:text-left">Paramètres</h1>

      <div className="space-y-6 pb-8">
        {/* Account Settings */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Paramètres du compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.includes("succès")
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Mot de passe actuel</Label>
                <Input
                  id="current_password"
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handleInputChange}
                  className="max-w-md"
                />
                {errors.current_password && <p className="text-sm text-red-500">{errors.current_password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">Nouveau mot de passe</Label>
                <Input
                  id="new_password"
                  name="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={handleInputChange}
                  className="max-w-md"
                />
                {errors.new_password && <p className="text-sm text-red-500">{errors.new_password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handleInputChange}
                  className="max-w-md"
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="px-6 bg-[#0a3172] hover:bg-[#072758] text-white" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Modification en cours..." : "Appliquer les modifications"}
                </Button>
              </div>
            </form>

            <div className="pt-4 border-t">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full md:w-auto border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
