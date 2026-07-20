"use client";

import { useCallback, useState } from "react";
import { AuthLayout, AuthLogo, AuthFooter, ResetPasswordForm } from "@/components/auth";
import { AUTH_PAGE_TITLES, AUTH_PAGE_DESCRIPTIONS, AUTH_ROUTES } from "@/constants/auth";
import type { ResetPasswordSchema } from "@/schemas/auth";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = useCallback(async (values: ResetPasswordSchema) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("Reset Password:", values);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthLayout
      title={AUTH_PAGE_TITLES.resetPassword}
      description={AUTH_PAGE_DESCRIPTIONS.resetPassword}
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
      <ResetPasswordForm
        onSubmit={handleResetPassword}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}