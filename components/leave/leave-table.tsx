"use client";

import { ChevronLeft, ChevronRight, FileX } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import LeaveStatusBadge from "./leave-status-badge";
import { LeaveRequest } from "@/types/leave";
import { LEAVE_TYPE_LABELS } from "@/constants/leave";

interface LeaveTableProps {
  records: LeaveRequest[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const safeFormatDate = (dateStr: string): string => {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

export default function LeaveTable({
  records,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false
}: LeaveTableProps) {
  
  const startRecordIndex = (currentPage - 1) * itemsPerPage + 1;
  const endRecordIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <Table className="min-w-max w-full">
            <TableHeader className="bg-muted/40 sticky top-0 border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px] text-xs font-semibold text-muted-foreground">Employee</TableHead>
                <TableHead className="w-[140px] text-xs font-semibold text-muted-foreground">Department</TableHead>
                <TableHead className="w-[130px] text-xs font-semibold text-muted-foreground">Leave Type</TableHead>
                <TableHead className="w-[110px] text-xs font-semibold text-muted-foreground text-center">Start Date</TableHead>
                <TableHead className="w-[110px] text-xs font-semibold text-muted-foreground text-center">End Date</TableHead>
                <TableHead className="w-[90px] text-xs font-semibold text-muted-foreground text-center">Days</TableHead>
                <TableHead className="w-[110px] text-xs font-semibold text-muted-foreground text-center">Applied On</TableHead>
                <TableHead className="w-[200px] text-xs font-semibold text-muted-foreground">Reason</TableHead>
                <TableHead className="w-[110px] text-xs font-semibold text-muted-foreground text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx} className="animate-pulse bg-transparent">
                    {Array.from({ length: 9 }).map((_, cIdx) => (
                      <TableCell key={cIdx} className="py-4">
                        <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                      <FileX
  aria-hidden="true"
  className="h-8 w-8 stroke-[1.5] text-muted-foreground/60"
 />
                      <p className="text-sm font-semibold">No leave applications found</p>
                      <p className="text-xs text-muted-foreground/80">Try changing the search query or clearing the active filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record, index) => (
                  <TableRow 
                    key={record.id} 
                    className={`transition-colors hover:bg-muted/30 ${
                      index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                    }`}
                  >
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
                    <TableCell className="text-xs text-foreground font-semibold">
                      {LEAVE_TYPE_LABELS[record.leaveType]}
                    </TableCell>
                    <TableCell className="text-xs text-center tabular-nums font-medium text-foreground">
                      {safeFormatDate(record.startDate)}
                    </TableCell>
                    <TableCell className="text-xs text-center tabular-nums font-medium text-foreground">
                      {safeFormatDate(record.endDate)}
                    </TableCell>
                    <TableCell className="text-xs text-center tabular-nums font-bold text-foreground">
                      {record.totalDays}
                    </TableCell>
                    <TableCell className="text-xs text-center tabular-nums font-medium text-muted-foreground">
                      {safeFormatDate(record.appliedOn)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                      {record.reason}
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <div className="flex justify-end">
                        <LeaveStatusBadge status={record.status} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination View */}
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
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              aria-label="Go to previous page"
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages || isLoading}
              aria-label="Go to next page"
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
