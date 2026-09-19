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

import type { AuthResponse, AuthState } from "@/types/auth";
import { authService } from "@/lib/auth/auth-service";

interface AuthContextType extends AuthState {
  /**
   * Authenticate and update in-memory state.
   * Returns AuthResponse so callers (e.g. login page) can redirect by role
   * without reading localStorage. Real auth still relies on the HTTP-only cookie.
   */
  readonly login: (
    usernameOrEmail: string,
    password?: string
  ) => Promise<AuthResponse>;

  readonly logout: () => Promise<void>;

  /**
   * Reload the authenticated user from cookie (/api/auth/me) or mock storage.
   */
  readonly refresh: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const initializeAuth = useCallback(async () => {
    try {
      const session = await authService.restoreSessionAsync();
      setAuthState({
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      });
    } catch {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        void initializeAuth();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [initializeAuth]);

  // Mock-only cross-tab sync. Real auth does not use localStorage.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "konark_hrms_session") {
        void initializeAuth();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [initializeAuth]);

  const login = useCallback(
    async (usernameOrEmail: string, password?: string): Promise<AuthResponse> => {
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

        return response;
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
    void initializeAuth();
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
