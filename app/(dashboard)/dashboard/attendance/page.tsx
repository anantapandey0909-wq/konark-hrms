"use client";

// ============================================================================
// Imports
// ============================================================================

import * as React from "react";
import { mockAttendanceWithEmployees } from "@/mock/attendance";
import { mockEmployees } from "@/mock/employee";
import { AttendanceWithEmployee } from "@/types/attendance";
import { calculateAttendanceMetrics } from "@/lib/reports/attendance-metrics";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { AttendanceFilters, AttendanceFilterState } from "@/components/attendance/attendance-filters";
import { AttendanceForm, AttendanceFormValues } from "@/components/attendance/attendance-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Users, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

// ============================================================================
// Helpers
// ============================================================================

/**
 * Creates a normalized attendance transaction payload paired with its corresponding employee metadata.
 * Enforces strong isolation and preserves strict relational boundaries.
 */
function createAttendanceRecord(
  values: AttendanceFormValues,
  timestamp: string
): AttendanceWithEmployee {
  const selectedEmployee = mockEmployees.find((e) => e.id === values.employeeId);
  const newRecordId = `att-${Date.now()}`;

  return {
    id: newRecordId,
    attendance: {
      id: newRecordId,
      tenantId: selectedEmployee?.tenantId ?? "tenant-konark-tech",
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
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    employee: {
      firstName: selectedEmployee?.firstName ?? "Unknown",
      lastName: selectedEmployee?.lastName ?? "User",
      email: selectedEmployee?.email ?? "no-email@domain.com",
      avatarUrl: selectedEmployee?.avatarUrl ?? null,
      designation: selectedEmployee?.designation ?? "Employee",
      departmentId: selectedEmployee?.departmentId ?? null,
    },
  };
}

/**
 * Merges updated form values into an existing attendance transaction record.
 */
function updateAttendanceRecord(
  existingRecord: AttendanceWithEmployee,
  values: AttendanceFormValues,
  timestamp: string
): AttendanceWithEmployee {
  return {
    ...existingRecord,
    attendance: {
      ...existingRecord.attendance,
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
      updatedAt: timestamp,
    },
  };
}

// ============================================================================
// Component
// ============================================================================

export default function AttendancePage() {
  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------

  const [data, setData] = React.useState<AttendanceWithEmployee[]>(mockAttendanceWithEmployees);
  const [filters, setFilters] = React.useState<AttendanceFilterState>({
    search: "",
    status: "ALL",
    workMode: "ALL",
  });

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingRecord, setEditingRecord] = React.useState<AttendanceWithEmployee | null>(null);

  // --------------------------------------------------------------------------
  // Memoized Values
  // --------------------------------------------------------------------------

  // Compute analytics metrics from current dataset
  const metrics = React.useMemo(() => {
    const rawAttendances = data.map((d) => d.attendance);
    return calculateAttendanceMetrics(rawAttendances);
  }, [data]);

  // Robust, dynamic filtering keeping time complexity at O(n)
  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      const searchTarget = `${row.employee.firstName} ${row.employee.lastName}`.toLowerCase();
      const searchQuery = filters.search.toLowerCase();

      const searchMatch = filters.search === "" || searchTarget.includes(searchQuery);
      const statusMatch = filters.status === "ALL" || row.attendance.status === filters.status;
      const workModeMatch = filters.workMode === "ALL" || row.attendance.workMode === filters.workMode;

      return searchMatch && statusMatch && workModeMatch;
    });
  }, [data, filters]);

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

  const handleEditClick = React.useCallback((record: AttendanceWithEmployee) => {
    setEditingRecord(record);
    setIsDialogOpen(true);
  }, []);

  const handleCreateClick = React.useCallback(() => {
    setEditingRecord(null);
    setIsDialogOpen(true);
  }, []);

  const handleFormSubmit = React.useCallback(
    (values: AttendanceFormValues) => {
      const timestamp = new Date().toISOString();

      if (editingRecord) {
        // Enforce update mutations
        setData((prev) =>
          prev.map((row) =>
            row.id === editingRecord.id
              ? updateAttendanceRecord(row, values, timestamp)
              : row
          )
        );
      } else {
        // Enforce transaction creations
        const newRow = createAttendanceRecord(values, timestamp);
        setData((prev) => [newRow, ...prev]);
      }
      setIsDialogOpen(false);
    },
    [editingRecord]
  );

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      
      {/* Title Bar & Actions */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance Logs</h2>
          <p className="text-muted-foreground text-sm">
            Monitor modern enterprise time tracking records, shift names, and regularizations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateClick} size="sm">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Add Record
          </Button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">Active Staff Records</span>
            <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold">{metrics.totalRecords}</div>
          <p className="text-xs text-muted-foreground">Total trackings processed</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">Avg Shift Hours</span>
            <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold">{metrics.averageWorkingHours} hrs</div>
          <p className="text-xs text-muted-foreground">Across present logs</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">Overtime Scheduled</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {metrics.totalOvertimeHours} hrs
          </div>
          <p className="text-xs text-muted-foreground">Approved overtime volume</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">Regularizations</span>
            <ShieldCheck className="h-4 w-4 text-amber-500" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {metrics.regularizationCount}
          </div>
          <p className="text-xs text-muted-foreground">Manually certified entries</p>
        </div>
      </div>

      {/* Dynamic Data Grid */}
      <div className="space-y-4">
        <AttendanceFilters filters={filters} onFiltersChange={setFilters} />
        <AttendanceTable data={filteredData} onEdit={handleEditClick} />
      </div>

      {/* Transaction Control Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingRecord ? "Edit Attendance Record" : "Create New Attendance Log"}
            </DialogTitle>
            <DialogDescription>
              Align check times, status corrections, and operational regularization parameters.
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