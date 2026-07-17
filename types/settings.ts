/**
 * @file types/settings.ts
 * @description Enterprise-grade, strictly typed configurations for the Konark HRMS Settings Module.
 * Fully compliant with TypeScript Strict Mode and React 19 architecture patterns.
 */

// ==========================================
// 1. CONSTANTS & SYSTEM ENUMERATIONS
// ==========================================

export const SETTINGS_SECTIONS = [
  'general',
  'company',
  'organization',
  'attendance',
  'leave',
  'payroll',
  'notifications',
  'security',
  'appearance',
  'about',
] as const;

export const TIME_FORMATS = [
  { value: '12h', label: '12-hour (hh:mm AM/PM)' },
  { value: '24h', label: '24-hour (HH:mm)' },
] as const;

export const DATE_FORMATS = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2025-12-31)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2025)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2025)' },
] as const;

export const LANGUAGES = [
  { value: 'en', label: 'English (US)' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
] as const;

export const TIMEZONES = [
  { value: 'UTC', label: 'UTC (GMT+0)' },
  { value: 'America/New_York', label: 'Eastern Standard Time (EST)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
  { value: 'Asia/Singapore', label: 'Singapore Standard Time (SST)' },
] as const;

export const FISCAL_MONTHS = [
  { value: 'January', label: 'January' },
  { value: 'April', label: 'April' },
  { value: 'July', label: 'July' },
  { value: 'October', label: 'October' },
] as const;

export const ORG_STRUCTURE_TYPES = ['flat', 'hierarchical'] as const;

export const ACCRUAL_FREQUENCIES = ['monthly', 'quarterly', 'yearly'] as const;

export const PAY_CYCLE_FREQUENCIES = ['monthly', 'bi-weekly', 'weekly'] as const;

export const TAX_REGIMES = ['old', 'new'] as const;

export const THEMES = ['light', 'dark', 'system'] as const;

export const SIDEBAR_VARIANTS = ['expanded', 'collapsed', 'compact'] as const;

export const DENSITIES = ['compact', 'comfortable'] as const;

export const LICENSE_TYPES = ['enterprise', 'standard', 'trial'] as const;

export const DEPARTMENT_STATUSES = ['active', 'inactive'] as const;

export const SETTINGS_CATEGORIES = ['core', 'workforce', 'preferences'] as const;

// ==========================================
// 2. DERIVED TYPES FROM CONSTANTS
// ==========================================

/** Main tabs or sections inside the Settings module dashboard */
export type SettingsSectionId = typeof SETTINGS_SECTIONS[number];

/** Time format system preference, derived from structured constant objects */
export type TimeFormat = typeof TIME_FORMATS[number]['value'];

/** Structural pattern configuration for organization layout */
export type OrgStructureType = typeof ORG_STRUCTURE_TYPES[number];

/** Accrual frequency rules for leave management policies */
export type AccrualFrequency = typeof ACCRUAL_FREQUENCIES[number];

/** Frequency configuration of payment operations */
export type PayCycleFrequency = typeof PAY_CYCLE_FREQUENCIES[number];

/** National or regional tax systems mapping */
export type TaxRegime = typeof TAX_REGIMES[number];

/** Application theme layout settings */
export type Theme = typeof THEMES[number];

/** Main navigation sidebar state */
export type SidebarVariant = typeof SIDEBAR_VARIANTS[number];

/** Visual density representation settings */
export type Density = typeof DENSITIES[number];

/** Core distribution license level */
export type LicenseType = typeof LICENSE_TYPES[number];

/** State of functional departments inside company structure */
export type DepartmentStatus = typeof DEPARTMENT_STATUSES[number];

/** High-level groups for categorization of layout options */
export type SettingsCategory = typeof SETTINGS_CATEGORIES[number];

// ==========================================
// 3. REUSABLE METADATA & SUPPORTING STRUCTS
// ==========================================

/**
 * @interface SettingsSubComponentProps
 * @description Standard layout contract shared across presentation elements in Settings tabs.
 */
export interface SettingsSubComponentProps<T> {
  readonly data: T;
  readonly onSave: (updatedData: T) => void;
  readonly isPending?: boolean;
}

/**
 * @interface CompanyAddress
 * @description Defines the standard address structure for company registries.
 */
export interface CompanyAddress {
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
}

/**
 * @interface EmailNotificationSettings
 * @description Fine-grained controls for automated transactional and system emails.
 */
export interface EmailNotificationSettings {
  readonly systemAlerts: boolean;
  readonly leaveApprovals: boolean;
  readonly payrollDisbursal: boolean;
  readonly performanceReviews: boolean;
}

/**
 * @interface PushNotificationSettings
 * @description Direct browser-based push notifications dashboard configuration.
 */
export interface PushNotificationSettings {
  readonly attendanceReminders: boolean;
  readonly announcements: boolean;
  readonly chatMessages: boolean;
}

/**
 * @interface SMSNotificationSettings
 * @description Standard configurations for SMS and high-importance alerts.
 */
export interface SMSNotificationSettings {
  readonly criticalAlerts: boolean;
  readonly otpVerification: boolean;
}

/**
 * @interface SettingsNavItem
 * @description Navigation configurations used for structural sidebar/tab building.
 */
export interface SettingsNavItem {
  readonly id: SettingsSectionId;
  readonly label: string;
  readonly description: string;
  readonly iconName: string;
  readonly category: SettingsCategory;
}

/**
 * @interface SettingsCardMetadata
 * @description Layout rendering schema for the main Settings overview list dashboard.
 */
export interface SettingsCardMetadata {
  readonly id: SettingsSectionId;
  readonly title: string;
  readonly description: string;
  readonly iconName: string;
  readonly category: SettingsCategory;
  readonly routePath: string;
}

// ==========================================
// 4. MAIN CONFIGURATION SCHEMA INTERFACES
// ==========================================

/**
 * @interface GeneralSettings
 * @description Application metadata, location localized rules, and scheduling patterns.
 */
export interface GeneralSettings {
  readonly systemName: string;
  readonly supportEmail: string;
  readonly timezone: string;
  readonly dateFormat: string;
  readonly timeFormat: TimeFormat;
  readonly defaultLanguage: string;
  readonly fiscalYearStart: string; // Format: "MM-DD" (e.g. "04-01")
}

/**
 * @interface CompanySettings
 * @description Registry, tax, contact, and structural identification metadata of the enterprise.
 */
export interface CompanySettings {
  readonly legalName: string;
  readonly tradeName: string;
  readonly taxIdentifier: string;
  readonly registrationNumber: string;
  readonly industry: string;
  readonly website: string;
  readonly contactEmail: string;
  readonly contactPhone: string;
  readonly address: CompanyAddress;
}

/**
 * @interface OrganizationDepartment
 * @description Department division blueprint model inside structural configurations.
 */
export interface OrganizationDepartment {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly headOfDepartmentId?: string;
  readonly status: DepartmentStatus;
}

/**
 * @interface OrganizationDesignation
 * @description Corporate role blueprints associated with levels and specific departments.
 */
export interface OrganizationDesignation {
  readonly id: string;
  readonly title: string;
  readonly departmentId: string;
  readonly gradeLevel: string;
}

/**
 * @interface OrganizationSettings
 * @description Hierarchy rules, structure strategies, and department configurations.
 */
export interface OrganizationSettings {
  readonly departments: readonly OrganizationDepartment[];
  readonly designations: readonly OrganizationDesignation[];
  readonly orgStructureType: OrgStructureType;
  readonly enableMatrixReporting: boolean;
}

/**
 * @interface AttendanceSettings
 * @description Tracking thresholds, schedule expectations, security validation, and rules.
 */
export interface AttendanceSettings {
  readonly standardWorkHours: number;
  readonly enableAutoClockOut: boolean;
  readonly autoClockOutTime: string; // Format: "HH:MM" (e.g. "18:00")
  readonly gracePeriodMinutes: number;
  readonly overtimeCalculationThresholdHours: number;
  readonly ipRestrictedClockIn: boolean;
  readonly allowedIpAddresses: readonly string[];
}

/**
 * @interface LeavePolicy
 * @description Leave allocation, accrual cycles, limits, and restriction policies.
 */
export interface LeavePolicy {
  readonly id: string;
  readonly leaveType: string;
  readonly annualQuotaDays: number;
  readonly accrualFrequency: AccrualFrequency;
  readonly carryForwardMaxDays: number;
  readonly requiresApproval: boolean;
}

/**
 * @interface LeaveSettings
 * @description Organizational policy controls for balance and structural processing.
 */
export interface LeaveSettings {
  readonly policies: readonly LeavePolicy[];
  readonly allowNegativeBalance: boolean;
  readonly sandwichRuleEnabled: boolean;
}

/**
 * @interface PayrollSettings
 * @description Currency metadata, run parameters, contribution percentages, and tax setup.
 */
export interface PayrollSettings {
  readonly currency: string;
  readonly payCycleFrequency: PayCycleFrequency;
  readonly payDayOfMonth: number;
  readonly providentFundContributionPercent: number;
  readonly taxRegimeDefault: TaxRegime;
  readonly enablePayslipGeneration: boolean;
}

/**
 * @interface NotificationsSettings
 * @description Composite interface configuring distribution settings across multiple communication channels.
 */
export interface NotificationsSettings {
  readonly email: EmailNotificationSettings;
  readonly push: PushNotificationSettings;
  readonly sms: SMSNotificationSettings;
}

/**
 * @interface SecuritySettings
 * @description Access control guidelines, passwords complexity parameters, and session behaviors.
 */
export interface SecuritySettings {
  readonly mfaRequired: boolean;
  readonly passwordMinLength: number;
  readonly passwordRequireSpecialChar: boolean;
  readonly passwordRequireNumbers: boolean;
  readonly sessionTimeoutMinutes: number;
  readonly maxLoginAttempts: number;
}

/**
 * @interface AppearanceSettings
 * @description UI customization rules, visual theme selection, densities, and sidebars.
 */
export interface AppearanceSettings {
  readonly theme: Theme;
  readonly sidebarVariant: SidebarVariant;
  readonly primaryColor: string;
  readonly density: Density;
}

/**
 * @interface AboutSettings
 * @description Production build metadata, license compliance details, and core system descriptors.
 */
export interface AboutSettings {
  readonly version: string;
  readonly buildNumber: string;
  readonly releaseDate: string;
  readonly licenseKey: string;
  readonly licenseType: LicenseType;
  readonly licenseExpiry: string;
}

/**
 * @interface SettingsConfiguration
 * @description Complete global state tree model for the Konark HRMS Settings module configurations.
 */
export interface SettingsConfiguration {
  readonly general: GeneralSettings;
  readonly company: CompanySettings;
  readonly organization: OrganizationSettings;
  readonly attendance: AttendanceSettings;
  readonly leave: LeaveSettings;
  readonly payroll: PayrollSettings;
  readonly notifications: NotificationsSettings;
  readonly security: SecuritySettings;
  readonly appearance: AppearanceSettings;
  readonly about: AboutSettings;
}