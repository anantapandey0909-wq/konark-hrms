"use client";

import React from "react";
import { Users, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AttendanceStats as AttendanceStatsType } from "@/types/attendance";
import { cn } from "@/lib/utils";

interface AttendanceStatsProps {
  stats: AttendanceStatsType;
  isLoading?: boolean;
  className?: string;
}

export function AttendanceStats({
  stats,
  isLoading = false,
  className,
}: AttendanceStatsProps) {
  const {
    totalEmployees = 0,
    presentCount = 0,
    absentCount = 0,
    lateCount = 0,
    onLeaveCount = 0,
    halfDayCount = 0,
    averageWorkingHours = 0,
    totalOvertimeHours = 0,
    attendanceRate = 0,
  } = stats || {};

  const metricCards = [
    {
      title: "Attendance Rate",
      value: `${attendanceRate.toFixed(1)}%`,
      description: `${presentCount} active today out of ${totalEmployees}`,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Average Working Hours",
      value: `${averageWorkingHours.toFixed(1)}h`,
      description: "Weighted average log per shifts",
      icon: Clock,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Late Arrivals",
      value: lateCount.toString(),
      description: `${absentCount} absent, ${onLeaveCount} on active leave`,
      icon: AlertTriangle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Total Overtime",
      value: `+${totalOvertimeHours.toFixed(1)}h`,
      description: `Includes ${halfDayCount} half-day logging adjustments`,
      icon: Users,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full", className)}>
      {metricCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="border border-border bg-card text-card-foreground shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                {card.title}
              </CardTitle>
              <div className={cn("p-1.5 rounded-lg shrink-0", card.bgColor)}>
                <Icon className={cn("h-4 w-4", card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-7 bg-muted rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-xl font-bold tracking-tight text-foreground tabular-nums">
                    {card.value}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    {card.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}