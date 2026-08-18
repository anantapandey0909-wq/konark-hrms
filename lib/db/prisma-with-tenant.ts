/**
 * Tenant-scoped Prisma access helpers.
 *
 * Design goals (Phase 2):
 * - Never trust client-provided companyId
 * - Make tenant filters explicit and auditable
 * - Fail closed on isolation violations
 *
 * Usage (server actions / repositories):
 *   const { companyId, prisma, scope } = await getTenantPrisma();
 *   const rows = await prisma.employee.findMany({ where: scope({}) });
 */

import { prisma } from "@/lib/prisma";
import {
  requireCurrentCompanyId,
  requireCurrentUser,
} from "@/lib/auth/current-user";
import {
  assertSameTenant,
  resolveTrustedCompanyId,
  TenantIsolationError,
} from "@/lib/tenant/tenant-guards";
import type { AuthUser } from "@/types/auth";

/** Models that carry companyId for tenant isolation (Phase 1 schema). */
export const TENANT_SCOPED_MODELS = [
  "Department",
  "User",
  "Employee",
  "Attendance",
  "LeaveRequest",
  "LeaveBalance",
  "Payroll",
  "Notification",
  "AuditLog",
  "Setting",
  "Document",
] as const;

export type TenantScopedModel = (typeof TENANT_SCOPED_MODELS)[number];

export interface TenantPrismaContext {
  readonly prisma: typeof prisma;
  readonly companyId: string;
  readonly user: AuthUser;
  /**
   * Merge trusted companyId into a Prisma `where` clause.
   * Always prefer this over passing companyId from the client.
   *
   * Prefer calling with an explicit Prisma WhereInput type argument when the
   * filter includes enum fields, e.g.:
   *   scope<Prisma.DepartmentWhereInput>({ status: DepartmentStatus.ACTIVE })
   */
  scope: <T extends object>(where?: T) => T & { companyId: string };
  /**
   * Assert a loaded record belongs to the current tenant.
   */
  assertRecord: (resourceCompanyId: string | null | undefined) => void;
  /**
   * Resolve client companyId against session (rejects mismatches).
   */
  trustCompanyId: (clientProvided?: string | null) => string;
}

/**
 * Obtain Prisma + authenticated tenant scope for server-side data access.
 * Requires a valid server session (cookie). Mock localStorage sessions are
 * not visible here until Phase 3 issues cookies.
 */
export async function getTenantPrisma(): Promise<TenantPrismaContext> {
  const user = await requireCurrentUser();
  const companyId = await requireCurrentCompanyId();

  return {
    prisma,
    companyId,
    user,
    scope: <T extends object>(where?: T) => {
      if (!companyId) {
        throw new TenantIsolationError("companyId is required for tenant scope.");
      }
      // Object.assign preserves the caller's T without re-inferring object literals.
      return Object.assign({}, where, { companyId }) as T & { companyId: string };
    },
    assertRecord: (resourceCompanyId) =>
      assertSameTenant(companyId, resourceCompanyId),
    trustCompanyId: (clientProvided) =>
      resolveTrustedCompanyId(companyId, clientProvided),
  };
}

/**
 * Build a where filter with forced companyId (when companyId is already known
 * from a trusted server context).
 *
 * Tip: when filtering on Prisma enums, either:
 * 1. Use Prisma enum members (DepartmentStatus.ACTIVE), or
 * 2. Assign the result to an explicit Prisma.*WhereInput variable, or
 * 3. Pass the WhereInput as the type argument: tenantScope<Prisma.XWhereInput>(...)
 */
export function tenantScope<
  T extends object = Record<string, never>,
>(companyId: string, where?: T): T & { companyId: string } {
  if (!companyId) {
    throw new TenantIsolationError("companyId is required for tenantScope.");
  }
  return Object.assign({}, where, { companyId }) as T & { companyId: string };
}

export { TenantIsolationError };
