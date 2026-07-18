"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Calendar, User, Info, Hash, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DepartmentStats } from "./department-stats";
import { DepartmentBudget } from "./department-budget";
import { DepartmentMembers } from "./department-members";
import { DepartmentStatusBadge } from "./department-status-badge";
import { cn } from "@/lib/utils";
import type { ResolvedDepartment } from "@/types/department";

interface DepartmentOverviewProps {
  department: ResolvedDepartment;
  className?: string;
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export function DepartmentOverview({ department, className }: DepartmentOverviewProps) {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-6", className)}
    >
      {/* Top Panel - Department Info (Left) & Budget (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Department Information Card */}
        <Card className="lg:col-span-7 overflow-hidden rounded-xl border border-muted/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-muted/40 pb-4">
            <div className="flex items-center gap-2">
              <Info className="h-4.5 w-4.5 text-muted-foreground" aria-hidden="true" />
              <CardTitle className="text-base font-semibold text-foreground tracking-tight select-none">
                Department Profile
              </CardTitle>
            </div>
            <DepartmentStatusBadge status={department.status} />
          </CardHeader>
          
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {department.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {department.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 pt-4 border-t border-muted/30 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground" aria-hidden="true">
                  <Hash className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block">
                    Department Code
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {department.code}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground" aria-hidden="true">
                  <Award className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block">
                    Department Head
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {department.headEmployee?.fullName || "Unassigned"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground" aria-hidden="true">
                  <User className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block">
                    Department Manager
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {department.managerEmployee?.fullName || "Unassigned"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground" aria-hidden="true">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block">
                    Established On
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatDate(department.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: DepartmentBudget */}
        <div className="lg:col-span-5">
          <DepartmentBudget budget={department.budget} />
        </div>
      </div>

      {/* Middle Row - Statistics */}
      <div className="w-full">
        <DepartmentStats statistics={department.statistics} />
      </div>

      {/* Bottom Row - Members */}
      <div className="w-full">
        <DepartmentMembers members={department.resolvedMembers} />
      </div>
    </motion.div>
  );
}