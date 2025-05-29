
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, MapPin } from "lucide-react";
import { SeverityBadge, StatusBadge } from "./DefectBadges";
import { type Defect } from "@/data/defect-data";

interface DefectTableProps {
  defects: Defect[];
  onViewMap: (defect: Defect) => void;
  onCreateReport: (defect: Defect) => void;
}

export function DefectTable({ defects, onViewMap, onCreateReport }: DefectTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Detected</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {defects.length > 0 ? (
            defects.map((defect) => (
              <TableRow key={defect._id} className="hover:bg-muted/50 cursor-pointer">
                <TableCell className="font-medium">{defect._id}</TableCell>
                <TableCell>{defect.type}</TableCell>
                <TableCell>
                  <SeverityBadge severity={defect.severity} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={defect.status} />
                </TableCell>
                <TableCell>{new Date(defect.detected_at).toLocaleDateString()}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {`${defect.location.trackId}, Mile ${defect.location.mileMarker}`}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewMap(defect)}
                    className="h-8"
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    Map
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onCreateReport(defect)}
                    className="h-8"
                  >
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    Report
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No defects found matching your search criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
