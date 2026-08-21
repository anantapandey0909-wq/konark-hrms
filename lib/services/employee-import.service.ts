/**
 * Employee import service — validates structured rows and creates employees
 * for the authenticated tenant. Reuses the same business rules as createEmployee
 * (User + Employee, uniqueness, department ownership).
 */

import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as employeeRepo from "@/lib/repositories/employee.repository";
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
  type EmployeeImportResult,
  type EmployeeImportRowError,
  type EmployeeImportRowInput,
  EMPLOYEE_IMPORT_MAX_ROWS,
} from "@/lib/validation/employee-import";

async function createOneImportedEmployee(
  companyId: string,
  roleId: string,
  row: EmployeeImportRowInput,
  departmentId: string
) {
  const email = row.email.toLowerCase();
  const tempPassword = await hashPassword(
    `Temp!${row.employeeId.slice(0, 8)}9a`
  );
  const userCode = `USER-${row.employeeId}`
    .replace(/[^A-Za-z0-9-]/g, "-")
    .slice(0, 40);

  return prisma.$transaction(async (tx) => {
    const dbUser = await tx.user.create({
      data: {
        userCode,
        email,
        password: tempPassword,
        companyId,
        roleId,
        accountStatus: "ACTIVE",
        isEmailVerified: false,
      },
    });

    return tx.employee.create({
      data: {
        employeeCode: row.employeeId,
        firstName: row.firstName,
        lastName: row.lastName,
        email,
        phone: row.phone?.trim() || "",
        gender: "OTHER",
        dateOfBirth: new Date("1990-01-01"),
        designation: row.designation,
        employmentType: toPrismaEmploymentType(row.employmentType),
        status: toPrismaEmployeeStatus(row.status),
        joiningDate: new Date(row.joiningDate),
        companyId,
        departmentId,
        userId: dbUser.id,
      },
    });
  });
}

export async function importEmployees(
  input: EmployeeImportBatchInput
): Promise<EmployeeImportResult> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = employeeImportBatchSchema.parse(input);

  if (parsed.rows.length > EMPLOYEE_IMPORT_MAX_ROWS) {
    throw new AppError(
      "VALIDATION",
      `Import is limited to ${EMPLOYEE_IMPORT_MAX_ROWS} rows.`
    );
  }

  const role = await prisma.role.findFirst({
    where: { roleName: "EMPLOYEE" },
  });
  if (!role) {
    throw new AppError("INTERNAL", "Default employee role is not configured.");
  }

  const departments = await importRepo.listCompanyDepartmentsForImport(
    companyId
  );
  const deptByKey = new Map<string, string>();
  for (const d of departments) {
    deptByKey.set(d.departmentCode.toLowerCase(), d.id);
    deptByKey.set(d.departmentName.toLowerCase(), d.id);
  }

  // Track codes/emails within this batch to reject intra-file duplicates
  const seenCodes = new Set<string>();
  const seenEmails = new Set<string>();

  const errors: EmployeeImportRowError[] = [];
  const importedEmployeeIds: string[] = [];
  let importedCount = 0;

  for (const row of parsed.rows) {
    const codeKey = row.employeeId.trim().toLowerCase();
    const emailKey = row.email.trim().toLowerCase();

    if (seenCodes.has(codeKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "employeeId",
        message: "Duplicate employee ID within the import file.",
      });
      continue;
    }
    if (seenEmails.has(emailKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "email",
        message: "Duplicate email within the import file.",
      });
      continue;
    }

    const departmentId = deptByKey.get(row.department.trim().toLowerCase());
    if (!departmentId) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "department",
        message: `Department "${row.department}" was not found in your organization.`,
      });
      continue;
    }

    const [byCode, byEmail, globalEmail] = await Promise.all([
      employeeRepo.findEmployeeByCode(companyId, row.employeeId),
      employeeRepo.findEmployeeByEmail(companyId, emailKey),
      prisma.user.findFirst({
        where: { email: { equals: emailKey, mode: "insensitive" } },
      }),
    ]);

    if (byCode) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "employeeId",
        message: "Employee ID already exists.",
      });
      continue;
    }
    if (byEmail || globalEmail) {
      errors.push({
        rowNumber: row.rowNumber,
        field: "email",
        message: "Email is already in use.",
      });
      continue;
    }

    try {
      const created = await createOneImportedEmployee(
        companyId,
        role.id,
        row,
        departmentId
      );
      seenCodes.add(codeKey);
      seenEmails.add(emailKey);
      importedCount++;
      importedEmployeeIds.push(created.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create employee.";
      errors.push({
        rowNumber: row.rowNumber,
        message: message.includes("Unique")
          ? "Conflict with an existing employee or user."
          : "Failed to create employee.",
      });
    }
  }

  if (importedCount > 0) {
    await writeAuditLog({
      companyId,
      actorId: user.id,
      action: "EMPLOYEE_IMPORTED",
      entity: "Employee",
      metadata: {
        importedCount,
        failedCount: errors.length,
        totalRows: parsed.rows.length,
        importedEmployeeIds,
      },
    });
  }

  return {
    success: importedCount > 0 && errors.length === 0,
    importedCount,
    failedCount: errors.length,
    totalRows: parsed.rows.length,
    errors,
    importedEmployeeIds,
  };
}
