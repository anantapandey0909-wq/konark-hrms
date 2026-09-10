"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * App Router error boundary (segment-level).
 * Shows a safe generic message only — never stack traces or DB details.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Development/ops signal only — do not include secrets or PII.
    console.error("[app/error]", error?.name, error?.message, error?.digest);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 text-center">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
          aria-hidden="true"
        >
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Something went wrong
          </h1>
          <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Something went wrong. Please try again. If the problem continues,
            contact your administrator.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" className="rounded-xl" onClick={() => reset()}>
            Try Again
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>

        <p className="text-xs text-zinc-400 dark:text-zinc-600">Konark HRMS</p>
      </div>
    </main>
  );
}
