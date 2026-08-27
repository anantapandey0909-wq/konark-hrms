/**
 * Leave import service — preview (read-only) and transactional commit.
 *
 * Rules:
 * - companyId from getTenantPrisma() only
 * - LeaveType is a Prisma enum (not a tenant table)
 * - Imported rows are always status PENDING
 * - totalDays from existing calculateLeaveDays (ignores CSV totalDays for storage)
 * - Preview never mutates
 * - Commit is all-or-nothing: any invalid row blocks the entire import
 */

import type { LeaveType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as leaveImportRepo from "@/lib/repositories/leave-import.repository";
import { calculateLeaveDays } from "@/lib/mappers/leave.mapper";
import { writeAuditLog } from "@/lib/services/audit.service";
import {
  leaveImportBatchSchema,
  type LeaveImportBatchInput,
  type LeaveImportPreviewResult,
  type LeaveImportResult,
  type LeaveImportRowError,
  type LeaveImportRowInput,
  LEAVE_IMPORT_MAX_ROWS,
} from "@/lib/validation/leave-import";

function parseDateOnly(isoDate: string): Date {
  return new Date(isoDate + "T00:00:00.000Z");
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

type Prepared = {
  row: LeaveImportRowInput;
  employeeDbId: string;
  startDate: Date;
  endDate: Date;
  appliedOn: Date;
  totalDays: number;
  leaveType: LeaveType;
};

function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart.getTime() <= bEnd.getTime() && aEnd.getTime() >= bStart.getTime();
}

async function validateLeaveImportBatch(
  companyId: string,
  rows: LeaveImportRowInput[]
): Promise<{
  prepared: Prepared[];
  errors: LeaveImportRowError[];
  duplicateCount: number;
}> {
  const codes = rows.map((r) => r.employeeId.trim());
  const employees = await leaveImportRepo.findEmployeesByCodesForImport(
    companyId,
    codes
  );
  const byCode = new Map(
    employees.map((e) => [e.employeeCode.toLowerCase(), e])
  );

  const employeeIds = employees.map((e) => e.id);
  const existingLeaves =
    await leaveImportRepo.findActiveLeavesForEmployees(companyId, employeeIds);

  // Group existing leaves by employee for in-memory checks
  const leavesByEmployee = new Map<
    string,
    {
      leaveType: string;
      startDate: Date;
      endDate: Date;
    }[]
  >();
  for (const leave of existingLeaves) {
    const list = leavesByEmployee.get(leave.employeeId) ?? [];
    list.push({
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
    });
    leavesByEmployee.set(leave.employeeId, list);
  }

  const seenKeys = new Set<string>();
  const errors: LeaveImportRowError[] = [];
  const prepared: Prepared[] = [];
  let duplicateCount = 0;

  // Track ranges already accepted in this batch (for intra-file overlap)
  const batchRanges: {
    employeeDbId: string;
    leaveType: string;
    startDate: Date;
    endDate: Date;
  }[] = [];

  for (const row of rows) {
    const codeKey = row.employeeId.trim().toLowerCase();
    const leaveType = row.leaveType as LeaveType;
    const startDate = parseDateOnly(row.startDate);
    const endDate = parseDateOnly(row.endDate);
    const appliedOn = parseDateOnly(row.appliedOn);
    const dupKey =
      codeKey +
      "|" +
      leaveType +
      "|" +
      row.startDate +
      "|" +
      row.endDate;

    let rowFailed = false;

    if (seenKeys.has(dupKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        message: "Duplicate leave row within the import file.",
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
        message: "Employee not found in current organization.",
      });
      rowFailed = true;
    }

    if (endDate < startDate) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "endDate",
        message: "End date cannot be before start date.",
      });
      rowFailed = true;
    }

    if (rowFailed || !employee) {
      continue;
    }

    const totalDays = calculateLeaveDays(
      startDate,
      endDate,
      leaveType,
      leaveType === "HALF_DAY"
    );

    // Optional CSV totalDays is informational only; system calculation wins.
    // (No hard failure if CSV days differ — avoids timezone/format friction.)

    const existing = leavesByEmployee.get(employee.id) ?? [];
    const exactDup = existing.some(
      (l) =>
        l.leaveType === leaveType &&
        dateKey(l.startDate) === row.startDate &&
        dateKey(l.endDate) === row.endDate
    );
    if (exactDup) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        message:
          "A leave request already exists for this employee, type, and date range.",
      });
      duplicateCount++;
      continue;
    }

    const dbOverlap = existing.some((l) =>
      rangesOverlap(startDate, endDate, l.startDate, l.endDate)
    );
    if (dbOverlap) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        message:
          "This request overlaps an existing pending or approved leave.",
      });
      continue;
    }

    const fileOverlap = batchRanges.some(
      (b) =>
        b.employeeDbId === employee.id &&
        rangesOverlap(startDate, endDate, b.startDate, b.endDate)
    );
    if (fileOverlap) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        message:
          "This request overlaps another leave row for the same employee in the import file.",
      });
      continue;
    }

    seenKeys.add(dupKey);
    batchRanges.push({
      employeeDbId: employee.id,
      leaveType,
      startDate,
      endDate,
    });
    prepared.push({
      row,
      employeeDbId: employee.id,
      startDate,
      endDate,
      appliedOn,
      totalDays,
      leaveType,
    });
  }

  return { prepared, errors, duplicateCount };
}

export async function previewLeaveImport(
  input: LeaveImportBatchInput
): Promise<LeaveImportPreviewResult> {
  const { companyId } = await getTenantPrisma();
  const parsed = leaveImportBatchSchema.parse(input);

  if (parsed.rows.length > LEAVE_IMPORT_MAX_ROWS) {
    throw new AppError(
      "VALIDATION",
      "Import is limited to " + LEAVE_IMPORT_MAX_ROWS + " rows."
    );
  }

  const { prepared, errors, duplicateCount } = await validateLeaveImportBatch(
    companyId,
    parsed.rows
  );

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

export async function importLeaveRequests(
  input: LeaveImportBatchInput
): Promise<LeaveImportResult> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = leaveImportBatchSchema.parse(input);

  if (parsed.rows.length > LEAVE_IMPORT_MAX_ROWS) {
    throw new AppError(
      "VALIDATION",
      "Import is limited to " + LEAVE_IMPORT_MAX_ROWS + " rows."
    );
  }

  const { prepared, errors } = await validateLeaveImportBatch(
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
        const created = await leaveImportRepo.createLeaveRequestInTx(tx, {
          leaveType: item.leaveType,
          startDate: item.startDate,
          endDate: item.endDate,
          totalDays: item.totalDays,
          reason: item.row.reason,
          appliedOn: item.appliedOn,
          companyId,
          employeeId: item.employeeDbId,
        });
        importedIds.push(created.id);
      }
    });
  } catch (err) {
    console.error("[leave-import] transaction failed", err);
    throw new AppError(
      "INTERNAL",
      "Failed to commit leave import. No rows were imported."
    );
  }

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "LEAVES_IMPORTED",
    entity: "LeaveRequest",
    metadata: {
      source: "leave_import",
      importedCount: importedIds.length,
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
