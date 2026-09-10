/**
 * Employee service — business rules, validation coordination, tenant checks.
 */

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as employeeRepo from "@/lib/repositories/employee.repository";
import * as departmentRepo from "@/lib/repositories/department.repository";
import {
  mapEmployeeToFrontend,
  toPrismaEmployeeStatus,
  toPrismaEmploymentType,
} from "@/lib/mappers/employee.mapper";
import { writeAuditLog } from "@/lib/services/audit.service";
import { hashPassword } from "@/lib/auth/password";
import type { Employee } from "@/types/employee";

const createEmployeeSchema = z.object({
  firstName: z.string().trim().min(2).max(100),
  lastName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional().or(z.literal("")),
  departmentId: z.string().min(1),
  managerId: z.string().nullable().optional(),
  designation: z.string().trim().min(1).max(120),
  status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"]),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]),
  joiningDate: z.string().min(1),
  employeeId: z.string().trim().min(1).max(50),
});

const updateEmployeeSchema = createEmployeeSchema.partial();

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

export type EmployeeListResult = {
  items: Employee[];
  total: number;
  page: number;
  pageSize: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 5;
/** Upper bound for untrusted client pageSize (directory default remains 5). */
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

/** Manager must exist in-tenant and be ACTIVE. */
async function assertActiveManager(
  companyId: string,
  managerId: string,
  excludeEmployeeId?: string
) {
  if (excludeEmployeeId && managerId === excludeEmployeeId) {
    throw new AppError("VALIDATION", "Employee cannot manage themselves.");
  }
  const manager = await employeeRepo.findEmployeeById(companyId, managerId);
  if (!manager) {
    throw new AppError(
      "VALIDATION",
      "Manager not found in your organization."
    );
  }
  if (manager.status !== "ACTIVE") {
    throw new AppError(
      "VALIDATION",
      "Manager must be an active employee."
    );
  }
  return manager;
}

export async function listEmployees(filters?: {
  search?: string;
  departmentId?: string;
  status?: string;
  employmentType?: string;
  page?: number;
  pageSize?: number;
}): Promise<EmployeeListResult> {
  const { companyId } = await getTenantPrisma();

  const page = clampPage(filters?.page);
  const pageSize = clampPageSize(filters?.pageSize);

  const repoFilters = {
    search: filters?.search,
    departmentId: filters?.departmentId,
    status: filters?.status,
    employmentType: filters?.employmentType,
  };
  if (repoFilters.status === "INACTIVE") {
    repoFilters.status = "RESIGNED";
  }

  const { items, total } = await employeeRepo.findEmployeesByCompany(
    companyId,
    repoFilters,
    { page, pageSize }
  );

  return {
    items: items.map(mapEmployeeToFrontend),
    total,
    page,
    pageSize,
  };
}

export async function getEmployee(id: string): Promise<Employee> {
  const { companyId } = await getTenantPrisma();
  const row = await employeeRepo.findEmployeeById(companyId, id);
  if (!row) {
    throw new AppError("NOT_FOUND", "Employee not found.", 404);
  }
  return mapEmployeeToFrontend(row);
}

export async function createEmployee(
  input: CreateEmployeeInput
): Promise<Employee> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = createEmployeeSchema.parse(input);

  const email = parsed.email.toLowerCase();

  const dept = await departmentRepo.findDepartmentById(
    companyId,
    parsed.departmentId
  );
  if (!dept) {
    throw new AppError(
      "VALIDATION",
      "Department not found in your organization."
    );
  }

  if (parsed.managerId) {
    await assertActiveManager(companyId, parsed.managerId);
  }

  const [byCode, byEmail, globalEmail] = await Promise.all([
    employeeRepo.findEmployeeByCode(companyId, parsed.employeeId),
    employeeRepo.findEmployeeByEmail(companyId, email),
    prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    }),
  ]);

  if (byCode) {
    throw new AppError("CONFLICT", "Employee ID already exists.");
  }
  if (byEmail || globalEmail) {
    throw new AppError("CONFLICT", "Email is already in use.");
  }

  const role = await prisma.role.findFirst({
    where: { roleName: "EMPLOYEE" },
  });
  if (!role) {
    throw new AppError("INTERNAL", "Default employee role is not configured.");
  }

  // Temporary password — user should reset; never returned to client
  const tempPassword = await hashPassword(
    `Temp!${parsed.employeeId.slice(0, 8)}9a`
  );

  const userCode = `USER-${parsed.employeeId}`
    .replace(/[^A-Za-z0-9-]/g, "-")
    .slice(0, 40);

  const created = await prisma.$transaction(async (tx) => {
    const dbUser = await tx.user.create({
      data: {
        userCode,
        email,
        password: tempPassword,
        companyId,
        roleId: role.id,
        accountStatus: "ACTIVE",
        isEmailVerified: false,
      },
    });

    return tx.employee.create({
      data: {
        employeeCode: parsed.employeeId,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email,
        phone: parsed.phone?.trim() || "",
        gender: "OTHER",
        dateOfBirth: new Date("1990-01-01"),
        profileImage:
          parsed.avatarUrl && parsed.avatarUrl.length > 0
            ? parsed.avatarUrl
            : null,
        designation: parsed.designation,
        employmentType: toPrismaEmploymentType(parsed.employmentType),
        status: toPrismaEmployeeStatus(parsed.status),
        joiningDate: new Date(parsed.joiningDate),
        companyId,
        departmentId: parsed.departmentId,
        userId: dbUser.id,
        managerId: parsed.managerId ?? null,
      },
      include: { department: true, manager: true },
    });
  });

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "EMPLOYEE_CREATED",
    entity: "Employee",
    entityId: created.id,
    metadata: { employeeCode: created.employeeCode },
  });

  return mapEmployeeToFrontend(created);
}

