import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDefects } from "@/api/defects";
import { getRecentDefects, Defect } from "@/data/defect-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";

interface AlertsPanelProps {
  onSelectDefect: (defect: Defect) => void;
}

export function AlertsPanel({ onSelectDefect }: AlertsPanelProps) {
  const { data: defects = [], isLoading } = useQuery({
    queryKey: ["defects"],
    queryFn: fetchDefects,
  });

  const [open, setOpen] = useState(false);
  const [recentDefects, setRecentDefects] = useState<Defect[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (defects.length) {
      const recents = getRecentDefects(defects);
      setRecentDefects(recents);
      setUnreadCount(recents.length);
    }
  }, [defects]);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const handleDefectSelect = (defect: Defect) => {
    onSelectDefect(defect);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1 bg-severity-critical">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 z-50" align="end">
        <div className="flex items-center justify-between p-3 pb-1">
          <h3 className="font-medium">Recent Alerts</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <div className="max-h-80 overflow-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : recentDefects.length > 0 ? (
            recentDefects.slice(0, 10).map((defect) => (
              <div
                key={defect._id + defect.detected_at}
                className="p-3 hover:bg-muted/50 cursor-pointer"
                onClick={() => handleDefectSelect(defect)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full bg-severity-${defect.severity}`}
                    />
                    <span className="font-medium">{defect.type}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(defect.detected_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {defect.description}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No recent alerts.
            </div>
          )}
        </div>
        <Separator />
      </PopoverContent>
    </Popover>
  );
}