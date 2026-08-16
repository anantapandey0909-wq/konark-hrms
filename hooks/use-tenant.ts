"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { AuthUserTenant } from "@/types/auth";
import { getAllowedTenants } from "@/lib/auth/session";

export interface UseTenantResult {
  readonly tenant: AuthUserTenant | null;
  readonly companyId: string | null;
  readonly allowedTenants: readonly AuthUserTenant[];
  readonly isSuperAdmin: boolean;
}

/**
 * Client-side tenant context derived from the authenticated user.
 * Does not perform tenant switching (Phase 2).
 */
export function useTenant(): UseTenantResult {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) {
      return {
        tenant: null,
        companyId: null,
        allowedTenants: [],
        isSuperAdmin: false,
      };
    }

    return {
      tenant: user.tenant,
      companyId: user.tenant.id,
      allowedTenants: getAllowedTenants(user),
      isSuperAdmin: user.isSuperAdmin,
    };
  }, [user]);
}

export default useTenant;
