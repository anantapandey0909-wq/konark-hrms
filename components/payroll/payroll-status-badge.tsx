import { Badge } from "@/components/ui/badge";
import { PayrollStatus } from "@/types/payroll";
import { formatPayrollStatus } from "@/lib/payroll";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Clock, 
  BadgeCheck, 
  Coins, 
  XCircle, 
  LucideIcon 
} from "lucide-react";

export interface PayrollStatusBadgeProps {
  status: PayrollStatus;
  showIcon?: boolean;
  className?: string;
}

interface BadgeConfig {
  icon: LucideIcon;
  badgeClass: string;
  iconClass: string;
}

const STATUS_CONFIGS: Record<PayrollStatus, BadgeConfig> = {
  DRAFT: {
    icon: FileText,
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800",
    iconClass: "text-slate-500 dark:text-slate-400",
  },
  PENDING: {
    icon: Clock,
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
    iconClass: "text-amber-500 dark:text-amber-400",
  },
  APPROVED: {
    icon: BadgeCheck,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-300/10 dark:text-blue-300 dark:border-blue-500/20",
    iconClass: "text-blue-500 dark:text-blue-400",
  },
  PAID: {
    icon: Coins,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
    iconClass: "text-emerald-500 dark:text-emerald-400",
  },
  CANCELLED: {
    icon: XCircle,
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
    iconClass: "text-rose-500 dark:text-rose-400",
  },
};

export function PayrollStatusBadge({
  status,
  showIcon = true,
  className,
}: PayrollStatusBadgeProps) {
  const config = STATUS_CONFIGS[status];
  const IconComponent = config.icon;

  return (
    <Badge
      variant="outline"
      aria-label={formatPayrollStatus(status)}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full transition-colors border select-none",
        config.badgeClass,
        className
      )}
    >
      {showIcon && (
        <IconComponent 
          className={cn("w-3.5 h-3.5 shrink-0", config.iconClass)} 
          aria-hidden="true" 
        />
      )}
      <span>{formatPayrollStatus(status)}</span>
    </Badge>
  );
}
