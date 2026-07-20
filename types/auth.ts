/**
 * Readonly array representing the authorized system roles in the HRMS.
 */
export const AUTH_ROLES = ["ADMIN", "HR", "MANAGER", "EMPLOYEE"] as const;

/**
 * Union type representing the possible system roles.
 */
export type AuthRole = (typeof AUTH_ROLES)[number];

/**
 * Readonly array representing supported authentication providers.
 */
export const AUTH_PROVIDERS = ["CREDENTIALS"] as const;

/**
 * Union type representing supported authentication providers.
 */
export type AuthProvider = (typeof AUTH_PROVIDERS)[number];

/**
 * Readonly array representing authentication operation statuses.
 */
export const AUTH_STATUS = ["IDLE", "LOADING", "SUCCESS", "ERROR"] as const;

/**
 * Union type representing the current authentication operation state.
 */
export type AuthStatus = (typeof AUTH_STATUS)[number];

/**
 * Interface representing credentials submitted for login.
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Interface representing a request payload to trigger a password recovery email.
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Interface representing a payload to verify and complete password reset.
 */
export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Interface representing the authenticated identity in the system.
 */
export interface AuthUser {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AuthRole;
  avatar?: string;
}

/**
 * Interface representing session metadata for an authenticated user.
 */
export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt: string; // ISO format string
}

/**
 * Interface representing a standardized response payload for authentication actions.
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  session?: AuthSession;
}