"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Briefcase,
  HelpCircle,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface SidebarContentProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  pathname: string;
}

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employees", href: "/dashboard/employees", icon: Users },
  { name: "Departments", href: "/dashboard/departments", icon: Briefcase },
  { name: "Attendance", href: "/dashboard/attendance", icon: Clock },
  { name: "Leave", href: "/dashboard/leave", icon: CalendarDays },
  { name: "Payroll", href: "/dashboard/payroll", icon: FileText },
  {
  name: "Reports",
  href: "/dashboard/reports",
  icon: BarChart3,
}
];

const secondaryNavItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
];

function SidebarContent({
  isCollapsed,
  setIsCollapsed,
  pathname,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col justify-between bg-zinc-50 dark:bg-zinc-950/70 p-4 border-r border-zinc-200/60 dark:border-zinc-800/60 select-none">
      <div>
        {/* Workspace Switcher */}
        <Link
  href="/dashboard"
  className="flex items-center gap-3 px-2 py-3 mb-6 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm">
            <Briefcase className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                Konark HRMS
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                Enterprise HR Platform
              </span>
            </motion.div>
          )}
        </Link>

        {/* Main Navigation Group */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-2 text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">
              Management
            </p>
          )}
          <nav className="space-y-[2px]" aria-label="Main Navigation">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
                    isActive
                      ? "text-zinc-900 dark:text-zinc-50 font-semibold"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Secondary Navigation Group */}
        <div className="mt-8 space-y-1">
          {!isCollapsed && (
            <p className="px-2 text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">
              System
            </p>
          )}
          <nav className="space-y-[2px]" aria-label="Secondary Navigation">
            {secondaryNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
                    isActive
                      ? "text-zinc-900 dark:text-zinc-50 font-semibold"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicatorSecondary"
                      className="absolute inset-0 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="space-y-4">
        {/* Workspace Quick Tag */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200/60 bg-white p-3 dark:border-zinc-800/60 dark:bg-zinc-900/50">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 leading-none">
                Enterprise Core
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                Version 1.0 MVP
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                AP
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate leading-none">
                  ananta pandey
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                  HR Manager
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: AppSidebarProps) {
  const pathname = usePathname();

  const handleBackdropClick = React.useCallback(() => {
    setIsMobileOpen(false);
  }, [setIsMobileOpen]);

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <aside
        className={cn(
          "hidden md:block h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out shrink-0",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          pathname={pathname}
        />
      </aside>

      {/* Mobile Drawer Navigation Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-40 bg-black md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Sidebar Navigation */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="fixed inset-y-0 left-0 z-50 w-64 md:hidden shadow-xl"
          >
            <SidebarContent
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              pathname={pathname}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
