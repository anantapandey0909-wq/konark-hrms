/**
 * Leave import service — preview (read-only) and transactional commit.
 *
 * Rules:
 * - companyId from getTenantPrisma() only
 * - LeaveType is a Prisma enum (not a tenant table)
 * - Imported rows are always status PENDING
 * - totalDays from existing calculateLeaveDays (ignores CSV totalDays for storage)
 * - Soft balance check matches createLeaveRequest (hard check remains on approve)
 * - Preview never mutates
 * - Commit is all-or-nothing: any invalid row blocks the entire import
 */

import type { LeaveType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as leaveImportRepo from "@/lib/repositories/leave-import.repository";
import {
  balanceFieldForLeaveType,
  calculateLeaveDays,
} from "@/lib/mappers/leave.mapper";
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
  const years = Array.from(
    new Set(
      rows.map((r) => parseDateOnly(r.startDate).getUTCFullYear())
    )
  );

  const [existingLeaves, ...balanceGroups] = await Promise.all([
    leaveImportRepo.findActiveLeavesForEmployees(companyId, employeeIds),
    ...years.map((year) =>
      leaveImportRepo.findLeaveBalancesForEmployees(companyId, employeeIds, year)
    ),
  ]);

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

  // Key: employeeId|year → balance fields
  const balanceByKey = new Map<
    string,
    {
      casualLeave: number;
      sickLeave: number;
      earnedLeave: number;
      maternityLeave: number;
      paternityLeave: number;
      compOff: number;
    }
  >();
  for (const group of balanceGroups) {
    for (const b of group) {
      balanceByKey.set(b.employeeId + "|" + b.year, {
        casualLeave: b.casualLeave,
        sickLeave: b.sickLeave,
        earnedLeave: b.earnedLeave,
        maternityLeave: b.maternityLeave,
        paternityLeave: b.paternityLeave,
        compOff: b.compOff,
      });
    }
  }

  // Track cumulative days requested in this file per employee|year|balanceField
  const batchDemand = new Map<string, number>();

  const seenKeys = new Set<string>();
  const errors: LeaveImportRowError[] = [];
  const prepared: Prepared[] = [];
  let duplicateCount = 0;

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
    const year = startDate.getUTCFullYear();
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
    } else if (employee.status === "TERMINATED") {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "employeeId",
        message: "Cannot import leave for a terminated employee.",
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

    // Soft balance check (same rule as createLeaveRequest — hard check on approve).
    // Missing balance rows are treated as unlimited for import preview (create path
    // also only fails when a balance row exists and is insufficient).
    const field = balanceFieldForLeaveType(leaveType);
    if (field) {
      const balKey = employee.id + "|" + year;
      const balance = balanceByKey.get(balKey);
      if (balance) {
        const available = balance[field];
        const demandKey = balKey + "|" + field;
        const priorDemand = batchDemand.get(demandKey) ?? 0;
        if (available < priorDemand + totalDays) {
          errors.push({
            rowNumber: row.rowNumber,
            employeeId: row.employeeId,
            message: "Insufficient leave balance for this request.",
          });
          continue;
        }
        batchDemand.set(demandKey, priorDemand + totalDays);
      }
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
    action: "LEAVE_IMPORT_COMPLETED",
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
