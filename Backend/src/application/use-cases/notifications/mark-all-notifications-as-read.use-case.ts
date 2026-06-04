import type { INotificationRepository } from "../../../domain/ports/repositories/notification.repository.js";

export class MarkAllNotificationsAsReadUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute(recipientId: string): Promise<void> {
    return this.notificationRepository.markAllAsRead(recipientId);
  }
}
