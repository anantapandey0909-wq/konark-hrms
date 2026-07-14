import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  Users,
  type LucideIcon 
} from "lucide-react";

export interface LeaveStatsData {
  total?: number;
  pending?: number;
  approved?: number;
  rejected?: number;
  cancelled?: number;
  onLeaveToday?: number;
}

export interface LeaveStatsProps extends LeaveStatsData {
  stats?: LeaveStatsData;
}

interface StatItem {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export default function LeaveStats({
  total: propTotal,
  pending: propPending,
  approved: propApproved,
  rejected: propRejected,
  cancelled: propCancelled,
  onLeaveToday: propOnLeaveToday,
  stats,
}: LeaveStatsProps) {
  const data: Required<LeaveStatsData> = {
    total: propTotal ?? stats?.total ?? 0,
    pending: propPending ?? stats?.pending ?? 0,
    approved: propApproved ?? stats?.approved ?? 0,
    rejected: propRejected ?? stats?.rejected ?? 0,
    cancelled: propCancelled ?? stats?.cancelled ?? 0,
    onLeaveToday: propOnLeaveToday ?? stats?.onLeaveToday ?? 0,
  };

  const statItems: StatItem[] = [
    {
      title: "Total Requests",
      value: data.total,
      icon: FileText,
      description: "All submitted requests",
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50 dark:bg-blue-950/40",
      borderClass: "hover:border-blue-300 dark:hover:border-blue-800/80",
    },
    {
      title: "Pending Approval",
      value: data.pending,
      icon: Clock,
      description: "Awaiting HR review",
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-50 dark:bg-amber-950/40",
      borderClass: "hover:border-amber-300 dark:hover:border-amber-800/80",
    },
    {
      title: "Approved",
      value: data.approved,
      icon: CheckCircle2,
      description: "Granted leave requests",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
      borderClass: "hover:border-emerald-300 dark:hover:border-emerald-800/80",
    },
    {
      title: "Rejected",
      value: data.rejected,
      icon: XCircle,
      description: "Declined requests",
      colorClass: "text-rose-600 dark:text-rose-400",
      bgClass: "bg-rose-50 dark:bg-rose-950/40",
      borderClass: "hover:border-rose-300 dark:hover:border-rose-800/80",
    },
    {
      title: "Cancelled",
      value: data.cancelled,
      icon: Ban,
      description: "Withdrawn by employee",
      colorClass: "text-slate-600 dark:text-slate-400",
      bgClass: "bg-slate-100 dark:bg-slate-900",
      borderClass: "hover:border-slate-300 dark:hover:border-slate-700",
    },
    {
      title: "On Leave Today",
      value: data.onLeaveToday,
      icon: Users,
      description: "Currently out of office",
      colorClass: "text-violet-600 dark:text-violet-400",
      bgClass: "bg-violet-50 dark:bg-violet-950/40",
      borderClass: "hover:border-violet-300 dark:hover:border-violet-800/80",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card 
            key={item.title}
            className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 ${item.borderClass}`}
          >
            <CardContent className="p-5 flex flex-col justify-between h-full min-h-[136px]">
              <div className="flex items-center justify-between space-x-3">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                  {item.title}
                </h3>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${item.bgClass}`}>
                  <Icon className={`h-5 w-5 ${item.colorClass}`} aria-hidden="true" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl xl:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  {item.value}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
