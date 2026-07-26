import { AuthResponse, AuthSession, AuthUser } from "@/types/auth";
import { mockUsers } from "@/mock/auth";

const SESSION_STORAGE_KEY = "konark_hrms_session";

/**
 * Validates authentication credentials and establishes an isolated tenant session.
 * Supports matching against either loginId or email address.
 */
export async function login(usernameOrEmail: string, password?: string): Promise<AuthResponse> {
  const normalizedInput = usernameOrEmail.trim().toLowerCase();

  const userMatch = mockUsers.find((u) => {
    const loginMatch = u.loginId.toLowerCase() === normalizedInput;
    const emailMatch = u.email.toLowerCase() === normalizedInput;
    const passwordMatch = u.password === password;
    return (loginMatch || emailMatch) && passwordMatch;
  });

  if (!userMatch) {
    throw new Error("Invalid username, email, or password.");
  }

  // Remove the mock password from the user object sent to memory
  const { password: _, ...user }: typeof userMatch = userMatch;

  const mockToken = `mock-token-${crypto.randomUUID()}`;
  
  const session: AuthSession = {
    token: mockToken,
    user,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24-hour lifetime
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

return {
  success: true,
  message: "Login successful.",
  user,
  token: mockToken,
  session,
};
}

/**
 * Purges the active tenant session from client storage.
 */
export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

/**
 * Safely deserializes the active tenant session from local storage.
 * Actively validates both structural integrity and the expiresAt timestamp.
 * Automatically clears and returns null on expired or malformed sessions.
 */
export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const serializedSession = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!serializedSession) {
    return null;
  }

  try {
    const session = JSON.parse(serializedSession) as AuthSession;
    
    if (session && session.token && session.user) {
      if (session.expiresAt) {
        const expirationTime = new Date(session.expiresAt).getTime();
        
        if (isNaN(expirationTime) || expirationTime < Date.now()) {
          localStorage.removeItem(SESSION_STORAGE_KEY);
          return null;
        }
      }
      return session;
    }
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  return null;
}

/**
 * Directly extracts the current isolated User context from client storage.
 */
export function getStoredUser(): AuthUser | null {
  const session = getStoredSession();
  return session ? session.user : null;
}

/**
 * Unified namespace wrapper supporting both named and unified imports.
 */
export const authService = {
  login,
  logout,
  getStoredSession,
  getStoredUser,
};

export default authService;