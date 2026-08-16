/**
 * Tenant context types and builders for server actions / repositories.
 * Client components should use hooks/use-tenant.ts (session user.tenant).
 */

import type { AuthUser, AuthUserTenant } from "@/types/auth";
import {
  getCurrentCompanyId,
  getCurrentUser,
  requireCurrentCompanyId,
  requireCurrentUser,
} from "@/lib/auth/current-user";
import { resolveActiveTenant } from "@/lib/tenant/tenant-utils";

export interface TenantContext {
  readonly user: AuthUser;
  readonly companyId: string;
  readonly tenant: AuthUserTenant;
}

/**
 * Build tenant context from the authenticated server session.
 * Throws if unauthenticated.
 */
export async function getTenantContext(): Promise<TenantContext> {
  const user = await requireCurrentUser();
  const companyId = await requireCurrentCompanyId();
  const tenant = resolveActiveTenant(user);

  if (tenant.id !== companyId) {
    // Session must be consistent
    throw new Error("Session tenant mismatch.");
  }

  return { user, companyId, tenant };
}

/**
 * Optional tenant context (null when not authenticated).
 */
export async function getOptionalTenantContext(): Promise<TenantContext | null> {
  const user = await getCurrentUser();
  const companyId = await getCurrentCompanyId();
  if (!user || !companyId) return null;
  return {
    user,
    companyId,
    tenant: resolveActiveTenant(user),
  };
}

export type { AuthUserTenant };
