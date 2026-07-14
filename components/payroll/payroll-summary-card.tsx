import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface PayrollSummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  trendLabel?: string;
  footer?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function PayrollSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
  footer,
  loading = false,
  className,
}: PayrollSummaryCardProps) {
  if (loading) {
    return (
      <Card className={cn("overflow-hidden shadow-sm border", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-3.5 w-48" />
          {footer && (
            <div className="pt-4 border-t mt-4">
              <Skeleton className="h-4 w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden shadow-sm border transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground select-none">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-foreground select-all">
          {value}
        </div>
        
        {/* Trend and Trend Label section */}
        {trend && (
          <div className="flex items-center gap-1.5 mt-1 text-xs select-none">
            <span
              className={cn(
                "inline-flex items-center font-medium gap-0.5",
                trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              )}
              {trend.value}
            </span>
            
            {trendLabel && (
              <span className="text-muted-foreground font-normal">
                {trendLabel}
              </span>
            )}
          </div>
        )}

        {/* Description section - displayed directly below trend row, or directly below value if no trend */}
        {description && (
          <div
            className={cn(
              "text-xs text-muted-foreground font-normal leading-normal select-none",
              trend ? "mt-1.5" : "mt-1"
            )}
          >
            {description}
          </div>
        )}

        {footer && (
          <div className="pt-3 mt-4 border-t border-muted/60 text-xs text-muted-foreground leading-normal">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
