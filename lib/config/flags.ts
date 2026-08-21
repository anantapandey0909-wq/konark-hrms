/**
 * Feature flags for gradual backend cut-over.
 *
 * CRITICAL (Next.js):
 * Client bundles only receive NEXT_PUBLIC_* values that appear as *static*
 * member access: process.env.NEXT_PUBLIC_FOO
 *
 * Dynamic access such as process.env[name] or (process.env as Record)[name]
 * is NOT inlined into the browser bundle, so those reads are always undefined
 * on the client. That previously forced authService.login() into mockLogin()
 * even when NEXT_PUBLIC_USE_REAL_AUTH=true — localStorage showed Harshita,
 * but no konark_hrms_session cookie was ever set.
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
 * Real authentication (cookie session) vs mock localStorage auth.
 * Client: only NEXT_PUBLIC_USE_REAL_AUTH (static access).
 * Server: also USE_REAL_AUTH.
 */
export function isRealAuthEnabled(): boolean {
  // Static access — required for client-bundle inlining.
  if (envFlagTrue(process.env.NEXT_PUBLIC_USE_REAL_AUTH)) return true;
  // Server-only alias (undefined in the browser after bundling).
  if (envFlagTrue(process.env.USE_REAL_AUTH)) return true;
  return false;
}

/**
 * Legacy mock preference. When isRealDataEnabled() is true, adapters use DB.
 */
export function useMockData(): boolean {
  if (isRealDataEnabled()) return false;
  const value = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  if (value === undefined || value === "") return true;
  return !envFlagTrue(value) && value.trim().toLowerCase() !== "false";
}

/**
 * Employee / Department / Attendance / Leave use PostgreSQL when true.
 * Client + server: NEXT_PUBLIC_USE_REAL_DATA (static).
 * Server-only alias: USE_REAL_DATA.
 */
export function isRealDataEnabled(): boolean {
  if (envFlagTrue(process.env.NEXT_PUBLIC_USE_REAL_DATA)) return true;
  if (envFlagTrue(process.env.USE_REAL_DATA)) return true;
  return false;
}
