/**
 * Feature flags for gradual backend cut-over.
 * Server-side flags use process.env (never expose secrets).
 * Client-safe flags must be NEXT_PUBLIC_*.
 */

/**
 * When false (default), authentication uses the existing mock service
 * (localStorage session + mockUsers). Real DB auth is Phase 3.
 */
export function useRealAuth(): boolean {
  const value = process.env.USE_REAL_AUTH ?? process.env.NEXT_PUBLIC_USE_REAL_AUTH;
  return value === "true" || value === "1";
}

/**
 * Prefer mock data sources in the UI until later phases wire repositories.
 * Independent of auth flag so UI can stay mock-driven while auth is real later.
 */
export function useMockData(): boolean {
  const value = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  // Default true until data phases flip the flag
  if (value === undefined || value === "") return true;
  return value !== "false" && value !== "0";
}
