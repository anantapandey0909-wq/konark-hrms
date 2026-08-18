/**
 * Department repository — database access only.
 */

import { DepartmentStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

const departmentInclude = {
  _count: { select: { employees: true } },
  manager: true,
} as const;

export async function findDepartmentsByCompany(companyId: string) {
  return prisma.department.findMany({
    where: tenantScope(companyId, {}),
    include: departmentInclude,
    orderBy: { departmentName: "asc" },
  });
}

export async function findDepartmentById(companyId: string, id: string) {
  return prisma.department.findFirst({
    where: tenantScope(companyId, { id }),
    include: departmentInclude,
  });
}

export async function findDepartmentByCode(
  companyId: string,
  departmentCode: string
) {
  return prisma.department.findFirst({
    where: tenantScope(companyId, { departmentCode }),
  });
}

export async function createDepartment(data: Prisma.DepartmentCreateInput) {
  return prisma.department.create({
    data,
    include: departmentInclude,
  });
}

export async function updateDepartment(
  companyId: string,
  id: string,
  data: Prisma.DepartmentUpdateInput
) {
  const existing = await findDepartmentById(companyId, id);
  if (!existing) return null;

  return prisma.department.update({
    where: { id },
    data,
    include: departmentInclude,
  });
}

export async function softDeactivateDepartment(
  companyId: string,
  id: string
) {
  return updateDepartment(companyId, id, { status: DepartmentStatus.INACTIVE });
}

export async function countEmployeesInDepartment(
  companyId: string,
  departmentId: string
) {
  return prisma.employee.count({
    where: tenantScope(companyId, { departmentId }),
  });
}

export async function getDepartmentSummary(companyId: string) {
  // Build Prisma.DepartmentWhereInput directly so `status` is contextual-typed
  // as DepartmentStatus. Do not pass status through tenantScope's generic merge
  // (that widens string literals to `string` and breaks Prisma enum assignability).
  // companyId still comes only from the trusted server parameter — never the client.
  const whereCompany: Prisma.DepartmentWhereInput = { companyId };
  const whereActive: Prisma.DepartmentWhereInput = {
    companyId,
    status: DepartmentStatus.ACTIVE,
  };
  const whereInactive: Prisma.DepartmentWhereInput = {
    companyId,
    status: DepartmentStatus.INACTIVE,
  };

  const [total, active, inactive, totalEmployees] = await Promise.all([
    prisma.department.count({ where: whereCompany }),
    prisma.department.count({ where: whereActive }),
    prisma.department.count({ where: whereInactive }),
    prisma.employee.count({ where: tenantScope(companyId, {}) }),
  ]);

  return {
    totalDepartments: total,
    activeDepartments: active,
    inactiveDepartments: inactive,
    totalEmployees,
  };
}
