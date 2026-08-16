import type { AuthResponse, AuthSession, AuthUser } from "@/types/auth";
import { mockUsers } from "@/mock/auth";
import { isRealAuthEnabled } from "@/lib/config/flags";
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
// Real authentication (calls server routes that set HTTP-only cookies)
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

  // Mirror session into localStorage so existing AuthProvider / login page
  // contracts that read konark_hrms_session continue to work without redesign.
  if (data.session) {
    saveSession(data.session);
  }

  return data;
}

async function realLogout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearSession();
  }
}

async function realRestoreSession(): Promise<AuthSession | null> {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      clearSession();
      return null;
    }
    const data = (await res.json()) as {
      success: boolean;
      session?: AuthSession;
    };
    if (data.success && data.session) {
      saveSession(data.session);
      return data.session;
    }
    clearSession();
    return null;
  } catch {
    return loadSession();
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

/**
 * Async session restore — used by AuthProvider when real auth is enabled
 * so the HTTP-only cookie is the source of truth after refresh.
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
