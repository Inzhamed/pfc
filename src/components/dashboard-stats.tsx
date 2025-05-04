
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDefectStatistics } from "@/data/defect-data";

export function DashboardStats() {
  const stats = getDefectStatistics();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <Card className="bg-card dark:glass-card">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium">Total Defects</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-4 pb-3">
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All detected defects</p>
        </CardContent>
      </Card>
      <Card className="bg-card dark:glass-card">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-4 pb-3">
          <div className="text-2xl font-bold text-severity-critical">{stats.bySeverity.critical}</div>
          <p className="text-xs text-muted-foreground">Needs immediate attention</p>
        </CardContent>
      </Card>
      <Card className="bg-card dark:glass-card">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium">Pending Repairs</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-4 pb-3">
          <div className="text-2xl font-bold text-amber-500">{stats.byStatus.pending}</div>
          <p className="text-xs text-muted-foreground">Awaiting action</p>
        </CardContent>
      </Card>
      <Card className="bg-card dark:glass-card">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-4 pb-3">
          <div className="text-2xl font-bold text-severity-resolved">{stats.byStatus.resolved}</div>
          <p className="text-xs text-muted-foreground">Successfully fixed</p>
        </CardContent>
      </Card>
    </div>
  );
}
