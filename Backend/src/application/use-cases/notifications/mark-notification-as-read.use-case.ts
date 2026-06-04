import type { INotificationRepository } from "../../../domain/ports/repositories/notification.repository.js";

export class MarkNotificationAsReadUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute(input: { id: string; recipientId: string }): Promise<void> {
    return this.notificationRepository.markAsRead(input.id, input.recipientId);
  }
}
