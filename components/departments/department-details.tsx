"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DepartmentOverview } from "./department-overview";
import { DepartmentStatusBadge } from "./department-status-badge";
import type { ResolvedDepartment } from "@/types/department";

interface DepartmentDetailsProps {
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

export function DepartmentDetails({ department, className }: DepartmentDetailsProps) {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-8", className)}
    >
      {/* Section 1: Department Header */}
      <Card className="overflow-hidden rounded-xl border border-muted/60 bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
                  <Building2 className="h-4.5 w-4.5" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground select-all">
                  {department.name}
                </h1>
                <span className="text-xs font-semibold text-muted-foreground select-all bg-muted px-2.5 py-0.5 rounded-lg border border-muted-foreground/10" aria-label="Department Code">
                  {department.code}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {department.description}
              </p>
            </div>
            <div className="shrink-0 pt-1">
              <DepartmentStatusBadge status={department.status} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="border-muted/40" />

      {/* Section 2 to 5: Composed Department Overview Panel */}
      <div className="space-y-6">
        <DepartmentOverview department={department} />
      </div>
    </motion.div>
  );
}