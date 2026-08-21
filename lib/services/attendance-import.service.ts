/**
 * Attendance import service — validates structured rows, resolves employee codes
 * within the authenticated tenant, computes hours via existing computeHours helper,
 * and creates attendance records (create-only, no overwrite).
 */

import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as attendanceRepo from "@/lib/repositories/attendance.repository";
import * as employeeRepo from "@/lib/repositories/employee.repository";
import { computeHours } from "@/lib/mappers/attendance.mapper";
import { writeAuditLog } from "@/lib/services/audit.service";
import {
  attendanceImportBatchSchema,
  type AttendanceImportBatchInput,
  type AttendanceImportResult,
  type AttendanceImportRowError,
  type AttendanceImportRowInput,
  ATTENDANCE_IMPORT_MAX_ROWS,
} from "@/lib/validation/attendance-import";
import type { AttendanceStatus, WorkMode } from "@prisma/client";

function parseDateOnly(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

/** Combine YYYY-MM-DD + HH:mm into a Date (UTC). */
function combineDateAndTime(
  dateYmd: string,
  timeHm: string | null | undefined
): Date | null {
  const t = timeHm?.trim();
  if (!t) return null;
  const d = new Date(`${dateYmd}T${t}:00.000Z`);
  if (Number.isNaN(d.getTime())) {
    throw new AppError("VALIDATION", "Invalid check-in/check-out time.");
  }
  return d;
}

function normalizeOptionalString(
  value: string | null | undefined
): string | null {
  if (value == null) return null;
  const t = value.trim();
  return t.length === 0 ? null : t;
}

export async function importAttendance(
  input: AttendanceImportBatchInput
): Promise<AttendanceImportResult> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = attendanceImportBatchSchema.parse(input);

  if (parsed.rows.length > ATTENDANCE_IMPORT_MAX_ROWS) {
    throw new AppError(
      "VALIDATION",
      `Import is limited to ${ATTENDANCE_IMPORT_MAX_ROWS} rows.`
    );
  }

  // Preload employees for this company by code
  const companyEmployees = await employeeRepo.findEmployeesByCompany(companyId);
  const byCode = new Map(
    companyEmployees.map((e) => [e.employeeCode.toLowerCase(), e])
  );

  // Detect intra-file duplicates: same employee code + date
  const seenKeys = new Set<string>();

  type Prepared = {
    row: AttendanceImportRowInput;
    employeeDbId: string;
    attendanceDate: Date;
    checkIn: Date | null;
    checkOut: Date | null;
    breakDuration: number | null;
    totalHours: number | null;
    overtimeHours: number | null;
  };

  const prepared: Prepared[] = [];
  const errors: AttendanceImportRowError[] = [];

  for (const row of parsed.rows) {
    const codeKey = row.employeeId.trim().toLowerCase();
    const dateKey = row.attendanceDate;
    const dupKey = `${codeKey}|${dateKey}`;

    if (seenKeys.has(dupKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "attendanceDate",
        message: "Duplicate employee and date within the import file.",
      });
      continue;
    }

    const employee = byCode.get(codeKey);
    if (!employee) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "employeeId",
        message: "Employee not found in your organization.",
      });
      continue;
    }

    const attendanceDate = parseDateOnly(row.attendanceDate);
    const existing = await attendanceRepo.findAttendanceByEmployeeDate(
      companyId,
      employee.id,
      attendanceDate
    );
    if (existing) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "attendanceDate",
        message: "Attendance already exists for this employee and date.",
      });
      continue;
    }

    let checkIn: Date | null;
    let checkOut: Date | null;
    try {
      checkIn = combineDateAndTime(
        row.attendanceDate,
        normalizeOptionalString(row.checkIn)
      );
      checkOut = combineDateAndTime(
        row.attendanceDate,
        normalizeOptionalString(row.checkOut)
      );
    } catch {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "checkIn",
        message: "Invalid check-in/check-out time.",
      });
      continue;
    }

    if (checkIn && checkOut && checkOut.getTime() < checkIn.getTime()) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "checkOut",
        message: "Check-out cannot precede check-in.",
      });
      continue;
    }

    const breakDuration =
      row.breakDuration != null && !Number.isNaN(Number(row.breakDuration))
        ? Number(row.breakDuration)
        : null;

    const hours = computeHours(checkIn, checkOut, breakDuration);

    seenKeys.add(dupKey);
    prepared.push({
      row,
      employeeDbId: employee.id,
      attendanceDate,
      checkIn,
      checkOut,
      breakDuration,
      totalHours: hours.totalHours,
      overtimeHours: hours.overtimeHours,
    });
  }

  const importedIds: string[] = [];

  if (prepared.length > 0) {
    try {
      await prisma.$transaction(async (tx) => {
        for (const item of prepared) {
          const created = await tx.attendance.create({
            data: {
              attendanceDate: item.attendanceDate,
              checkIn: item.checkIn,
              checkOut: item.checkOut,
              totalHours: item.totalHours,
              overtimeHours: item.overtimeHours,
              breakDuration: item.breakDuration,
              status: item.row.status as AttendanceStatus,
              workMode: item.row.workMode as WorkMode,
              location: normalizeOptionalString(item.row.location),
              shiftName: normalizeOptionalString(item.row.shiftName),
              remarks: normalizeOptionalString(item.row.remarks),
              isRegularized: false,
              companyId,
              employeeId: item.employeeDbId,
            },
          });
          importedIds.push(created.id);
        }
      });
    } catch (err) {
      console.error("[attendance-import] transaction failed", err);
      throw new AppError(
        "INTERNAL",
        "Failed to commit attendance records. Please try again."
      );
    }

    await writeAuditLog({
      companyId,
      actorId: user.id,
      action: "ATTENDANCE_IMPORTED",
      entity: "Attendance",
      metadata: {
        importedCount: importedIds.length,
        failedCount: errors.length,
        totalRows: parsed.rows.length,
        importedIds,
      },
    });
  }

  return {
    success: importedIds.length > 0 && errors.length === 0,
    importedCount: importedIds.length,
    failedCount: errors.length,
    skippedCount: errors.length,
    totalRows: parsed.rows.length,
    errors,
    importedIds,
  };
}
