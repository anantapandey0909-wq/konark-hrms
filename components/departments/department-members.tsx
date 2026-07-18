"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Mail, IdCard, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DepartmentEmptyState } from "./department-empty-state";
import type { Employee } from "@/types/employee";

interface DepartmentMembersProps {
  members: Employee[];
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
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

const getEmployeeEmail = (emp: Employee): string => {
  const hasEmail = "email" in emp && typeof (emp as { email?: unknown }).email === "string";
  if (hasEmail) {
    return (emp as { email: string }).email;
  }
  const normalized = emp.fullName.toLowerCase().replace(/\s+/g, ".");
  return `${normalized}@konark.io`;
};

const renderStatusBadge = (status: string) => {
  const isStatusActive = status.toUpperCase() === "ACTIVE";
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium px-2.5 py-0.5 text-xs rounded-full transition-colors select-none",
        isStatusActive
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900/50 dark:text-zinc-400 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
      )}
    >
      {isStatusActive ? "Active" : "Inactive"}
    </Badge>
  );
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export function DepartmentMembers({ members, className }: DepartmentMembersProps) {
  if (!members || members.length === 0) {
    return (
      <DepartmentEmptyState
        title="No Department Members"
        description="There are currently no employees assigned to this department."
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <Card className={cn(
        "overflow-hidden rounded-xl border border-muted/60 bg-card shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}>
        <CardHeader className="border-b border-muted/40 pb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-muted-foreground" aria-hidden="true" />
            <CardTitle className="text-base font-semibold text-foreground tracking-tight select-none">
              Department Members ({members.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="divide-y divide-muted/40"
          >
            {members.map((emp) => {
              const initials = getInitials(emp.fullName);
              const email = getEmployeeEmail(emp);
              const avatarUrl = "avatarUrl" in emp && typeof (emp as { avatarUrl?: unknown }).avatarUrl === "string" 
                ? (emp as { avatarUrl: string }).avatarUrl 
                : undefined;

              return (
                <motion.li
                  key={emp.id}
                  variants={itemVariants}
                  className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/10 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div className="flex items-start gap-4 sm:items-center">
                    <Avatar className="h-10 w-10 border border-muted-foreground/10 select-none">
                      {avatarUrl && <AvatarImage src={avatarUrl} alt={emp.fullName} />}
                      <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold text-foreground tracking-tight">
                        {emp.fullName}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium">
                        {emp.designation}
                      </p>
                      
                      {/* Responsive Metadata Row for Mobile */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground/80 sm:hidden">
                        <span className="flex items-center gap-1">
                          <IdCard className="h-3.5 w-3.5" />
                          {emp.employeeId || emp.employeeCode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Metadata Row & Status */}
                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    <div className="hidden flex-col items-end gap-1 text-xs text-muted-foreground text-right sm:flex">
                      <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                        <IdCard className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
                        {emp.employeeId || emp.employeeCode}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
                        {email}
                      </span>
                    </div>

                    <div className="flex items-center">
                      {renderStatusBadge(emp.status)}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}