/**
 * Thin leave data adapter.
 * NEXT_PUBLIC_USE_REAL_DATA=true → server actions / DB
 * otherwise → mock data
 */

import { isRealDataEnabled } from "@/lib/config/flags";
import { mockLeaveRequests, mockLeaveBalances } from "@/mock/leave";
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
  if (!isRealDataEnabled()) {
    return mockLeaveRequests.filter((r) => {
      if (filters?.status && filters.status !== "ALL" && r.status !== filters.status)
        return false;
      if (
        filters?.leaveType &&
        filters.leaveType !== "ALL" &&
        r.leaveType !== filters.leaveType
      )
        return false;
      if (filters?.employeeId && r.employeeId !== filters.employeeId) return false;
      return true;
    });
  }
  const result = await listLeaveRequestsAction(filters);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function fetchLeaveRequest(
  id: string
): Promise<LeaveRequest | null> {
  if (!isRealDataEnabled()) {
    return mockLeaveRequests.find((r) => r.id === id) ?? null;
  }
  const result = await getLeaveRequestAction(id);
  if (!result.success) return null;
  return result.data;
}

export async function fetchLeaveStats(): Promise<LeaveStatsSummary> {
  if (!isRealDataEnabled()) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const summary: LeaveStatsSummary = {
      totalRequests: mockLeaveRequests.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      onLeaveToday: 0,
    };
    for (const leave of mockLeaveRequests) {
      switch (leave.status) {
        case "PENDING":
          summary.pending++;
          break;
        case "APPROVED":
          summary.approved++;
          break;
        case "REJECTED":
          summary.rejected++;
          break;
        case "CANCELLED":
          summary.cancelled++;
          break;
      }
      if (leave.status === "APPROVED") {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        if (today >= start && today <= end) summary.onLeaveToday++;
      }
    }
    return summary;
  }
  const result = await getLeaveStatsAction();
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function fetchLeaveBalance(
  employeeId: string
): Promise<LeaveBalance | null> {
  if (!isRealDataEnabled()) {
    return mockLeaveBalances.find((b) => b.employeeId === employeeId) ?? null;
  }
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

  if (!isRealDataEnabled()) {
    const id = `LV-mock-${Date.now()}`;
    return {
      id,
      employeeId: form.employeeId,
      employeeCode: form.employeeDisplayId ?? "",
      employeeName: form.employeeName ?? "",
      department: form.department ?? "",
      leaveType: payload.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      totalDays: form.duration || 1,
      reason: form.reason,
      appliedOn: new Date().toISOString().slice(0, 10),
      status: "PENDING",
    };
  }

  const result = await createLeaveRequestAction(payload);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function patchLeaveRequest(
  id: string,
  form: Partial<LeaveFormData>
): Promise<LeaveRequest> {
  if (!isRealDataEnabled()) {
    const existing = mockLeaveRequests.find((r) => r.id === id);
    if (!existing) throw new Error("Leave request not found.");
    return { ...existing, ...form } as LeaveRequest;
  }
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
  if (!isRealDataEnabled()) {
    const existing = mockLeaveRequests.find((r) => r.id === id);
    if (!existing) throw new Error("Leave request not found.");
    return { ...existing, status: "APPROVED", approvalRemarks: remarks ?? undefined };
  }
  const result = await approveLeaveRequestAction(id, remarks);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function rejectLeave(
  id: string,
  remarks?: string | null
): Promise<LeaveRequest> {
  if (!isRealDataEnabled()) {
    const existing = mockLeaveRequests.find((r) => r.id === id);
    if (!existing) throw new Error("Leave request not found.");
    return { ...existing, status: "REJECTED", approvalRemarks: remarks ?? undefined };
  }
  const result = await rejectLeaveRequestAction(id, remarks);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function cancelLeave(id: string): Promise<LeaveRequest> {
  if (!isRealDataEnabled()) {
    const existing = mockLeaveRequests.find((r) => r.id === id);
    if (!existing) throw new Error("Leave request not found.");
    return { ...existing, status: "CANCELLED" };
  }
  const result = await cancelLeaveRequestAction(id);
  if (!result.success) throw new Error(result.error);
  return result.data;
}
