/**
 * Server-side current user / company helpers.
 * Phase 2 foundation — reads prepared cookie session when present.
 * Mock auth (localStorage) is not visible on the server; returns null until Phase 3
 * wires cookie-based sessions after real login.
 *
 * NEVER accept companyId from the client as the source of truth.
 */

import { cookies } from "next/headers";
import type { AuthSession, AuthUser } from "@/types/auth";
import {
  SESSION_COOKIE_NAME,
  parseSession,
  getTenantFromUser,
} from "@/lib/auth/session";
import { useRealAuth } from "@/lib/config/flags";

export class UnauthenticatedError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

/**
 * Read the session cookie if present (real-auth path).
 * Safe to call from Server Components / Server Actions / Route Handlers only.
 */
export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return parseSession(raw ?? null);
  } catch {
    // cookies() outside of a request context
    return null;
  }
}

/**
 * Authenticated user from server session, or null.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getServerSession();
  return session?.user ?? null;
}

/**
 * Company (tenant) id for the authenticated user.
 * Source of truth: session.user.tenant.id — never client-supplied companyId.
 */
export async function getCurrentCompanyId(): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return getTenantFromUser(user).id;
}

/**
 * Require an authenticated user or throw.
 */
export async function requireCurrentUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthenticatedError();
  }
  return user;
}

/**
 * Require a company id from the authenticated session or throw.
 */
export async function requireCurrentCompanyId(): Promise<string> {
  const companyId = await getCurrentCompanyId();
  if (!companyId) {
    throw new UnauthenticatedError("Tenant context required.");
  }
  return companyId;
}

/**
 * Whether the server is configured for real auth (flag only).
 * Does not imply a session exists.
 */
export function isRealAuthEnabled(): boolean {
  return useRealAuth();
}
