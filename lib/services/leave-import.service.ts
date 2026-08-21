/**
 * Leave import service — validates rows, resolves employee codes within the
 * authenticated tenant, calculates totalDays via existing calculateLeaveDays,
 * detects duplicates/overlaps, and creates PENDING LeaveRequest records.
 */

import type { LeaveType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as employeeRepo from "@/lib/repositories/employee.repository";
import * as leaveImportRepo from "@/lib/repositories/leave-import.repository";
import { calculateLeaveDays } from "@/lib/mappers/leave.mapper";
import { writeAuditLog } from "@/lib/services/audit.service";
import {
  leaveImportBatchSchema,
  type LeaveImportBatchInput,
  type LeaveImportResult,
  type LeaveImportRowError,
  type LeaveImportRowInput,
  LEAVE_IMPORT_MAX_ROWS,
} from "@/lib/validation/leave-import";

function parseDateOnly(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

export async function importLeaveRequests(
  input: LeaveImportBatchInput
): Promise<LeaveImportResult> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = leaveImportBatchSchema.parse(input);

  if (parsed.rows.length > LEAVE_IMPORT_MAX_ROWS) {
    throw new AppError(
      "VALIDATION",
      `Import is limited to ${LEAVE_IMPORT_MAX_ROWS} rows.`
    );
  }

  const companyEmployees = await employeeRepo.findEmployeesByCompany(companyId);
  const byCode = new Map(
    companyEmployees.map((e) => [e.employeeCode.toLowerCase(), e])
  );

  const seenKeys = new Set<string>();
  const errors: LeaveImportRowError[] = [];

  type Prepared = {
    row: LeaveImportRowInput;
    employeeDbId: string;
    startDate: Date;
    endDate: Date;
    appliedOn: Date;
    totalDays: number;
    leaveType: LeaveType;
  };

  const prepared: Prepared[] = [];

  for (const row of parsed.rows) {
    const codeKey = row.employeeId.trim().toLowerCase();
    const dupKey = `${codeKey}|${row.leaveType}|${row.startDate}|${row.endDate}`;

    if (seenKeys.has(dupKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        message: "Duplicate leave row within the import file.",
      });
      continue;
    }

    const employee = byCode.get(codeKey);
    if (!employee) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "employeeId",
        message: "Employee not found in current organization.",
      });
      continue;
    }

    const startDate = parseDateOnly(row.startDate);
    const endDate = parseDateOnly(row.endDate);
    const appliedOn = parseDateOnly(row.appliedOn);

    if (endDate < startDate) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "endDate",
        message: "End date cannot be before start date.",
      });
      continue;
    }

    const leaveType = row.leaveType as LeaveType;
    const totalDays = calculateLeaveDays(
      startDate,
      endDate,
      leaveType,
      leaveType === "HALF_DAY"
    );

    // Exact duplicate (same employee, type, start, end)
    const exactDup = await leaveImportRepo.findDuplicateLeaveRequests(
      companyId,
      employee.id,
      leaveType,
      startDate,
      endDate
    );
    if (exactDup.length > 0) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        message:
          "A leave request already exists for this employee, type, and date range.",
      });
      continue;
    }

    // Overlapping pending/approved leave (same rule as leave.service)
    const overlaps = await leaveImportRepo.findOverlappingForImport(
      companyId,
      employee.id,
      startDate,
      endDate
    );
    if (overlaps.length > 0) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        message:
          "This request overlaps an existing pending or approved leave.",
      });
      continue;
    }

    seenKeys.add(dupKey);
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

  const importedIds: string[] = [];

  if (prepared.length > 0) {
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
        "Failed to commit leave records. Please try again."
      );
    }

    await writeAuditLog({
      companyId,
      actorId: user.id,
      action: "LEAVE_IMPORTED",
      entity: "LeaveRequest",
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
