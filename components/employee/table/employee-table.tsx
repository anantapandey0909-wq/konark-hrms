"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Briefcase,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Employee } from "@/types/employee";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;

export interface EmployeeTableProps {
  employees: Employee[];
  isLoading?: boolean;
  className?: string;
  /** Controlled selection of employee UUIDs */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function EmployeeTable({
  employees = [],
  isLoading = false,
  className,
  selectedIds,
  onSelectionChange,
}: EmployeeTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [internalSelected, setInternalSelected] = useState<Set<string>>(
    new Set()
  );

  const isControlled = selectedIds !== undefined;
  const selectedSet = useMemo(
    () => new Set(isControlled ? selectedIds : Array.from(internalSelected)),
    [isControlled, selectedIds, internalSelected]
  );

  const emitSelection = useCallback(
    (next: Set<string>) => {
      if (!isControlled) setInternalSelected(next);
      onSelectionChange?.(Array.from(next));
    },
    [isControlled, onSelectionChange]
  );

  const totalItems = employees.length;
  const totalPages = useMemo(
    () => Math.ceil(totalItems / ITEMS_PER_PAGE) || 1,
    [totalItems]
  );

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return employees.slice(start, start + ITEMS_PER_PAGE);
  }, [employees, currentPage]);

  const startRecordIndex = useMemo(
    () => (currentPage - 1) * ITEMS_PER_PAGE + 1,
    [currentPage]
  );
  const endRecordIndex = useMemo(
    () => Math.min(currentPage * ITEMS_PER_PAGE, totalItems),
    [currentPage, totalItems]
  );

  const pageIds = paginatedRecords.map((e) => e.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedSet.has(id));
  const somePageSelected =
    pageIds.some((id) => selectedSet.has(id)) && !allPageSelected;

  const toggleAllPage = () => {
    const next = new Set(selectedSet);
    if (allPageSelected) {
      pageIds.forEach((id) => next.delete(id));
    } else {
      pageIds.forEach((id) => next.add(id));
    }
    emitSelection(next);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    emitSelection(next);
  };

  return (
    <Card
      className={cn(
        "border border-border bg-card text-card-foreground shadow-sm overflow-hidden w-full",
        className
      )}
    >
      <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              Employee Directory
            </CardTitle>
            <CardDescription className="text-xs">
              Manage, filter, and audit all active client workspace workforce
              parameters
            </CardDescription>
          </div>
          {selectedSet.size > 0 && (
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              {selectedSet.size} selected for bulk operations
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-max w-full">
              <TableHeader className="bg-muted/40 sticky top-0 border-b border-border z-10">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[44px] text-xs">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-border"
                      checked={allPageSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = somePageSelected;
                      }}
                      onChange={toggleAllPage}
                      disabled={isLoading || pageIds.length === 0}
                      aria-label="Select all employees on this page"
                    />
                  </TableHead>
                  <TableHead className="w-[220px] text-xs font-semibold text-muted-foreground">
                    Employee
                  </TableHead>
                  <TableHead className="w-[140px] text-xs font-semibold text-muted-foreground">
                    Department
                  </TableHead>
                  <TableHead className="w-[180px] text-xs font-semibold text-muted-foreground font-medium">
                    Designation
                  </TableHead>
                  <TableHead className="w-[130px] text-xs font-semibold text-muted-foreground text-center">
                    Employment Type
                  </TableHead>
                  <TableHead className="w-[120px] text-xs font-semibold text-muted-foreground text-center">
                    Location
                  </TableHead>
                  <TableHead className="w-[120px] text-xs font-semibold text-muted-foreground text-center">
                    Joining Date
                  </TableHead>
                  <TableHead className="w-[100px] text-xs font-semibold text-muted-foreground text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <TableRow key={idx} className="animate-pulse bg-transparent">
                      {Array.from({ length: 8 }).map((_, cIdx) => (
                        <TableCell key={cIdx} className="py-4">
                          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginatedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                        <Briefcase className="h-8 w-8 stroke-[1.5] text-muted-foreground/60" />
                        <p className="text-sm font-semibold">
                          No employees registered yet
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map((emp, index) => {
                    const fullName = `${emp.firstName} ${emp.lastName}`;
                    const initials =
                      `${emp.firstName.charAt(0)}${emp.lastName.charAt(0)}`.toUpperCase();
                    const departmentLabel =
                      emp.departmentId?.replace("dept-", "").replace("-", " ") ||
                      "General";
                    const isSelected = selectedSet.has(emp.id);

                    return (
                      <TableRow
                        key={emp.id}
                        className={cn(
                          "hover:bg-muted/40 transition-all",
                          index % 2 === 0 ? "bg-transparent" : "bg-muted/10",
                          isSelected && "bg-indigo-50/40 dark:bg-indigo-950/20"
                        )}
                      >
                        <TableCell className="py-3">
                          <input
                            type="checkbox"
                            className="h-3.5 w-3.5 rounded border-border"
                            checked={isSelected}
                            onChange={() => toggleRow(emp.id)}
                            aria-label={`Select ${fullName}`}
                          />
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-border/80 shrink-0">
                              {emp.avatarUrl ? (
                                <AvatarImage
                                  src={emp.avatarUrl}
                                  alt={fullName}
                                />
                              ) : null}
                              <AvatarFallback className="text-[10px] font-bold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col space-y-0.5 overflow-hidden">
                              <span className="text-xs font-semibold text-foreground leading-none truncate">
                                {fullName}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {emp.employeeId}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-medium capitalize">
                          {departmentLabel}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-foreground">
                          {emp.designation}
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          <Badge
                            variant="outline"
                            className="rounded-xl px-2 py-0.5 text-[10px] uppercase font-semibold"
                          >
                            {emp.employmentType.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-center text-muted-foreground font-medium">
                          {emp.workLocation ? (
                            <div className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/80" />
                              <span>{emp.workLocation}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/50">--</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-center tabular-nums text-muted-foreground font-medium">
                          {formatDate(emp.joiningDate)}
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <div className="flex justify-end">
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-xl px-2.5 py-0.5 text-[10px] font-bold tracking-tight uppercase",
                                emp.status === "ACTIVE" &&
                                  "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                                emp.status === "ON_LEAVE" &&
                                  "bg-amber-500/10 text-amber-600 border-amber-500/20",
                                emp.status === "INACTIVE" &&
                                  "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
                                emp.status === "TERMINATED" &&
                                  "bg-red-500/10 text-red-600 border-red-500/20"
                              )}
                            >
                              {emp.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
            <span className="text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {startRecordIndex}
              </span>
              –
              <span className="font-semibold text-foreground">
                {endRecordIndex}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">{totalItems}</span>{" "}
              employees
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                aria-label="Go to previous page"
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || isLoading}
                aria-label="Go to next page"
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
