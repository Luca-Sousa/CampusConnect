import type {
  Notification,
  NotificationWithActor,
  CreateNotificationInput,
} from "../../entities/notification.js";

export interface INotificationRepository {
  create(input: CreateNotificationInput): Promise<Notification>;
  createMany(inputs: CreateNotificationInput[]): Promise<void>;
  findByRecipient(
    recipientId: string,
    options: { limit: number; offset: number },
  ): Promise<NotificationWithActor[]>;
  countUnread(recipientId: string): Promise<number>;
  markAsRead(id: string, recipientId: string): Promise<void>;
  markAllAsRead(recipientId: string): Promise<void>;
  findManyByRecipient(
    recipientId: string,
    options: { limit: number; offset: number; unreadOnly: boolean },
  ): Promise<{ notifications: NotificationWithActor[]; total: number }>;
}
