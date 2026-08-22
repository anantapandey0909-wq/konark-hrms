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
