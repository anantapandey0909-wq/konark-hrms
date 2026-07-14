import { LeaveStatus, LeaveType } from "@/types/leave";

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  CASUAL_LEAVE: "Casual Leave",
  SICK_LEAVE: "Sick Leave",
  EARNED_LEAVE: "Earned Leave",
  MATERNITY_LEAVE: "Maternity Leave",
  PATERNITY_LEAVE: "Paternity Leave",
  WORK_FROM_HOME: "Work From Home",
  HALF_DAY: "Half Day",
  COMP_OFF: "Comp Off",
};

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};
