/**
 * Pure tenant utilities (no I/O).
 */

import type { AuthUser, AuthUserTenant } from "@/types/auth";

export function tenantSlugFromName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export function toAuthUserTenant(input: {
  id: string;
  name: string;
  slug?: string;
}): AuthUserTenant {
  return {
    id: input.id,
    name: input.name,
    slug: input.slug ?? tenantSlugFromName(input.name),
  };
}

export function userBelongsToTenant(user: AuthUser, companyId: string): boolean {
  if (user.tenant.id === companyId) return true;
  return Boolean(user.allowedTenants?.some((t) => t.id === companyId));
}

export function resolveActiveTenant(user: AuthUser): AuthUserTenant {
  return user.tenant;
}
