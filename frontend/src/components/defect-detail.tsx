
import { useState } from "react";
import { Defect, DefectType, RepairStatus, SeverityLevel } from "@/data/defect-data";
import { Check, Clock, HardHat, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface DefectDetailProps {
  defect: Defect;
  onStatusChange: (defect: Defect, newStatus: RepairStatus) => void;
  onAddComment: (defect: Defect, comment: string) => void;
  className?: string;
}

export function DefectDetail({
  defect,
  onStatusChange,
  onAddComment,
  className = "",
}: DefectDetailProps) {
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const getSeverityColor = (severity: SeverityLevel): string => {
    switch (severity) {
      case "critical":
        return "bg-severity-critical text-white";
      case "high":
        return "bg-severity-high text-white";
      case "medium":
        return "bg-severity-medium text-black";
      case "low":
        return "bg-severity-low text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getDefectTypeInfo = (type: DefectType): { label: string } => {
    switch (type) {
      case "crack":
        return { label: "Rail Crack" };
      case "alignment":
        return { label: "Track Misalignment" };
      case "corrosion":
        return { label: "Rail Corrosion" };
      case "geometry":
        return { label: "Joint Failure" };
      case "wear":
        return { label: "Rail Wear" };
      default:
        return { label: "Unknown Defect" };
    }
  };

  const getStatusInfo = (status: RepairStatus): { label: string; color: string } => {
    switch (status) {
      case "pending":
        return { label: "Pending", color: "bg-amber-500" };
      case "scheduled":
        return { label: "Scheduled", color: "bg-blue-500" };
      case "in-progress":
        return { label: "In Progress", color: "bg-purple-500" };
      case "resolved":
        return { label: "Resolved", color: "bg-green-500" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      onAddComment(defect, comment);
      setComment("");
      toast({
        title: "Comment Added",
        description: "Your comment has been added to this defect.",
      });
    }
  };

  const handleStatusChange = (newStatus: RepairStatus) => {
    onStatusChange(defect, newStatus);
    toast({
      title: "Status Updated",
      description: `Defect status has been updated to ${newStatus}.`,
    });
  };

  const statusInfo = getStatusInfo(defect.status);
  const defectTypeInfo = getDefectTypeInfo(defect.type);

  if (!defect) return null;

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{defectTypeInfo.label}</CardTitle>
            <CardDescription className="text-xs">
              ID: {defect.id} - Detected {formatDate(defect.detectedAt)}
            </CardDescription>
          </div>
          <Badge
            className={`text-xs ${getSeverityColor(defect.severity)} ${
              defect.severity === "critical" && defect.status !== "resolved"
                ? "animate-pulse"
                : ""
            }`}
          >
            {defect.severity.charAt(0).toUpperCase() + defect.severity.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Badge
            variant="outline"
            className={`text-xs ${statusInfo.color} bg-opacity-20`}
          >
            {statusInfo.label}
          </Badge>
          {defect.assignedTo && (
            <Badge variant="outline" className="text-xs">
              Assigned to: {defect.assignedTo}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col overflow-y-auto space-y-4 pb-3 flex-grow">
        <div className="aspect-video rounded-md overflow-hidden bg-muted relative">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-3xl font-light">Defect Image</div>
              <div className="text-xs mt-1">({defect.type} visualization)</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Description</h4>
          <p className="text-sm text-muted-foreground">{defect.description}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Location</h4>
          <p className="text-sm text-muted-foreground">
            Track: {defect.location.trackId}, Mile marker: {defect.location.mileMarker}
          </p>
          <p className="text-sm text-muted-foreground">
            GPS: {defect.location.lat.toFixed(6)}, {defect.location.lng.toFixed(6)}
          </p>
        </div>

        {defect.comments && defect.comments.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Comments</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {defect.comments.map((comment, i) => (
                <div key={i} className="text-xs bg-muted p-2 rounded-md">
                  <div className="font-medium">{comment.userName}</div>
                  <div className="text-muted-foreground mt-0.5">
                    {comment.text}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {formatDate(comment.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {defect.status !== "resolved" && (
          <div>
            <Textarea
              placeholder="Add a comment..."
              className="text-xs h-20 resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              size="sm"
              className="mt-2 h-7 text-xs"
              onClick={handleAddComment}
            >
              <Send className="mr-1 h-3 w-3" />
              Add Comment
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t">
        {defect.status !== "resolved" && (
          <div className="w-full">
            <div className="text-xs mb-2">Update Status</div>
            <div className="flex flex-wrap gap-2">
              {defect.status === "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleStatusChange("scheduled")}
                >
                  <Clock className="mr-1 h-3 w-3" />
                  Schedule Repair
                </Button>
              )}
              {(defect.status === "pending" || defect.status === "scheduled") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleStatusChange("in-progress")}
                >
                  <HardHat className="mr-1 h-3 w-3" />
                  Start Repair
                </Button>
              )}
              {defect.status === "pending" || defect.status === "scheduled" || defect.status === "in-progress" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleStatusChange("resolved")}
                >
                  <Check className="mr-1 h-3 w-3" />
                  Mark Resolved
                </Button>
              )}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
