"use server";

import { revalidatePath } from "next/cache";
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

export async function listLeaveRequestsAction(filters?: {
  status?: string;
  leaveType?: string;
  employeeId?: string;
  departmentId?: string;
}): Promise<ActionResult<LeaveRequest[]>> {
  try {
    return { success: true, data: await listLeaveRequests(filters) };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getLeaveRequestAction(
  id: string
): Promise<ActionResult<LeaveRequest>> {
  try {
    return { success: true, data: await getLeaveRequest(id) };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getLeaveStatsAction(): Promise<
  ActionResult<LeaveStatsSummary>
> {
  try {
    return { success: true, data: await getLeaveStats() };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getLeaveBalanceAction(
  employeeId: string
): Promise<ActionResult<LeaveBalance>> {
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
    const data = await cancelLeaveRequest(id);
    revalidatePath("/dashboard/leave");
    revalidatePath(`/dashboard/leave/${id}`);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}
