/**
 * Department service — business rules, validation, tenant checks.
 */

import { z } from "zod";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as departmentRepo from "@/lib/repositories/department.repository";
import * as employeeRepo from "@/lib/repositories/employee.repository";
import {
  mapDepartmentToFrontend,
  mapResolvedDepartment,
  toPrismaDepartmentStatus,
} from "@/lib/mappers/department.mapper";
import { mapEmployeeToFrontend } from "@/lib/mappers/employee.mapper";
import { writeAuditLog } from "@/lib/services/audit.service";
import type {
  Department,
  DepartmentSummary,
  ResolvedDepartment,
} from "@/types/department";

const departmentSchema = z.object({
  name: z.string().trim().min(2).max(100),
  code: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .regex(/^[A-Za-z0-9-]+$/),
  description: z.string().trim().max(500).nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  managerId: z.string().nullable().optional(),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;

/** Manager must exist in-tenant and be ACTIVE. */
async function assertActiveDepartmentManager(
  companyId: string,
  managerId: string
) {
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

export async function listDepartments(): Promise<ResolvedDepartment[]> {
  const { companyId } = await getTenantPrisma();
  const rows = await departmentRepo.findDepartmentsByCompany(companyId);

  return rows.map((row) => {
    const manager = row.manager ? mapEmployeeToFrontend(row.manager) : null;
    return mapResolvedDepartment(row, manager);
  });
}

export async function getDepartment(id: string): Promise<ResolvedDepartment> {
  const { companyId } = await getTenantPrisma();
  const row = await departmentRepo.findDepartmentById(companyId, id);
  if (!row) {
    throw new AppError("NOT_FOUND", "Department not found.", 404);
  }
  const manager = row.manager ? mapEmployeeToFrontend(row.manager) : null;
  return mapResolvedDepartment(row, manager);
}

export async function getDepartmentSummary(): Promise<DepartmentSummary> {
  const { companyId } = await getTenantPrisma();
  return departmentRepo.getDepartmentSummary(companyId);
}

export async function createDepartment(
  input: DepartmentInput
): Promise<Department> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = departmentSchema.parse(input);

  const existing = await departmentRepo.findDepartmentByCode(
    companyId,
    parsed.code
  );
  if (existing) {
    throw new AppError("CONFLICT", "Department code already exists.");
  }

  if (parsed.managerId) {
    await assertActiveDepartmentManager(companyId, parsed.managerId);
  }

  const created = await departmentRepo.createDepartment({
    departmentCode: parsed.code,
    departmentName: parsed.name,
    description: parsed.description ?? null,
    status: toPrismaDepartmentStatus(parsed.status),
    company: { connect: { id: companyId } },
    ...(parsed.managerId
      ? { manager: { connect: { id: parsed.managerId } } }
      : {}),
  });

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "DEPARTMENT_CREATED",
    entity: "Department",
    entityId: created.id,
    metadata: { code: created.departmentCode },
  });

  return mapDepartmentToFrontend(created);
}

export async function updateDepartment(
  id: string,
  input: Partial<DepartmentInput>
): Promise<Department> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = departmentSchema.partial().parse(input);

  const existing = await departmentRepo.findDepartmentById(companyId, id);
  if (!existing) {
    throw new AppError("NOT_FOUND", "Department not found.", 404);
  }

  if (parsed.code && parsed.code !== existing.departmentCode) {
    const clash = await departmentRepo.findDepartmentByCode(
      companyId,
      parsed.code
    );
    if (clash) {
      throw new AppError("CONFLICT", "Department code already exists.");
    }
  }

  if (parsed.managerId) {
    await assertActiveDepartmentManager(companyId, parsed.managerId);
  }

  const updated = await departmentRepo.updateDepartment(companyId, id, {
    ...(parsed.name !== undefined ? { departmentName: parsed.name } : {}),
    ...(parsed.code !== undefined ? { departmentCode: parsed.code } : {}),
    ...(parsed.description !== undefined
      ? { description: parsed.description }
      : {}),
    ...(parsed.status !== undefined
      ? { status: toPrismaDepartmentStatus(parsed.status) }
      : {}),
    ...(parsed.managerId !== undefined
      ? parsed.managerId
        ? { manager: { connect: { id: parsed.managerId } } }
        : { manager: { disconnect: true } }
      : {}),
  });

  if (!updated) {
    throw new AppError("NOT_FOUND", "Department not found.", 404);
  }

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "DEPARTMENT_UPDATED",
    entity: "Department",
    entityId: id,
  });

  return mapDepartmentToFrontend(updated);
}

export async function deactivateDepartment(id: string): Promise<Department> {
  const { companyId, user } = await getTenantPrisma();

  const existing = await departmentRepo.findDepartmentById(companyId, id);
  if (!existing) {
    throw new AppError("NOT_FOUND", "Department not found.", 404);
  }

  const memberCount = await departmentRepo.countEmployeesInDepartment(
    companyId,
    id
  );
  if (memberCount > 0) {
    throw new AppError(
      "CONFLICT",
      "Cannot deactivate a department that still has employees. Reassign them first."
    );
  }

  const updated = await departmentRepo.softDeactivateDepartment(companyId, id);
  if (!updated) {
    throw new AppError("NOT_FOUND", "Department not found.", 404);
  }

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "DEPARTMENT_DEACTIVATED",
    entity: "Department",
    entityId: id,
  });

  return mapDepartmentToFrontend(updated);
}
