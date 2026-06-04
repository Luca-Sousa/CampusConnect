import type { INotificationEventBus, NotificationEvent } from "../../domain/ports/services/notification-event-bus.js";
import type { INotificationRepository } from "../../domain/ports/repositories/notification.repository.js";

export class NotificationEventHandler {
  constructor(
    private readonly eventBus: INotificationEventBus,
    private readonly notificationRepository: INotificationRepository,
  ) {
    this.eventBus.on(this.handle.bind(this));
  }

  private async handle(event: NotificationEvent): Promise<void> {
    const inputs = event.recipientIds.map((recipientId) => ({
      recipientId,
      actorId: event.actorId,
      type: event.type,
      entityType: event.entityType,
      entityId: event.entityId,
      message: event.message,
    }));

    await this.notificationRepository.createMany(inputs);
  }
}
