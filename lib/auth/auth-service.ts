import type { AuthResponse, AuthSession, AuthUser } from "@/types/auth";
import { mockUsers } from "@/mock/auth";
import { isRealAuthEnabled } from "@/lib/config/flags";
import {
  SESSION_STORAGE_KEY,
  buildSessionForUser,
  isSessionExpired,
} from "@/lib/auth/session";

/**
 * Client auth service.
 *
 * localStorage is ONLY for mock authentication (isRealAuthEnabled() === false).
 * Real authentication source of truth is the HTTP-only cookie (konark_hrms_session)
 * set by POST /api/auth/login and validated by GET /api/auth/me.
 * When real auth is enabled, /api/auth/me failure MUST fail closed — never fall
 * back to localStorage.
 */

// ==============================================================================
// Storage (client MOCK path only — localStorage)
// ==============================================================================

function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

function loadSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    clearSession();
    return null;
  }
}

/**
 * Migration cleanup: remove any stale mock key left over after switching to
 * real auth. Must NEVER be used as an authentication source or fallback.
 */
function clearStaleLocalSession(): void {
  clearSession();
}

// ==============================================================================
// Mock authentication (default when USE_REAL_AUTH is false)
// ==============================================================================

async function mockLogin(
  usernameOrEmail: string,
  password?: string
): Promise<AuthResponse> {
  const normalizedInput = usernameOrEmail.trim().toLowerCase();

  const userMatch = mockUsers.find((user) => {
    const loginMatch = user.loginId.toLowerCase() === normalizedInput;
    const emailMatch = user.email.toLowerCase() === normalizedInput;
    return (loginMatch || emailMatch) && user.password === password;
  });

  if (!userMatch) {
    throw new Error("Invalid credentials.");
  }

  const { password: _password, ...user } = userMatch;
  const session = buildSessionForUser(user);
  saveSession(session);

  return {
    success: true,
    message: "Login successful.",
    user,
    token: session.token,
    session,
  };
}

async function mockLogout(): Promise<void> {
  clearSession();
}

// ==============================================================================
// Real authentication (HTTP-only cookie is the only source of truth)
// ==============================================================================

async function realLogin(
  usernameOrEmail: string,
  password?: string
): Promise<AuthResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      usernameOrEmail,
      password: password ?? "",
    }),
  });

  const data = (await res.json()) as AuthResponse & { message?: string };

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Invalid credentials.");
  }

  // Cookie is set by the server (Set-Cookie). Do NOT persist real sessions
  // into localStorage — that must never become an auth source of truth.
  clearStaleLocalSession();

  // Return user/session for immediate in-memory AuthProvider state only.
  return data;
}

async function realLogout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } finally {
    // Clear any legacy localStorage key; never used for real-auth decisions.
    clearStaleLocalSession();
  }
}

/**
 * Restore real session from the HTTP-only cookie via /api/auth/me.
 * Fail closed: non-2xx, unsuccessful payload, or network error → null.
 * NEVER falls back to localStorage.
 */
async function realRestoreSession(): Promise<AuthSession | null> {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      clearStaleLocalSession();
      return null;
    }
    const data = (await res.json()) as {
      success: boolean;
      session?: AuthSession;
    };
    if (data.success && data.session) {
      // In-memory only; do not write to localStorage.
      clearStaleLocalSession();
      return data.session;
    }
    clearStaleLocalSession();
    return null;
  } catch {
    // Network / parse failure: fail closed — do not use loadSession().
    clearStaleLocalSession();
    return null;
  }
}

// ==============================================================================
// Public API (stable for AuthProvider / login forms)
// ==============================================================================

export async function login(
  usernameOrEmail: string,
  password?: string
): Promise<AuthResponse> {
  if (isRealAuthEnabled()) {
    return realLogin(usernameOrEmail, password);
  }
  return mockLogin(usernameOrEmail, password);
}

export async function logout(): Promise<void> {
  if (isRealAuthEnabled()) {
    return realLogout();
  }
  return mockLogout();
}

/**
 * Sync localStorage session — MOCK AUTH ONLY.
 * When real auth is enabled, always returns null (cookie is source of truth).
 */
export function getStoredSession(): AuthSession | null {
  if (isRealAuthEnabled()) {
    return null;
  }
  const session = loadSession();
  if (!session) return null;
  if (isSessionExpired(session)) {
    clearSession();
    return null;
  }
  return session;
}

export function getStoredUser(): AuthUser | null {
  return getStoredSession()?.user ?? null;
}

export function restoreSession(): AuthSession | null {
  return getStoredSession();
}

/**
 * Async session restore — used by AuthProvider.
 * Real auth: HTTP-only cookie via /api/auth/me (fail closed).
 * Mock auth: localStorage.
 */
export async function restoreSessionAsync(): Promise<AuthSession | null> {
  if (isRealAuthEnabled()) {
    return realRestoreSession();
  }
  return getStoredSession();
}

export const authService = {
  login,
  logout,
  getStoredSession,
  getStoredUser,
  restoreSession,
  restoreSessionAsync,
};

export default authService;
