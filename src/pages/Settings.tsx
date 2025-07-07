import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Globe, Mail, Shield } from "lucide-react";
import { useState, useEffect} from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { API_BASE_URL } from "@/api";

export default function SettingsPage() {
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  const [newEmail, setNewEmail] = useState("demo@example.com");
  const [newPassword, setNewPassword] = useState("");
  const userId = localStorage.getItem("userId");
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/${userId}`);
        setNewEmail(res.data.email);
        // Sync notification preferences
        if (res.data.notifications) {
          setEmailNotifications(res.data.notifications.email ?? true);
          setPushNotifications(res.data.notifications.push ?? true);
        }
        // Sync language
        setLanguage(res.data.language || "en");
      } catch (err) {
        console.error(err);
      }
    }
    if (userId) fetchUser();
  }, [userId]);

  async function handleChangeEmail() {
    try {
      await axios.put(`${API_BASE_URL}/users/${userId}`, { email: newEmail });
      toast({ title: "Email changed successfully!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to change email", variant: "destructive" });
    }
  }

  async function handleChangePassword() {
    try {
      await axios.put(`${API_BASE_URL}/users/${userId}`, { password: newPassword });
      toast({ title: "Password changed successfully!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to change password", variant: "destructive" });
    }
  }

  async function handleNotificationChange(type: "email" | "push", value: boolean) {
    try {
      const notifications = {
        email: type === "email" ? value : emailNotifications,
        push: type === "push" ? value : pushNotifications,
      };
      await axios.put(`${API_BASE_URL}/users/${userId}`, { notifications });
      if (type === "email") setEmailNotifications(value);
      if (type === "push") setPushNotifications(value);
      toast({ title: "Notification preferences updated!" });
    } catch (error) {
      toast({ title: "Failed to update notifications", variant: "destructive" });
    }
  }

  async function handleLanguageChange(value: string) {
    try {
      await axios.put(`${API_BASE_URL}/users/${userId}`, { language: value });
      setLanguage(value);
      toast({ title: "Language updated!" });
    } catch (error) {
      toast({ title: "Failed to update language", variant: "destructive" });
    }
  }

  return (
    <DashboardLayout onDefectSelect={setSelectedDefect}>
      <ScrollArea className="h-full w-full">
        <div className="p-6 space-y-6">
          {/* Notifications Settings */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive email updates about defect reports and assignments
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(val) => handleNotificationChange("email", val)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Get real-time push notifications for urgent defects
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={(val) => handleNotificationChange("push", val)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="max-w-md"
                  />
                  <Button variant="outline" onClick={handleChangeEmail}>Change</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="max-w-md"
                  />
                  <Button variant="outline" onClick={handleChangePassword}>Change</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          {/* <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card> */}
          
          {/* Add some bottom padding to ensure everything is visible when scrolling */}
          <div className="h-6"></div>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
}
