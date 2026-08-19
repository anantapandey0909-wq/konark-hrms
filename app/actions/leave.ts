"use server";

import { revalidatePath } from "next/cache";
import { isRealDataEnabled } from "@/lib/config/flags";
import { mockLeaveRequests, mockLeaveBalances } from "@/mock/leave";
import {
  listLeaveRequests,
  getLeaveRequest,
  getLeaveStats,
  getLeaveBalance,
  createLeaveRequest,
  updateLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  cancelLeaveRequest,
} from "@/lib/services/leave.service";
import type {
  CreateLeaveInput,
  UpdateLeaveInput,
} from "@/lib/validation/leave";
import { toSafeActionResult } from "@/lib/errors/app-error";
import type {
  LeaveRequest,
  LeaveBalance,
  LeaveStatsSummary,
} from "@/types/leave";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function filterMockLeaves(
  rows: LeaveRequest[],
  filters?: {
    status?: string;
    leaveType?: string;
    employeeId?: string;
    departmentId?: string;
  }
): LeaveRequest[] {
  return rows.filter((r) => {
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

function mockStats(): LeaveStatsSummary {
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

export async function listLeaveRequestsAction(filters?: {
  status?: string;
  leaveType?: string;
  employeeId?: string;
  departmentId?: string;
}): Promise<ActionResult<LeaveRequest[]>> {
  const real = isRealDataEnabled();
  // Visible in the `next dev` terminal — proves which branch runs.
  console.info(
    `[leave] listLeaveRequestsAction dataSource=${real ? "postgres" : "mock"} NEXT_PUBLIC_USE_REAL_DATA=${String(
      process.env.NEXT_PUBLIC_USE_REAL_DATA ?? "(unset)"
    )}`
  );

  if (!real) {
    return { success: true, data: filterMockLeaves(mockLeaveRequests, filters) };
  }
  try {
    return { success: true, data: await listLeaveRequests(filters) };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getLeaveRequestAction(
  id: string
): Promise<ActionResult<LeaveRequest>> {
  if (!isRealDataEnabled()) {
    const row = mockLeaveRequests.find((r) => r.id === id);
    if (!row) {
      return { success: false, error: "Leave request not found.", code: "NOT_FOUND" };
    }
    return { success: true, data: row };
  }
  try {
    return { success: true, data: await getLeaveRequest(id) };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getLeaveStatsAction(): Promise<
  ActionResult<LeaveStatsSummary>
> {
  if (!isRealDataEnabled()) {
    return { success: true, data: mockStats() };
  }
  try {
    return { success: true, data: await getLeaveStats() };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getLeaveBalanceAction(
  employeeId: string
): Promise<ActionResult<LeaveBalance>> {
  if (!isRealDataEnabled()) {
    const row = mockLeaveBalances.find((b) => b.employeeId === employeeId);
    if (!row) {
      return {
        success: false,
        error: "Leave balance not found.",
        code: "NOT_FOUND",
      };
    }
    return { success: true, data: row };
  }
  try {
    return { success: true, data: await getLeaveBalance(employeeId) };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function createLeaveRequestAction(
  input: CreateLeaveInput
): Promise<ActionResult<LeaveRequest>> {
  const real = isRealDataEnabled();
  console.info(
    `[leave] createLeaveRequestAction dataSource=${real ? "postgres" : "mock"}`
  );

  if (!real) {
    const id = `LV-mock-${Date.now()}`;
    return {
      success: true,
      data: {
        id,
        employeeId: input.employeeId,
        employeeCode: "",
        employeeName: "",
        department: "",
        leaveType: input.leaveType,
        startDate: input.startDate,
        endDate: input.endDate,
        totalDays: input.isHalfDay || input.leaveType === "HALF_DAY" ? 0.5 : 1,
        reason: input.reason,
        appliedOn: new Date().toISOString().slice(0, 10),
        status: "PENDING",
        halfDaySession: input.halfDaySession ?? undefined,
      },
    };
  }
  try {
    const data = await createLeaveRequest(input);
    revalidatePath("/dashboard/leave");
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function updateLeaveRequestAction(
  id: string,
  input: UpdateLeaveInput
): Promise<ActionResult<LeaveRequest>> {
  if (!isRealDataEnabled()) {
    const existing = mockLeaveRequests.find((r) => r.id === id);
    if (!existing) {
      return { success: false, error: "Leave request not found.", code: "NOT_FOUND" };
    }
    return {
      success: true,
      data: {
        ...existing,
        ...(input.leaveType ? { leaveType: input.leaveType } : {}),
        ...(input.startDate ? { startDate: input.startDate } : {}),
        ...(input.endDate ? { endDate: input.endDate } : {}),
        ...(input.reason ? { reason: input.reason } : {}),
      },
    };
  }
  try {
    const data = await updateLeaveRequest(id, input);
    revalidatePath("/dashboard/leave");
    revalidatePath(`/dashboard/leave/${id}`);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function approveLeaveRequestAction(
  id: string,
  remarks?: string | null
): Promise<ActionResult<LeaveRequest>> {
  if (!isRealDataEnabled()) {
    const existing = mockLeaveRequests.find((r) => r.id === id);
    if (!existing) {
      return { success: false, error: "Leave request not found.", code: "NOT_FOUND" };
    }
    return {
      success: true,
      data: {
        ...existing,
        status: "APPROVED",
        approvalRemarks: remarks ?? undefined,
      },
    };
  }
  try {
    const data = await approveLeaveRequest(id, remarks);
    revalidatePath("/dashboard/leave");
    revalidatePath(`/dashboard/leave/${id}`);
    revalidatePath("/dashboard/manager/approvals");
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function rejectLeaveRequestAction(
  id: string,
  remarks?: string | null
): Promise<ActionResult<LeaveRequest>> {
  if (!isRealDataEnabled()) {
    const existing = mockLeaveRequests.find((r) => r.id === id);
    if (!existing) {
      return { success: false, error: "Leave request not found.", code: "NOT_FOUND" };
    }
    return {
      success: true,
      data: {
        ...existing,
        status: "REJECTED",
        approvalRemarks: remarks ?? undefined,
      },
    };
  }
  try {
    const data = await rejectLeaveRequest(id, remarks);
    revalidatePath("/dashboard/leave");
    revalidatePath(`/dashboard/leave/${id}`);
    revalidatePath("/dashboard/manager/approvals");
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function cancelLeaveRequestAction(
  id: string
): Promise<ActionResult<LeaveRequest>> {
  if (!isRealDataEnabled()) {
    const existing = mockLeaveRequests.find((r) => r.id === id);
    if (!existing) {
      return { success: false, error: "Leave request not found.", code: "NOT_FOUND" };
    }
    return { success: true, data: { ...existing, status: "CANCELLED" } };
  }
  try {
    const data = await cancelLeaveRequest(id);
    revalidatePath("/dashboard/leave");
    revalidatePath(`/dashboard/leave/${id}`);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}
