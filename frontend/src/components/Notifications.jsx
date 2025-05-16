import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Notifications() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-4 space-y-2">
        <h4 className="text-sm font-semibold">Notifications</h4>
        <ul className="text-sm space-y-1">
          <li className="bg-muted p-2 rounded-md">
            🚧 Nouveau défaut détecté à 14:23
          </li>
          <li className="bg-muted p-2 rounded-md">
            ✅ Défaut résolu secteur Est
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
