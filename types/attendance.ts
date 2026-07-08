/**
 * ==================================================
 * Attendance Module Type Definitions
 * Konark HRMS
 * ==================================================
 */

/**
 * Supported attendance statuses.
 */
export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "HALF_DAY"
  | "ON_LEAVE";

/**
 * Single daily attendance record for an employee.
 */
export interface AttendanceRecord {
  /** Unique attendance record ID */
  id: string;

  /** Employee ID (references Employee module) */
  employeeId: string;

  /** Employee Code */
  employeeCode: string;

  /** Snapshot of employee name */
  employeeName: string;

  /** Snapshot of department */
  department: string;

  /** Attendance date (YYYY-MM-DD) */
  date: string;

  /** Employee clock-in timestamp (ISO 8601) */
  clockInAt: string | null;

  /** Employee clock-out timestamp (ISO 8601) */
  clockOutAt: string | null;

  /** Daily attendance status */
  status: AttendanceStatus;

  /** Total worked hours */
  workHours: number | null;

  /** Overtime hours */
  overtimeHours: number | null;

  /** Office / Remote / Client Site */
  location?: string;

  /** Assigned shift */
  shiftName?: string;

  /** Whether attendance has been manually regularized */
  isRegularized?: boolean;

  /** Optional HR remarks */
  notes?: string;
}

/**
 * Dashboard attendance statistics.
 */
export interface AttendanceStats {
  /** Employees present today */
  presentCount: number;

  /** Employees absent today */
  absentCount: number;

  /** Employees marked late */
  lateCount: number;

  /** Employees currently on leave */
  onLeaveCount: number;

  /** Overall attendance percentage */
  attendanceRate: number;

  /** Average work hours */
  averageWorkHours: number;

  /** Total overtime hours */
  totalOvertimeHours: number;
}

/**
 * Active clock session state.
 */
export interface ActiveClockState {
  /** Whether the employee is currently clocked in */
  isClockedIn: boolean;

  /** Current clock-in timestamp */
  clockInTime: string | null;

  /** Active break start timestamp */
  currentBreakStart: string | null;

  /** Total accumulated break duration (minutes) */
  totalBreakDuration: number;
}

/**
 * Attendance status summary.
 * Used by dashboard widgets and statistics.
 */
export interface AttendanceSummary {
  presentCount: number;
  lateCount: number;
  absentCount: number;
  halfDayCount: number;
  onLeaveCount: number;
  totalEmployees: number;
}

/**
 * Employee attendance summary.
 * Used by employee profile pages and reports.
 */
export interface EmployeeAttendanceSummary {
  presentCount: number;
  lateCount: number;
  halfDayCount: number;
  absentCount: number;
  onLeaveCount: number;
  totalWorkedHours: number;
  totalOvertime: number;
  attendanceRate: number;
}

/**
 * Attendance filtering options.
 * Used by tables, dashboards and reports.
 */
export interface AttendanceFilters {
  employeeId?: string;

  department?: string;

  status?: AttendanceStatus;

  location?: string;

  shiftName?: string;

  search?: string;

  /** ISO Date (YYYY-MM-DD) */
  startDate?: string;

  /** ISO Date (YYYY-MM-DD) */
  endDate?: string;

  isRegularized?: boolean;
}