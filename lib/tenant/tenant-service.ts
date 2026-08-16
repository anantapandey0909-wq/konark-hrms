/**
 * Tenant (Company) read helpers for server-side use.
 * Phase 2: basic lookups only — no admin APIs or switching.
 */

import { prisma } from "@/lib/prisma";
import type { AuthUserTenant } from "@/types/auth";
import { toAuthUserTenant, tenantSlugFromName } from "@/lib/tenant/tenant-utils";

export async function getCompanyById(companyId: string) {
  return prisma.company.findUnique({
    where: { id: companyId },
  });
}

export async function getCompanyByCode(companyCode: string) {
  return prisma.company.findUnique({
    where: { companyCode },
  });
}

export async function toTenantFromCompanyId(
  companyId: string
): Promise<AuthUserTenant | null> {
  const company = await getCompanyById(companyId);
  if (!company) return null;
  return toAuthUserTenant({
    id: company.id,
    name: company.companyName,
    slug: tenantSlugFromName(company.companyCode),
  });
}
