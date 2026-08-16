"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { AuthLayout, AuthLogo, AuthFooter, ForgotPasswordForm } from "@/components/auth";
import { AUTH_PAGE_TITLES, AUTH_PAGE_DESCRIPTIONS, AUTH_ROUTES } from "@/constants/auth";
import type { ForgotPasswordSchema } from "@/schemas/auth";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = useCallback(async (values: ForgotPasswordSchema) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      const data = (await res.json()) as {
        success: boolean;
        message: string;
        devResetUrl?: string;
      };

      toast.success(
        data.message ||
          "If an account exists for that email, a reset link has been prepared."
      );

      // Development-only: surface reset URL so local testing is possible
      // without an email provider. Never shown as a secret in production builds.
      if (data.devResetUrl && process.env.NODE_ENV !== "production") {
        toast.message("Dev reset link", {
          description: data.devResetUrl,
          duration: 15000,
        });
      }
    } catch {
      toast.error("Unable to process the request. Please try again.");
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
