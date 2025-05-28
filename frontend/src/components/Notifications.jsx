import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Bell, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/defauts")
      .then((res) => res.json())
      .then((data) => {
        const dynamic = data
          .slice(0, 10) // Limiter aux 10 plus récents
          .map((d) => ({
            id: d._id?.$oid || d._id,
            type:
              d.niveau_defaut === "critique"
                ? "critical"
                : d.niveau_defaut === "modere"
                ? "warning"
                : "resolved",
            message: `🔧 Défaut ${d.niveau_defaut} à ${d.region || "zone inconnue"}`,
            time: d.date,
            defectId: d._id?.$oid || d._id,
          }));
        setNotifications(dynamic);
      })
      .catch((err) =>
        console.error("Erreur de chargement des notifications :", err)
      );
  }, []);

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
                  case "warning":
                    return "bg-orange-100 text-orange-800 dark:bg-orange-900/30";
                  case "resolved":
                    return "bg-green-100 text-green-800 dark:bg-green-900/30";
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
                  case "warning":
                    return (
                      <Info
                        className="text-orange-600 dark:text-orange-400"
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
                  default:
                    return null;
                }
              };

              return (
                <li
                  key={notif.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${getStyles()}`}
                  onClick={() => navigate(`/dashboard?defectId=${notif.defectId}`)}
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
