"use server";

import { revalidatePath } from "next/cache";
import {
  assertProductionRealData,
  requireAttendanceMark,
  requireAttendanceSelfService,
  requireAttendanceView,
} from "@/lib/auth/assert-data-management";
import {
  listAttendance,
  getAttendance,
  createAttendance,
  updateAttendance,
  checkIn,
  checkOut,
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

export async function listAttendanceAction(filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
  workMode?: string;
  employeeId?: string;
  departmentId?: string;
}): Promise<ActionResult<AttendanceWithEmployee[]>> {
  try {
    await requireAttendanceView();
    assertProductionRealData();
    const data = await listAttendance(filters);
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
