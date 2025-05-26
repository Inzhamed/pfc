"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

// ✅ Checkbox intégrée avec support du thème dark
function Checkbox({ id, label, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className="inline-flex items-center space-x-2 cursor-pointer select-none text-gray-800 dark:text-gray-200"
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
      />
      <span>{label}</span>
    </label>
  )
}

export default function AdminTechnicianForm({ onSubmit, initialData = null, onCancel }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (initialData) {
      setEmail(initialData.email)
      setPassword("") // sécurité : ne pas afficher le mot de passe
      setIsAdmin(initialData.is_admin)
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ email, password, is_admin: isAdmin })
    setEmail("")
    setPassword("")
    setIsAdmin(false)
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 transition-colors">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {initialData ? "Modifier un technicien" : "Ajouter un technicien"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">Email professionnel</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nomprenom@stnf.com"
              className="bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">Mot de passe (matricule)</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!initialData}
              placeholder="123456"
              className="bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div>
            <Checkbox
              id="isAdmin"
              label="Administrateur ?"
              checked={isAdmin}
              onChange={setIsAdmin}
            />
          </div>

          <div className="flex gap-4 mt-4">
            <Button type="submit">
              {initialData ? "Mettre à jour" : "Ajouter"}
            </Button>
            {initialData && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
