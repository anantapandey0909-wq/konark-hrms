import type { LucideIcon } from "lucide-react";

export interface ReportTrend {
  value: number;
  isPositive: boolean;
}

export interface ReportSummary {
  id: string;
  title: string;
  value: string | number;
  description: string;
  trend?: ReportTrend;
  icon?: LucideIcon;
}