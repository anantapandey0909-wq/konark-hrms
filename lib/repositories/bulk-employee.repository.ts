/**
 * Bulk employee repository — DB access only.
 * companyId is always trusted (from getTenantPrisma), never from client.
 */

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

const employeeInclude = {
  department: true,
  manager: true,
} as const;

export async function findEmployeesByIds(
  companyId: string,
  ids: string[]
) {
  if (ids.length === 0) return [];
  return prisma.employee.findMany({
    where: tenantScope(companyId, { id: { in: ids } }),
    include: employeeInclude,
  });
}

export async function updateEmployeeInTx(
  tx: Prisma.TransactionClient,
  companyId: string,
  id: string,
  data: Prisma.EmployeeUpdateInput
) {
  // Guard ownership inside the same transaction
  const existing = await tx.employee.findFirst({
    where: tenantScope(companyId, { id }),
  });
  if (!existing) return null;

  return tx.employee.update({
    where: { id },
    data,
    include: employeeInclude,
  });
}
