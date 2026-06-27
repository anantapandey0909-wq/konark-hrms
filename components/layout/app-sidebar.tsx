"use client";

import { navigation } from "@/constants/navigation";
import { SidebarItem } from "./sidebar-item";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  return (
    <aside
      className="
        flex h-screen w-72 flex-col
        border-r border-zinc-200
        bg-white
        dark:border-zinc-800
        dark:bg-zinc-950
      "
    >
      {/* Logo */}
      <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight">
          Konark HRMS
        </h1>

        <p className="mt-1 text-xs text-zinc-500">
          Enterprise HR Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => (
          <SidebarItem
            key={item.title}
            item={item}
          />
        ))}
      </nav>

      {/* User */}
      <NavUser />
    </aside>
  );
}