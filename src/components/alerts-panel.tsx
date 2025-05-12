
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getRecentDefects, Defect } from "@/data/defect-data";
import { useToast } from "@/hooks/use-toast";

interface AlertsPanelProps {
  onSelectDefect: (defect: Defect) => void;
}

export function AlertsPanel({ onSelectDefect }: AlertsPanelProps) {
  const [recentDefects, setRecentDefects] = useState<Defect[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Load initial alerts
  useEffect(() => {
    const recents = getRecentDefects();
    setRecentDefects(recents);
    setUnreadCount(recents.length);
    
    // Show toast for critical defects
    const criticalDefects = recents.filter(d => d.severity === 'critical');
    if (criticalDefects.length > 0) {
      toast({
        title: `${criticalDefects.length} Critical defect${criticalDefects.length > 1 ? 's' : ''} detected`,
        description: "These defects require immediate attention.",
        variant: "destructive"
      });
    }
    
    // Simulate new alert every 15-30 seconds
    const interval = setInterval(() => {
      const newAlert = getRecentDefects()[0]; // Get one random defect
      if (newAlert) {
        // Update to make the timestamp recent
        const now = new Date();
        newAlert.detectedAt = now.toISOString();
        
        setRecentDefects(prev => [newAlert, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        if (newAlert.severity === 'critical' || newAlert.severity === 'high') {
          toast({
            title: `New ${newAlert.severity} defect detected`,
            description: newAlert.description,
            variant: newAlert.severity === 'critical' ? "destructive" : "default"
          });
        }
      }
    }, Math.random() * 15000 + 15000); // Random interval between 15-30 seconds
    
    return () => clearInterval(interval);
  }, [toast]);
  
  // Mark all as read
  const markAllAsRead = () => {
    setUnreadCount(0);
  };
  
  // Handle defect selection
  const handleDefectSelect = (defect: Defect) => {
    onSelectDefect(defect);
    setOpen(false);
  };
  
  // Format time (like "2 minutes ago")
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
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
          {recentDefects.length > 0 ? (
            recentDefects.slice(0, 10).map((defect) => (
              <div
                key={defect.id + defect.detectedAt}
                className="p-3 hover:bg-muted/50 cursor-pointer"
                onClick={() => handleDefectSelect(defect)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className={`w-2 h-2 rounded-full bg-severity-${defect.severity}`} 
                    />
                    <span className="font-medium text-sm">
                      {defect.id}: {defect.type} defect
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(defect.detectedAt)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground ml-4 mt-1 line-clamp-2">
                  {defect.description}
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No new alerts
            </div>
          )}
        </div>
        <Separator />
        <div className="p-2">
          <Button variant="outline" size="sm" className="w-full text-xs">
            View all alerts
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
