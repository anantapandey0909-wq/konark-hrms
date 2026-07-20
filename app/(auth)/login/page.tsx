/*"use client";

import { useCallback, useState } from "react";
import { AuthLayout, AuthLogo, AuthFooter, LoginForm } from "@/components/auth";
import { AUTH_PAGE_TITLES, AUTH_PAGE_DESCRIPTIONS, AUTH_ROUTES } from "@/constants/auth";
import type { LoginSchema } from "@/schemas/auth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async (values: LoginSchema) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("Login:", values);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
}*/
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthLayout,
  AuthLogo,
  AuthFooter,
  LoginForm,
} from "@/components/auth";
import {
  AUTH_PAGE_TITLES,
  AUTH_PAGE_DESCRIPTIONS,
  AUTH_ROUTES,
} from "@/constants/auth";
import type { LoginSchema } from "@/schemas/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(
    async (values: LoginSchema) => {
      setIsLoading(true);

      try {
        // Simulate API request
        await new Promise((resolve) => setTimeout(resolve, 1200));

        console.log("Login:", values);

        // Temporary navigation until backend authentication is implemented
        router.push("/dashboard");
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
      <AuthLogo size="lg" className="mb-4" />

      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}