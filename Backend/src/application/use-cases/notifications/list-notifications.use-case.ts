import type { INotificationRepository } from "../../../domain/ports/repositories/notification.repository.js";

export interface ListNotificationsInput {
  recipientId: string;
  limit: number;
  offset: number;
  unreadOnly: boolean;
}

export class ListNotificationsUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute(input: ListNotificationsInput) {
    const { notifications, total } =
      await this.notificationRepository.findManyByRecipient(input.recipientId, {
        limit: input.limit,
        offset: input.offset,
        unreadOnly: input.unreadOnly,
      });

    const unreadCount = await this.notificationRepository.countUnread(
      input.recipientId,
    );

    return { notifications, total, unreadCount };
  }
}
