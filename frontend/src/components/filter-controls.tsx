
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckedState } from "@radix-ui/react-checkbox";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DefectType,
  RepairStatus,
  SeverityLevel,
} from "@/data/defect-data";

interface FilterControlsProps {
  onFilterChange: (filters: {
    severity: SeverityLevel[];
    type: DefectType[];
    status: RepairStatus[];
    dateRange: { start?: Date; end?: Date };
  }) => void;
}

export function FilterControls({ onFilterChange }: FilterControlsProps) {
  const [selectedSeverities, setSelectedSeverities] = useState<SeverityLevel[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<DefectType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<RepairStatus[]>([]);
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});

  // Handle severity checkbox changes
  const handleSeverityChange = (checked: CheckedState, severity: SeverityLevel) => {
    if (checked) {
      setSelectedSeverities([...selectedSeverities, severity]);
    } else {
      setSelectedSeverities(selectedSeverities.filter((s) => s !== severity));
    }
  };

  // Handle type checkbox changes
  const handleTypeChange = (checked: CheckedState, type: DefectType) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    }
  };

  // Handle status checkbox changes
  const handleStatusChange = (checked: CheckedState, status: RepairStatus) => {
    if (checked) {
      setSelectedStatuses([...selectedStatuses, status]);
    } else {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    }
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      severity: selectedSeverities,
      type: selectedTypes,
      status: selectedStatuses,
      dateRange,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedSeverities([]);
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setDateRange({});
    onFilterChange({
      severity: [],
      type: [],
      status: [],
      dateRange: {},
    });
  };

  // Get date range display text
  const getDateRangeText = () => {
    if (!dateRange.start) return "Select date range";
    if (!dateRange.end) return `From ${format(dateRange.start, "MMM d, yyyy")}`;
    return `${format(dateRange.start, "MMM d, yyyy")} - ${format(dateRange.end, "MMM d, yyyy")}`;
  };

  // Clear date range
  const clearDateRange = () => {
    setDateRange({});
  };

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto bg-card dark:glass-card rounded-lg border shadow-sm">
      <div>
        <h3 className="font-medium">Filter Defects</h3>
        <p className="text-sm text-muted-foreground">
          Apply filters to narrow down the displayed defects.
        </p>
      </div>

      <Separator />

      {/* Severity filter */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Severity</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="severity-critical"
              checked={selectedSeverities.includes("critical")}
              onCheckedChange={(checked) =>
                handleSeverityChange(checked, "critical")
              }
            />
            <label
              htmlFor="severity-critical"
              className="text-sm space-x-1 flex items-center"
            >
              <div className="w-2 h-2 rounded-full bg-severity-critical"></div>
              <span>Critical</span>
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="severity-high"
              checked={selectedSeverities.includes("high")}
              onCheckedChange={(checked) =>
                handleSeverityChange(checked, "high")
              }
            />
            <label
              htmlFor="severity-high"
              className="text-sm space-x-1 flex items-center"
            >
              <div className="w-2 h-2 rounded-full bg-severity-high"></div>
              <span>High</span>
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="severity-medium"
              checked={selectedSeverities.includes("medium")}
              onCheckedChange={(checked) =>
                handleSeverityChange(checked, "medium")
              }
            />
            <label
              htmlFor="severity-medium"
              className="text-sm space-x-1 flex items-center"
            >
              <div className="w-2 h-2 rounded-full bg-severity-medium"></div>
              <span>Medium</span>
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="severity-low"
              checked={selectedSeverities.includes("low")}
              onCheckedChange={(checked) =>
                handleSeverityChange(checked, "low")
              }
            />
            <label
              htmlFor="severity-low"
              className="text-sm space-x-1 flex items-center"
            >
              <div className="w-2 h-2 rounded-full bg-severity-low"></div>
              <span>Low</span>
            </label>
          </div>
        </div>
      </div>

      {/* Type filter */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Defect Type</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type-crack"
              checked={selectedTypes.includes("crack")}
              onCheckedChange={(checked) => handleTypeChange(checked, "crack")}
            />
            <label htmlFor="type-crack" className="text-sm">
              Rail Crack
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type-wear"
              checked={selectedTypes.includes("wear")}
              onCheckedChange={(checked) => handleTypeChange(checked, "wear")}
            />
            <label htmlFor="type-wear" className="text-sm">
              Rail Wear
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type-corrosion"
              checked={selectedTypes.includes("corrosion")}
              onCheckedChange={(checked) =>
                handleTypeChange(checked, "corrosion")
              }
            />
            <label htmlFor="type-corrosion" className="text-sm">
              Corrosion
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type-alignment"
              checked={selectedTypes.includes("alignment")}
              onCheckedChange={(checked) =>
                handleTypeChange(checked, "alignment")
              }
            />
            <label htmlFor="type-alignment" className="text-sm">
              Alignment
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type-geometry"
              checked={selectedTypes.includes("geometry")}
              onCheckedChange={(checked) =>
                handleTypeChange(checked, "geometry")
              }
            />
            <label htmlFor="type-geometry" className="text-sm">
              Geometry
            </label>
          </div>
        </div>
      </div>

      {/* Status filter */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Status</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-pending"
              checked={selectedStatuses.includes("pending")}
              onCheckedChange={(checked) =>
                handleStatusChange(checked, "pending")
              }
            />
            <label htmlFor="status-pending" className="text-sm">
              Pending
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-scheduled"
              checked={selectedStatuses.includes("scheduled")}
              onCheckedChange={(checked) =>
                handleStatusChange(checked, "scheduled")
              }
            />
            <label htmlFor="status-scheduled" className="text-sm">
              Scheduled
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-in-progress"
              checked={selectedStatuses.includes("in-progress")}
              onCheckedChange={(checked) =>
                handleStatusChange(checked, "in-progress")
              }
            />
            <label htmlFor="status-in-progress" className="text-sm">
              In Progress
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-resolved"
              checked={selectedStatuses.includes("resolved")}
              onCheckedChange={(checked) =>
                handleStatusChange(checked, "resolved")
              }
            />
            <label htmlFor="status-resolved" className="text-sm">
              Resolved
            </label>
          </div>
        </div>
      </div>

      {/* Date range filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Date Range</h4>
          {(dateRange.start || dateRange.end) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              onClick={clearDateRange}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear date range</span>
            </Button>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal text-sm",
                !dateRange.start && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getDateRangeText()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.start}
              selected={{
                from: dateRange.start,
                to: dateRange.end,
              }}
              onSelect={(range) => {
                setDateRange({
                  start: range?.from,
                  end: range?.to,
                });
              }}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  );
}
