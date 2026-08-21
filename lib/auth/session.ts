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
 * Whether the session cookie should use the Secure attribute.
 *
 * Browsers refuse to store/send Secure cookies over plain HTTP.
 * Running `next start` (NODE_ENV=production) on http://localhost therefore
 * must NOT set Secure, or login appears to succeed (localStorage mirror)
 * while the server never receives a session cookie.
 *
 * Override with COOKIE_SECURE=true|false when needed.
 */
export function shouldUseSecureCookies(): boolean {
  const override = process.env.COOKIE_SECURE?.trim().toLowerCase();
  if (override === "true" || override === "1") return true;
  if (override === "false" || override === "0") return false;

  const appUrl =
    process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
  if (appUrl.startsWith("http://")) return false;
  if (appUrl.startsWith("https://")) return true;

  // Default: Secure only in production when no explicit APP_URL says otherwise.
  return process.env.NODE_ENV === "production";
}

/**
 * Cookie options for the HTTP-only session cookie.
 * httpOnly + sameSite=lax + path=/ ; Secure only when appropriate for the origin.
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
    secure: shouldUseSecureCookies(),
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
