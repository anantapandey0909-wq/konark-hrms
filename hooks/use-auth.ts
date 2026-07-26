"use client";

export { useAuth } from "@/components/auth/auth-provider";

/**
 * Custom hook for accessing the authentication context.
 *
 * Usage:
 * const {
 *   user,
 *   session,
 *   isAuthenticated,
 *   isLoading,
 *   login,
 *   logout,
 * } = useAuth();
 */