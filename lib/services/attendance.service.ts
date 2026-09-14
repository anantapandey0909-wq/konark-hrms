/**
 * Attendance service — business rules, validation, tenant checks.
 */

import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as attendanceRepo from "@/lib/repositories/attendance.repository";
import * as employeeRepo from "@/lib/repositories/employee.repository";
import {
  mapAttendanceWithEmployee,
  computeHours,
} from "@/lib/mappers/attendance.mapper";
import { writeAuditLog } from "@/lib/services/audit.service";
import {
  createAttendanceSchema,
  updateAttendanceSchema,
  type CreateAttendanceInput,
  type UpdateAttendanceInput,
} from "@/lib/validation/attendance";
import { getPermissions } from "@/lib/auth/permissions";
import type { AuthUser } from "@/types/auth";
import type { AttendanceWithEmployee } from "@/types/attendance";
import type { AttendanceMetrics } from "@/lib/reports/attendance-metrics";
import type { AttendanceStatus, WorkMode } from "@prisma/client";

export type AttendanceListResult = {
  items: AttendanceWithEmployee[];
  total: number;
  page: number;
  pageSize: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function clampPage(page?: number): number {
  if (typeof page !== "number" || !Number.isFinite(page)) return DEFAULT_PAGE;
  return Math.max(1, Math.floor(page));
}

function clampPageSize(pageSize?: number): number {
  if (typeof pageSize !== "number" || !Number.isFinite(pageSize)) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(pageSize)));
}

function parseDateOnly(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function parseOptionalDateTime(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new AppError("VALIDATION", "Invalid date/time value.");
  }
  return d;
}

function assertCheckOrder(checkIn: Date | null, checkOut: Date | null) {
  if (checkIn && checkOut && checkOut.getTime() < checkIn.getTime()) {
    throw new AppError("VALIDATION", "Check-out cannot precede check-in.");
  }
}

function canViewOrgAttendance(user: AuthUser): boolean {
  if (user.isSuperAdmin) return true;
  const p = getPermissions(user.role);
  return p.attendance.mark || p.attendance.approve;
}

async function resolveSessionEmployeeId(
  companyId: string,
  userId: string
): Promise<string | null> {
  const { prisma } = await getTenantPrisma();
  const linked = await prisma.employee.findFirst({
    where: { companyId, userId },
    select: { id: true },
  });
  return linked?.id ?? null;
}

export async function listAttendance(filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
  workMode?: string;
  employeeId?: string;
  departmentId?: string;
  page?: number;
  pageSize?: number;
}): Promise<AttendanceListResult> {
  const { companyId, user } = await getTenantPrisma();
  const scoped = { ...(filters ?? {}) };

  if (!canViewOrgAttendance(user)) {
    const ownId = await resolveSessionEmployeeId(companyId, user.id);
    if (!ownId) {
      const page = clampPage(filters?.page);
      const pageSize = clampPageSize(filters?.pageSize);
      return { items: [], total: 0, page, pageSize };
    }
    scoped.employeeId = ownId;
  }

  const page = clampPage(filters?.page);
  const pageSize = clampPageSize(filters?.pageSize);

  const { items, total } = await attendanceRepo.findAttendancesByCompany(
    companyId,
    {
      startDate: scoped.startDate,
      endDate: scoped.endDate,
      status: scoped.status,
      workMode: scoped.workMode,
      employeeId: scoped.employeeId,
      departmentId: scoped.departmentId,
    },
    { page, pageSize }
  );

  return {
    items: items.map(mapAttendanceWithEmployee),
    total,
    page,
    pageSize,
  };
}

export async function getAttendanceMetrics(): Promise<AttendanceMetrics> {
  const { companyId, user } = await getTenantPrisma();
  const scope: attendanceRepo.AttendanceMetricsScope = {};

  if (!canViewOrgAttendance(user)) {
    const ownId = await resolveSessionEmployeeId(companyId, user.id);
    if (!ownId) {
      return {
        totalRecords: 0,
        presentCount: 0,
        lateCount: 0,
        halfDayCount: 0,
        absentCount: 0,
        onLeaveCount: 0,
        averageWorkingHours: 0,
        totalOvertimeHours: 0,
        regularizationCount: 0,
      };
    }
    scope.employeeId = ownId;
  }

  return attendanceRepo.getAttendanceMetricsByCompany(companyId, scope);
}

