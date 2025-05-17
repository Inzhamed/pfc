import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Bell, AlertCircle, CheckCircle2, Info } from "lucide-react";
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
        <Button variant="ghost" className="relative rounded-full p-2">
          <Bell size={22} className="text-muted-foreground" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 space-y-3 rounded-xl border bg-white text-black dark:bg-zinc-900 dark:text-white shadow-xl">
        <h4 className="text-base font-semibold text-black dark:text-white mb-2">
          Notifications
        </h4>

        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune notification pour l’instant.
          </p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {notifications.map((notif) => {
              const getStyles = () => {
                switch (notif.type) {
                  case "critical":
                    return "bg-red-100 text-red-800 dark:bg-red-900/30";
                  case "resolved":
                    return "bg-green-100 text-green-800 dark:bg-green-900/30";
                  case "info":
                    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30";
                  default:
                    return "bg-muted";
                }
              };

              const getIcon = () => {
                switch (notif.type) {
                  case "critical":
                    return (
                      <AlertCircle
                        className="text-red-600 dark:text-red-400"
                        size={18}
                      />
                    );
                  case "resolved":
                    return (
                      <CheckCircle2
                        className="text-green-600 dark:text-green-400"
                        size={18}
                      />
                    );
                  case "info":
                    return (
                      <Info
                        className="text-blue-600 dark:text-blue-400"
                        size={18}
                      />
                    );
                  default:
                    return null;
                }
              };

              return (
                <li
                  key={notif.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${getStyles()}`}
                >
                  <div className="pt-0.5">{getIcon()}</div>
                  <div className="flex-1">
                    <p className="font-medium">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notif.time}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}