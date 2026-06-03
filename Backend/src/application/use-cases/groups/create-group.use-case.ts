import type { IGroupRepository } from "../../../domain/ports/repositories/group.repository.js";
import type { Group, CreateGroupInput } from "../../../domain/entities/group.js";

export interface CreateGroupCommand extends CreateGroupInput {
  userRole: string;
}

export class CreateGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(command: CreateGroupCommand): Promise<Group> {
    return this.groupRepository.create({
      name: command.name,
      description: command.description,
      authorId: command.authorId,
    });
  }
}
