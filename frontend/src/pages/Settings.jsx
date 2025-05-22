"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Globe, Shield, Save } from "lucide-react"


export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [language, setLanguage] = useState("fr")
  const [isDark, setIsDark] = useState(false)

  // Détecter le thème sombre/clair
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const handleSaveSettings = () => {
    // Simuler la sauvegarde des paramètres
    console.log("Paramètres sauvegardés:", {
      emailNotifications,
      pushNotifications,
      language,
    })
    // Afficher une notification ou un message de succès
    alert("Paramètres sauvegardés avec succès!")
  }

  return (
  
      <div className="p-4 md:p-8 max-w-screen-xl mx-auto w-full">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-center md:text-left">Paramètres</h1>

        <ScrollArea className="h-full w-full pr-4">
          <div className="space-y-6 pb-8">
            {/* Notifications Settings */}
            <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100"}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Préférences de notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDark ? "text-gray-300" : "text-gray-700"}>Notifications par email</Label>
                    <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Recevoir des mises à jour par email concernant les rapports de défauts
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <Separator className={isDark ? "bg-gray-700" : "bg-gray-200"} />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDark ? "text-gray-300" : "text-gray-700"}>Notifications push</Label>
                    <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Recevoir des notifications en temps réel pour les défauts urgents
                    </div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100"}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Paramètres du compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className={isDark ? "text-gray-300" : "text-gray-700"}>Adresse email</Label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      value="technicien@sntf.dz"
                      disabled
                      className={`max-w-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                    />
                    <Button
                      variant="outline"
                      className={isDark ? "border-gray-600 text-gray-200 hover:bg-gray-700" : ""}
                    >
                      Modifier
                    </Button>
                  </div>
                </div>
                <Separator className={isDark ? "bg-gray-700" : "bg-gray-200"} />
                <div className="space-y-2">
                  <Label className={isDark ? "text-gray-300" : "text-gray-700"}>Mot de passe</Label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value="********"
                      disabled
                      className={`max-w-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                    />
                    <Button
                      variant="outline"
                      className={isDark ? "border-gray-600 text-gray-200 hover:bg-gray-700" : ""}
                    >
                      Modifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100"}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Préférences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className={isDark ? "text-gray-300" : "text-gray-700"}>Langue</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger
                      className={`w-full max-w-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={isDark ? "bg-gray-800 border-gray-700" : ""}>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator className={isDark ? "bg-gray-700" : "bg-gray-200"} />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDark ? "text-gray-300" : "text-gray-700"}>Mises à jour automatiques</Label>
                    <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Maintenir la vue de la carte mise à jour en temps réel
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveSettings}
                className={`px-6 ${
                  isDark ? "bg-[#0a3172] hover:bg-[#072758] text-white" : "bg-[#0a3172] hover:bg-[#072758] text-white"
                }`}
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les modifications
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
  )
}
