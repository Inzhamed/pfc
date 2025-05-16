import Sidebar from "@/components/Sidebar";
import DrawerSidebar from "@/components/DrawerSidebar";
import Notifications from "@/components/Notifications";
import Map from "@/components/Map";
import ThemeToggle from "@/components/ThemeToggle";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          {/* Mobile menu à gauche */}
          <div className="md:hidden">
            <DrawerSidebar />
          </div>

          {/* Notifications à droite */}
          <div className="ml-auto">
            <Notifications />
            <ThemeToggle />
          </div>
        </div>

        {/* Contenu */}
        <main className="flex-1 p-4">
          <h1 className="text-xl font-bold mb-4">Rail Defect Dashboard</h1>
          <Map />
        </main>
      </div>
    </div>
  );
}