export async function updateEmployee(
  id: string,
  input: UpdateEmployeeInput
): Promise<Employee> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = updateEmployeeSchema.parse(input);

  const existing = await employeeRepo.findEmployeeById(companyId, id);
  if (!existing) {
    throw new AppError("NOT_FOUND", "Employee not found.", 404);
  }

  if (parsed.departmentId) {
    const dept = await departmentRepo.findDepartmentById(
      companyId,
      parsed.departmentId
    );
    if (!dept) {
      throw new AppError(
        "VALIDATION",
        "Department not found in your organization."
      );
    }
  }

  if (parsed.managerId) {
    await assertActiveManager(companyId, parsed.managerId, id);
  }

  if (parsed.employeeId && parsed.employeeId !== existing.employeeCode) {
    const clash = await employeeRepo.findEmployeeByCode(
      companyId,
      parsed.employeeId
    );
    if (clash) {
      throw new AppError("CONFLICT", "Employee ID already exists.");
    }
  }

  const emailChanging =
    parsed.email !== undefined &&
    parsed.email.toLowerCase() !== existing.email.toLowerCase();
  const nextEmail = emailChanging ? parsed.email!.toLowerCase() : null;

  if (nextEmail) {
    const [empClash, userClash] = await Promise.all([
      employeeRepo.findEmployeeByEmail(companyId, nextEmail),
      prisma.user.findFirst({
        where: {
          email: { equals: nextEmail, mode: "insensitive" },
          NOT: { id: existing.userId },
        },
      }),
    ]);
    if (empClash || userClash) {
      throw new AppError("CONFLICT", "Email is already in use.");
    }
  }

  const employeeData = {
    ...(parsed.firstName !== undefined ? { firstName: parsed.firstName } : {}),
    ...(parsed.lastName !== undefined ? { lastName: parsed.lastName } : {}),
    ...(nextEmail ? { email: nextEmail } : {}),
    ...(parsed.phone !== undefined
      ? { phone: parsed.phone?.trim() || "" }
      : {}),
    ...(parsed.avatarUrl !== undefined
      ? {
          profileImage:
            parsed.avatarUrl && parsed.avatarUrl.length > 0
              ? parsed.avatarUrl
              : null,
        }
      : {}),
    ...(parsed.departmentId !== undefined
      ? { departmentId: parsed.departmentId }
      : {}),
    ...(parsed.managerId !== undefined
      ? { managerId: parsed.managerId }
      : {}),
    ...(parsed.designation !== undefined
      ? { designation: parsed.designation }
      : {}),
    ...(parsed.status !== undefined
      ? { status: toPrismaEmployeeStatus(parsed.status) }
      : {}),
    ...(parsed.employmentType !== undefined
      ? { employmentType: toPrismaEmploymentType(parsed.employmentType) }
      : {}),
    ...(parsed.joiningDate !== undefined
      ? { joiningDate: new Date(parsed.joiningDate) }
      : {}),
    ...(parsed.employeeId !== undefined
      ? { employeeCode: parsed.employeeId }
      : {}),
  };

  const updated = await prisma.$transaction(async (tx) => {
    // Guard ownership inside the transaction
    const owned = await tx.employee.findFirst({
      where: { id, companyId },
    });
    if (!owned) {
      throw new AppError("NOT_FOUND", "Employee not found.", 404);
    }

    if (nextEmail) {
      await tx.user.update({
        where: { id: owned.userId },
        data: { email: nextEmail },
      });
    }

    return tx.employee.update({
      where: { id },
      data: employeeData,
      include: { department: true, manager: true },
    });
  });

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "EMPLOYEE_UPDATED",
    entity: "Employee",
    entityId: id,
    metadata: nextEmail ? { emailUpdated: true } : undefined,
  });

  return mapEmployeeToFrontend(updated);
}

export async function deactivateEmployee(id: string): Promise<Employee> {
  const { companyId, user } = await getTenantPrisma();

  const existing = await employeeRepo.findEmployeeById(companyId, id);
  if (!existing) {
    throw new AppError("NOT_FOUND", "Employee not found.", 404);
  }

  // Atomic: TERMINATED employee + linked User cannot authenticate.
  // AccountStatus.INACTIVE is the existing non-login state (real-auth rejects non-ACTIVE).
  const updated = await prisma.$transaction(async (tx) => {
    const owned = await tx.employee.findFirst({
      where: { id, companyId },
    });
    if (!owned) {
      throw new AppError("NOT_FOUND", "Employee not found.", 404);
    }

    await tx.user.update({
      where: { id: owned.userId },
      data: { accountStatus: "INACTIVE" },
    });

    return tx.employee.update({
      where: { id },
      data: { status: "TERMINATED" },
      include: { department: true, manager: true },
    });
  });

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "EMPLOYEE_DEACTIVATED",
    entity: "Employee",
    entityId: id,
    metadata: { userAccountStatus: "INACTIVE" },
  });

  return mapEmployeeToFrontend(updated);
}
