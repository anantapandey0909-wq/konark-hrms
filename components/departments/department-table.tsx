"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DepartmentStatusBadge } from "./department-status-badge";
import { DepartmentEmptyState } from "./department-empty-state";
import type { ResolvedDepartment } from "@/types/department";

interface DepartmentTableProps {
  departments: ResolvedDepartment[];
  loading?: boolean;
  className?: string;
  onView?: (department: ResolvedDepartment) => void;
  onEdit?: (department: ResolvedDepartment) => void;
  onDelete?: (department: ResolvedDepartment) => void;
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export function DepartmentTable({
  departments,
  loading = false,
  className,
  onView,
  onEdit,
  onDelete,
}: DepartmentTableProps) {
  if (!loading && departments.length === 0) {
    return <DepartmentEmptyState className="my-8" />;
  }

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "w-full overflow-hidden rounded-xl border border-muted/60 bg-card shadow-sm",
        className
      )}
    >
      <div className="w-full overflow-x-auto">
        <Table className="w-full min-w-[1000px] table-fixed">
          <TableHeader className="bg-muted/30 select-none">
            <TableRow className="border-b border-muted/40 hover:bg-transparent">
              <TableHead className="w-[110px] font-semibold text-muted-foreground">Code</TableHead>
              <TableHead className="w-[220px] font-semibold text-muted-foreground">Department Name</TableHead>
              <TableHead className="w-[120px] font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="w-[180px] font-semibold text-muted-foreground">Head</TableHead>
              <TableHead className="w-[180px] font-semibold text-muted-foreground">Manager</TableHead>
              <TableHead className="w-[110px] text-center font-semibold text-muted-foreground">Employees</TableHead>
              <TableHead className="w-[160px] text-right font-semibold text-muted-foreground">Monthly Payroll</TableHead>
              <TableHead className="w-[80px] text-center font-semibold text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-muted/40">
            {loading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={`ske-row-${rowIndex}`} className="hover:bg-transparent border-b border-muted/30">
                  <TableCell><Skeleton className="h-4 w-12 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28 rounded" /></TableCell>
                  <TableCell className="text-center flex justify-center"><Skeleton className="h-4 w-8 rounded" /></TableCell>
                  <TableCell><div className="flex justify-end"><Skeleton className="h-4 w-24 rounded" /></div></TableCell>
                  <TableCell className="text-center flex justify-center"><Skeleton className="h-8 w-8 rounded-lg" /></TableCell>
                </TableRow>
              ))
            ) : (
              departments.map((dept) => (
                <TableRow
                  key={dept.id}
                  className="group transition-colors border-b border-muted/30 hover:bg-muted/10"
                >
                  <TableCell className="font-semibold text-foreground tracking-tight select-all">
                    {dept.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-foreground tracking-tight line-clamp-1 select-all">
                        {dept.name}
                      </span>
                      {dept.description && (
                        <span className="text-xs text-muted-foreground/80 line-clamp-1 mt-0.5 select-none">
                          {dept.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DepartmentStatusBadge status={dept.status} />
                  </TableCell>
                  <TableCell className="text-sm font-medium text-foreground/90 select-all truncate">
                    {dept.headEmployee?.fullName || "Unassigned"}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-foreground/90 select-all truncate">
                    {dept.managerEmployee?.fullName || "Unassigned"}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-sm text-foreground/85 select-none">
                    {dept.employeeCount}
                  </TableCell>
                  <TableCell className="text-right font-bold text-sm text-foreground/85 select-all">
                    {inrFormatter.format(dept.statistics.monthlyPayroll)}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg border border-transparent transition-all duration-150 text-muted-foreground hover:text-foreground hover:bg-muted hover:border-muted-foreground/10"
                          aria-label="Toggle actions menu"
                        >
                          <MoreHorizontal className="h-4.5 w-4.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[140px] rounded-xl select-none shadow-md">
                        {onView && (
                          <DropdownMenuItem
                            onClick={() => onView(dept)}
                            className="flex items-center gap-2 rounded-lg cursor-pointer py-2 focus:bg-muted"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground/70" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem
                            onClick={() => onEdit(dept)}
                            className="flex items-center gap-2 rounded-lg cursor-pointer py-2 focus:bg-muted"
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground/70" />
                            <span>Edit Profile</span>
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <>
                            <DropdownMenuSeparator className="bg-muted/50" />
                            <DropdownMenuItem
                              onClick={() => onDelete(dept)}
                              className="flex items-center gap-2 rounded-lg cursor-pointer py-2 text-destructive focus:bg-destructive/5 focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}