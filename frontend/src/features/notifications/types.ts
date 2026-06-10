export type NotificationType =
  | "like"
  | "comment"
  | "post_created"
  | "post_approved"
  | "post_moderation_rejected"
  | "group_created"
  | "group_message";

export interface NotificationActor {
  id: string;
  name: string;
  image: string | null;
}

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string | null;
  type: NotificationType;
  entityType: string;
  entityId: string;
  message: string;
  readAt: string | null;
  createdAt: string;
  actor: NotificationActor | null;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

export interface UnreadCountResponse {
  count: number;
}
