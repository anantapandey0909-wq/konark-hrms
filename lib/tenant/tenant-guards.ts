/**
 * Tenant isolation guards.
 * Fail closed: missing or mismatched companyId is rejected.
 */

import type { AuthUser } from "@/types/auth";
import { userBelongsToTenant } from "@/lib/tenant/tenant-utils";

export class TenantIsolationError extends Error {
  constructor(message = "Tenant isolation violation.") {
    super(message);
    this.name = "TenantIsolationError";
  }
}

/**
 * Assert that a resource's companyId matches the authenticated tenant.
 * Never call this with a client-provided "expected" id as the sole check —
 * pass the session-derived companyId as `authenticatedCompanyId`.
 */
export function assertSameTenant(
  authenticatedCompanyId: string,
  resourceCompanyId: string | null | undefined,
  message?: string
): void {
  if (!authenticatedCompanyId) {
    throw new TenantIsolationError("Authenticated company id is required.");
  }
  if (!resourceCompanyId || resourceCompanyId !== authenticatedCompanyId) {
    throw new TenantIsolationError(
      message ?? "Resource does not belong to the authenticated tenant."
    );
  }
}

/**
 * Assert the user is allowed to act within the given company id.
 */
export function assertUserTenantAccess(
  user: AuthUser,
  companyId: string
): void {
  if (!userBelongsToTenant(user, companyId)) {
    throw new TenantIsolationError(
      "User is not a member of the requested tenant."
    );
  }
}

/**
 * Reject any attempt to use a client-supplied companyId that differs from
 * the session tenant. Returns the trusted session companyId.
 */
export function resolveTrustedCompanyId(
  sessionCompanyId: string,
  clientProvidedCompanyId?: string | null
): string {
  if (
    clientProvidedCompanyId != null &&
    clientProvidedCompanyId !== "" &&
    clientProvidedCompanyId !== sessionCompanyId
  ) {
    throw new TenantIsolationError(
      "Client-provided companyId does not match the authenticated tenant."
    );
  }
  return sessionCompanyId;
}
