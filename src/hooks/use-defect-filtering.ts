
import { useState, useEffect, useMemo } from "react";
import { type Defect } from "@/data/defect-data";

interface FilterState {
  showResolved: boolean;
  showPending: boolean;
}


export function useDefectFiltering(initialDefects: Defect[]) {
  const [defects, setDefects] = useState<Defect[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({
    showResolved: true,
    showPending: true,
  });
  
  // Load all defects when component mounts
  useEffect(() => {
    setDefects(initialDefects);
  }, [initialDefects]);

  // Filter defects based on search term and filters
  const filteredDefects = useMemo(() => {
    return defects.filter(defect => {
      // Apply status filters
      if (!filters.showResolved && defect.status === "resolved") return false;
      if (!filters.showPending && defect.status === "pending") return false;

      // Apply search filter
      if (searchTerm.trim() === "") return true;
      
      const search = searchTerm.toLowerCase();
      return (
        defect._id.toLowerCase().includes(search) ||
        defect.type.toLowerCase().includes(search) ||
        defect.location.trackId.toLowerCase().includes(search) ||
        defect.description.toLowerCase().includes(search)
      );
    });
  }, [defects, filters, searchTerm]);

  return {
    defects,
    setDefects,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredDefects
  };
}
