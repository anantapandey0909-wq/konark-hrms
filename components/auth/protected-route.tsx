"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { AUTH_ROUTES } from "@/constants/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(
        `${AUTH_ROUTES.login}?redirect=${encodeURIComponent(pathname)}`
      );
    }
  }, [
    isAuthenticated,
    isLoading,
    pathname,
    router,
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

  return <>{children}</>;
}