/**
 * Employee-import helpers — tenant-scoped lookups for validation and commit.
 * companyId is always trusted (from getTenantPrisma), never from the client.
 */

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

export async function findDepartmentByNameOrCode(
  companyId: string,
  nameOrCode: string
) {
  const q = nameOrCode.trim();
  if (!q) return null;

  const byCodeWhere: Prisma.DepartmentWhereInput = {
    companyId,
    departmentCode: {
      equals: q,
      mode: Prisma.QueryMode.insensitive,
    },
  };

  const byCode = await prisma.department.findFirst({
    where: byCodeWhere,
  });
  if (byCode) return byCode;

  const byNameWhere: Prisma.DepartmentWhereInput = {
    companyId,
    departmentName: {
      equals: q,
      mode: Prisma.QueryMode.insensitive,
    },
  };

  return prisma.department.findFirst({
    where: byNameWhere,
  });
}

export async function listCompanyDepartmentsForImport(companyId: string) {
  return prisma.department.findMany({
    where: tenantScope(companyId, {}),
    select: {
      id: true,
      departmentCode: true,
      departmentName: true,
      status: true,
    },
  });
}

/** Batch lookup of employee codes within the tenant (case-sensitive codes as stored). */
export async function findEmployeesByCodes(
  companyId: string,
  codes: string[]
) {
  if (codes.length === 0) return [];
  return prisma.employee.findMany({
    where: tenantScope(companyId, {
      employeeCode: { in: codes },
    }),
    select: { id: true, employeeCode: true, email: true },
  });
}

/** Batch case-insensitive email lookup within the tenant. */
export async function findEmployeesByEmails(
  companyId: string,
  emails: string[]
) {
  if (emails.length === 0) return [];
  const normalized = Array.from(
    new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean))
  );
  if (normalized.length === 0) return [];

  // Prisma `in` is case-sensitive for most collations — fetch candidates via OR equals insensitive.
  return prisma.employee.findMany({
    where: {
      companyId,
      OR: normalized.map((email) => ({
        email: { equals: email, mode: Prisma.QueryMode.insensitive },
      })),
    },
    select: { id: true, employeeCode: true, email: true },
  });
}

/** Global User email uniqueness (User.email is unique across tenants). */
export async function findUsersByEmails(emails: string[]) {
  if (emails.length === 0) return [];
  const normalized = Array.from(
    new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean))
  );
  if (normalized.length === 0) return [];

  return prisma.user.findMany({
    where: {
      OR: normalized.map((email) => ({
        email: { equals: email, mode: Prisma.QueryMode.insensitive },
      })),
    },
    select: { id: true, email: true },
  });
}
