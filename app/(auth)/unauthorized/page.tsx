import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthLayout, AuthLogo, AuthFooter } from "@/components/auth";
import { AUTH_ROUTES } from "@/constants/auth";

export default function UnauthorizedPage() {
  return (
    <AuthLayout
      title="Access Denied"
      description="You don't have permission to access this page."
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

      <div className="flex flex-col items-center text-center space-y-6 py-2">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
          aria-hidden="true"
        >
          <ShieldAlert className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Access Denied
          </h2>

          <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            You do not have permission to access this resource. If you believe
            this is an error, please contact your HR administrator.
          </p>
        </div>

        <Button
          asChild
          className="w-full rounded-xl"
        >
          <Link href={AUTH_ROUTES.login}>
            Back to Login
          </Link>
        </Button>
      </div>
    </AuthLayout>
  );
}