
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardStats } from "@/components/dashboard-stats";
import DefectMap from "@/components/defect-map";
import { FilterControls } from "@/components/filter-controls";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDefects, updateDefect } from "@/api/defects";
import { Defect, filterDefects} from "@/data/defect-data";

export default function DashboardPage() {
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [filters, setFilters] = useState({
    severity: [],
    type: [],
    status: [],
    dateRange: {}
  });

  const queryClient = useQueryClient();

  // Fetch defects from backend
  const { data: defects = [], isLoading } = useQuery({
    queryKey: ["defects"],
    queryFn: fetchDefects,
  });

  // Filtering (client-side for now)
  const filteredDefects = filterDefects(defects, filters);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleMarkAsRepaired = (defect: Defect) => {
    updateDefectMutation.mutate({
      defectId: defect._id,
      data: { status: "resolved" },
    });
  };

  // Mutations for status
  const updateDefectMutation = useMutation<
    { defectId: string; data: Partial<Defect> }, // argument type
    unknown,
    { defectId: string; data: Partial<Defect> }
  >({
    mutationFn: ({ defectId, data }) => updateDefect(defectId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["defects"] }),
  });

  // Pass these handlers to DefectDetail
  const handleStatusChange = (defect, newStatus) => {
    updateDefectMutation.mutate({
      defectId: defect._id,
      data: { status: newStatus },
    });
  };

  return (
    <DashboardLayout onDefectSelect={setSelectedDefect}>
      <div className="p-4 md:p-6 h-full overflow-y-auto">
        <div className="mb-4 md:mb-6">
          <DashboardStats defects={defects} isLoading={isLoading} />
        </div>
        
        {/* Different layouts for mobile and desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Map takes 3/4 width on large screens, full width on small screens */}
          <div className="lg:col-span-3">
            <div className="bg-card dark:glass-card rounded-lg overflow-hidden border shadow-sm h-[400px] md:h-[500px] lg:h-[calc(100vh-280px)]">
              <DefectMap 
                defects={defects} 
                onDefectSelect={setSelectedDefect}
                selectedDefect={selectedDefect}
                onMarkAsRepaired={handleMarkAsRepaired}
              />
            </div>
          </div>
          
          {/* Filter and detail section - 1/4 width on large screens, full width on small */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Filters visible on all screen sizes */}
            <div className="sticky top-0 z-10">
              <FilterControls onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
