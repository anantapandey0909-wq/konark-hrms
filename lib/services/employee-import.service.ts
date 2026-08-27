/**
 * Employee import service — preview (read-only) and transactional commit.
 *
 * Rules:
 * - companyId from getTenantPrisma() only
 * - Preview never mutates
 * - Commit is all-or-nothing: any invalid row blocks the entire import
 * - User + Employee created with the same pattern as createEmployee()
 * - Temporary passwords are never returned to the client
 */

import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as importRepo from "@/lib/repositories/employee-import.repository";
import {
  toPrismaEmployeeStatus,
  toPrismaEmploymentType,
} from "@/lib/mappers/employee.mapper";
import { writeAuditLog } from "@/lib/services/audit.service";
import { hashPassword } from "@/lib/auth/password";
import {
  employeeImportBatchSchema,
  type EmployeeImportBatchInput,
  type EmployeeImportPreviewResult,
  type EmployeeImportResult,
  type EmployeeImportRowError,
  type EmployeeImportRowInput,
  EMPLOYEE_IMPORT_MAX_ROWS,
} from "@/lib/validation/employee-import";

type PreparedRow = {
  row: EmployeeImportRowInput;
  departmentId: string;
  email: string;
  codeKey: string;
  emailKey: string;
};

async function validateImportBatch(
  companyId: string,
  rows: EmployeeImportRowInput[]
): Promise<{
  prepared: PreparedRow[];
  errors: EmployeeImportRowError[];
  duplicateCount: number;
}> {
  const departments = await importRepo.listCompanyDepartmentsForImport(
    companyId
  );
  const deptByKey = new Map<string, string>();
  for (const d of departments) {
    deptByKey.set(d.departmentCode.toLowerCase(), d.id);
    deptByKey.set(d.departmentName.toLowerCase(), d.id);
  }

  const codes = rows.map((r) => r.employeeId.trim());
  const emails = rows.map((r) => r.email.trim().toLowerCase());

  const [existingByCode, existingByEmail, existingUsers] = await Promise.all([
    importRepo.findEmployeesByCodes(companyId, codes),
    importRepo.findEmployeesByEmails(companyId, emails),
    importRepo.findUsersByEmails(emails),
  ]);

  const dbCodes = new Set(
    existingByCode.map((e) => e.employeeCode.trim().toLowerCase())
  );
  const dbEmails = new Set(
    existingByEmail.map((e) => e.email.trim().toLowerCase())
  );
  for (const u of existingUsers) {
    dbEmails.add(u.email.trim().toLowerCase());
  }

  const seenCodes = new Set<string>();
  const seenEmails = new Set<string>();
  const errors: EmployeeImportRowError[] = [];
  const prepared: PreparedRow[] = [];
  let duplicateCount = 0;

  for (const row of rows) {
    const codeKey = row.employeeId.trim().toLowerCase();
    const emailKey = row.email.trim().toLowerCase();
    let rowFailed = false;

    if (seenCodes.has(codeKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "employeeId",
        message: "Duplicate employee ID within the import file.",
      });
      duplicateCount++;
      rowFailed = true;
    }
    if (seenEmails.has(emailKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "email",
        message: "Duplicate email within the import file.",
      });
      duplicateCount++;
      rowFailed = true;
    }

    if (dbCodes.has(codeKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "employeeId",
        message: "Employee ID already exists.",
      });
      duplicateCount++;
      rowFailed = true;
    }
    if (dbEmails.has(emailKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "email",
        message: "Email is already in use.",
      });
      duplicateCount++;
      rowFailed = true;
    }

    const departmentId = deptByKey.get(row.department.trim().toLowerCase());
    if (!departmentId) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "department",
        message:
          'Department "' +
          row.department +
          '" was not found in your organization.',
      });
      rowFailed = true;
    }

    if (rowFailed || !departmentId) {
      continue;
    }

    seenCodes.add(codeKey);
    seenEmails.add(emailKey);
    prepared.push({
      row,
      departmentId,
      email: emailKey,
      codeKey,
      emailKey,
    });
  }

  return { prepared, errors, duplicateCount };
}

