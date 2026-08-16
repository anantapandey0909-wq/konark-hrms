/**
 * Tenant-related constants shared across server helpers.
 */

export const TENANT_COOKIE_HEADER = "x-konark-tenant"; // informational only — never trust as identity

/** Session field that carries the active company/tenant id (AuthUser.tenant.id). */
export const TENANT_SESSION_FIELD = "tenant" as const;
