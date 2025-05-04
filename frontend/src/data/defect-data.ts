
export type DefectType = 'crack' | 'wear' | 'corrosion' | 'alignment' | 'geometry';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type RepairStatus = 'pending' | 'scheduled' | 'in-progress' | 'resolved';

export interface Defect {
  id: string;
  type: DefectType;
  severity: SeverityLevel;
  location: {
    lat: number;
    lng: number;
    trackId: string;
    mileMarker: number;
  };
  detectedAt: string;
  imageUrl: string;
  description: string;
  status: RepairStatus;
  assignedTo?: string;
  scheduledRepair?: string;
  comments: {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: string;
  }[];
}

// Generate random defects around Chicago area
function generateRandomDefects(count: number): Defect[] {
  const defects: Defect[] = [];
  const defectTypes: DefectType[] = ['crack', 'wear', 'corrosion', 'alignment', 'geometry'];
  const severityLevels: SeverityLevel[] = ['critical', 'high', 'medium', 'low'];
  const statuses: RepairStatus[] = ['pending', 'scheduled', 'in-progress', 'resolved'];
  
  // Chicago center coordinates
  const chicagoLat = 41.8781;
  const chicagoLng = -87.6298;
  
  for (let i = 0; i < count; i++) {
    // Random coordinates within ~20mi of Chicago
    const lat = chicagoLat + (Math.random() - 0.5) * 0.3;
    const lng = chicagoLng + (Math.random() - 0.5) * 0.3;
    
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    const type = defectTypes[Math.floor(Math.random() * defectTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate a date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const defect: Defect = {
      id: `DEF-${1000 + i}`,
      type,
      severity,
      location: {
        lat,
        lng,
        trackId: `TRK-${100 + Math.floor(Math.random() * 20)}`,
        mileMarker: Math.floor(Math.random() * 100),
      },
      detectedAt: date.toISOString(),
      imageUrl: `/defect-${type}-${Math.floor(Math.random() * 3) + 1}.jpg`,
      description: generateDescription(type, severity),
      status,
      comments: [],
    };
    
    // Add assigned technician and scheduled repair for non-pending defects
    if (status !== 'pending') {
      defect.assignedTo = `Tech-${Math.floor(Math.random() * 5) + 1}`;
      
      // For scheduled or in-progress, add a future date
      if (status === 'scheduled' || status === 'in-progress') {
        const repairDate = new Date();
        repairDate.setDate(date.getDate() + Math.floor(Math.random() * 7) + 1);
        defect.scheduledRepair = repairDate.toISOString();
      }
      
      // Add some comments
      const commentCount = Math.floor(Math.random() * 3);
      for (let c = 0; c < commentCount; c++) {
        const commentDate = new Date(date);
        commentDate.setHours(date.getHours() + c + 1);
        
        defect.comments.push({
          id: `CMT-${i}-${c}`,
          userId: `USER-${Math.floor(Math.random() * 5) + 1}`,
          userName: `Technician ${Math.floor(Math.random() * 5) + 1}`,
          text: generateComment(type, status),
          timestamp: commentDate.toISOString(),
        });
      }
    }
    
    defects.push(defect);
  }
  
  return defects;
}

function generateDescription(type: DefectType, severity: SeverityLevel): string {
  const descriptions = {
    crack: [
      "Longitudinal crack detected along rail head",
      "Transverse crack detected in rail base",
      "Multiple hairline cracks observed at rail joint",
      "Single crack propagating from bolt hole"
    ],
    wear: [
      "Side wear exceeding threshold on outer rail curve",
      "Top surface wear detected on straight section",
      "Uneven wear pattern observed at crossing",
      "Gauge corner wear detected"
    ],
    corrosion: [
      "Surface corrosion affecting rail web",
      "Heavy corrosion at fastening location",
      "Corrosion damage observed near drainage area",
      "Rust flaking detected on rail base"
    ],
    alignment: [
      "Horizontal misalignment detected beyond tolerance",
      "Vertical misalignment observed at joint",
      "Track gauge deviation detected",
      "Cross-level exceeds maintenance threshold"
    ],
    geometry: [
      "Cant deficiency detected on curve",
      "Excessive twist measured over 3 meters",
      "Track settlement observed near bridge approach",
      "Geometry irregularity at switch point"
    ]
  };
  
  const severityPrefixes = {
    critical: "URGENT: ",
    high: "High priority: ",
    medium: "Moderate: ",
    low: "Minor: "
  };
  
  const typeDescriptions = descriptions[type];
  const description = typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
  
  return severityPrefixes[severity] + description;
}

function generateComment(type: DefectType, status: RepairStatus): string {
  const comments = {
    pending: [
      "Reviewing defect details to assign priority",
      "Need equipment to address this issue",
      "Will schedule inspection team for next week"
    ],
    scheduled: [
      "Materials ordered for repair",
      "Crew scheduled for repair on assigned date",
      "Track time requested for maintenance window"
    ],
    'in-progress': [
      "Repair work has begun, estimated completion by end of shift",
      "Temporary fix applied, permanent repair scheduled",
      "Working on this section currently, additional resources needed"
    ],
    resolved: [
      "Defect repaired and track returned to service",
      "Fixed with standard procedure, follow-up inspection recommended",
      "Repair completed and verified via testing"
    ]
  };
  
  const statusComments = comments[status];
  return statusComments[Math.floor(Math.random() * statusComments.length)];
}

export const mockDefects = generateRandomDefects(40);

// Returns the counts of defects by severity
export function getDefectStatistics() {
  const stats = {
    total: mockDefects.length,
    bySeverity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    byStatus: {
      pending: 0,
      scheduled: 0,
      'in-progress': 0,
      resolved: 0
    }
  };
  
  mockDefects.forEach(defect => {
    stats.bySeverity[defect.severity]++;
    stats.byStatus[defect.status]++;
  });
  
  return stats;
}

// Filter defects based on criteria
export function filterDefects(
  defects: Defect[], 
  filters: {
    severity?: SeverityLevel[], 
    type?: DefectType[], 
    status?: RepairStatus[],
    dateRange?: { start?: Date, end?: Date }
  }
): Defect[] {
  return defects.filter(defect => {
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
      const defectDate = new Date(defect.detectedAt);
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

// Get new mock defects that were detected in the last hour (simulating real-time)
export function getRecentDefects(): Defect[] {
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
  // Get ~10% of defects and make them recent
  return mockDefects
    .slice(0, Math.max(1, Math.floor(mockDefects.length * 0.1)))
    .map(defect => {
      const recentDefect = { ...defect };
      const recentTime = new Date();
      recentTime.setMinutes(recentTime.getMinutes() - Math.floor(Math.random() * 60));
      recentDefect.detectedAt = recentTime.toISOString();
      return recentDefect;
    });
}
