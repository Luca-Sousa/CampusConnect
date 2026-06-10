import type {
  INotificationEventBus,
  NotificationEvent,
  NotificationEventHandler,
} from "../../domain/ports/services/notification-event-bus.js";

export class InMemoryNotificationEventBus implements INotificationEventBus {
  private handlers: NotificationEventHandler[] = [];

  emit(event: NotificationEvent): void {
    for (const handler of this.handlers) {
      Promise.resolve(handler(event)).catch((err) => {
        console.error("[NotificationEventBus] Handler error:", err);
      });
    }
  }

  on(handler: NotificationEventHandler): void {
    this.handlers.push(handler);
  }
}
