"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "@/types/auth";
import { authService } from "@/lib/auth/auth-service";

interface AuthContextType {
  readonly user: AuthUser | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly login: (usernameOrEmail: string, password?: string) => Promise<void>;
  readonly logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore the active session on application initialization
  useEffect(() => {
    const session = authService.getStoredSession();
    if (session) {
      setUser(session.user);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (usernameOrEmail: string, password?: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(usernameOrEmail, password);
      setUser(response.user);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;

  // Memoize the value object to optimize consumer rendering trees
  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }), [user, isAuthenticated, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to safely consume authentication and tenant session contexts.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}