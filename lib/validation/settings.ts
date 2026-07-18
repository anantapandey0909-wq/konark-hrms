/**
 * @file lib/validation/settings.ts
 * @description Centralized validation layer for the Konark HRMS Settings Module.
 * Fully compatible with TypeScript Strict Mode, React 19, and Zod v4.
 */

import * as z from "zod";
import type { 
  SettingsConfiguration,
  GeneralSettings,
  CompanySettings,
  OrganizationSettings,
  AttendanceSettings,
  LeaveSettings,
  PayrollSettings,
  NotificationsSettings,
  SecuritySettings,
  AppearanceSettings,
  AboutSettings,
  OrganizationDepartment,
  OrganizationDesignation,
  LeavePolicy
} from "@/types/settings";
import {
  DATE_FORMATS,
  LANGUAGES,
  TIMEZONES,
  ORG_STRUCTURE_TYPES,
  ACCRUAL_FREQUENCIES,
  PAY_CYCLE_FREQUENCIES,
  TAX_REGIMES,
  THEMES,
  SIDEBAR_VARIANTS,
  DENSITIES,
  LICENSE_TYPES,
  DEPARTMENT_STATUSES,
} from "@/types/settings";

// ==========================================
// 1. REUSABLE REGULAR EXPRESSIONS
// ==========================================

export const FISCAL_YEAR_REGEX = /^\d{2}-\d{2}$/;
export const TIME_REGEX = /^\d{2}:\d{2}$/;
export const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
export const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// ==========================================
// 2. REUSABLE NESTED OBJECT SCHEMAS
// ==========================================

export const companyAddressSchema = z.object({
  street: z.string().min(1, "Street address is required").max(200, "Street address is too long"),
  city: z.string().min(1, "City is required").max(100, "City name is too long"),
  state: z.string().min(1, "State/Province is required").max(100, "State name is too long"),
  postalCode: z.string().min(1, "Postal/ZIP code is required").max(20, "Postal code is too long"),
  country: z.string().min(1, "Country is required").max(100, "Country name is too long"),
}).strict();

export const emailNotificationSettingsSchema = z.object({
  systemAlerts: z.boolean(),
  leaveApprovals: z.boolean(),
  payrollDisbursal: z.boolean(),
  performanceReviews: z.boolean(),
}).strict();

export const pushNotificationSettingsSchema = z.object({
  attendanceReminders: z.boolean(),
  announcements: z.boolean(),
  chatMessages: z.boolean(),
}).strict();

export const smsNotificationSettingsSchema = z.object({
  criticalAlerts: z.boolean(),
  otpVerification: z.boolean(),
}).strict();

// ==========================================
// 3. MAIN FORM SCHEMAS BY CONFIG DOMAIN
// ==========================================

export const generalSettingsSchema = z.object({
  systemName: z.string().min(3, "System name must be at least 3 characters").max(100, "System name exceeds maximum length"),
  supportEmail: z.string().email("Please provide a valid support email address"),
  timezone: z.string().refine(
    (val) => TIMEZONES.some((tz) => tz.value === val),
    { message: "Please select a valid timezone" }
  ),
  dateFormat: z.string().refine(
    (val) => DATE_FORMATS.some((df) => df.value === val),
    { message: "Please select a valid date format" }
  ),
  timeFormat: z.enum(["12h", "24h"]),
  defaultLanguage: z.string().refine(
    (val) => LANGUAGES.some((lang) => lang.value === val),
    { message: "Please select a valid default language" }
  ),
  fiscalYearStart: z.string().regex(FISCAL_YEAR_REGEX, "Fiscal year start must follow MM-DD format structure"),
}).strict() satisfies z.ZodType<GeneralSettings>;

export const companySettingsSchema = z.object({
  legalName: z.string().min(2, "Legal company name must be at least 2 characters").max(150, "Legal name exceeds capacity"),
  tradeName: z.string().min(2, "Corporate trade name must be at least 2 characters").max(100, "Trade name exceeds capacity"),
  taxIdentifier: z.string().min(1, "Tax identification parameter is required"),
  registrationNumber: z.string().min(1, "Corporate registration tracking string is required"),
  industry: z.string().min(1, "Industry categorization is required"),
  website: z.string().url("Please input a valid corporate website URL"),
  contactEmail: z.string().email("Please provide a valid company contact email address"),
  contactPhone: z.string().min(5, "Contact phone is invalid").max(30, "Phone number exceeds max capacity"),
  address: companyAddressSchema,
}).strict() satisfies z.ZodType<CompanySettings>;

export const organizationDepartmentSchema = z.object({
  id: z.string().min(1, "Department identifier is required"),
  name: z.string().min(2, "Department name must be at least 2 characters").max(100),
  code: z.string().min(2, "Department tracking code is required").max(10),
  headOfDepartmentId: z.string().optional(),
  status: z.enum(DEPARTMENT_STATUSES),
}).strict() satisfies z.ZodType<OrganizationDepartment>;

export const organizationDesignationSchema = z.object({
  id: z.string().min(1, "Designation identifier is required"),
  title: z.string().min(2, "Designation title is required").max(100),
  departmentId: z.string().min(1, "Department assignment is required"),
  gradeLevel: z.string().min(1, "Grade classification tier is required"),
}).strict() satisfies z.ZodType<OrganizationDesignation>;

