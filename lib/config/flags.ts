/**
 * Feature flags for gradual backend cut-over.
 *
 * IMPORTANT for Next.js:
 * - Client bundles can only see NEXT_PUBLIC_* (inlined at compile time).
 * - Data adapters that run in Client Components must NOT decide mock vs real
 *   locally. Put the branch inside "use server" actions so the flag is read
 *   on the server where both NEXT_PUBLIC_* and server-only env vars exist.
 */

function envFlagTrue(value: string | undefined): boolean {
  if (value == null) return false;
  const normalized = value.trim().toLowerCase();
  return (
    normalized === "true" ||
    normalized === "1" ||
    normalized === "yes" ||
    normalized === "on"
  );
}

/**
 * When false (default), authentication uses the existing mock service.
 */
export function isRealAuthEnabled(): boolean {
  // Keep member access static so Next can inline NEXT_PUBLIC_* correctly.
  if (envFlagTrue(process.env.NEXT_PUBLIC_USE_REAL_AUTH)) return true;
  if (envFlagTrue(process.env.USE_REAL_AUTH)) return true;
  return false;
}

/**
 * Legacy mock preference. When isRealDataEnabled() is true, adapters/actions
 * use PostgreSQL and ignore this flag.
 */
export function useMockData(): boolean {
  if (isRealDataEnabled()) return false;
  const value = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  if (value === undefined || value === "") return true;
  return !envFlagTrue(value) && value.trim().toLowerCase() !== "false";
}

/**
 * Phase 4+: Employee / Department / Attendance / Leave use real DB when true.
 *
 * Evaluation order (first match wins):
 * 1. NEXT_PUBLIC_USE_REAL_DATA
 * 2. USE_REAL_DATA (server-only)
 *
 * Prefer setting NEXT_PUBLIC_USE_REAL_DATA so client-invoked server actions
 * and server components agree after a dev-server restart.
 */
export function isRealDataEnabled(): boolean {
  if (envFlagTrue(process.env.NEXT_PUBLIC_USE_REAL_DATA)) return true;
  if (envFlagTrue(process.env.USE_REAL_DATA)) return true;
  return false;
}
