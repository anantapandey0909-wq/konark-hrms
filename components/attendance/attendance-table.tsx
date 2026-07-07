"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { 
  Search, 
  RefreshCcw, 
  Download, 
  Calendar as CalendarIcon, 
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { mockAttendanceRecords } from "@/mock/attendance";
import { AttendanceStatus } from "@/types/attendance";

const ITEMS_PER_PAGE = 5;

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

export default function AttendanceTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [deptFilter, setDeptFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamic department mapping based on the available records, sorted alphabetically
  const departments = useMemo(() => {
    const list = mockAttendanceRecords.map((record) => record.department);
    const uniqueList = Array.from(new Set(list));
    return uniqueList.sort((a, b) => a.localeCompare(b));
  }, []);

  // Simulates system refreshes with visual loading indicators and clears timeouts correctly
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    refreshTimerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 450);
  }, []);

  // Clears active timers on unmount to prevent leaks
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // Frontend placeholder export behavior
  const handleExportCSV = useCallback(() => {
    console.log("Export CSV");
  }, []);

  // Handler helpers to cleanly coordinate state updates alongside page resets
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDeptFilterChange = (value: string) => {
    setDeptFilter(value);
    setCurrentPage(1);
  };

  // Memoized query normalization to optimize search filtering inside every iteration
  const normalizedQuery = useMemo(() => {
    return searchQuery.trim().toLowerCase();
  }, [searchQuery]);

  // Combined client-side search and option filtration engine
  const filteredRecords = useMemo(() => {
    return mockAttendanceRecords.filter((record) => {
      const matchesSearch = 
        record.employeeName.toLowerCase().includes(normalizedQuery) ||
        record.employeeCode.toLowerCase().includes(normalizedQuery);
      
      const matchesStatus = statusFilter === "ALL" || record.status === statusFilter;
      const matchesDept = deptFilter === "ALL" || record.department === deptFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [normalizedQuery, statusFilter, deptFilter]);

  // Pagination bounds calculation
  const totalItems = filteredRecords.length;
  const totalPages = useMemo(() => Math.ceil(totalItems / ITEMS_PER_PAGE) || 1, [totalItems]);
  
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const startRecordIndex = useMemo(() => (currentPage - 1) * ITEMS_PER_PAGE + 1, [currentPage]);
  const endRecordIndex = useMemo(() => Math.min(currentPage * ITEMS_PER_PAGE, totalItems), [currentPage, totalItems]);

  // Maps attendance types to dedicated semantic theme badge elements
  const getStatusBadge = useCallback((status: AttendanceStatus) => {
    const baseClasses = "font-semibold text-xs py-0.5 px-2.5 border rounded-full transition-all shrink-0 w-fit";
    switch (status) {
      case "PRESENT":
        return (
          <Badge variant="outline" className={`${baseClasses} bg-emerald-600 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30`}>
            Present
          </Badge>
        );
      case "LATE":
        return (
          <Badge variant="outline" className={`${baseClasses} bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30`}>
            Late
          </Badge>
        );
      case "ABSENT":
        return (
          <Badge variant="outline" className={`${baseClasses} bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30`}>
            Absent
          </Badge>
        );
      case "HALF_DAY":
        return (
          <Badge variant="outline" className={`${baseClasses} bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border-orange-200/50 dark:border-orange-900/30`}>
            Half Day
          </Badge>
        );
      case "ON_LEAVE":
        return (
          <Badge variant="outline" className={`${baseClasses} bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30`}>
            On Leave
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className={baseClasses}>
            {status}
          </Badge>
        );
    }
  }, []);

  return (
    <Card className="border border-border bg-card text-card-foreground shadow-sm overflow-hidden w-full">
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
              <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
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
        {/* Dynamic Filters Toolbar Layout */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-muted/20 p-3 rounded-lg border border-border/40">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:max-w-3xl">
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search name or ID..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search employees by name or code"
                className="pl-8 h-8.5 text-xs bg-background"
              />
            </div>
            
            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full">
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger aria-label="Filter by attendance status" className="h-8.5 text-xs bg-background w-full sm:w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PRESENT">Present</SelectItem>
                  <SelectItem value="LATE">Late</SelectItem>
                  <SelectItem value="HALF_DAY">Half Day</SelectItem>
                  <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                  <SelectItem value="ABSENT">Absent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={deptFilter} onValueChange={handleDeptFilterChange}>
                <SelectTrigger aria-label="Filter by department" className="h-8.5 text-xs bg-background w-full sm:w-44">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            aria-label="Select date range filter"
            className="h-8.5 text-xs border-dashed gap-1.5 justify-center"
          >
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Select Date Filter</span>
          </Button>
        </div>

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
                      className={`hover:bg-muted/30 transition-all ${
                        index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                      }`}
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
                          {getStatusBadge(record.status)}
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