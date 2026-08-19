/**
 * Feature flags for gradual backend cut-over.
 * Server-side flags use process.env (never expose secrets).
 * Client-safe flags must be NEXT_PUBLIC_*.
 */

/**
 * When false (default), authentication uses the existing mock service
 * (localStorage session + mockUsers). Real DB auth is Phase 3.
 *
 * Named without a "use" prefix so ESLint rules-of-hooks does not treat
 * this pure flag helper as a React Hook.
 */
export function isRealAuthEnabled(): boolean {
  const value =
    process.env.USE_REAL_AUTH ?? process.env.NEXT_PUBLIC_USE_REAL_AUTH;
  return value === "true" || value === "1";
}

/**
 * Prefer mock data sources in the UI until later phases wire repositories.
 * Independent of auth flag so UI can stay mock-driven while auth is real later.
 *
 * Note: when isRealDataEnabled() is true, data adapters use PostgreSQL
 * regardless of this flag.
 */
export function useMockData(): boolean {
  if (isRealDataEnabled()) return false;
  const value = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  // Default true until data phases flip the flag
  if (value === undefined || value === "") return true;
  return value !== "false" && value !== "0";
}

/**
 * Phase 4+: when true, Employee/Department/Attendance/Leave (and later modules)
 * use real DB via server actions. Default false — mock data remains the default.
 *
 * Accepts either:
 * - NEXT_PUBLIC_USE_REAL_DATA (client + server, required for client adapters)
 * - USE_REAL_DATA (server-only alias)
 *
 * Restart `next dev` after changing these values so the process picks them up.
 */
export function isRealDataEnabled(): boolean {
  const value =
    process.env.NEXT_PUBLIC_USE_REAL_DATA ?? process.env.USE_REAL_DATA;
  return value === "true" || value === "1";
}
