/**
 * Thin leave data adapter.
 *
 * Mock vs real is decided ONLY inside app/actions/leave.ts ("use server"),
 * where isRealDataEnabled() reads process.env on the server.
 * This module never branches on the flag itself — that avoided a class of
 * client/server env mismatches for NEXT_PUBLIC_* in Client Components.
 */

import type {
  LeaveRequest,
  LeaveBalance,
  LeaveStatsSummary,
  LeaveFormData,
} from "@/types/leave";
import {
  listLeaveRequestsAction,
  getLeaveRequestAction,
  getLeaveStatsAction,
  getLeaveBalanceAction,
  createLeaveRequestAction,
  updateLeaveRequestAction,
  approveLeaveRequestAction,
  rejectLeaveRequestAction,
  cancelLeaveRequestAction,
} from "@/app/actions/leave";

export async function fetchLeaveRequests(filters?: {
  status?: string;
  leaveType?: string;
  employeeId?: string;
}): Promise<LeaveRequest[]> {
  const result = await listLeaveRequestsAction(filters);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function fetchLeaveRequest(
  id: string
): Promise<LeaveRequest | null> {
  const result = await getLeaveRequestAction(id);
  if (!result.success) return null;
  return result.data;
}

export async function fetchLeaveStats(): Promise<LeaveStatsSummary> {
  const result = await getLeaveStatsAction();
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function fetchLeaveBalance(
  employeeId: string
): Promise<LeaveBalance | null> {
  const result = await getLeaveBalanceAction(employeeId);
  if (!result.success) return null;
  return result.data;
}

export async function saveLeaveRequest(
  form: LeaveFormData
): Promise<LeaveRequest> {
  if (!form.leaveType) {
    throw new Error("Leave type is required.");
  }
  const payload = {
    employeeId: form.employeeId,
    leaveType: form.leaveType as LeaveRequest["leaveType"],
    startDate: form.startDate,
    endDate: form.endDate,
    reason: form.reason,
    isHalfDay: form.isHalfDay,
    halfDaySession: form.halfDaySession || null,
  };

  const result = await createLeaveRequestAction(payload);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function patchLeaveRequest(
  id: string,
  form: Partial<LeaveFormData>
): Promise<LeaveRequest> {
  const result = await updateLeaveRequestAction(id, {
    employeeId: form.employeeId,
    leaveType: form.leaveType || undefined,
    startDate: form.startDate,
    endDate: form.endDate,
    reason: form.reason,
    isHalfDay: form.isHalfDay,
    halfDaySession: form.halfDaySession || null,
  });
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function approveLeave(
  id: string,
  remarks?: string | null
): Promise<LeaveRequest> {
  const result = await approveLeaveRequestAction(id, remarks);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function rejectLeave(
  id: string,
  remarks?: string | null
): Promise<LeaveRequest> {
  const result = await rejectLeaveRequestAction(id, remarks);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function cancelLeave(id: string): Promise<LeaveRequest> {
  const result = await cancelLeaveRequestAction(id);
  if (!result.success) throw new Error(result.error);
  return result.data;
}