export async function getAttendance(
  id: string
): Promise<AttendanceWithEmployee> {
  const { companyId, user } = await getTenantPrisma();
  const row = await attendanceRepo.findAttendanceById(companyId, id);
  if (!row) {
    throw new AppError("NOT_FOUND", "Attendance record not found.", 404);
  }

  if (!canViewOrgAttendance(user)) {
    const ownId = await resolveSessionEmployeeId(companyId, user.id);
    if (!ownId || row.employeeId !== ownId) {
      throw new AppError("NOT_FOUND", "Attendance record not found.", 404);
    }
  }

  return mapAttendanceWithEmployee(row);
}

export async function createAttendance(
  input: CreateAttendanceInput
): Promise<AttendanceWithEmployee> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = createAttendanceSchema.parse(input);

  const employee = await employeeRepo.findEmployeeById(
    companyId,
    parsed.employeeId
  );
  if (!employee) {
    throw new AppError(
      "VALIDATION",
      "Employee not found in your organization."
    );
  }
  if (employee.status !== "ACTIVE") {
    throw new AppError(
      "VALIDATION",
      "Attendance can only be created for active employees."
    );
  }

  const attendanceDate = parseDateOnly(parsed.attendanceDate);
  const existing = await attendanceRepo.findAttendanceByEmployeeDate(
    companyId,
    parsed.employeeId,
    attendanceDate
  );
  if (existing) {
    throw new AppError(
      "CONFLICT",
      "An attendance record already exists for this employee on that date."
    );
  }

  const checkIn = parseOptionalDateTime(parsed.checkIn);
  const checkOut = parseOptionalDateTime(parsed.checkOut);
  assertCheckOrder(checkIn, checkOut);

  const breakDuration = parsed.breakDuration ?? null;
  const hours =
    parsed.totalHours != null
      ? {
          totalHours: parsed.totalHours,
          overtimeHours: parsed.overtimeHours ?? null,
        }
      : computeHours(checkIn, checkOut, breakDuration);

  const created = await attendanceRepo.createAttendance({
    attendanceDate,
    checkIn,
    checkOut,
    totalHours: hours.totalHours,
    overtimeHours: hours.overtimeHours,
    breakDuration,
    status: parsed.status as AttendanceStatus,
    workMode: parsed.workMode as WorkMode,
    location: parsed.location ?? null,
    shiftName: parsed.shiftName ?? null,
    isRegularized: parsed.isRegularized ?? false,
    remarks: parsed.remarks ?? null,
    company: { connect: { id: companyId } },
    employee: { connect: { id: parsed.employeeId } },
  });

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "ATTENDANCE_CREATED",
    entity: "Attendance",
    entityId: created.id,
    metadata: {
      employeeId: parsed.employeeId,
      attendanceDate: parsed.attendanceDate,
    },
  });

  return mapAttendanceWithEmployee(created);
}

export async function updateAttendance(
  id: string,
  input: UpdateAttendanceInput
): Promise<AttendanceWithEmployee> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = updateAttendanceSchema.parse(input);

  const existing = await attendanceRepo.findAttendanceById(companyId, id);
  if (!existing) {
    throw new AppError("NOT_FOUND", "Attendance record not found.", 404);
  }

  if (parsed.employeeId && parsed.employeeId !== existing.employeeId) {
    const emp = await employeeRepo.findEmployeeById(
      companyId,
      parsed.employeeId
    );
    if (!emp) {
      throw new AppError(
        "VALIDATION",
        "Employee not found in your organization."
      );
    }
  }

  const checkIn =
    parsed.checkIn !== undefined
      ? parseOptionalDateTime(parsed.checkIn)
      : existing.checkIn;
  const checkOut =
    parsed.checkOut !== undefined
      ? parseOptionalDateTime(parsed.checkOut)
      : existing.checkOut;
  assertCheckOrder(checkIn, checkOut);

  const breakDuration =
    parsed.breakDuration !== undefined
      ? parsed.breakDuration
      : existing.breakDuration;

  const hours =
    parsed.totalHours !== undefined
      ? {
          totalHours: parsed.totalHours,
          overtimeHours:
            parsed.overtimeHours !== undefined
              ? parsed.overtimeHours
              : existing.overtimeHours,
        }
      : computeHours(checkIn, checkOut, breakDuration);

  const updated = await attendanceRepo.updateAttendance(companyId, id, {
    ...(parsed.employeeId !== undefined
      ? { employee: { connect: { id: parsed.employeeId } } }
      : {}),
    ...(parsed.attendanceDate !== undefined
      ? { attendanceDate: parseDateOnly(parsed.attendanceDate) }
      : {}),
    ...(parsed.checkIn !== undefined ? { checkIn } : {}),
    ...(parsed.checkOut !== undefined ? { checkOut } : {}),
    totalHours: hours.totalHours,
    overtimeHours: hours.overtimeHours,
    ...(parsed.breakDuration !== undefined ? { breakDuration } : {}),
    ...(parsed.status !== undefined
      ? { status: parsed.status as AttendanceStatus }
      : {}),
    ...(parsed.workMode !== undefined
      ? { workMode: parsed.workMode as WorkMode }
      : {}),
    ...(parsed.remarks !== undefined ? { remarks: parsed.remarks } : {}),
    ...(parsed.location !== undefined ? { location: parsed.location } : {}),
    ...(parsed.shiftName !== undefined ? { shiftName: parsed.shiftName } : {}),
    ...(parsed.isRegularized !== undefined
      ? { isRegularized: parsed.isRegularized }
      : {}),
  });

  if (!updated) {
    throw new AppError("NOT_FOUND", "Attendance record not found.", 404);
  }

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "ATTENDANCE_UPDATED",
    entity: "Attendance",
    entityId: id,
  });

  return mapAttendanceWithEmployee(updated);
}

