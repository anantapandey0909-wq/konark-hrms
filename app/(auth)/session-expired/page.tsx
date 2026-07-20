import { Clock3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthLayout, AuthLogo, AuthFooter } from "@/components/auth";
import { AUTH_ROUTES } from "@/constants/auth";

export default function SessionExpiredPage() {
  return (
    <AuthLayout
      title="Session Expired"
      description="Your session has expired. Please sign in again."
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

      <div className="flex flex-col items-center justify-center text-center py-4 space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" aria-hidden="true">
          <Clock3 className="h-6 w-6" />
        </div>

        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Session Expired
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
          Your session has expired for security reasons. Please sign in again to continue using Konark HRMS.
        </p>

        <Button
          asChild
          className="w-full h-10 rounded-xl font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
        >
          <Link href={AUTH_ROUTES.login}>
            Sign In Again
          </Link>
        </Button>
      </div>
    </AuthLayout>
  );
}