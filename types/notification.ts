import type { LucideIcon } from "lucide-react";

/**
 * Notification Categories
 */
export const NOTIFICATION_CATEGORIES = [
  "EMPLOYEE",
  "ATTENDANCE",
  "LEAVE",
  "PAYROLL",
  "DEPARTMENT",
  "SUPPORT",
  "SECURITY",
  "SYSTEM",
  "REMINDER",
  "ANNOUNCEMENT",
] as const;

export type NotificationCategory =
  (typeof NOTIFICATION_CATEGORIES)[number];

/**
 * Notification Priorities
 */
export const NOTIFICATION_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;

export type NotificationPriority =
  (typeof NOTIFICATION_PRIORITIES)[number];

/**
 * Filter Options
 */
export const NOTIFICATION_FILTERS = [
  "ALL",
  "UNREAD",
  "EMPLOYEE",
  "ATTENDANCE",
  "LEAVE",
  "PAYROLL",
  "SUPPORT",
  "SYSTEM",
] as const;

export type NotificationFilter =
  (typeof NOTIFICATION_FILTERS)[number];

/**
 * Notification Action
 */
export interface NotificationAction {
  label: string;
  href: string;
}

/**
 * Main Notification Model
 */
export interface Notification {
  id: string;

  title: string;

  message: string;

  category: NotificationCategory;

  priority: NotificationPriority;

  isRead: boolean;

  timestamp: Date;

  icon: LucideIcon;

  color: string;

  avatar?: string;

  action?: NotificationAction;
}

/**
 * Grouped Notifications
 */
export interface NotificationGroup {
  label: string;

  notifications: Notification[];
}