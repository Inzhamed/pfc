import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AlertsPanel } from "@/components/alerts-panel";
import { ThemeProvider } from "@/components/theme-provider";
import { Defect } from "@/data/defect-data";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: ReactNode;
  onDefectSelect: (defect: Defect) => void;
}

export function DashboardLayout({
  children,
  onDefectSelect
}: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/login");
  };

  return (
    <ThemeProvider>
      <div className="h-screen w-screen flex overflow-hidden">
        {!isMobile && (
          <aside className="h-full border-r">
            <DashboardSidebar />
          </aside>
        )}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="h-14 border-b px-4 flex items-center justify-between bg-card dark:glass-card z-30">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="flex-1" />
            <div className="flex items-center space-x-2">
              <AlertsPanel onSelectDefect={onDefectSelect} />
            </div>
          </header>
          <div className="flex-1 overflow-hidden">{children}</div>
        </main>
      </div>

      {/* Mobile sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent className="p-0 z-50" side="left">
            <DashboardSidebar isMobile onClose={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      )}
    </ThemeProvider>
  );
}