/**
 * Feature flags for gradual backend cut-over.
 *
 * Data adapters must not branch on these flags in Client Components.
 * Branch inside "use server" actions so env is read on the server.
 *
 * Env values are read via dynamic property access so Next/Turbopack cannot
 * replace them with a stale compile-time literal.
 */

function readEnv(name: string): string | undefined {
  // Dynamic access — do not use process.env.NEXT_PUBLIC_* member syntax here.
  return (process.env as Record<string, string | undefined>)[name];
}

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

export function isRealAuthEnabled(): boolean {
  if (envFlagTrue(readEnv("NEXT_PUBLIC_USE_REAL_AUTH"))) return true;
  if (envFlagTrue(readEnv("USE_REAL_AUTH"))) return true;
  return false;
}

export function useMockData(): boolean {
  if (isRealDataEnabled()) return false;
  const value = readEnv("NEXT_PUBLIC_USE_MOCK_DATA");
  if (value === undefined || value === "") return true;
  return !envFlagTrue(value) && value.trim().toLowerCase() !== "false";
}

/**
 * When true: Employee / Department / Attendance / Leave use PostgreSQL.
 * When false (default): mock data.
 *
 * Reads (in order):
 * - NEXT_PUBLIC_USE_REAL_DATA
 * - USE_REAL_DATA
 */
export function isRealDataEnabled(): boolean {
  if (envFlagTrue(readEnv("NEXT_PUBLIC_USE_REAL_DATA"))) return true;
  if (envFlagTrue(readEnv("USE_REAL_DATA"))) return true;
  return false;
}
