/**
 * Employee-import helpers that extend department lookup without duplicating
 * the main employee repository write path.
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

  // Build DepartmentWhereInput directly so `mode` is typed as Prisma.QueryMode.
  // Do not pass StringFilter through tenantScope's generic merge (that widens
  // "insensitive" to string). companyId still comes only from the trusted
  // server parameter — never the client.
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
