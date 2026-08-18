"use client";

import { Suspense, useCallback, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthLayout, AuthLogo, AuthFooter, ResetPasswordForm } from "@/components/auth";
import { AUTH_PAGE_TITLES, AUTH_PAGE_DESCRIPTIONS, AUTH_ROUTES } from "@/constants/auth";
import type { ResetPasswordSchema } from "@/schemas/auth";

/**
 * Inner content that reads `?token=` via useSearchParams.
 * Must sit under a React Suspense boundary for Next.js App Router prerender.
 */
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = useMemo(
    () => searchParams.get("token") ?? "",
    [searchParams]
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = useCallback(
    async (values: ResetPasswordSchema) => {
      setIsLoading(true);
      try {
        const token = values.token || tokenFromUrl;
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            password: values.password,
          }),
        });

        const data = (await res.json()) as {
          success: boolean;
          message: string;
        };

        if (!res.ok || !data.success) {
          toast.error(data.message || "Unable to reset password.");
          return;
        }

        toast.success(data.message || "Password has been reset.");
        router.replace(AUTH_ROUTES.login);
      } catch {
        toast.error("Unable to reset password. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [router, tokenFromUrl]
  );

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
        defaultToken={tokenFromUrl}
      />
    </AuthLayout>
  );
}

function ResetPasswordFallback() {
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
      <p className="text-sm text-muted-foreground">Loading reset form…</p>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
