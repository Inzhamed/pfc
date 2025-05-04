
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
      <div className="p-4 md:p-6 h-full overflow-y-auto">
        <div className="mb-4 md:mb-6">
          <DashboardStats />
        </div>
        
        {/* Different layouts for mobile and desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Map takes 3/4 width on large screens, full width on small screens */}
          <div className="lg:col-span-3">
            <div className="bg-card dark:glass-card rounded-lg overflow-hidden border shadow-sm h-[400px] md:h-[500px] lg:h-[calc(100vh-280px)]">
              <DefectMap 
                defects={filteredDefects} 
                onDefectSelect={setSelectedDefect}
                selectedDefect={selectedDefect}
              />
            </div>
          </div>
          
          {/* Filter and detail section - 1/4 width on large screens, full width on small */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Filters visible on all screen sizes */}
            <div className="sticky top-0 z-10">
              <FilterControls onFilterChange={handleFilterChange} />
            </div>
            
            {/* {selectedDefect && (
              <div className="min-h-[300px]">
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
            )} */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
