"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AuthFooterProps {
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  copyright?: string;
  showCopyright?: boolean;
  className?: string;
}

export function AuthFooter({
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  copyright,
  showCopyright = true,
  className,
}: AuthFooterProps) {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} Konark HRMS`;
  const copyrightText = copyright ?? defaultCopyright;

  const hasPrimary = !!(primaryLabel && primaryHref);
  const hasSecondary = !!(secondaryLabel && secondaryHref);

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("flex flex-col items-center gap-2 text-center text-xs text-zinc-500 dark:text-zinc-400", className)}
    >
      {(hasPrimary || hasSecondary) && (
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          {hasPrimary && (
            <Link
              href={primaryHref}
              className="font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 rounded px-1"
            >
              {primaryLabel}
            </Link>
          )}

          {hasPrimary && hasSecondary && (
            <span className="text-zinc-300 dark:text-zinc-800" aria-hidden="true">
              •
            </span>
          )}

          {hasSecondary && (
            <Link
              href={secondaryHref}
              className="font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 rounded px-1"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}

      {showCopyright && (
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1">
          {copyrightText}
        </p>
      )}
    </motion.footer>
  );
}