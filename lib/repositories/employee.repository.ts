/**
 * Employee repository — database access only.
 * Always filter by companyId (caller supplies trusted session companyId).
 */

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

const employeeInclude = {
  department: true,
  manager: true,
} as const;

export type EmployeeListFilters = {
  search?: string;
  departmentId?: string;
  status?: string;
  employmentType?: string;
};

export async function findEmployeesByCompany(
  companyId: string,
  filters: EmployeeListFilters = {}
) {
  const where: Prisma.EmployeeWhereInput = tenantScope(companyId, {});

  if (filters.departmentId && filters.departmentId !== "ALL") {
    where.departmentId = filters.departmentId;
  }
  if (filters.status && filters.status !== "ALL") {
    // Map frontend INACTIVE → RESIGNED at service layer before calling
    where.status = filters.status as Prisma.EnumEmployeeStatusFilter["equals"];
  }
  if (filters.employmentType && filters.employmentType !== "ALL") {
    where.employmentType =
      filters.employmentType as Prisma.EnumEmploymentTypeFilter["equals"];
  }
  if (filters.search?.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { employeeCode: { contains: q, mode: "insensitive" } },
    ];
  }

  return prisma.employee.findMany({
    where,
    include: employeeInclude,
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });
}

export async function findEmployeeById(companyId: string, id: string) {
  return prisma.employee.findFirst({
    where: tenantScope(companyId, { id }),
    include: employeeInclude,
  });
}

export async function findEmployeeByCode(
  companyId: string,
  employeeCode: string
) {
  return prisma.employee.findFirst({
    where: tenantScope(companyId, { employeeCode }),
  });
}

export async function findEmployeeByEmail(companyId: string, email: string) {
  return prisma.employee.findFirst({
    where: tenantScope(companyId, {
      email: { equals: email, mode: "insensitive" },
    }),
  });
}

export async function createEmployeeWithUser(
  data: Prisma.EmployeeCreateInput
) {
  return prisma.employee.create({
    data,
    include: employeeInclude,
  });
}

export async function updateEmployee(
  companyId: string,
  id: string,
  data: Prisma.EmployeeUpdateInput
) {
  // Guard: only update if row belongs to company
  const existing = await findEmployeeById(companyId, id);
  if (!existing) return null;

  return prisma.employee.update({
    where: { id },
    data,
    include: employeeInclude,
  });
}

export async function softDeactivateEmployee(
  companyId: string,
  id: string
) {
  return updateEmployee(companyId, id, { status: "TERMINATED" });
}
