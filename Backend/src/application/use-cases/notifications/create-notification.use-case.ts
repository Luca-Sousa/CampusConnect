import type { INotificationRepository } from "../../../domain/ports/repositories/notification.repository.js";
import type { CreateNotificationInput } from "../../../domain/entities/notification.js";

export class CreateNotificationUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute(input: CreateNotificationInput) {
    return this.notificationRepository.create(input);
  }
}
