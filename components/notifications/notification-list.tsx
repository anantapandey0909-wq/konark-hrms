import { cn } from "@/lib/utils";
import { NotificationItem } from "./notification-item";
import { NotificationEmpty } from "./notification-empty";
import { NotificationLoading } from "./notification-loading";
import type { Notification, NotificationAction } from "@/types/notification";

export interface NotificationListProps {
  notifications: Notification[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onNotificationClick?: (notification: Notification) => void;
  onActionClick?: (
    notification: Notification,
    action: NotificationAction
  ) => void;
  className?: string;
}

export function NotificationList({
  notifications,
  loading = false,
  emptyTitle,
  emptyDescription,
  onNotificationClick,
  onActionClick,
  className,
}: NotificationListProps) {
  if (loading) {
    return <NotificationLoading />;
  }

  if (notifications.length === 0) {
    return (
      <NotificationEmpty
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <section
      aria-label="Notifications"
      className={cn("overflow-y-auto p-4", className)}
    >
      <ul className="space-y-3">
        {notifications.map((notification) => (
          <li key={notification.id}>
            <NotificationItem
              notification={notification}
              onClick={onNotificationClick}
              onActionClick={onActionClick}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}