export async function checkIn(options?: {
  workMode?: WorkMode;
  location?: string | null;
}): Promise<AttendanceWithEmployee> {
  const { companyId, user, prisma } = await getTenantPrisma();

  const employee = await prisma.employee.findFirst({
    where: { companyId, userId: user.id },
  });
  if (!employee) {
    throw new AppError(
      "VALIDATION",
      "No employee profile is linked to your account."
    );
  }

  const today = new Date();
  const attendanceDate = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );

  const existing = await attendanceRepo.findAttendanceByEmployeeDate(
    companyId,
    employee.id,
    attendanceDate
  );
  if (existing?.checkIn) {
    throw new AppError("CONFLICT", "You have already checked in today.");
  }

  const now = new Date();

  if (existing) {
    const updated = await attendanceRepo.updateAttendance(
      companyId,
      existing.id,
      {
        checkIn: now,
        status: "PRESENT",
        workMode: options?.workMode ?? existing.workMode,
        location: options?.location ?? existing.location,
      }
    );
    if (!updated) {
      throw new AppError("NOT_FOUND", "Attendance record not found.", 404);
    }
    await writeAuditLog({
      companyId,
      actorId: user.id,
      action: "ATTENDANCE_CHECKED_IN",
      entity: "Attendance",
      entityId: updated.id,
    });
    return mapAttendanceWithEmployee(updated);
  }

  const created = await attendanceRepo.createAttendance({
    attendanceDate,
    checkIn: now,
    checkOut: null,
    totalHours: null,
    overtimeHours: null,
    breakDuration: null,
    status: "PRESENT",
    workMode: options?.workMode ?? "OFFICE",
    location: options?.location ?? null,
    shiftName: "General Shift",
    isRegularized: false,
    remarks: null,
    company: { connect: { id: companyId } },
    employee: { connect: { id: employee.id } },
  });

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "ATTENDANCE_CHECKED_IN",
    entity: "Attendance",
    entityId: created.id,
  });

  return mapAttendanceWithEmployee(created);
}

export async function checkOut(): Promise<AttendanceWithEmployee> {
  const { companyId, user, prisma } = await getTenantPrisma();

  const employee = await prisma.employee.findFirst({
    where: { companyId, userId: user.id },
  });
  if (!employee) {
    throw new AppError(
      "VALIDATION",
      "No employee profile is linked to your account."
    );
  }

  const today = new Date();
  const attendanceDate = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );

  const existing = await attendanceRepo.findAttendanceByEmployeeDate(
    companyId,
    employee.id,
    attendanceDate
  );
  if (!existing || !existing.checkIn) {
    throw new AppError("VALIDATION", "No check-in found for today.");
  }
  if (existing.checkOut) {
    throw new AppError("CONFLICT", "You have already checked out today.");
  }

  const now = new Date();
  assertCheckOrder(existing.checkIn, now);
  const hours = computeHours(existing.checkIn, now, existing.breakDuration);

  const updated = await attendanceRepo.updateAttendance(companyId, existing.id, {
    checkOut: now,
    totalHours: hours.totalHours,
    overtimeHours: hours.overtimeHours,
  });
  if (!updated) {
    throw new AppError("NOT_FOUND", "Attendance record not found.", 404);
  }

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "ATTENDANCE_CHECKED_OUT",
    entity: "Attendance",
    entityId: updated.id,
  });

  return mapAttendanceWithEmployee(updated);
}
