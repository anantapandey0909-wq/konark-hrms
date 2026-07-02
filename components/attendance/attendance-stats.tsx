"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  CalendarOff,
  Percent,
  Timer,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { mockAttendanceStats } from "@/mock/attendance";

interface StatItem {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  description: string;
}

export default function AttendanceStats() {
  const stats = React.useMemo<StatItem[]>(
    () => [
      {
        title: "Present Today",
        value: mockAttendanceStats.presentCount,
        icon: CheckCircle2,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30",
        description: "Employees checked in",
      },
      {
        title: "Late Arrivals",
        value: mockAttendanceStats.lateCount,
        icon: Clock,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30",
        description: "Arrived after shift start",
      },
      {
        title: "Absent",
        value: mockAttendanceStats.absentCount,
        icon: AlertCircle,
        color: "text-destructive dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/30",
        description: "Unexcused absences today",
      },
      {
        title: "On Leave",
        value: mockAttendanceStats.onLeaveCount,
        icon: CalendarOff,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30",
        description: "Approved time off",
      },
      {
        title: "Attendance Rate",
        value: `${mockAttendanceStats.attendanceRate}%`,
        icon: Percent,
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30",
        description: "Overall attendance",
      },
      {
        title: "Avg Work Hours",
        value: `${mockAttendanceStats.averageWorkHours}h`,
        icon: Timer,
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-50 dark:bg-violet-950/40 border-violet-100 dark:border-violet-900/30",
        description: "Daily average",
      },
      {
        title: "Overtime Hours",
        value: `${mockAttendanceStats.totalOvertimeHours}h`,
        icon: TrendingUp,
        color: "text-sky-600 dark:text-sky-400",
        bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/30",
        description: "Accumulated overtime",
      },
    ],
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
            }}
          >
            <Card className="overflow-hidden border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardContent className="flex min-h-[112px] flex-col justify-between p-4">
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </span>

                  <div
                    className={`rounded-md border p-1.5 shrink-0 ${stat.bg}`}
                  >
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="text-3xl font-bold tracking-tight">
                    {stat.value}
                  </h3>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}