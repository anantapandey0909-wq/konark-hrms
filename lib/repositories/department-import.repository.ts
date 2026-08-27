/**
 * Department-import repository helpers.
 * departmentCode is globally @unique in Prisma — check both tenant and global.
 */

import type { DepartmentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

export async function findDepartmentByCodeInCompany(
  companyId: string,
  departmentCode: string
) {
  return prisma.department.findFirst({
    where: tenantScope(companyId, { departmentCode }),
  });
}

/** Global uniqueness check (schema constraint). */
export async function findDepartmentByCodeGlobal(departmentCode: string) {
  return prisma.department.findFirst({
    where: { departmentCode },
  });
}

/**
 * Batch global lookup by department codes (avoids N+1).
 * Matches case-insensitively in application after fetch of candidate codes.
 */
export async function findDepartmentsByCodesGlobal(departmentCodes: string[]) {
  const unique = Array.from(
    new Set(departmentCodes.map((c) => c.trim()).filter(Boolean))
  );
  if (unique.length === 0) return [];

  return prisma.department.findMany({
    where: {
      departmentCode: { in: unique },
    },
    select: {
      id: true,
      departmentCode: true,
      companyId: true,
    },
  });
}

/** Batch tenant-scoped lookup by department codes. */
export async function findDepartmentsByCodesInCompany(
  companyId: string,
  departmentCodes: string[]
) {
  const unique = Array.from(
    new Set(departmentCodes.map((c) => c.trim()).filter(Boolean))
  );
  if (unique.length === 0) return [];

  return prisma.department.findMany({
    where: tenantScope(companyId, {
      departmentCode: { in: unique },
    }),
    select: {
      id: true,
      departmentCode: true,
      companyId: true,
    },
  });
}

export async function createDepartmentInTx(
  tx: Prisma.TransactionClient,
  data: {
    departmentCode: string;
    departmentName: string;
    description: string | null;
    status: DepartmentStatus;
    companyId: string;
  }
) {
  return tx.department.create({
    data: {
      departmentCode: data.departmentCode,
      departmentName: data.departmentName,
      description: data.description,
      status: data.status,
      companyId: data.companyId,
    },
  });
}