export async function previewEmployeeImport(
  input: EmployeeImportBatchInput
): Promise<EmployeeImportPreviewResult> {
  const { companyId } = await getTenantPrisma();
  const parsed = employeeImportBatchSchema.parse(input);

  if (parsed.rows.length > EMPLOYEE_IMPORT_MAX_ROWS) {
    throw new AppError(
      "VALIDATION",
      "Import is limited to " + EMPLOYEE_IMPORT_MAX_ROWS + " rows."
    );
  }

  const { prepared, errors, duplicateCount } = await validateImportBatch(
    companyId,
    parsed.rows
  );

  return {
    totalRows: parsed.rows.length,
    validCount: prepared.length,
    invalidCount: errors.length > 0 ? parsed.rows.length - prepared.length : 0,
    duplicateCount,
    canCommit: prepared.length > 0 && errors.length === 0,
    errors,
    validRowNumbers: prepared.map((p) => p.row.rowNumber),
  };
}

export async function importEmployees(
  input: EmployeeImportBatchInput
): Promise<EmployeeImportResult> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = employeeImportBatchSchema.parse(input);

  if (parsed.rows.length > EMPLOYEE_IMPORT_MAX_ROWS) {
    throw new AppError(
      "VALIDATION",
      "Import is limited to " + EMPLOYEE_IMPORT_MAX_ROWS + " rows."
    );
  }

  const { prepared, errors } = await validateImportBatch(
    companyId,
    parsed.rows
  );

  // All-or-nothing: any invalid row blocks the entire commit.
  if (errors.length > 0 || prepared.length === 0) {
    return {
      success: false,
      importedCount: 0,
      failedCount: errors.length || parsed.rows.length,
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
      importedEmployeeIds: [],
    };
  }

  if (prepared.length !== parsed.rows.length) {
    return {
      success: false,
      importedCount: 0,
      failedCount: errors.length,
      totalRows: parsed.rows.length,
      errors,
      importedEmployeeIds: [],
    };
  }

  const role = await prisma.role.findFirst({
    where: { roleName: "EMPLOYEE" },
  });
  if (!role) {
    throw new AppError("INTERNAL", "Default employee role is not configured.");
  }

  // Hash outside the transaction to keep the DB lock window short.
  const passwordHashes = await Promise.all(
    prepared.map((p) =>
      hashPassword("Temp!" + p.row.employeeId.slice(0, 8) + "9a")
    )
  );

  const importedEmployeeIds: string[] = [];
  const importedCodes: string[] = [];

  try {
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < prepared.length; i++) {
        const item = prepared[i];
        const tempPassword = passwordHashes[i];
        const userCode = ("USER-" + item.row.employeeId)
          .replace(/[^A-Za-z0-9-]/g, "-")
          .slice(0, 40);

        const dbUser = await tx.user.create({
          data: {
            userCode,
            email: item.email,
            password: tempPassword,
            companyId,
            roleId: role.id,
            accountStatus: "ACTIVE",
            isEmailVerified: false,
          },
        });

        const created = await tx.employee.create({
          data: {
            employeeCode: item.row.employeeId,
            firstName: item.row.firstName,
            lastName: item.row.lastName,
            email: item.email,
            phone: item.row.phone?.trim() || "",
            gender: "OTHER",
            dateOfBirth: new Date("1990-01-01"),
            designation: item.row.designation,
            employmentType: toPrismaEmploymentType(item.row.employmentType),
            status: toPrismaEmployeeStatus(item.row.status),
            joiningDate: new Date(item.row.joiningDate),
            companyId,
            departmentId: item.departmentId,
            userId: dbUser.id,
          },
        });

        importedEmployeeIds.push(created.id);
        importedCodes.push(created.employeeCode);
      }
    });
  } catch (err) {
    console.error("[employee-import] transaction failed", err);
    const isUnique =
      err instanceof Error &&
      (err.message.includes("Unique") || err.message.includes("unique"));
    throw new AppError(
      isUnique ? "CONFLICT" : "INTERNAL",
      isUnique
        ? "A conflict occurred with an existing employee or user. No rows were imported."
        : "Failed to commit employee import. No rows were imported."
    );
  }

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "EMPLOYEES_IMPORTED",
    entity: "Employee",
    metadata: {
      source: "employee_import",
      importedCount: importedEmployeeIds.length,
      totalRows: parsed.rows.length,
      employeeCodes: importedCodes.slice(0, 50),
    },
  });

  return {
    success: true,
    importedCount: importedEmployeeIds.length,
    failedCount: 0,
    totalRows: parsed.rows.length,
    errors: [],
    importedEmployeeIds,
  };
}
