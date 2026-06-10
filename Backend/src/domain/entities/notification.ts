export type NotificationType =
  | "like"
  | "comment"
  | "post_created"
  | "post_approved"
  | "post_moderation_rejected"
  | "group_created"
  | "group_message";

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string | null;
  type: NotificationType;
  entityType: string;
  entityId: string;
  message: string;
  readAt: Date | null;
  createdAt: Date;
}

export interface NotificationActor {
  id: string;
  name: string;
  image: string | null;
}

export interface NotificationWithActor extends Notification {
  actor: NotificationActor | null;
}

export interface CreateNotificationInput {
  recipientId: string;
  actorId: string | null;
  type: NotificationType;
  entityType: string;
  entityId: string;
  message: string;
}
