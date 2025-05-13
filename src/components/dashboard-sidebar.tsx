import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, LayoutDashboard, Map, Settings, User, X, FileText, History, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface DashboardSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ isMobile, onClose }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-3" />,
      path: "/dashboard"
    },
    {
      id: "reports",
      label: "Reports",
      icon: <FileText className="h-4 w-4 mr-3" />,
      path: "/reports"
    },
    {
      id: "history",
      label: "Defect History",
      icon: <History className="h-4 w-4 mr-3" />,
      path: "/history"
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4 mr-3" />,
      path: "/settings"
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full w-64 bg-sidebar">
      <div className="flex items-center justify-between p-4">
        <Link to="/dashboard" className="flex items-center">
          <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center mr-2">
            <span className="text-xs font-bold text-primary-foreground">RV</span>
          </div>
          <h1 className="font-semibold">Rail View Guardian</h1>
        </Link>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="mt-2 px-2">
        <div className="rounded-md bg-card p-1">
          <div className="flex items-center px-2 py-1.5">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
              <User className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium">Demo User</div>
              <div className="text-xs text-muted-foreground">Technician</div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex-1 overflow-auto">
        <div className="px-2 space-y-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPath === item.path ? "secondary" : "ghost"}
              className="w-full justify-start font-normal"
              asChild
            >
              <Link to={item.path}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}