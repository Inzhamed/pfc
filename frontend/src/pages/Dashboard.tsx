import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardStats } from "@/components/dashboard-stats";
import DefectMap from "@/components/defect-map";
import { FilterControls } from "@/components/filter-controls";
import { DefectDetail } from "@/components/defect-detail";
import { useState, useEffect } from "react";
import { Defect, filterDefects, mockDefects } from "@/data/defect-data";

export default function DashboardPage() {
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [filteredDefects, setFilteredDefects] = useState<Defect[]>(mockDefects);
  const [filters, setFilters] = useState({
    severity: [],
    type: [],
    status: [],
    dateRange: {}
  });

  useEffect(() => {
    const filtered = filterDefects(mockDefects, filters);
    setFilteredDefects(filtered);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <DashboardLayout onDefectSelect={setSelectedDefect}>
      <div className="p-6 h-full overflow-y-auto">
        <div className="mb-6">
          <DashboardStats />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-280px)]">
          <div className="lg:col-span-3 flex flex-col">
            <div className="bg-card dark:glass-card rounded-lg overflow-hidden border shadow-sm h-full">
              <DefectMap 
                defects={filteredDefects} 
                onDefectSelect={setSelectedDefect}
                selectedDefect={selectedDefect}
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-4 h-full overflow-y-auto">
            <div className="sticky top-0 z-10">
              <FilterControls onFilterChange={handleFilterChange} />
            </div>
            
            {selectedDefect && (
              <div className="flex-1 min-h-[300px]">
                <DefectDetail 
                  defect={selectedDefect}
                  onStatusChange={(defect, newStatus) => {
                    console.log(`Changing status of defect ${defect.id} to ${newStatus}`);
                  }}
                  onAddComment={(defect, comment) => {
                    console.log(`Adding comment to defect ${defect.id}: ${comment}`);
                  }}
                  className="h-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
