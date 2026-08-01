import type { AuthResponse, AuthSession, AuthUser } from "@/types/auth";
import { mockUsers } from "@/mock/auth";

const SESSION_STORAGE_KEY = "konark_hrms_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

// ==============================================================================
// Token
// ==============================================================================

function generateMockToken(): string {
  return `mock-token-${crypto.randomUUID()}`;
}

// ==============================================================================
// Session
// ==============================================================================

function createSession(user: AuthUser): AuthSession {
  const issuedAt = new Date();

  return {
    token: generateMockToken(),
    refreshToken: `refresh-${crypto.randomUUID()}`,
    user,
    issuedAt: issuedAt.toISOString(),
    expiresAt: new Date(
      issuedAt.getTime() + SESSION_DURATION_MS
    ).toISOString(),
    provider: "credentials",
  };
}

// ==============================================================================
// Storage
// ==============================================================================

function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(session)
  );
}

function clearSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(SESSION_STORAGE_KEY);
}

function loadSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    clearSession();
    return null;
  }
}

// ==============================================================================
// Public API
// ==============================================================================

export async function login(
  usernameOrEmail: string,
  password?: string
): Promise<AuthResponse> {
  const normalizedInput = usernameOrEmail.trim().toLowerCase();
  console.log("Received:", usernameOrEmail);
console.log("Password:", password);

  const userMatch = mockUsers.find((user) => {
    const loginMatch =
      user.loginId.toLowerCase() === normalizedInput;

    const emailMatch =
      user.email.toLowerCase() === normalizedInput;

    return (
      (loginMatch || emailMatch) &&
      user.password === password
    );
  });
  console.log("Input:", usernameOrEmail, password);
console.log("Matched User:", userMatch);
console.log("Matched:", userMatch);

  if (!userMatch) {
    throw new Error("Invalid credentials.");
  }

  const { password: _, ...user } = userMatch;

  const session = createSession(user);

  saveSession(session);

  return {
    success: true,
    message: "Login successful.",
    user,
    token: session.token,
    session,
  };
}

export async function logout(): Promise<void> {
  clearSession();
}

export function getStoredSession(): AuthSession | null {
  const session = loadSession();

  if (!session) {
    return null;
  }

  if (
    session.expiresAt &&
    new Date(session.expiresAt).getTime() < Date.now()
  ) {
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