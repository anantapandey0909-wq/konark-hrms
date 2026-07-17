"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Settings,
  Building2,
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  Bell,
  Shield,
  Palette,
  Info,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { SettingsNavItem } from "@/types/settings";

import { settingsNavigation } from "@/mock/settings";
import type {
  SettingsCategory,
  SettingsSectionId,
} from "@/types/settings";

const iconMap: Record<string, LucideIcon> = {
  Settings,
  Building2,
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  Bell,
  Shield,
  Palette,
  Info,
};

const categoryHeaders: Record<SettingsCategory, string> = {
  core: "Core Settings",
  workforce: "Workforce Rules",
  preferences: "System Preferences",
};

interface SettingsSidebarProps {
  readonly activeSection: SettingsSectionId;
  readonly onSectionChange: (sectionId: SettingsSectionId) => void;
}

export function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  const groupedNavigation = useMemo(() => {
    const groups: Record<SettingsCategory, SettingsNavItem[]> = {
      core: [],
      workforce: [],
      preferences: [],
    };

    settingsNavigation.forEach((item) => {
      groups[item.category].push(item);
    });

    return groups;
  }, []);

  return (
    <nav
      aria-label="Settings navigation"
      className="w-full shrink-0 border-r border-border/40 pr-2 lg:w-72"
    >
      <div className="flex flex-col gap-6">
        {(Object.keys(groupedNavigation) as SettingsCategory[]).map(
          (category) => (
            <section key={category} className="space-y-2">
              <h2 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {categoryHeaders[category]}
              </h2>

              <ul
                role="tablist"
                aria-orientation="vertical"
                className="space-y-1"
              >
                {groupedNavigation[category].map((item) => {
                  const isActive = activeSection === item.id;
                  const Icon = iconMap[item.iconName] ?? Settings;

                  return (
                    <li key={item.id}>
                      <button
                        id={`settings-tab-${item.id}`}
                        role="tab"
                        type="button"
                        aria-selected={isActive}
                        aria-controls={`settings-panel-${item.id}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => onSectionChange(item.id)}
                        className={cn(
                          "group relative flex w-full items-center gap-3 overflow-hidden rounded-lg border border-transparent px-3 py-2 text-left text-sm font-medium transition-all duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          isActive
                            ? "bg-primary/5 text-primary"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        {/* Animated active indicator */}
                        {isActive && (
                          <motion.span
                            layoutId="settings-sidebar-indicator"
                            className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-primary"
                            transition={{
                              type: "spring",
                              stiffness: 320,
                              damping: 28,
                            }}
                          />
                        )}

                        {/* Navigation icon */}
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors duration-200",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />

                        {/* Navigation label */}
                        <span className="truncate">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )
        )}
      </div>
    </nav>
  );
}