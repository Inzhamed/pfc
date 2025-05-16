import { Link, useLocation } from "react-router-dom";
import { Home, FileText, History, Settings } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
    { label: "reports", path: "/reports", icon: <FileText size={18} /> },
    { label: "history", path: "/history", icon: <History size={18} /> },
    { label: "settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 bg-card text-card-foreground border-r border-border flex-col justify-between p-4">
      <div>
        <h2 className="text-lg font-bold mb-6">Rail Defect App</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, icon, path }) => {
            const isActive = currentPath === path;
            return (
              <Link
                key={path}
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
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
