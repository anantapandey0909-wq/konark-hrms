/**
 * Department import service — preview (read-only) and transactional commit.
 *
 * Rules:
 * - companyId from getTenantPrisma() only
 * - Preview never mutates
 * - Commit is all-or-nothing: any invalid row blocks the entire import
 * - departmentCode is globally unique (Prisma schema)
 * - Create-only
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
  type DepartmentImportPreviewResult,
  type DepartmentImportResult,
  type DepartmentImportRowError,
  type DepartmentImportRowInput,
  DEPARTMENT_IMPORT_MAX_ROWS,
} from "@/lib/validation/department-import";

type Prepared = {
  row: DepartmentImportRowInput;
};

async function validateDepartmentImportBatch(
  companyId: string,
  rows: DepartmentImportRowInput[]
): Promise<{
  prepared: Prepared[];
  errors: DepartmentImportRowError[];
  duplicateCount: number;
}> {
  const codes = rows.map((r) => r.departmentCode.trim());

  const [existingGlobal, existingInCompany] = await Promise.all([
    departmentImportRepo.findDepartmentsByCodesGlobal(codes),
    departmentImportRepo.findDepartmentsByCodesInCompany(companyId, codes),
  ]);

  const globalByCode = new Map(
    existingGlobal.map((d) => [d.departmentCode.toLowerCase(), d])
  );
  const companyByCode = new Map(
    existingInCompany.map((d) => [d.departmentCode.toLowerCase(), d])
  );

  const seenCodes = new Set<string>();
  const prepared: Prepared[] = [];
  const errors: DepartmentImportRowError[] = [];
  let duplicateCount = 0;

  for (const row of rows) {
    const codeKey = row.departmentCode.trim().toLowerCase();
    let rowFailed = false;

    if (seenCodes.has(codeKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        departmentCode: row.departmentCode,
        field: "departmentCode",
        message: "Duplicate department code within the import file.",
      });
      duplicateCount++;
      rowFailed = true;
    }

    if (globalByCode.has(codeKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        departmentCode: row.departmentCode,
        field: "departmentCode",
        message: "Department code already exists.",
      });
      duplicateCount++;
      rowFailed = true;
    } else if (companyByCode.has(codeKey)) {
      // Defense in depth if global unique were ever relaxed.
      errors.push({
        rowNumber: row.rowNumber,
        departmentCode: row.departmentCode,
        field: "departmentCode",
        message: "Department code already exists in your organization.",
      });
      duplicateCount++;
      rowFailed = true;
    }

    if (rowFailed) {
      continue;
    }

    seenCodes.add(codeKey);
    prepared.push({ row });
  }

  return { prepared, errors, duplicateCount };
}

export async function previewDepartmentImport(
  input: DepartmentImportBatchInput
): Promise<DepartmentImportPreviewResult> {
  // Auth + tenant required even for read-only preview.
  const { companyId } = await getTenantPrisma();
  const parsed = departmentImportBatchSchema.parse(input);

  if (parsed.rows.length > DEPARTMENT_IMPORT_MAX_ROWS) {
    throw new AppError(
      "VALIDATION",
      `Import is limited to ${DEPARTMENT_IMPORT_MAX_ROWS} rows.`
    );
  }

  const { prepared, errors, duplicateCount } =
    await validateDepartmentImportBatch(companyId, parsed.rows);

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

  const { prepared, errors } = await validateDepartmentImportBatch(
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
        ? "A department code in this batch already exists. No rows were imported."
        : "Failed to commit department import. No rows were imported."
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
