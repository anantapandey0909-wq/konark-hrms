import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Timer, 
  Umbrella, 
  HelpCircle,
  type LucideIcon 
} from "lucide-react";
import type { AttendanceStatus } from "@/types/attendance";

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  className?: string;
}

interface StatusConfiguration {
  label: string;
  icon: LucideIcon;
  styleClass: string;
}

/**
 * Centrally managed status configuration.
 * Strictly typed with AttendanceStatus to ensure compile-time exhaustiveness checks.
 */
const STATUS_CONFIGS: Record<AttendanceStatus, StatusConfiguration> = {
  PRESENT: {
    label: "Present",
    icon: CheckCircle2,
    styleClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30",
  },
  ABSENT: {
    label: "Absent",
    icon: XCircle,
    styleClass: "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20 dark:text-red-400 dark:border-red-900/30",
  },
  LATE: {
    label: "Late",
    icon: Clock,
    styleClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30",
  },
  HALF_DAY: {
    label: "Half Day",
    icon: Timer,
    styleClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/30",
  },
  ON_LEAVE: {
    label: "On Leave",
    icon: Umbrella,
    styleClass: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-800/30",
  },
};

/**
 * Fallback style structure for unidentified or unhandled attendance states.
 */
const FALLBACK_CONFIG: StatusConfiguration = {
  label: "Unknown",
  icon: HelpCircle,
  styleClass: "bg-muted text-muted-foreground border-muted-foreground/20",
};

/**
 * Reusable, accessibly styled Attendance Status Badge.
 * Conforms to system-wide dark mode configurations and does not rely on color alone.
 */
export function AttendanceStatusBadge({ status, className }: AttendanceStatusBadgeProps) {
  // Using fallback config if runtime status falls outside typings
  const config = STATUS_CONFIGS[status] || FALLBACK_CONFIG;
  const StatusIcon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md transition-colors border shadow-none",
        config.styleClass,
        className
      )}
    >
      <StatusIcon 
        className="h-3.5 w-3.5 shrink-0" 
        aria-hidden="true" 
      />
      <span>{config.label}</span>
    </Badge>
  );
}
