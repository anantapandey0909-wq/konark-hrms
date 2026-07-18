import * as React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Users, CalendarCheck, FileClock, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DepartmentStatistics } from "@/types/department";

interface DepartmentStatsProps {
  statistics: DepartmentStatistics;
  className?: string;
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

export function DepartmentStats({ statistics, className }: DepartmentStatsProps) {
  const statItems = [
    {
      id: "employeeCount",
      label: "Employee Count",
      value: statistics.employeeCount.toLocaleString("en-IN"),
      icon: Users,
      iconStyle: "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
      id: "attendanceRate",
      label: "Attendance Rate",
      value: `${statistics.attendanceRate}%`,
      icon: CalendarCheck,
      iconStyle: "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    {
      id: "pendingLeaves",
      label: "Pending Leaves",
      value: statistics.pendingLeaves.toLocaleString("en-IN"),
      icon: FileClock,
      iconStyle: "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20",
    },
    {
      id: "monthlyPayroll",
      label: "Monthly Payroll",
      value: inrFormatter.format(statistics.monthlyPayroll),
      icon: IndianRupee,
      iconStyle: "text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <motion.div key={item.id} variants={itemVariants}>
            <Card className="overflow-hidden rounded-xl border border-muted/60 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-muted-foreground/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground tracking-tight select-none">
                    {item.label}
                  </span>
                  <div className={cn("flex h-8.5 w-8.5 items-center justify-center rounded-lg", item.iconStyle)} aria-hidden="true">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-foreground tracking-tight select-all">
                    {item.value}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}