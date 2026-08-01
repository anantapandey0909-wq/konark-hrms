"use client";

import {
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import type { AuthRole } from "@/types/auth";

import { useAuth } from "@/hooks/use-auth";

import { AUTH_ROUTES } from "@/constants/auth";

interface ProtectedRouteProps {
  readonly children: ReactNode;

  readonly allowedRoles?: readonly AuthRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const pathname = usePathname();

  const {
    user,
    isAuthenticated,
    isLoading,
  } = useAuth();

  const loginRedirect = useMemo(() => {
    return `${AUTH_ROUTES.login}?redirect=${encodeURIComponent(
      pathname
    )}`;
  }, [pathname]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(loginRedirect);
      return;
    }

    if (
      allowedRoles &&
      user &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace("/unauthorized");
    }
  }, [
    allowedRoles,
    isAuthenticated,
    isLoading,
    loginRedirect,
    router,
    user,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}