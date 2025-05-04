
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { History as HistoryIcon } from "lucide-react";
import { mockDefects, type Defect } from "@/data/defect-data";
import { DefectFilters } from "@/components/history/DefectFilters";
import { DefectTable } from "@/components/history/DefectTable";
import { useDefectFiltering } from "@/hooks/use-defect-filtering";

export default function HistoryPage() {
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredDefects
  } = useDefectFiltering(mockDefects);

  // Handle creating a report for a defect
  const handleCreateReport = (defect: Defect): void => {
    navigate("/reports", { state: { defect } });
  };

  // Handle viewing a defect on the map
  const handleViewOnMap = (defect: Defect): void => {
    navigate("/dashboard", { state: { defect } });
  };

  return (
    <DashboardLayout onDefectSelect={setSelectedDefect}>
      <div className="p-6 h-full overflow-y-auto">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <HistoryIcon className="h-6 w-6 text-primary" />
                <CardTitle>Defect History</CardTitle>
              </div>
              <DefectFilters 
                filters={filters}
                setFilters={setFilters}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          </CardHeader>
          <CardContent>
            <DefectTable 
              defects={filteredDefects} 
              onViewMap={handleViewOnMap} 
              onCreateReport={handleCreateReport}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
