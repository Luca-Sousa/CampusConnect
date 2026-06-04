import type { INotificationRepository } from "../../../domain/ports/repositories/notification.repository.js";
import type { CreateNotificationInput } from "../../../domain/entities/notification.js";

export class CreateBulkNotificationUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute(inputs: CreateNotificationInput[]): Promise<void> {
    return this.notificationRepository.createMany(inputs);
  }
}
