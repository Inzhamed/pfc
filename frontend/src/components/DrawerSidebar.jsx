import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, Home, FileText, History, Settings } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

export default function DrawerSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
    { label: "Rapport", path: "/rapport", icon: <FileText size={18} /> },
    { label: "Historique", path: "/historique", icon: <History size={18} /> },
    { label: "Paramètres", path: "/parametres", icon: <Settings size={18} /> },
  ];

  return (
    <div className="md:hidden p-4">
      <Sheet>
        <SheetTrigger className="text-foreground">
          <Menu size={24} />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <h2 className="text-lg font-bold mb-6">Rail Defect App</h2>
          <nav className="flex flex-col gap-2">
            {navItems.map(({ label, icon, path }) => {
              const isActive = currentPath === path;
              return (
                <SheetClose asChild key={path}>
                  <Link
                    to={path}
                    className={`flex items-center gap-3 p-2 rounded-md transition-all border-l-4 ${
                      isActive
                        ? "bg-muted font-semibold text-primary border-primary"
                        : "hover:bg-muted border-transparent"
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                </SheetClose>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