export const organizationSettingsSchema = z.object({
  departments: z.array(organizationDepartmentSchema),
  designations: z.array(organizationDesignationSchema),
  orgStructureType: z.enum(ORG_STRUCTURE_TYPES),
  enableMatrixReporting: z.boolean(),
}).strict() satisfies z.ZodType<OrganizationSettings>;

export const attendanceSettingsSchema = z.object({
  standardWorkHours: z.number().min(1, "Minimum standard hours must be 1").max(24, "Maximum standard hours cannot exceed 24"),
  enableAutoClockOut: z.boolean(),
  autoClockOutTime: z.string().regex(TIME_REGEX, "Must represent standard 24h clock syntax HH:MM"),
  gracePeriodMinutes: z.number().min(0, "Grace period duration must be a positive integer"),
  overtimeCalculationThresholdHours: z.number().min(0, "Weekly threshold duration must be non-negative").max(168, "Threshold duration exceeds weekly capacity limit"),
  ipRestrictedClockIn: z.boolean(),
  allowedIpAddresses: z.array(z.string().regex(IPV4_REGEX, "Allowed addresses must compile to standard IPv4 patterns")),
}).strict() satisfies z.ZodType<AttendanceSettings>;

export const leavePolicySchema = z.object({
  id: z.string().min(1, "Policy tracking ID is required"),
  leaveType: z.string().min(1, "Leave type string descriptor is required").max(100),
  annualQuotaDays: z.number().min(0, "Annual quota must be a positive integer").max(365, "Allocation exceeds calendar capacity limit"),
  accrualFrequency: z.enum(ACCRUAL_FREQUENCIES),
  carryForwardMaxDays: z.number().min(0, "Accrual carry-forward maximum cannot represent negative values"),
  requiresApproval: z.boolean(),
}).strict() satisfies z.ZodType<LeavePolicy>;

export const leaveSettingsSchema = z.object({
  policies: z.array(leavePolicySchema),
  allowNegativeBalance: z.boolean(),
  sandwichRuleEnabled: z.boolean(),
}).strict() satisfies z.ZodType<LeaveSettings>;

export const payrollSettingsSchema = z.object({
  currency: z.string().min(1, "Currency string registration identifier is required").max(10),
  payCycleFrequency: z.enum(PAY_CYCLE_FREQUENCIES),
  payDayOfMonth: z.number().min(1, "Processing day must be at least 1").max(31, "Processing day cannot exceed 31"),
  providentFundContributionPercent: z.number().min(0, "PF parameter must be non-negative").max(100, "PF parameter cannot exceed 100%"),
  taxRegimeDefault: z.enum(TAX_REGIMES),
  enablePayslipGeneration: z.boolean(),
}).strict() satisfies z.ZodType<PayrollSettings>;

export const notificationsSettingsSchema = z.object({
  email: emailNotificationSettingsSchema,
  push: pushNotificationSettingsSchema,
  sms: smsNotificationSettingsSchema,
}).strict() satisfies z.ZodType<NotificationsSettings>;

export const securitySettingsSchema = z.object({
  mfaRequired: z.boolean(),
  passwordMinLength: z.number().min(8, "Security passwords must require at least 8 characters").max(128, "Max length exceeded"),
  passwordRequireSpecialChar: z.boolean(),
  passwordRequireNumbers: z.boolean(),
  sessionTimeoutMinutes: z.number().min(1, "Session active duration must represent at least 1 minute").max(1440, "Session timeout cannot exceed 24 hours"),
  maxLoginAttempts: z.number().min(1, "Max attempts threshold must require at least 1 login attempt").max(20, "Threshold exceeds realistic enterprise limits"),
}).strict() satisfies z.ZodType<SecuritySettings>;

export const appearanceSettingsSchema = z.object({
  theme: z.enum(THEMES),
  sidebarVariant: z.enum(SIDEBAR_VARIANTS),
  primaryColor: z.string().regex(HEX_COLOR_REGEX, "Primary aesthetic theme configuration must follow valid hexadecimal syntax"),
  density: z.enum(DENSITIES),
}).strict() satisfies z.ZodType<AppearanceSettings>;

export const aboutSettingsSchema = z.object({
  version: z.string().min(1, "Core deployment release version is required"),
  buildNumber: z.string().min(1, "Operational system build sequence metadata is required"),
  releaseDate: z.string().min(1, "Operational system release calendar entry is required"),
  licenseKey: z.string().min(1, "Enterprise validation license key identifier is required"),
  licenseType: z.enum(LICENSE_TYPES),
  licenseExpiry: z.string().min(1, "Enterprise validation license expiry tracking record is required"),
}).strict() satisfies z.ZodType<AboutSettings>;

// ==========================================
// 4. COMPOSITE MASTER CONFIGURATION SCHEMA
// ==========================================

export const settingsConfigurationSchema: z.ZodType<SettingsConfiguration> = z.object({
  general: generalSettingsSchema,
  company: companySettingsSchema,
  organization: organizationSettingsSchema,
  attendance: attendanceSettingsSchema,
  leave: leaveSettingsSchema,
  payroll: payrollSettingsSchema,
  notifications: notificationsSettingsSchema,
  security: securitySettingsSchema,
  appearance: appearanceSettingsSchema,
  about: aboutSettingsSchema,
}).strict();