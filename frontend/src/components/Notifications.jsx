import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Bell, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [
  {
    id: 1,
    type: "critical",
    message: "🚧 Défaut critique détecté à El Harrach",
    time: "Il y a 2 min",
  },
  {
    id: 2,
    type: "resolved",
    message: "✅ Défaut résolu secteur Est",
    time: "Il y a 12 min",
  },
  {
    id: 3,
    type: "info",
    message: "ℹ️ Nouvelle mise à jour des données",
    time: "Il y a 1h",
  },
];

export default function Notifications() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell size={22} className="text-muted-foreground" />
          {notifications.length > 0 && (
            <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 space-y-2 shadow-xl rounded-xl">
        <h4 className="text-base font-semibold text-foreground mb-2">
          Notifications
        </h4>

        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune notification pour l’instant.
          </p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`rounded-lg p-3 text-sm border shadow-sm ${
                  notif.type === "critical"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/20"
                    : notif.type === "resolved"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20"
                    : "bg-muted"
                }`}
              >
                <div className="font-medium">{notif.message}</div>
                <div className="text-xs text-zinc-500 mt-1">{notif.time}</div>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
