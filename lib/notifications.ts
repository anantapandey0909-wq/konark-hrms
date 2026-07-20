import type {
  Notification,
  NotificationFilter,
  NotificationGroup,
} from "@/types/notification";

/**
 * Format a notification timestamp into a relative time string.
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString();
}

/**
 * Filter notifications based on the selected filter.
 */
export function filterNotifications(
  notifications: Notification[],
  filter: NotificationFilter
): Notification[] {
  switch (filter) {
    case "ALL":
      return notifications;

    case "UNREAD":
      return notifications.filter((notification) => !notification.isRead);

    default:
      return notifications.filter(
        (notification) => notification.category === filter
      );
  }
}

/**
 * Calculate unread notification count.
 */
export function unreadCount(notifications: Notification[]): number {
  return notifications.filter((notification) => !notification.isRead).length;
}

/**
 * Mark a single notification as read.
 */
export function markAsRead(
  notifications: Notification[],
  id: string
): Notification[] {
  return notifications.map((notification) =>
    notification.id === id
      ? {
          ...notification,
          isRead: true,
        }
      : notification
  );
}

/**
 * Mark all notifications as read.
 */
export function markAllAsRead(
  notifications: Notification[]
): Notification[] {
  return notifications.map((notification) => ({
    ...notification,
    isRead: true,
  }));
}

/**
 * Group notifications by date.
 */
export function groupNotifications(
  notifications: Notification[]
): NotificationGroup[] {
  const groups = new Map<string, Notification[]>();

  notifications.forEach((notification) => {
    const now = new Date();
    const notificationDate = new Date(notification.timestamp);

    const isToday =
      now.toDateString() === notificationDate.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      yesterday.toDateString() === notificationDate.toDateString();

    let label = notificationDate.toLocaleDateString();

    if (isToday) {
      label = "Today";
    } else if (isYesterday) {
      label = "Yesterday";
    }

    const existing = groups.get(label);

    if (existing) {
      existing.push(notification);
    } else {
      groups.set(label, [notification]);
    }
  });

  return Array.from(groups.entries()).map(([label, notifications]) => ({
    label,
    notifications,
  }));
}