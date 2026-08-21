/**
 * Employee-import helpers that extend department lookup without duplicating
 * the main employee repository write path.
 */

import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

export async function findDepartmentByNameOrCode(
  companyId: string,
  nameOrCode: string
) {
  const q = nameOrCode.trim();
  if (!q) return null;

  const byCode = await prisma.department.findFirst({
    where: tenantScope(companyId, {
      departmentCode: { equals: q, mode: "insensitive" },
    }),
  });
  if (byCode) return byCode;

  return prisma.department.findFirst({
    where: tenantScope(companyId, {
      departmentName: { equals: q, mode: "insensitive" },
    }),
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
