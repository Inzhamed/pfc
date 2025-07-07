export type DefectType =
  | "crack"
  | "wear"
  | "corrosion"
  | "alignment"
  | "geometry";
export type SeverityLevel = "critical" | "high" | "medium" | "low";
export type RepairStatus = "pending" | "scheduled" | "in-progress" | "resolved";

export interface Defect {
  _id: string;
  type: DefectType;
  severity: SeverityLevel;
  location: {
    lat: number;
    lng: number;
    trackId: string;
    mileMarker: number;
  };
  detected_at: string;
  image_url: string;
  description: string;
  status: RepairStatus;
  assignedTo?: string;
  scheduledRepair?: string;
}

// Returns the counts of defects by severity
export function getDefectStatistics(defects: Defect[]) {
  const stats = {
    total: defects.length,
    bySeverity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
    byStatus: {
      pending: 0,
      scheduled: 0,
      "in-progress": 0,
      resolved: 0,
    },
  };

  defects.forEach((defect) => {
    stats.bySeverity[defect.severity]++;
    stats.byStatus[defect.status]++;
  });

  return stats;
}

// Filter defects based on criteria
export function filterDefects(
  defects: Defect[],
  filters: {
    severity?: SeverityLevel[];
    type?: DefectType[];
    status?: RepairStatus[];
    dateRange?: { start?: Date; end?: Date };
  }
): Defect[] {
  return defects.filter((defect) => {
    // Filter by severity
    if (filters.severity && filters.severity.length > 0) {
      if (!filters.severity.includes(defect.severity)) {
        return false;
      }
    }

    // Filter by type
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(defect.type)) {
        return false;
      }
    }

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(defect.status)) {
        return false;
      }
    }

    // Filter by date range
    if (filters.dateRange) {
      const defectDate = new Date(defect.detected_at);
      if (filters.dateRange.start && defectDate < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        endDate.setHours(23, 59, 59, 999); // Include the entire end day
        if (defectDate > endDate) {
          return false;
        }
      }
    }

    return true;
  });
}

export function getRecentDefects(defects: Defect[]): Defect[] {
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);

  // Filter defects detected in the last hour
  return defects.filter((defect) => {
    const detected_at = new Date(defect.detected_at);
    return detected_at >= oneHourAgo;
  });
}
