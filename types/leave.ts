/**
 * ==================================================
 * Leave Management Types
 * Konark HRMS
 * ==================================================
 */

/**
 * Available leave categories.
 */
export type LeaveType =
  | "CASUAL_LEAVE"
  | "SICK_LEAVE"
  | "EARNED_LEAVE"
  | "MATERNITY_LEAVE"
  | "PATERNITY_LEAVE"
  | "WORK_FROM_HOME"
  | "HALF_DAY"
  | "COMP_OFF";

/**
 * Current approval status of a leave request.
 */
export type LeaveStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

/**
 * Used only when leave type is HALF_DAY.
 */
export type HalfDaySession =
  | "FIRST_HALF"
  | "SECOND_HALF";

/**
 * Employee leave request.
 */
export interface LeaveRequest {
  /** Unique Leave Request ID */
  id: string;

  /** Employee Information */
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;

  /** Leave Details */
  leaveType: LeaveType;
  startDate: string; // ISO Date (YYYY-MM-DD)
  endDate: string; // ISO Date (YYYY-MM-DD)
  totalDays: number;
  reason: string;

  /** Half-day session (Only applicable for HALF_DAY leave) */
  halfDaySession?: HalfDaySession;

  /** Application Details */
  appliedOn: string; // ISO Date (YYYY-MM-DD)
  status: LeaveStatus;

  /** Approval Information */
  approvedBy?: string;
  approvedOn?: string; // ISO Date (YYYY-MM-DD)
  approvalRemarks?: string;

  /** Optional attachment (Medical Certificate etc.) */
  attachment?: string;
}

/**
 * Dashboard statistics.
 */
export interface LeaveStatsSummary {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  onLeaveToday: number;
}

/**
 * Leave balance for an employee.
 * Useful for future Payroll integration.
 */
export interface LeaveBalance {
  employeeId: string;

  casualLeave: number;
  sickLeave: number;
  earnedLeave: number;

  maternityLeave: number;
  paternityLeave: number;

  compOff: number;
}

/**
 * Search and filter state.
 */
export interface LeaveFilters {
  search: string;

  leaveType: LeaveType | "ALL";

  status: LeaveStatus | "ALL";

  department: string | "ALL";
}