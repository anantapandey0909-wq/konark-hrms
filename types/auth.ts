export const AUTH_ROLES = [
  "ADMIN",
  "HR",
  "ACCOUNTANT",
  "MANAGER",
  "SUPERVISOR",
  "EMPLOYEE",
] as const;

export type AuthRole = typeof AUTH_ROLES[number];

export const AUTH_PROVIDERS = ["credentials", "google", "github"] as const;

export type AuthProvider = typeof AUTH_PROVIDERS[number];

/**
 * Lightweight, optimized slice of Tenant metadata stored directly inside the
 * authentication context. Keeps token and session footprints minimal.
 */
export interface AuthUserTenant {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
}

/**
 * Represents the current authenticated user session context.
 * Partitioned and fully isolated by Tenant.
 */
export interface User {
  readonly loginId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly role: AuthRole;
  
  // Single source of truth for Tenant context
  readonly tenant: AuthUserTenant;
  
  // Predictable state representing system-wide operator permissions
  readonly isSuperAdmin: boolean; 
  
  // Optional collection to support interactive cross-tenant switching
  readonly allowedTenants?: readonly AuthUserTenant[];
}

/**
 * Alias to support backward compatibility for parts of the application
 * that directly reference the AuthUser signature.
 */
export type AuthUser = User;

/**
 * Represents an active security session context.
 */
export interface AuthSession {
  readonly token: string;
  readonly user: User;
  readonly expiresAt?: string;
}

/**
 * Represents the structured response returned by authentication actions.
 */
export interface AuthResponse {
  readonly success: boolean;
  readonly message: string;
  readonly user: User;
  readonly token: string;
  readonly session?: AuthSession;
}

/**
 * Represents the global authentication state.
 */
export interface AuthState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
}