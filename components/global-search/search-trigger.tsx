"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SearchTriggerProps = React.ComponentPropsWithoutRef<typeof Button>;

export const SearchTrigger = React.forwardRef<
  HTMLButtonElement,
  SearchTriggerProps
>(({ className, onClick, disabled, ...props }, ref) => {
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform);

  const shortcutLabel = isMac ? "⌘ K" : "Ctrl K";
  const ariaShortcut = isMac ? "Meta+K" : "Control+K";

  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      aria-label="Open global search"
      aria-keyshortcuts={ariaShortcut}
      className={cn(
        "relative h-10 w-full max-w-md justify-start rounded-xl border border-zinc-200 bg-zinc-100/70 pl-10 pr-20 text-left text-sm text-zinc-500 shadow-none transition-all hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-900",
        className
      )}
      {...props}
    >
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        aria-hidden="true"
      />

      <span className="truncate">
        Search employees, payroll, leave... ({shortcutLabel})
      </span>

      <kbd
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 md:inline-flex"
      >
        {shortcutLabel}
      </kbd>
    </Button>
  );
});

SearchTrigger.displayName = "SearchTrigger";