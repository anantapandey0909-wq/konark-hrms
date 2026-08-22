/**
 * Department import service — validates rows, enforces global departmentCode
 * uniqueness, creates departments for the authenticated tenant only (CREATE-ONLY).
 */

import type { DepartmentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as departmentImportRepo from "@/lib/repositories/department-import.repository";
import { writeAuditLog } from "@/lib/services/audit.service";
import {
  departmentImportBatchSchema,
  type DepartmentImportBatchInput,
  type DepartmentImportResult,
  type DepartmentImportRowError,
  type DepartmentImportRowInput,
  DEPARTMENT_IMPORT_MAX_ROWS,
} from "@/lib/validation/department-import";

export async function importDepartments(
  input: DepartmentImportBatchInput
): Promise<DepartmentImportResult> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = departmentImportBatchSchema.parse(input);

  if (parsed.rows.length > DEPARTMENT_IMPORT_MAX_ROWS) {
    throw new AppError(
      "VALIDATION",
      `Import is limited to ${DEPARTMENT_IMPORT_MAX_ROWS} rows.`
    );
  }

  const seenCodes = new Set<string>();
  const errors: DepartmentImportRowError[] = [];

  type Prepared = {
    row: DepartmentImportRowInput;
  };

  const prepared: Prepared[] = [];

  for (const row of parsed.rows) {
    const codeKey = row.departmentCode.trim().toLowerCase();

    if (seenCodes.has(codeKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        departmentCode: row.departmentCode,
        field: "departmentCode",
        message: "Duplicate department code within the import file.",
      });
      continue;
    }

    // Schema: departmentCode is globally unique
    const existingGlobal =
      await departmentImportRepo.findDepartmentByCodeGlobal(
        row.departmentCode
      );
    if (existingGlobal) {
      errors.push({
        rowNumber: row.rowNumber,
        departmentCode: row.departmentCode,
        field: "departmentCode",
        message: "Department code already exists.",
      });
      continue;
    }

    const existingInCompany =
      await departmentImportRepo.findDepartmentByCodeInCompany(
        companyId,
        row.departmentCode
      );
    if (existingInCompany) {
      errors.push({
        rowNumber: row.rowNumber,
        departmentCode: row.departmentCode,
        field: "departmentCode",
        message: "Department code already exists in your organization.",
      });
      continue;
    }

    seenCodes.add(codeKey);
    prepared.push({ row });
  }

  const importedIds: string[] = [];

  if (prepared.length > 0) {
    try {
      await prisma.$transaction(async (tx) => {
        for (const item of prepared) {
          const desc =
            item.row.description && String(item.row.description).trim()
              ? String(item.row.description).trim()
              : null;

          const created = await departmentImportRepo.createDepartmentInTx(tx, {
            departmentCode: item.row.departmentCode,
            departmentName: item.row.departmentName,
            description: desc,
            status: item.row.status as DepartmentStatus,
            companyId,
          });
          importedIds.push(created.id);
        }
      });
    } catch (err) {
      console.error("[department-import] transaction failed", err);
      const isUnique =
        err instanceof Error &&
        (err.message.includes("Unique") || err.message.includes("unique"));
      throw new AppError(
        isUnique ? "CONFLICT" : "INTERNAL",
        isUnique
          ? "A department code in this batch already exists."
          : "Failed to commit department records. Please try again."
      );
    }

    for (let i = 0; i < prepared.length; i++) {
      const item = prepared[i];
      const id = importedIds[i];
      if (!id) continue;
      await writeAuditLog({
        companyId,
        actorId: user.id,
        action: "DEPARTMENT_CREATED",
        entity: "Department",
        entityId: id,
        metadata: {
          source: "csv_import",
          code: item.row.departmentCode,
          name: item.row.departmentName,
        },
      });
    }
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
