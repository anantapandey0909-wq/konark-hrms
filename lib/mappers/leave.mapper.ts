import type {
  LeaveRequest,
  LeaveBalance,
  LeaveType,
  LeaveStatus,
  HalfDaySession,
} from "@/types/leave";

export type PrismaLeaveRequestRow = {
  id: string;
  companyId: string;
  employeeId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  halfDaySession: string | null;
  appliedOn: Date;
  status: string;
  approvedOn: Date | null;
  approvalRemarks: string | null;
  attachment: string | null;
  approvedById: string | null;
  employee?: {
    employeeCode: string;
    firstName: string;
    lastName: string;
    department?: { departmentName: string } | null;
  } | null;
  approvedBy?: {
    firstName: string;
    lastName: string;
  } | null;
};

export type PrismaLeaveBalanceRow = {
  employeeId: string;
  casualLeave: number;
  sickLeave: number;
  earnedLeave: number;
  maternityLeave: number;
  paternityLeave: number;
  compOff: number;
};

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function mapLeaveRequestToFrontend(
  row: PrismaLeaveRequestRow
): LeaveRequest {
  const emp = row.employee;
  return {
    id: row.id,
    employeeId: row.employeeId,
    employeeCode: emp?.employeeCode ?? "",
    employeeName: emp
      ? `${emp.firstName} ${emp.lastName}`
      : "Unknown",
    department: emp?.department?.departmentName ?? "",
    leaveType: row.leaveType as LeaveType,
    startDate: isoDate(row.startDate),
    endDate: isoDate(row.endDate),
    totalDays: row.totalDays,
    reason: row.reason,
    halfDaySession: (row.halfDaySession as HalfDaySession) ?? undefined,
    appliedOn: isoDate(row.appliedOn),
    status: row.status as LeaveStatus,
    approvedBy: row.approvedBy
      ? `${row.approvedBy.firstName} ${row.approvedBy.lastName}`
      : undefined,
    approvedOn: row.approvedOn ? isoDate(row.approvedOn) : undefined,
    approvalRemarks: row.approvalRemarks ?? undefined,
    attachment: row.attachment ?? undefined,
  };
}

export function mapLeaveBalanceToFrontend(
  row: PrismaLeaveBalanceRow
): LeaveBalance {
  return {
    employeeId: row.employeeId,
    casualLeave: row.casualLeave,
    sickLeave: row.sickLeave,
    earnedLeave: row.earnedLeave,
    maternityLeave: row.maternityLeave,
    paternityLeave: row.paternityLeave,
    compOff: row.compOff,
  };
}

/** Inclusive calendar-day count; half-day types return 0.5. */
export function calculateLeaveDays(
  startDate: Date,
  endDate: Date,
  leaveType: string,
  isHalfDay?: boolean
): number {
  if (leaveType === "HALF_DAY" || isHalfDay) return 0.5;
  const start = Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate()
  );
  const end = Date.UTC(
    endDate.getUTCFullYear(),
    endDate.getUTCMonth(),
    endDate.getUTCDate()
  );
  if (end < start) return 0;
  return Math.floor((end - start) / 86_400_000) + 1;
}

export function balanceFieldForLeaveType(
  leaveType: string
): keyof Omit<LeaveBalance, "employeeId"> | null {
  switch (leaveType) {
    case "CASUAL_LEAVE":
      return "casualLeave";
    case "SICK_LEAVE":
      return "sickLeave";
    case "EARNED_LEAVE":
      return "earnedLeave";
    case "MATERNITY_LEAVE":
      return "maternityLeave";
    case "PATERNITY_LEAVE":
      return "paternityLeave";
    case "COMP_OFF":
      return "compOff";
    case "HALF_DAY":
      return "casualLeave";
    case "WORK_FROM_HOME":
      return null; // no balance deduction
    default:
      return null;
  }
}
