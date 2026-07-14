import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus, type LucideIcon } from "lucide-react";

interface AttendanceStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconClassName?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  className?: string;
}

const TREND_CONFIG = {
  up: {
    icon: ArrowUpRight,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    srLabel: "Increase of ",
  },
  down: {
    icon: ArrowDownRight,
    colorClass: "text-rose-600 dark:text-rose-400",
    srLabel: "Decrease of ",
  },
  neutral: {
    icon: Minus,
    colorClass: "text-muted-foreground",
    srLabel: "Stable at ",
  },
};

/**
 * Reusable KPI Statistics Card.
 * Supports entrance animations, semantic color indicators, and highly accessible structures.
 */
export function AttendanceStatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
  trend,
  className,
}: AttendanceStatsCardProps) {
  const TrendIcon = trend ? TREND_CONFIG[trend.direction].icon : null;
  const trendColor = trend ? TREND_CONFIG[trend.direction].colorClass : "";
  const trendSrLabel = trend ? TREND_CONFIG[trend.direction].srLabel : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <Card className={cn("overflow-hidden hover:shadow-md transition-shadow duration-200 border shadow-none", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="p-2 rounded-lg bg-muted/50">
            <Icon 
              className={cn("h-4 w-4 text-muted-foreground shrink-0", iconClassName)} 
              aria-hidden="true" 
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">
            {value}
          </div>
          
          {(trend || description) && (
            <div className="flex flex-wrap items-center gap-x-1.5 mt-1.5 text-xs text-muted-foreground">
              {trend && TrendIcon && (
                <div className="flex items-center gap-0.5">
                  <TrendIcon 
                    className={cn("h-3.5 w-3.5 shrink-0", trendColor)} 
                    aria-hidden="true" 
                  />
                  <span className={cn("font-semibold", trendColor)}>
                    <span className="sr-only">{trendSrLabel}</span>
                    {trend.value}%
                  </span>
                </div>
              )}
              
              {description && (
                <span className="text-muted-foreground">
                  {trend && trend.label ? `${trend.label} ` : ""}
                  {description}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
