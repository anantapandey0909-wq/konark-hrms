import * as React from "react";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportSummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  className?: string;
}

export function SupportSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: SupportSummaryCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md dark:hover:border-muted-foreground/20",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground select-none">
          {title}
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground transition-colors">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </h3>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
              trend.isPositive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 shrink-0" />
            ) : (
              <TrendingDown className="h-3 w-3 shrink-0" />
            )}
            {trend.value}%
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed select-none">
          {description}
          {trend && <span className="text-muted-foreground/60"> {trend.label}</span>}
        </p>
      )}
    </div>
  );
}