"use client";

import { ChevronDown } from "lucide-react";

export function NavUser() {
  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
      <button
        className="
          flex w-full items-center gap-3 rounded-xl
          p-2 transition-colors
          hover:bg-zinc-100
          dark:hover:bg-zinc-900
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-blue-500
        "
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
          AP
        </div>

        <div className="flex-1 text-left">
          <p className="text-sm font-semibold">
            Ananta Pandey
          </p>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            HR Manager
          </p>
        </div>

        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </button>
    </div>
  );
}
