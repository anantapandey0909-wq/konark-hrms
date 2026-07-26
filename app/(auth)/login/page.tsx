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

import { login } from "@/lib/auth/auth-service";
import { getRoleRoute } from "@/lib/auth/role-routes";

import type { LoginSchema } from "@/schemas/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(
    async (values: LoginSchema) => {
      setIsLoading(true);

      try {
        const response = await login(
          values.email,
          values.password
        );

        if (!response.success || !response.session) {
          toast.error(response.message);
          return;
        }

        toast.success(
          `Welcome back, ${response.session.user.firstName}!`
        );

        const redirectPath = getRoleRoute(
          response.session.user.role
        );

        router.push(redirectPath);
      } catch (error) {
        console.error(error);

        toast.error(
          "Something went wrong while signing in. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router]
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
      <AuthLogo
        size="lg"
        className="mb-4"
      />

      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}