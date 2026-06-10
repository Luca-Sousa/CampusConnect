import type { Notification, NotificationType } from "./types";

export const TYPE_ICONS: Record<NotificationType, string> = {
  like: "❤️",
  comment: "💬",
  post_created: "📢",
  post_approved: "✅",
  post_moderation_rejected: "🚫",
  group_created: "👥",
  group_message: "✉️",
};

export function getEntityPath(notification: Notification): string {
  switch (notification.entityType) {
    case "post":
      return `/post/${notification.entityId}`;
    case "group":
      return `/groups?chat=${notification.entityId}`;
    case "group_message":
      return `/groups?chat=${notification.entityId}`;
    default:
      return "/feed";
  }
}
