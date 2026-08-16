/**
 * Session helpers for Konark HRMS.
 * Phase 2: cookie/session foundation only — production login is Phase 3.
 *
 * Mock auth continues to use localStorage via auth-service when USE_REAL_AUTH=false.
 * These helpers prepare HTTP-only cookie support for the real-auth path.
 */

import type { AuthSession, AuthUser, AuthUserTenant } from "@/types/auth";

export const SESSION_COOKIE_NAME = "konark_hrms_session";
export const SESSION_STORAGE_KEY = "konark_hrms_session";

/** Default session lifetime (24h). */
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

/**
 * Server-side session payload carried by secure cookies (Phase 3+).
 * Mirrors AuthSession shape so frontend contracts stay stable.
 */
export interface ServerSessionPayload {
  readonly token: string;
  readonly refreshToken?: string;
  readonly user: AuthUser;
  readonly issuedAt: string;
  readonly expiresAt: string;
  readonly provider?: AuthSession["provider"];
}

export function isSessionExpired(session: Pick<AuthSession, "expiresAt">): boolean {
  if (!session.expiresAt) return false;
  return new Date(session.expiresAt).getTime() < Date.now();
}

export function buildSessionForUser(
  user: AuthUser,
  options?: {
    token?: string;
    refreshToken?: string;
    provider?: AuthSession["provider"];
    durationMs?: number;
  }
): AuthSession {
  const issuedAt = new Date();
  const duration = options?.durationMs ?? SESSION_DURATION_MS;

  return {
    token: options?.token ?? `session-${crypto.randomUUID()}`,
    refreshToken: options?.refreshToken ?? `refresh-${crypto.randomUUID()}`,
    user,
    issuedAt: issuedAt.toISOString(),
    expiresAt: new Date(issuedAt.getTime() + duration).toISOString(),
    provider: options?.provider ?? "credentials",
  };
}

/**
 * Serialize session for cookie storage (Phase 3 will sign/encrypt).
 * Phase 2: plain JSON string — not used by mock login path.
 */
export function serializeSession(session: AuthSession): string {
  return JSON.stringify(session);
}

export function parseSession(value: string | undefined | null): AuthSession | null {
  if (!value) return null;
  try {
    const session = JSON.parse(value) as AuthSession;
    if (!session?.user?.id || !session.token) return null;
    if (isSessionExpired(session)) return null;
    return session;
  } catch {
    return null;
  }
}

/**
 * Cookie options for future secure session cookie (Phase 3).
 * httpOnly + secure + sameSite=lax; path=/
 */
export function getSessionCookieOptions(maxAgeSeconds?: number): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds ?? Math.floor(SESSION_DURATION_MS / 1000),
  };
}

/** Extract tenant identity from an authenticated user — never from client input. */
export function getTenantFromUser(user: AuthUser): AuthUserTenant {
  return user.tenant;
}

export function getAllowedTenants(user: AuthUser): readonly AuthUserTenant[] {
  if (user.allowedTenants && user.allowedTenants.length > 0) {
    return user.allowedTenants;
  }
  return [user.tenant];
}
