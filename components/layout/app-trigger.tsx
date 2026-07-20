"use client";

import { Search } from "lucide-react";

interface SearchTriggerProps {
  onClick: () => void;
}

export function SearchTrigger({ onClick }: SearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open global search"
      className="relative flex h-10 w-full shrink-0 items-center rounded-xl border border-zinc-200 bg-zinc-100/70 pl-10 pr-20 text-left text-sm text-zinc-500 shadow-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400"
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

      <span className="truncate">
        Search employees, payroll, leave... (Ctrl + K)
      </span>

      <span
        aria-hidden="true"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 md:inline-flex"
      >
        Ctrl K
      </span>
    </button>
  );
}