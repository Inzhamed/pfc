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
import { useState } from "react";

export default function SettingsPage() {
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  
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
                  onCheckedChange={setEmailNotifications}
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
                  onCheckedChange={setPushNotifications}
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
                    value="demo@example.com" 
                    disabled 
                    className="max-w-md"
                  />
                  <Button variant="outline">Change</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    value="********" 
                    disabled 
                    className="max-w-md"
                  />
                  <Button variant="outline">Change</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
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
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Updates</Label>
                  <div className="text-sm text-muted-foreground">
                    Keep the map view updated in real-time
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          {/* Add some bottom padding to ensure everything is visible when scrolling */}
          <div className="h-6"></div>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
}
