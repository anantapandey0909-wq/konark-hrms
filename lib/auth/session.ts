/**
 * Session helpers for Konark HRMS.
 *
 * Mock auth continues to use localStorage via auth-service when USE_REAL_AUTH=false.
 * Real auth uses HTTP-only signed cookies (HMAC-SHA256 via session-crypto).
 */

import type { AuthSession, AuthUser, AuthUserTenant } from "@/types/auth";
import { sealSession, unsealSession } from "@/lib/auth/session-crypto";

export const SESSION_COOKIE_NAME = "konark_hrms_session";
export const SESSION_STORAGE_KEY = "konark_hrms_session";

/** Default session lifetime (24h). */
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export function isSessionExpired(
  session: Pick<AuthSession, "expiresAt">
): boolean {
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
 * Seal session for secure HTTP-only cookie (real-auth path).
 */
export function serializeSession(session: AuthSession): string {
  return sealSession(session);
}

/**
 * Parse a sealed cookie value (real-auth). Returns null if invalid/expired.
 */
export function parseSession(
  value: string | undefined | null
): AuthSession | null {
  return unsealSession(value);
}

/**
 * Cookie options for secure session cookie.
 * httpOnly + secure (prod) + sameSite=lax; path=/
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

export function getAllowedTenants(
  user: AuthUser
): readonly AuthUserTenant[] {
  if (user.allowedTenants && user.allowedTenants.length > 0) {
    return user.allowedTenants;
  }
  return [user.tenant];
}
