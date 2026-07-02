// types/attendance.ts

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "HALF_DAY"
  | "ON_LEAVE";

export interface AttendanceRecord {
  /** Unique attendance record ID */
  id: string;

  /** Existing Employee ID */
  employeeId: string;

  /** Existing Employee Code */
  employeeCode: string;

  /** Snapshot of employee name for historical records */
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

  /** Total working hours */
  workHours: number | null;

  /** Overtime hours */
  overtimeHours: number | null;

  /** Office / Remote / Client Site */
  location?: string;

  /** Assigned shift */
  shiftName?: string;

  /** Whether attendance was manually regularized */
  isRegularized?: boolean;

  /** Optional remarks */
  notes?: string;
}

export interface AttendanceStats {
  /** Employees present today */
  presentCount: number;

  /** Employees absent today */
  absentCount: number;

  /** Employees marked late */
  lateCount: number;

  /** Employees on leave */
  onLeaveCount: number;

  /** Attendance percentage */
  attendanceRate: number;

  /** Average work hours */
  averageWorkHours: number;

  /** Total overtime hours */
  totalOvertimeHours: number;
}

export interface ActiveClockState {
  /** Current clock-in status */
  isClockedIn: boolean;

  /** Current clock-in timestamp */
  clockInTime: string | null;

  /** Current break start timestamp */
  currentBreakStart: string | null;

  /** Break duration in minutes */
  totalBreakDuration: number;
}