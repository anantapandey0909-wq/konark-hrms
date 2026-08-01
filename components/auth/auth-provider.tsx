"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { AuthState } from "@/types/auth";
import { authService } from "@/lib/auth/auth-service";

interface AuthContextType extends AuthState {
  readonly login: (
    usernameOrEmail: string,
    password?: string
  ) => Promise<void>;

  readonly logout: () => Promise<void>;

  /**
   * Reload the authenticated user from storage.
   * Useful after profile updates or future backend refreshes.
   */
  readonly refresh: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const INITIAL_AUTH_STATE: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [authState, setAuthState] =
    useState<AuthState>(INITIAL_AUTH_STATE);

  /**
   * Restores the stored authentication session.
   */
  const initializeAuth = useCallback(() => {
    const session = authService.getStoredSession();

    setAuthState({
      user: session?.user ?? null,
      isAuthenticated: !!session,
      isLoading: false,
    });
  }, []);

  /**
   * Initialize authentication after hydration.
   * This avoids hydration mismatches between the server
   * and client caused by reading localStorage during render.
   */
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Synchronize authentication state across browser tabs.
   */
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "konark_hrms_session") {
        initializeAuth();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, [initializeAuth]);

  const login = useCallback(
    async (
      usernameOrEmail: string,
      password?: string
    ) => {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
      }));

      try {
        const response = await authService.login(
          usernameOrEmail,
          password
        );

        setAuthState({
          user: response.user ?? null,
          isAuthenticated: response.success,
          isLoading: false,
        });
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        throw error;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setAuthState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      await authService.logout();
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const refresh = useCallback(() => {
    initializeAuth();
  }, [initializeAuth]);

  const value = useMemo<AuthContextType>(
    () => ({
      ...authState,
      login,
      logout,
      refresh,
    }),
    [authState, login, logout, refresh]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider."
    );
  }

  return context;
}