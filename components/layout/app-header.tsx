"use client";

import { Bell } from "lucide-react";

import { GlobalSearch } from "@/components/global-search";
import { NavUser } from "@/components/layout/nav-user";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200/70 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/80">
      {/* Global Search */}
      <div className="flex w-full max-w-md items-center">
        <GlobalSearch />
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