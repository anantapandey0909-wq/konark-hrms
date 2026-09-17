"use server";

import { revalidatePath } from "next/cache";
import {
  assertProductionRealData,
  requireAttendanceMark,
  requireAttendanceSelfService,
  requireAttendanceView,
} from "@/lib/auth/assert-data-management";
import { isRealDataEnabled } from "@/lib/config/flags";
import { mockAttendanceWithEmployees } from "@/mock/attendance";
import { calculateAttendanceMetrics } from "@/lib/reports/attendance-metrics";
import type { AttendanceMetrics } from "@/lib/reports/attendance-metrics";
import {
  listAttendance,
  getAttendance,
  getAttendanceMetrics,
  createAttendance,
  updateAttendance,
  checkIn,
  checkOut,
  type AttendanceListResult,
} from "@/lib/services/attendance.service";
import type {
  CreateAttendanceInput,
  UpdateAttendanceInput,
} from "@/lib/validation/attendance";
import { toSafeActionResult } from "@/lib/errors/app-error";
import type { AttendanceWithEmployee } from "@/types/attendance";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function clampPage(page?: number): number {
  if (typeof page !== "number" || !Number.isFinite(page)) return 1;
  return Math.max(1, Math.floor(page));
}

function clampPageSize(pageSize?: number): number {
  if (typeof pageSize !== "number" || !Number.isFinite(pageSize)) return 10;
  return Math.min(50, Math.max(1, Math.floor(pageSize)));
}

function matchesMockSearch(
  row: AttendanceWithEmployee,
  search: string | undefined
): boolean {
  if (!search?.trim()) return true;
  const tokens = search
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return true;
  const first = row.employee.firstName.toLowerCase();
  const last = row.employee.lastName.toLowerCase();
  return tokens.every(
    (token) => first.includes(token) || last.includes(token)
  );
}

function filterMockAttendance(filters?: {
  status?: string;
  workMode?: string;
  employeeId?: string;
  search?: string;
}): AttendanceWithEmployee[] {
  return mockAttendanceWithEmployees.filter((row) => {
    if (filters?.status && filters.status !== "ALL") {
      if (row.attendance.status !== filters.status) return false;
    }
    if (filters?.workMode && filters.workMode !== "ALL") {
      if (row.attendance.workMode !== filters.workMode) return false;
    }
    if (filters?.employeeId && row.attendance.employeeId !== filters.employeeId) {
      return false;
    }
    if (!matchesMockSearch(row, filters?.search)) return false;
    return true;
  });
}

export async function listAttendanceAction(filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
  workMode?: string;
  employeeId?: string;
  departmentId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<ActionResult<AttendanceListResult>> {
  try {
    await requireAttendanceView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  const page = clampPage(filters?.page);
  const pageSize = clampPageSize(filters?.pageSize);

  if (!isRealDataEnabled()) {
    const filtered = filterMockAttendance(filters);
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return { success: true, data: { items, total, page, pageSize } };
  }

  try {
    const data = await listAttendance({
      ...filters,
      page,
      pageSize,
    });
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getAttendanceMetricsAction(): Promise<
  ActionResult<AttendanceMetrics>
> {
  try {
    await requireAttendanceView();
    assertProductionRealData();

    if (!isRealDataEnabled()) {
      const rows = mockAttendanceWithEmployees.map((r) => r.attendance);
      return {
        success: true,
        data: calculateAttendanceMetrics(rows),
      };
    }

    const data = await getAttendanceMetrics();
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getAttendanceAction(
  id: string
): Promise<ActionResult<AttendanceWithEmployee>> {
  try {
    await requireAttendanceView();
    assertProductionRealData();
    const data = await getAttendance(id);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function createAttendanceAction(
  input: CreateAttendanceInput
): Promise<ActionResult<AttendanceWithEmployee>> {
  try {
    await requireAttendanceMark();
    assertProductionRealData();
    const data = await createAttendance(input);
    revalidatePath("/dashboard/attendance");
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function updateAttendanceAction(
  id: string,
  input: UpdateAttendanceInput
): Promise<ActionResult<AttendanceWithEmployee>> {
  try {
    await requireAttendanceMark();
    assertProductionRealData();
    const data = await updateAttendance(id, input);
    revalidatePath("/dashboard/attendance");
    revalidatePath(`/dashboard/attendance/${id}`);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function checkInAction(options?: {
  workMode?: "OFFICE" | "REMOTE" | "HYBRID";
  location?: string | null;
}): Promise<ActionResult<AttendanceWithEmployee>> {
  try {
    await requireAttendanceSelfService();
    assertProductionRealData();
    const data = await checkIn(options);
    revalidatePath("/dashboard/attendance");
    revalidatePath("/dashboard/employee/attendance");
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function checkOutAction(): Promise<
  ActionResult<AttendanceWithEmployee>
> {
  try {
    await requireAttendanceSelfService();
    assertProductionRealData();
    const data = await checkOut();
    revalidatePath("/dashboard/attendance");
    revalidatePath("/dashboard/employee/attendance");
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}
