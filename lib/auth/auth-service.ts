import type { AuthResponse, AuthSession, AuthUser } from "@/types/auth";
import { mockUsers } from "@/mock/auth";
import { useRealAuth } from "@/lib/config/flags";
import {
  SESSION_STORAGE_KEY,
  buildSessionForUser,
  isSessionExpired,
} from "@/lib/auth/session";

// ==============================================================================
// Storage (client mock path — localStorage)
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
// Real authentication skeleton (Phase 3 — not implemented yet)
// ==============================================================================

async function realLogin(
  _usernameOrEmail: string,
  _password?: string
): Promise<AuthResponse> {
  // Phase 3 will: validate against User table, hash verify, set HTTP-only cookie.
  throw new Error(
    "Real authentication is not enabled yet. Set USE_REAL_AUTH=false or wait for Phase 3."
  );
}

async function realLogout(): Promise<void> {
  // Phase 3 will clear HTTP-only session cookie server-side.
  clearSession();
}

// ==============================================================================
// Public API (stable for AuthProvider / login forms)
// ==============================================================================

export async function login(
  usernameOrEmail: string,
  password?: string
): Promise<AuthResponse> {
  if (useRealAuth()) {
    return realLogin(usernameOrEmail, password);
  }
  return mockLogin(usernameOrEmail, password);
}

export async function logout(): Promise<void> {
  if (useRealAuth()) {
    return realLogout();
  }
  return mockLogout();
}

export function getStoredSession(): AuthSession | null {
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

export const authService = {
  login,
  logout,
  getStoredSession,
  getStoredUser,
  restoreSession,
};

export default authService;
