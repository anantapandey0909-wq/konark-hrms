/**
 * @file mock/settings.ts
 * @description Centralized, strictly typed mock configuration datasets for the Settings Module.
 * Conforms 100% to TypeScript Strict Mode and standard domain schemas.
 */

import { 
  SettingsConfiguration, 
  SettingsNavItem, 
  SettingsCardMetadata 
} from "@/types/settings";

// ==========================================
// 1. GLOBAL SYSTEM CONFIGURATION DATA
// ==========================================

export const settingsConfiguration: SettingsConfiguration = {
  general: {
    systemName: "Konark HRMS Portal",
    supportEmail: "support@konark.io",
    timezone: "Asia/Kolkata",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "24h",
    defaultLanguage: "en",
    fiscalYearStart: "04-01",
  },
  company: {
    legalName: "Konark Enterprise Solutions Private Limited",
    tradeName: "Konark Solutions",
    taxIdentifier: "27AAAAA1234A1Z5",
    registrationNumber: "U74900MH2025PTC123456",
    industry: "Enterprise Technology & SaaS Solutions",
    website: "https://konark.io",
    contactEmail: "contact@konark.io",
    contactPhone: "+91 22 5555 1234",
    address: {
      street: "101, Technology Business Park, Sector 4",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
  },
  organization: {
    departments: [
      { id: "dept-eng", name: "Engineering", code: "ENG", headOfDepartmentId: "emp-001", status: "active" },
      { id: "dept-hr", name: "Human Resources", code: "HR", headOfDepartmentId: "emp-005", status: "active" },
      { id: "dept-fin", name: "Finance", code: "FIN", headOfDepartmentId: "emp-012", status: "active" },
    ],
    designations: [
      { id: "desg-se", title: "Software Engineer", departmentId: "dept-eng", gradeLevel: "L1" },
      { id: "desg-le", title: "Lead Engineer", departmentId: "dept-eng", gradeLevel: "L3" },
      { id: "desg-hrm", title: "HR Manager", departmentId: "dept-hr", gradeLevel: "M2" },
    ],
    orgStructureType: "hierarchical",
    enableMatrixReporting: true,
  },
  attendance: {
    standardWorkHours: 8,
    enableAutoClockOut: true,
    autoClockOutTime: "19:00",
    gracePeriodMinutes: 15,
    overtimeCalculationThresholdHours: 40,
    ipRestrictedClockIn: true,
    allowedIpAddresses: ["192.168.1.1", "10.0.0.12"],
  },
  leave: {
    allowNegativeBalance: false,
    sandwichRuleEnabled: true,
    policies: [
      { id: "pol-cl", leaveType: "Casual Leave", annualQuotaDays: 12, accrualFrequency: "monthly", carryForwardMaxDays: 3, requiresApproval: true },
      { id: "pol-sl", leaveType: "Sick Leave", annualQuotaDays: 10, accrualFrequency: "yearly", carryForwardMaxDays: 0, requiresApproval: false },
      { id: "pol-el", leaveType: "Earned Leave", annualQuotaDays: 18, accrualFrequency: "monthly", carryForwardMaxDays: 45, requiresApproval: true },
    ],
  },
  payroll: {
    currency: "INR",
    payCycleFrequency: "monthly",
    payDayOfMonth: 28,
    providentFundContributionPercent: 12.00,
    taxRegimeDefault: "new",
    enablePayslipGeneration: true,
  },
  notifications: {
    email: {
      systemAlerts: true,
      leaveApprovals: true,
      payrollDisbursal: true,
      performanceReviews: true,
    },
    push: {
      attendanceReminders: true,
      announcements: true,
      chatMessages: false,
    },
    sms: {
      criticalAlerts: true,
      otpVerification: true,
    },
  },
  security: {
    mfaRequired: true,
    passwordMinLength: 10,
    passwordRequireSpecialChar: true,
    passwordRequireNumbers: true,
    sessionTimeoutMinutes: 30,
    maxLoginAttempts: 5,
  },
  appearance: {
    theme: "system",
    sidebarVariant: "expanded",
    primaryColor: "#4f46e5",
    density: "comfortable",
  },
  about: {
    version: "1.2.0",
    buildNumber: "20250101.44",
    releaseDate: "2025-01-01",
    licenseKey: "KNARK-ENT-8899-7722-X781",
    licenseType: "enterprise",
    licenseExpiry: "2026-12-31",
  },
};

// ==========================================
// 2. NAVIGATION SIDEBAR DATA
// ==========================================

export const settingsNavigation: SettingsNavItem[] = [
  {
    id: "general",
    label: "General Settings",
    description: "System identity, timezone, and calendar",
    iconName: "Globe",
    category: "core",
  },
  {
    id: "company",
    label: "Company Directory",
    description: "Corporate registry and tax profiles",
    iconName: "Building2",
    category: "core",
  },
  {
    id: "organization",
    label: "Organizational Structure",
    description: "Corporate hierarchy, departments, and nodes",
    iconName: "Network",
    category: "core",
  },
  {
    id: "attendance",
    label: "Attendance Controls",
    description: "Grace periods, overtime, and networks",
    iconName: "Clock",
    category: "workforce",
  },
  {
    id: "leave",
    label: "Leave Rules",
    description: "Quota, roll-overs, and sandwich policies",
    iconName: "CalendarDays",
    category: "workforce",
  },
  {
    id: "payroll",
    label: "Payroll Configurations",
    description: "Currency setups, PF percentage, and cycles",
    iconName: "CreditCard",
    category: "workforce",
  },
  {
    id: "notifications",
    label: "Communications",
    description: "Alert routing across SMS, Mail, and Push",
    iconName: "BellRing",
    category: "preferences",
  },
  {
    id: "security",
    label: "Access Security",
    description: "MFA setups, password standards, and lockouts",
    iconName: "ShieldAlert",
    category: "preferences",
  },
  {
    id: "appearance",
    label: "Theme & Styling",
    description: "Branding colors, layout density, and view modes",
    iconName: "Palette",
    category: "preferences",
  },
  {
    id: "about",
    label: "Deployment & Licenses",
    description: "Build keys, compliance, and expiry indices",
    iconName: "Cpu",
    category: "preferences",
  },
];

// ==========================================
// 3. DASHBOARD OVERVIEW CARD DATA
// ==========================================

export const settingsCards: SettingsCardMetadata[] = [
  {
    id: "general",
    title: "General Settings",
    description: "Manage default timezones, global locale configurations, and system portal naming structures.",
    iconName: "Globe",
    category: "core",
    routePath: "/settings/general",
  },
  {
    id: "company",
    title: "Company Settings",
    description: "Update company registry data, contact coordinates, websites, and official street office addresses.",
    iconName: "Building2",
    category: "core",
    routePath: "/settings/company",
  },
  {
    id: "organization",
    title: "Organization Settings",
    description: "Define executive designations, dynamic departments, reporting guidelines, and corporate structures.",
    iconName: "Network",
    category: "core",
    routePath: "/settings/organization",
  },
  {
    id: "attendance",
    title: "Attendance Settings",
    description: "Configure daily shift durations, flexible grace parameters, weekly overtime calculation limits, and IP address ranges.",
    iconName: "Clock",
    category: "workforce",
    routePath: "/settings/attendance",
  },
  {
    id: "leave",
    title: "Leave Settings",
    description: "Manage leave-accrual policies, carry-over rollover day limits, approval workflows, and sandwich rules.",
    iconName: "CalendarDays",
    category: "workforce",
    routePath: "/settings/leave",
  },
  {
    id: "payroll",
    title: "Payroll Settings",
    description: "Specify execution frequencies, transactional currency symbols, default tax guidelines, and statutory savings rates.",
    iconName: "CreditCard",
    category: "workforce",
    routePath: "/settings/payroll",
  },
  {
    id: "notifications",
    title: "Notification Settings",
    description: "Toggle auto-triggered delivery protocols across SMS, browser-level push channels, and company emails.",
    iconName: "BellRing",
    category: "preferences",
    routePath: "/settings/notifications",
  },
  {
    id: "security",
    title: "Security Settings",
    description: "Configure strict password complexity boundaries, session inactivity limits, and lockout strategies.",
    iconName: "ShieldAlert",
    category: "preferences",
    routePath: "/settings/security",
  },
  {
    id: "appearance",
    title: "Appearance Settings",
    description: "Customize dark-light theme preferences, visual branding colors, navigation bars, and layout density.",
    iconName: "Palette",
    category: "preferences",
    routePath: "/settings/appearance",
  },
  {
    id: "about",
    title: "System & About Settings",
    description: "Verify version identifiers, system development build parameters, and manage activation product keys.",
    iconName: "Cpu",
    category: "preferences",
    routePath: "/settings/about",
  },
];