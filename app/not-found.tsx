import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Global 404 for unknown routes and notFound() calls.
 * UX only — does not change auth, RBAC, or data access.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 text-center">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
          aria-hidden="true"
        >
          <FileQuestion className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            404
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Page Not Found
          </h1>
          <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            The page you requested does not exist or is no longer available. Check
            the URL, or return to the dashboard to continue.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="rounded-xl">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>

        <p className="text-xs text-zinc-400 dark:text-zinc-600">Konark HRMS</p>
      </div>
    </main>
  );
}
