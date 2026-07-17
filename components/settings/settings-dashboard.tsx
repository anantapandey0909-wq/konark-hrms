"use client";

import { useState, useCallback } from "react";
import { SettingsSidebar } from "./settings-sidebar";
import { mockSettingsConfiguration } from "@/mock/settings";
import type {
  SettingsConfiguration,
  SettingsSectionId,
  GeneralSettings as GeneralSettingsType,
  CompanySettings as CompanySettingsType,
  OrganizationSettings as OrganizationSettingsType,
  AttendanceSettings as AttendanceSettingsType,
  LeaveSettings as LeaveSettingsType,
  PayrollSettings as PayrollSettingsType,
  NotificationsSettings as NotificationsSettingsType,
  SecuritySettings as SecuritySettingsType,
  AppearanceSettings as AppearanceSettingsType,
  AboutSettings as AboutSettingsType,
} from "@/types/settings";

import { GeneralSettings } from "./general-settings";
import { CompanySettings } from "./company-settings";
import { OrganizationSettings } from "./organization-settings";
import { AttendanceSettings } from "./attendance-settings";
import { LeaveSettings } from "./leave-settings";
import { PayrollSettings } from "./payroll-settings";
import { NotificationSettings } from "./notification-settings";
import { SecuritySettings } from "./security-settings";
import { AppearanceSettings } from "./appearance-settings";
import { AboutSettings } from "./about-settings";

export function SettingsDashboard() {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>("general");
  const [config, setConfig] = useState<SettingsConfiguration>(mockSettingsConfiguration);
  const [isPending, setIsPending] = useState(false);

  const handleSave = useCallback(
    async <K extends keyof SettingsConfiguration>(
      key: K,
      updatedValue: SettingsConfiguration[K]
    ) => {
      setIsPending(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setConfig((prev) => ({
          ...prev,
          [key]: updatedValue,
        }));
      } catch (error) {
        console.error("Failed to save settings for block:", key, error);
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  const renderActiveSectionContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <GeneralSettings
            data={config.general}
            onSave={(val: GeneralSettingsType) => handleSave("general", val)}
            isPending={isPending}
          />
        );
      case "company":
        return (
          <CompanySettings
            data={config.company}
            onSave={(val: CompanySettingsType) => handleSave("company", val)}
            isPending={isPending}
          />
        );
      case "organization":
        return (
          <OrganizationSettings
            data={config.organization}
            onSave={(val: OrganizationSettingsType) => handleSave("organization", val)}
            isPending={isPending}
          />
        );
      case "attendance":
        return (
          <AttendanceSettings
            data={config.attendance}
            onSave={(val: AttendanceSettingsType) => handleSave("attendance", val)}
            isPending={isPending}
          />
        );
      case "leave":
        return (
          <LeaveSettings
            data={config.leave}
            onSave={(val: LeaveSettingsType) => handleSave("leave", val)}
            isPending={isPending}
          />
        );
      case "payroll":
        return (
          <PayrollSettings
            data={config.payroll}
            onSave={(val: PayrollSettingsType) => handleSave("payroll", val)}
            isPending={isPending}
          />
        );
      case "notifications":
        return (
          <NotificationSettings
            data={config.notifications}
            onSave={(val: NotificationsSettingsType) => handleSave("notifications", val)}
            isPending={isPending}
          />
        );
      case "security":
        return (
          <SecuritySettings
            data={config.security}
            onSave={(val: SecuritySettingsType) => handleSave("security", val)}
            isPending={isPending}
          />
        );
      case "appearance":
        return (
          <AppearanceSettings
            data={config.appearance}
            onSave={(val: AppearanceSettingsType) => handleSave("appearance", val)}
            isPending={isPending}
          />
        );
      case "about":
        return (
          <AboutSettings
            data={config.about}
            onSave={(val: AboutSettingsType) => handleSave("about", val)}
            isPending={isPending}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Settings Module Title & Explainer Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          System Settings
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Manage system configurations, register corporate legal identity, determine attendance policy rules, formulate leaves, and supervise regional parameters.
        </p>
      </div>

      {/* Main Settings Panel Workspace Layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main
          className="flex-1 min-w-0"
          id={`settings-panel-${activeSection}`}
          role="tabpanel"
          aria-labelledby={`settings-tab-${activeSection}`}
        >
          {renderActiveSectionContent()}
        </main>
      </div>
    </section>
  );
}