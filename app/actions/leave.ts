"use server";

import { revalidatePath } from "next/cache";
import {
  assertProductionRealData,
  requireLeaveApply,
  requireLeaveApprove,
  requireLeaveView,
} from "@/lib/auth/assert-data-management";
import { getPermissions } from "@/lib/auth/permissions";
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
  type LeaveListResult,
} from "@/lib/services/leave.service";
import type {
  CreateLeaveInput,
  UpdateLeaveInput,
} from "@/lib/validation/leave";
import { toSafeActionResult } from "@/lib/errors/app-error";
import type { AuthUser } from "@/types/auth";
import type {
  LeaveRequest,
  LeaveBalance,
  LeaveStatsSummary,
} from "@/types/leave";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function canViewOrgLeave(user: AuthUser): boolean {
  if (user.isSuperAdmin) return true;
  return getPermissions(user.role).leave.approve;
}

/** Match mock leave rows to session identity (employee code or id). */
function isOwnMockLeave(user: AuthUser, leave: LeaveRequest): boolean {
  const identity = user.employeeId;
  return (
    leave.employeeId === identity ||
    leave.employeeCode === identity
  );
}

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

function mockLeavesForUser(
  user: AuthUser,
  filters?: {
    status?: string;
    leaveType?: string;
    employeeId?: string;
    departmentId?: string;
  }
): LeaveRequest[] {
  if (!canViewOrgLeave(user)) {
    // Force self-scope; ignore client employeeId.
    return filterMockLeaves(mockLeaveRequests, {
      ...filters,
      employeeId: undefined,
    }).filter((r) => isOwnMockLeave(user, r));
  }
  return filterMockLeaves(mockLeaveRequests, filters);
}

function clampPage(page?: number): number {
  if (typeof page !== "number" || !Number.isFinite(page)) return 1;
  return Math.max(1, Math.floor(page));
}

function clampPageSize(pageSize?: number): number {
  if (typeof pageSize !== "number" || !Number.isFinite(pageSize)) return 10;
  return Math.min(50, Math.max(1, Math.floor(pageSize)));
}

function mockStatsForUser(user: AuthUser): LeaveStatsSummary {
  const rows = mockLeavesForUser(user);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const summary: LeaveStatsSummary = {
    totalRequests: rows.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    onLeaveToday: 0,
  };
  for (const leave of rows) {
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
  page?: number;
  pageSize?: number;
}): Promise<ActionResult<LeaveListResult>> {
  let user: AuthUser;
  try {
    user = await requireLeaveView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  const page = clampPage(filters?.page);
  const pageSize = clampPageSize(filters?.pageSize);

  const real = isRealDataEnabled();
  console.info(
    `[leave] listLeaveRequestsAction dataSource=${real ? "postgres" : "mock"}`
  );

  if (!real) {
    const filtered = mockLeavesForUser(user, filters);
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return { success: true, data: { items, total, page, pageSize } };
  }
  try {
    return {
      success: true,
      data: await listLeaveRequests({
        ...filters,
        page,
        pageSize,
      }),
    };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getLeaveRequestAction(
  id: string
): Promise<ActionResult<LeaveRequest>> {
  let user: AuthUser;
  try {
    user = await requireLeaveView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const row = mockLeaveRequests.find((r) => r.id === id);
    if (!row) {
      return {
        success: false,
        error: "Leave request not found.",
        code: "NOT_FOUND",
      };
    }
    if (!canViewOrgLeave(user) && !isOwnMockLeave(user, row)) {
      return {
        success: false,
        error: "Leave request not found.",
        code: "NOT_FOUND",
      };
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
  let user: AuthUser;
  try {
    user = await requireLeaveView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    return { success: true, data: mockStatsForUser(user) };
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
  let user: AuthUser;
  try {
    user = await requireLeaveView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    let targetId = employeeId;
    if (!canViewOrgLeave(user)) {
      const identity = user.employeeId;
      if (employeeId && employeeId !== identity) {
        return {
          success: false,
          error: "Leave balance not found.",
          code: "NOT_FOUND",
        };
      }
      targetId = identity;
    }
    const row = mockLeaveBalances.find((b) => b.employeeId === targetId);
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
  try {
    await requireLeaveApply();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

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
  let user: AuthUser;
  try {
    user = await requireLeaveApply();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const existing = mockLeaveRequests.find((r) => r.id === id);
    if (!existing) {
      return {
        success: false,
        error: "Leave request not found.",
        code: "NOT_FOUND",
      };
    }
    if (!canViewOrgLeave(user) && !isOwnMockLeave(user, existing)) {
      return {
        success: false,
        error: "Leave request not found.",
        code: "NOT_FOUND",
      };
    }
    if (
      !canViewOrgLeave(user) &&
      input.employeeId &&
      input.employeeId !== existing.employeeId
    ) {
      return {
        success: false,
        error: "You cannot reassign a leave request to another employee.",
        code: "FORBIDDEN",
      };
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
  try {
    await requireLeaveApprove();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const existing = mockLeaveRequests.find((r) => r.id === id);
    if (!existing) {
      return {
        success: false,
        error: "Leave request not found.",
        code: "NOT_FOUND",
      };
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
  try {
    await requireLeaveApprove();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const existing = mockLeaveRequests.find((r) => r.id === id);
    if (!existing) {
      return {
        success: false,
        error: "Leave request not found.",
        code: "NOT_FOUND",
      };
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
  try {
    await requireLeaveApply();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const existing = mockLeaveRequests.find((r) => r.id === id);
    if (!existing) {
      return {
        success: false,
        error: "Leave request not found.",
        code: "NOT_FOUND",
      };
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
