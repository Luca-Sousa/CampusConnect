import type { IGroupRepository, ListMessagesOptions } from "../../../domain/ports/repositories/group.repository.js";
import type { GroupMessageWithAuthor } from "../../../domain/entities/group.js";

export class ListGroupMessagesUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(options: ListMessagesOptions): Promise<GroupMessageWithAuthor[]> {
    const group = await this.groupRepository.findById(options.groupId);
    if (!group) throw new Error("NOT_FOUND");

    return this.groupRepository.findMessages(options);
  }
}
