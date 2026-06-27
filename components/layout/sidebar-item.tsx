"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationItem } from "@/types/navigation-types";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  item: NavigationItem;
}

export function SidebarItem({ item }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        isActive
          ? "bg-blue-50 text-blue-600 font-semibold"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 transition-colors",
          isActive
            ? "text-blue-600"
            : "text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"
        )}
      />

      <span>{item.title}</span>
    </Link>
  );
}