
import { type SeverityLevel } from "@/data/defect-data";

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const badgeClass = getSeverityBadgeClass(severity);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const badgeClass = getStatusBadgeClass(status);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Get severity badge color
export function getSeverityBadgeClass(severity: SeverityLevel): string {
  switch (severity) {
    case "critical": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    default: return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  }
}

// Get status badge color
export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "resolved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "pending": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
  }
}
