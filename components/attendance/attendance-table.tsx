"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  RefreshCcw, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Clock
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AttendanceRecord } from "@/types/attendance";
import { AttendanceStatusBadge } from "./attendance-status-badge";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;

export interface AttendanceTableProps {
  records: AttendanceRecord[];
  isLoading?: boolean;
  className?: string;
}

// Safely formats timestamps for tabular displays
const formatTimeOnly = (isoString: string | null): string => {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Formats calendar dates consistently while preventing timezone shifting
const formatDateOnly = (dateString: string): string => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function AttendanceTable({
  records = [],
  isLoading = false,
  className,
}: AttendanceTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // Frontend placeholder actions
  const handleRefresh = useCallback(() => {
    // TODO: Refresh action will be linked to the parent state/query re-fetching
  }, []);

  const handleExportCSV = useCallback(() => {
    // TODO: CSV export will be implemented later when the Reporting/Backend module is available.
  }, []);

  const handleRowClick = useCallback(
    (attendanceId: string) => {
      router.push(`/attendance/${attendanceId}`);
    },
    [router]
  );

  // Pagination bounds calculation
  const totalItems = records.length;
  const totalPages = useMemo(() => Math.ceil(totalItems / ITEMS_PER_PAGE) || 1, [totalItems]);
  
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return records.slice(start, start + ITEMS_PER_PAGE);
  }, [records, currentPage]);

  const startRecordIndex = useMemo(() => (currentPage - 1) * ITEMS_PER_PAGE + 1, [currentPage]);
  const endRecordIndex = useMemo(() => Math.min(currentPage * ITEMS_PER_PAGE, totalItems), [currentPage, totalItems]);

  return (
    <Card className={cn("border border-border bg-card text-card-foreground shadow-sm overflow-hidden w-full", className)}>
      <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              Attendance Records
            </CardTitle>
            <CardDescription className="text-xs">
              Monitor, search, and audit organization timesheet parameters
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              aria-label="Refresh attendance records"
              className="h-8 text-xs font-medium gap-1.5"
            >
              <RefreshCcw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
              <span>Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isLoading}
              aria-label="Export attendance records to CSV"
              className="h-8 text-xs font-medium gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Core Table View Container */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-max w-full">
              <TableHeader className="bg-muted/40 sticky top-0 border-b border-border">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px] text-xs font-semibold text-muted-foreground">Date</TableHead>
                  <TableHead className="w-[200px] text-xs font-semibold text-muted-foreground">Employee</TableHead>
                  <TableHead className="w-[140px] text-xs font-semibold text-muted-foreground">Department</TableHead>
                  <TableHead className="w-[100px] text-xs font-semibold text-muted-foreground text-center">Clock In</TableHead>
                  <TableHead className="w-[100px] text-xs font-semibold text-muted-foreground text-center">Clock Out</TableHead>
                  <TableHead className="w-[110px] text-xs font-semibold text-muted-foreground text-center">Work Hours</TableHead>
                  <TableHead className="w-[100px] text-xs font-semibold text-muted-foreground text-center">Overtime</TableHead>
                  <TableHead className="w-[110px] text-xs font-semibold text-muted-foreground text-center">Location</TableHead>
                  <TableHead className="w-[180px] text-xs font-semibold text-muted-foreground">Notes</TableHead>
                  <TableHead className="w-[110px] text-xs font-semibold text-muted-foreground text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading State Animation
                  Array.from({ length: 3 }).map((_, idx) => (
                    <TableRow key={idx} className="animate-pulse bg-transparent">
                      {Array.from({ length: 10 }).map((_, cIdx) => (
                        <TableCell key={cIdx} className="py-4">
                          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginatedRecords.length === 0 ? (
                  // Empty State Layout
                  <TableRow>
                    <TableCell colSpan={10} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                        <Clock className="h-8 w-8 stroke-[1.5] text-muted-foreground/60" />
                        <p className="text-sm font-semibold">No attendance records found</p>
                        <p className="text-xs text-muted-foreground/80">Try changing the search query or clearing the active filters.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Records Table Rendering
                  paginatedRecords.map((record, index) => (
                    <TableRow 
                      key={record.id} 
                      onClick={() => handleRowClick(record.id)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleRowClick(record.id);
                        }
                      }}
                      className={cn(
                        "hover:bg-muted/40 transition-all cursor-pointer",
                        index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                      )}
                    >
                      <TableCell className="text-xs font-medium tabular-nums text-foreground">
                        {formatDateOnly(record.date)}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-xs font-semibold text-foreground leading-none">
                            {record.employeeName}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {record.employeeCode}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-medium">
                        {record.department}
                      </TableCell>
                      <TableCell className="text-xs text-center tabular-nums font-medium text-foreground">
                        {formatTimeOnly(record.clockInAt)}
                      </TableCell>
                      <TableCell className="text-xs text-center tabular-nums font-medium text-foreground">
                        {formatTimeOnly(record.clockOutAt)}
                      </TableCell>
                      <TableCell className="text-xs text-center tabular-nums font-semibold text-foreground">
                        {record.workHours !== null ? `${record.workHours.toFixed(1)}h` : "--"}
                      </TableCell>
                      <TableCell className="text-xs text-center tabular-nums font-medium text-emerald-600 dark:text-emerald-400">
                        {record.overtimeHours && record.overtimeHours > 0 
                          ? `+${record.overtimeHours.toFixed(1)}h` 
                          : "--"
                        }
                      </TableCell>
                      <TableCell className="text-xs text-center">
                        {record.location ? (
                          <div className="inline-flex items-center gap-1 text-muted-foreground font-medium">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{record.location}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/55">--</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                        {record.notes || "--"}
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <div className="flex justify-end">
                          <AttendanceStatusBadge status={record.status} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Table Footer Pagination Actions */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
            <span className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{startRecordIndex}</span>–<span className="font-semibold text-foreground">{endRecordIndex}</span> of{" "}
              <span className="font-semibold text-foreground">{totalItems}</span> records
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
