"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AuthLayout,
  AuthLogo,
  AuthFooter,
  LoginForm,
} from "@/components/auth";

import {
  AUTH_PAGE_DESCRIPTIONS,
  AUTH_PAGE_TITLES,
  AUTH_ROUTES,
} from "@/constants/auth";

import { useAuth } from "@/hooks/use-auth";
import { getRoleRoute } from "@/lib/auth/role-routes";

import type { LoginSchema } from "@/schemas/auth";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(
    async (values: LoginSchema) => {
      setIsLoading(true);

      try {
        // login() updates AuthProvider state and returns the AuthResponse.
        // Real auth: session lives in the HTTP-only cookie only — do not read localStorage.
        // Mock auth: localStorage is still used inside authService, but this page
        // relies on the returned response, not a direct localStorage read.
        const response = await login(values.email, values.password);

        const authenticatedUser = response.user;

        if (!response.success || !authenticatedUser) {
          toast.error("Unable to create authentication session.");
          return;
        }

        toast.success(`Welcome back, ${authenticatedUser.firstName}!`);

        const redirectPath = getRoleRoute(authenticatedUser.role);

        router.replace(redirectPath);
      } catch (error) {
        console.error("Login failed:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong while signing in."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [login, router]
  );

  return (
    <AuthLayout
      title={AUTH_PAGE_TITLES.login}
      description={AUTH_PAGE_DESCRIPTIONS.login}
      footer={
        <AuthFooter
          primaryLabel="Forgot Password"
          primaryHref={AUTH_ROUTES.forgotPassword}
          secondaryLabel="Back to Home"
          secondaryHref="/"
        />
      }
    >
      <AuthLogo size="lg" className="mb-4" />

      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </AuthLayout>
  );
}
