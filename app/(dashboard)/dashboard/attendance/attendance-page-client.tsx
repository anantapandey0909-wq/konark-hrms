"use client";

import * as React from "react";
import { toast } from "sonner";
import type { AttendanceWithEmployee } from "@/types/attendance";
import type { AttendanceMetrics } from "@/lib/reports/attendance-metrics";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import {
  AttendanceFilters,
  type AttendanceFilterState,
} from "@/components/attendance/attendance-filters";
import {
  AttendanceForm,
  type AttendanceFormValues,
} from "@/components/attendance/attendance-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchAttendanceList,
  fetchAttendanceMetrics,
  saveAttendance,
  patchAttendance,
} from "@/lib/data/attendance";

const DEFAULT_PAGE_SIZE = 10;

interface AttendancePageClientProps {
  readonly initialData: AttendanceWithEmployee[];
  readonly initialTotal: number;
  readonly initialPage: number;
  readonly initialPageSize: number;
  readonly initialMetrics: AttendanceMetrics;
}

export function AttendancePageClient({
  initialData,
  initialTotal,
  initialPage,
  initialPageSize,
  initialMetrics,
}: AttendancePageClientProps) {
  const [data, setData] =
    React.useState<AttendanceWithEmployee[]>(initialData);
  const [totalItems, setTotalItems] = React.useState(initialTotal);
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [pageSize] = React.useState(initialPageSize || DEFAULT_PAGE_SIZE);
  const [metrics, setMetrics] =
    React.useState<AttendanceMetrics>(initialMetrics);
  const [isLoading, setIsLoading] = React.useState(false);
  const [filters, setFilters] = React.useState<AttendanceFilterState>({
    search: "",
    status: "ALL",
    workMode: "ALL",
  });

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingRecord, setEditingRecord] =
    React.useState<AttendanceWithEmployee | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  /** Server list load: status + workMode applied before pagination. Search stays client-side. */
  const loadList = React.useCallback(
    async (page: number, status: string, workMode: string) => {
      setIsLoading(true);
      try {
        const result = await fetchAttendanceList({
          page,
          pageSize,
          status: status === "ALL" ? undefined : status,
          workMode: workMode === "ALL" ? undefined : workMode,
        });
        setData(result.items);
        setTotalItems(result.total);
        setCurrentPage(result.page);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load attendance."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize]
  );

  /** Reload list page + KPIs after save — KPIs stay independent of list filters. */
  const reload = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [listResult, nextMetrics] = await Promise.all([
        fetchAttendanceList({
          page: currentPage,
          pageSize,
          status: filters.status === "ALL" ? undefined : filters.status,
          workMode: filters.workMode === "ALL" ? undefined : filters.workMode,
        }),
        fetchAttendanceMetrics(),
      ]);
      setData(listResult.items);
      setTotalItems(listResult.total);
      setCurrentPage(listResult.page);
      setMetrics(nextMetrics);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load attendance."
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, filters.status, filters.workMode]);

  /**
   * Search remains client-side on the current server page (Part 3B).
   * Status / workMode are applied server-side — do not re-filter them here.
   */
  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      const searchTarget =
        `${row.employee.firstName} ${row.employee.lastName}`.toLowerCase();
      const searchQuery = filters.search.toLowerCase();
      return filters.search === "" || searchTarget.includes(searchQuery);
    });
  }, [data, filters.search]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startRecordIndex =
    totalItems === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const endRecordIndex = Math.min(activePage * pageSize, totalItems);

  const handleFiltersChange = (next: AttendanceFilterState) => {
    const statusChanged = next.status !== filters.status;
    const workModeChanged = next.workMode !== filters.workMode;
    setFilters(next);

    if (statusChanged || workModeChanged) {
      setCurrentPage(1);
      void loadList(1, next.status, next.workMode);
    }
  };

  const handlePageChange = (page: number) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    void loadList(next, filters.status, filters.workMode);
  };

  const handleEditClick = React.useCallback((record: AttendanceWithEmployee) => {
    setEditingRecord(record);
    setIsDialogOpen(true);
  }, []);

  const handleCreateClick = React.useCallback(() => {
    setEditingRecord(null);
    setIsDialogOpen(true);
  }, []);

  const handleFormSubmit = React.useCallback(
    async (values: AttendanceFormValues) => {
      setIsSubmitting(true);
      try {
        if (editingRecord) {
          await patchAttendance(editingRecord.id, {
            employeeId: values.employeeId,
            attendanceDate: values.attendanceDate,
            checkIn: values.checkIn || null,
            checkOut: values.checkOut || null,
            totalHours: values.totalHours || null,
            overtimeHours: values.overtimeHours || null,
            breakDuration: values.breakDuration || null,
            status: values.status,
            workMode: values.workMode,
            remarks: values.remarks || null,
            location: values.location || null,
            shiftName: values.shiftName || null,
            isRegularized: values.isRegularized,
          });
          toast.success("Attendance updated.");
        } else {
          await saveAttendance({
            employeeId: values.employeeId,
            attendanceDate: values.attendanceDate,
            checkIn: values.checkIn || null,
            checkOut: values.checkOut || null,
            totalHours: values.totalHours || null,
            overtimeHours: values.overtimeHours || null,
            breakDuration: values.breakDuration || null,
            status: values.status,
            workMode: values.workMode,
            remarks: values.remarks || null,
            location: values.location || null,
            shiftName: values.shiftName || null,
            isRegularized: values.isRegularized,
          });
          toast.success("Attendance created.");
        }
        setIsDialogOpen(false);
        await reload();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save attendance."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingRecord, reload]
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance Logs</h2>
          <p className="text-muted-foreground text-sm">
            Monitor modern enterprise time tracking records, shift names, and
            regularizations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateClick} size="sm" disabled={isSubmitting}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Add Record
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Active Staff Records
            </span>
            <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold">{metrics.totalRecords}</div>
          <p className="text-xs text-muted-foreground">Total trackings processed</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Avg Shift Hours
            </span>
            <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold">{metrics.averageWorkingHours} hrs</div>
          <p className="text-xs text-muted-foreground">Across present logs</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Overtime Scheduled
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {metrics.totalOvertimeHours} hrs
          </div>
          <p className="text-xs text-muted-foreground">Approved overtime volume</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Regularizations
            </span>
            <ShieldCheck className="h-4 w-4 text-amber-500" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {metrics.regularizationCount}
          </div>
          <p className="text-xs text-muted-foreground">Manually certified entries</p>
        </div>
      </div>

      <div className="space-y-4">
        <AttendanceFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading attendance…</p>
        ) : (
          <>
            <AttendanceTable data={filteredData} onEdit={handleEditClick} />
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
                  <span className="font-semibold text-foreground">
                    {totalItems}
                  </span>{" "}
                  records
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(activePage - 1)}
                    disabled={activePage <= 1 || isLoading}
                    aria-label="Go to previous page"
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-muted-foreground tabular-nums px-1">
                    Page {activePage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(activePage + 1)}
                    disabled={activePage >= totalPages || isLoading}
                    aria-label="Go to next page"
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingRecord
                ? "Edit Attendance Record"
                : "Create New Attendance Log"}
            </DialogTitle>
            <DialogDescription>
              Align check times, status corrections, and operational
              regularization parameters.
            </DialogDescription>
          </DialogHeader>
          <AttendanceForm
            record={editingRecord}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
