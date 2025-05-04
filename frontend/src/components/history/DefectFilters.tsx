
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterState {
  showResolved: boolean;
  showPending: boolean;
}

interface DefectFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function DefectFilters({ filters, setFilters, searchTerm, setSearchTerm }: DefectFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search defects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showResolved" 
            checked={filters.showResolved}
            onCheckedChange={(checked) => 
              setFilters({ ...filters, showResolved: !!checked })
            }
          />
          <label htmlFor="showResolved" className="text-sm cursor-pointer">
            Resolved
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showPending" 
            checked={filters.showPending}
            onCheckedChange={(checked) => 
              setFilters({ ...filters, showPending: !!checked })
            }
          />
          <label htmlFor="showPending" className="text-sm cursor-pointer">
            Pending
          </label>
        </div>
      </div>
    </div>
  );
}
