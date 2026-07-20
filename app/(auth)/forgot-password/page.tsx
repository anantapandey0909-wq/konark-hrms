"use client";

import { useCallback, useState } from "react";
import { AuthLayout, AuthLogo, AuthFooter, ForgotPasswordForm } from "@/components/auth";
import { AUTH_PAGE_TITLES, AUTH_PAGE_DESCRIPTIONS, AUTH_ROUTES } from "@/constants/auth";
import type { ForgotPasswordSchema } from "@/schemas/auth";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = useCallback(async (values: ForgotPasswordSchema) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("Forgot Password:", values);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthLayout
      title={AUTH_PAGE_TITLES.forgotPassword}
      description={AUTH_PAGE_DESCRIPTIONS.forgotPassword}
      footer={
        <AuthFooter
          primaryLabel="Back to Login"
          primaryHref={AUTH_ROUTES.login}
          secondaryLabel="Back to Home"
          secondaryHref="/"
        />
      }
    >
      <AuthLogo size="lg" className="mb-4" />
      <ForgotPasswordForm
        onSubmit={handleForgotPassword}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}