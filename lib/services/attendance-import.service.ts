/**
 * Attendance import service — preview (read-only) and transactional commit.
 *
 * Rules:
 * - companyId from getTenantPrisma() only
 * - Preview never mutates
 * - Commit is all-or-nothing: any invalid row blocks the entire import
 * - totalHours/overtimeHours from existing computeHours helper
 * - Create-only (no overwrite of existing employee+date rows)
 */

import type { AttendanceStatus, WorkMode } from "@prisma/client";
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
  type AttendanceImportPreviewResult,
  type AttendanceImportResult,
  type AttendanceImportRowError,
  type AttendanceImportRowInput,
  ATTENDANCE_IMPORT_MAX_ROWS,
} from "@/lib/validation/attendance-import";

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

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

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

/** Unique trimmed employee codes from the upload (bounded by row count). */
function extractEmployeeCodes(rows: AttendanceImportRowInput[]): string[] {
  return Array.from(
    new Set(rows.map((row) => row.employeeId.trim()).filter(Boolean))
  );
}

async function validateAttendanceImportBatch(
  companyId: string,
  rows: AttendanceImportRowInput[]
): Promise<{
  prepared: Prepared[];
  errors: AttendanceImportRowError[];
  duplicateCount: number;
}> {
  const codes = extractEmployeeCodes(rows);
  const companyEmployees = await employeeRepo.findEmployeesByCodesForImport(
    companyId,
    codes
  );
  const byCode = new Map(
    companyEmployees.map((e) => [e.employeeCode.toLowerCase(), e])
  );

  // Resolve codes first so we can batch-load existing attendance.
  const resolvedPairs: {
    row: AttendanceImportRowInput;
    employeeDbId: string;
    attendanceDate: Date;
  }[] = [];

  for (const row of rows) {
    const employee = byCode.get(row.employeeId.trim().toLowerCase());
    if (employee) {
      resolvedPairs.push({
        row,
        employeeDbId: employee.id,
        attendanceDate: parseDateOnly(row.attendanceDate),
      });
    }
  }

  const existingRows =
    await attendanceRepo.findAttendancesByEmployeeDates(
      companyId,
      resolvedPairs.map((p) => p.employeeDbId),
      resolvedPairs.map((p) => p.attendanceDate)
    );

  const existingKeys = new Set(
    existingRows.map(
      (a) => `${a.employeeId}|${dateKey(a.attendanceDate)}`
    )
  );

  const seenKeys = new Set<string>();
  const prepared: Prepared[] = [];
  const errors: AttendanceImportRowError[] = [];
  let duplicateCount = 0;

  for (const row of rows) {
    const codeKey = row.employeeId.trim().toLowerCase();
    const dateIso = row.attendanceDate;
    const dupKey = `${codeKey}|${dateIso}`;
    let rowFailed = false;

    if (seenKeys.has(dupKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "attendanceDate",
        message: "Duplicate employee and date within the import file.",
      });
      duplicateCount++;
      rowFailed = true;
    }

    const employee = byCode.get(codeKey);
    if (!employee) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "employeeId",
        message: "Employee not found in your organization.",
      });
      rowFailed = true;
    } else if (employee.status === "TERMINATED") {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "employeeId",
        message: "Cannot import attendance for a terminated employee.",
      });
      rowFailed = true;
    }

    if (rowFailed || !employee) {
      continue;
    }

    const attendanceDate = parseDateOnly(row.attendanceDate);
    const existingKey = `${employee.id}|${dateIso}`;
    if (existingKeys.has(existingKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "attendanceDate",
        message: "Attendance already exists for this employee and date.",
      });
      duplicateCount++;
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

  return { prepared, errors, duplicateCount };
}

export async function previewAttendanceImport(
  input: AttendanceImportBatchInput
): Promise<AttendanceImportPreviewResult> {
  const { companyId } = await getTenantPrisma();
  const parsed = attendanceImportBatchSchema.parse(input);

  if (parsed.rows.length > ATTENDANCE_IMPORT_MAX_ROWS) {
    throw new AppError(
      "VALIDATION",
      `Import is limited to ${ATTENDANCE_IMPORT_MAX_ROWS} rows.`
    );
  }

  const { prepared, errors, duplicateCount } =
    await validateAttendanceImportBatch(companyId, parsed.rows);

  const invalidRowNumbers = new Set(errors.map((e) => e.rowNumber));

  return {
    totalRows: parsed.rows.length,
    validCount: prepared.length,
    invalidCount: invalidRowNumbers.size,
    duplicateCount,
    canCommit: prepared.length > 0 && errors.length === 0,
    errors,
    validRowNumbers: prepared.map((p) => p.row.rowNumber),
  };
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

  const { prepared, errors } = await validateAttendanceImportBatch(
    companyId,
    parsed.rows
  );

  // All-or-nothing: any invalid row blocks the entire commit.
  if (errors.length > 0 || prepared.length === 0) {
    return {
      success: false,
      importedCount: 0,
      failedCount: errors.length || parsed.rows.length,
      skippedCount: errors.length || parsed.rows.length,
      totalRows: parsed.rows.length,
      errors:
        errors.length > 0
          ? errors
          : [
              {
                rowNumber: 0,
                message: "No valid rows to import.",
              },
            ],
      importedIds: [],
    };
  }

  if (prepared.length !== parsed.rows.length) {
    return {
      success: false,
      importedCount: 0,
      failedCount: errors.length,
      skippedCount: errors.length,
      totalRows: parsed.rows.length,
      errors,
      importedIds: [],
    };
  }

  const importedIds: string[] = [];

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
      "Failed to commit attendance import. No rows were imported."
    );
  }

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "ATTENDANCE_IMPORTED",
    entity: "Attendance",
    metadata: {
      source: "attendance_import",
      importedCount: importedIds.length,
      failedCount: 0,
      totalRows: parsed.rows.length,
      importedIds: importedIds.slice(0, 50),
    },
  });

  return {
    success: true,
    importedCount: importedIds.length,
    failedCount: 0,
    skippedCount: 0,
    totalRows: parsed.rows.length,
    errors: [],
    importedIds,
  };
}
