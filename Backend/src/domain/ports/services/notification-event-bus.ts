import type { NotificationType } from "../../entities/notification.js";

export interface NotificationEvent {
  type: NotificationType;
  actorId: string | null;
  entityType: string;
  entityId: string;
  recipientIds: string[];
  message: string;
}

export type NotificationEventHandler = (event: NotificationEvent) => void | Promise<void>;

export interface INotificationEventBus {
  emit(event: NotificationEvent): void;
  on(handler: NotificationEventHandler): void;
}
