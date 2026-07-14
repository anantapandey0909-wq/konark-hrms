"use client";

import { Search, Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavUser } from "@/components/layout/nav-user";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200/70 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/80">
      {/* Search */}
      <div className="flex w-full max-w-md items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <Input
            type="search"
            placeholder="Search employees, payroll, leave... (Ctrl + K)"
            className="h-10 rounded-xl border-zinc-200 bg-zinc-100/70 pl-10 pr-20 shadow-none transition-all focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900/60"
            aria-label="Global Search"
          />

          <span
            aria-hidden="true"
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 md:inline-flex"
          >
            Ctrl K
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="ml-6 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative rounded-xl"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-zinc-950" />
        </Button>

        <ThemeToggle />

        <div className="mx-2 h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

        <NavUser />
      </div>
    </header>
  );
}
