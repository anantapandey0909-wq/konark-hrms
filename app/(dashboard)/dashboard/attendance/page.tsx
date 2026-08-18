"use client";

import * as React from "react";
import { toast } from "sonner";
import { AttendanceWithEmployee } from "@/types/attendance";
import { calculateAttendanceMetrics } from "@/lib/reports/attendance-metrics";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import {
  AttendanceFilters,
  AttendanceFilterState,
} from "@/components/attendance/attendance-filters";
import {
  AttendanceForm,
  AttendanceFormValues,
} from "@/components/attendance/attendance-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Users, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import {
  fetchAttendanceList,
  saveAttendance,
  patchAttendance,
} from "@/lib/data/attendance";

export default function AttendancePage() {
  const [data, setData] = React.useState<AttendanceWithEmployee[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filters, setFilters] = React.useState<AttendanceFilterState>({
    search: "",
    status: "ALL",
    workMode: "ALL",
  });

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingRecord, setEditingRecord] =
    React.useState<AttendanceWithEmployee | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await fetchAttendanceList({
        status: filters.status === "ALL" ? undefined : filters.status,
        workMode: filters.workMode === "ALL" ? undefined : filters.workMode,
      });
      setData(rows);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load attendance."
      );
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.workMode]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const metrics = React.useMemo(() => {
    const rawAttendances = data.map((d) => d.attendance);
    return calculateAttendanceMetrics(rawAttendances);
  }, [data]);

  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      const searchTarget =
        `${row.employee.firstName} ${row.employee.lastName}`.toLowerCase();
      const searchQuery = filters.search.toLowerCase();

      const searchMatch =
        filters.search === "" || searchTarget.includes(searchQuery);
      const statusMatch =
        filters.status === "ALL" || row.attendance.status === filters.status;
      const workModeMatch =
        filters.workMode === "ALL" ||
        row.attendance.workMode === filters.workMode;

      return searchMatch && statusMatch && workModeMatch;
    });
  }, [data, filters]);

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
        await load();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save attendance."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingRecord, load]
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
        <AttendanceFilters filters={filters} onFiltersChange={setFilters} />
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading attendance…</p>
        ) : (
          <AttendanceTable data={filteredData} onEdit={handleEditClick} />
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
