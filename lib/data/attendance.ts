/**
 * Thin attendance data adapter.
 * NEXT_PUBLIC_USE_REAL_DATA=true → server actions / DB
 * otherwise → mock data
 */

import { isRealDataEnabled } from "@/lib/config/flags";
import { mockAttendanceWithEmployees } from "@/mock/attendance";
import { calculateAttendanceMetrics } from "@/lib/reports/attendance-metrics";
import type { AttendanceMetrics } from "@/lib/reports/attendance-metrics";
import type { AttendanceWithEmployee } from "@/types/attendance";
import {
  listAttendanceAction,
  getAttendanceAction,
  getAttendanceMetricsAction,
  createAttendanceAction,
  updateAttendanceAction,
  checkInAction,
  checkOutAction,
} from "@/app/actions/attendance";
import type {
  CreateAttendanceInput,
  UpdateAttendanceInput,
} from "@/lib/validation/attendance";

export async function fetchAttendanceList(filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
  workMode?: string;
  employeeId?: string;
  departmentId?: string;
}): Promise<AttendanceWithEmployee[]> {
  if (!isRealDataEnabled()) {
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
      return true;
    });
  }

  const result = await listAttendanceAction(filters);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

/**
 * All-time Attendance KPIs (independent of list pagination/filters).
 * Mock: same calculateAttendanceMetrics on mock rows.
 */
export async function fetchAttendanceMetrics(): Promise<AttendanceMetrics> {
  if (!isRealDataEnabled()) {
    const rows = mockAttendanceWithEmployees.map((r) => r.attendance);
    return calculateAttendanceMetrics(rows);
  }

  const result = await getAttendanceMetricsAction();
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function fetchAttendance(
  id: string
): Promise<AttendanceWithEmployee | null> {
  if (!isRealDataEnabled()) {
    return mockAttendanceWithEmployees.find((r) => r.id === id) ?? null;
  }
  const result = await getAttendanceAction(id);
  if (!result.success) return null;
  return result.data;
}

export async function saveAttendance(
  input: CreateAttendanceInput
): Promise<AttendanceWithEmployee> {
  if (!isRealDataEnabled()) {
    const id = `att-mock-${Date.now()}`;
    const now = new Date().toISOString();
    return {
      id,
      attendance: {
        id,
        tenantId: "tenant-mock",
        employeeId: input.employeeId,
        attendanceDate: input.attendanceDate,
        checkIn: input.checkIn ?? null,
        checkOut: input.checkOut ?? null,
        totalHours: input.totalHours ?? null,
        overtimeHours: input.overtimeHours ?? null,
        breakDuration: input.breakDuration ?? null,
        status: input.status,
        workMode: input.workMode,
        remarks: input.remarks ?? null,
        location: input.location ?? null,
        shiftName: input.shiftName ?? null,
        isRegularized: input.isRegularized ?? false,
        createdAt: now,
        updatedAt: now,
      },
      employee: {
        firstName: "Mock",
        lastName: "Employee",
        email: "mock@example.com",
        avatarUrl: null,
        designation: "Employee",
        departmentId: null,
      },
    };
  }

  const result = await createAttendanceAction(input);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function patchAttendance(
  id: string,
  input: UpdateAttendanceInput
): Promise<AttendanceWithEmployee> {
  if (!isRealDataEnabled()) {
    const existing = mockAttendanceWithEmployees.find((r) => r.id === id);
    if (!existing) throw new Error("Attendance record not found.");
    return {
      ...existing,
      attendance: {
        ...existing.attendance,
        ...input,
        updatedAt: new Date().toISOString(),
      },
    } as AttendanceWithEmployee;
  }

  const result = await updateAttendanceAction(id, input);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function clockIn(options?: {
  workMode?: "OFFICE" | "REMOTE" | "HYBRID";
  location?: string | null;
}): Promise<AttendanceWithEmployee> {
  if (!isRealDataEnabled()) {
    throw new Error("Check-in requires real data mode.");
  }
  const result = await checkInAction(options);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function clockOut(): Promise<AttendanceWithEmployee> {
  if (!isRealDataEnabled()) {
    throw new Error("Check-out requires real data mode.");
  }
  const result = await checkOutAction();
  if (!result.success) throw new Error(result.error);
  return result.data;
}
