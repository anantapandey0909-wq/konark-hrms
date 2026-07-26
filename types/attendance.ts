export const ATTENDANCE_STATUSES = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "HALF_DAY",
  "ON_LEAVE",
] as const;

export type AttendanceStatus = typeof ATTENDANCE_STATUSES[number];

export const WORK_MODES = ["OFFICE", "REMOTE", "HYBRID"] as const;

export type WorkMode = typeof WORK_MODES[number];

/**
 * Core Attendance entity partition schema.
 * Bound strictly to a single Tenant partition key to enforce strict data isolation.
 */
export interface Attendance {
  readonly id: string;
  readonly tenantId: string; // Partition key for multi-tenant database isolation
  readonly employeeId: string; // References Employee.id (foreign key relation)
  readonly attendanceDate: string; // ISO date format (YYYY-MM-DD)
  readonly checkIn: string | null; // ISO-8601 datetime string
  readonly checkOut: string | null; // ISO-8601 datetime string
  readonly totalHours: number | null; // Total logged hours for the day
  readonly overtimeHours: number | null; // Overtime hours calculated during processing
  readonly breakDuration: number | null; // Total break duration in minutes
  readonly status: AttendanceStatus;
  readonly workMode: WorkMode;
  readonly remarks: string | null;
  readonly createdAt: string; // ISO-8601 string
  readonly updatedAt: string; // ISO-8601 string
readonly location: string | null;
readonly shiftName: string | null;
readonly isRegularized: boolean;

}

/**
 * Legacy type alias to preserve compilation and smooth refactoring across older 
 * view panels without breaking active module dependencies.
 */
export type AttendanceRecord = Attendance;

/**
 * Joined structural representation intended for data table rendering and audit listings.
 * Resolves related employee metadata dynamically, keeping the core database model fully normalized.
 */
export interface AttendanceWithEmployee {
  readonly id: string;
  readonly attendance: Attendance;
  readonly employee: {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly avatarUrl: string | null;
    readonly designation: string;
    readonly departmentId: string | null;
  };
}

/**
 * Statistics contract supporting dashboard widgets and operational metric cards.
 */
export interface AttendanceStats {
  readonly totalEmployees: number;
  readonly presentCount: number;
  readonly absentCount: number;
  readonly lateCount: number;
  readonly onLeaveCount: number;
  readonly halfDayCount: number;

  readonly attendanceRate: number;

  readonly averageWorkingHours: number;
  readonly totalOvertimeHours: number;
}

/**
 * Schema representing active filters used in attendance reporting and audit logs.
 */
export interface AttendanceFilters {
  readonly startDate?: string; // ISO format (YYYY-MM-DD)
  readonly endDate?: string; // ISO format (YYYY-MM-DD)
  readonly status?: AttendanceStatus;
  readonly workMode?: WorkMode;
  readonly departmentId?: string;
  readonly employeeId?: string;
}

/**
 * Contract representing the active punch clock state for the logged-in user session.
 */
export interface ClockState {
  readonly isClockedIn: boolean;
  readonly currentAttendanceId: string | null;
  readonly lastCheckIn: string | null; // ISO-8601 string
  readonly lastCheckOut: string | null; // ISO-8601 string
}

/**
 * Utility types designed for form validation and create/update request structures.
 */
export type CreateAttendanceInput = Omit<Attendance, "id" | "createdAt" | "updatedAt">;
export type UpdateAttendanceInput = Partial<CreateAttendanceInput>;