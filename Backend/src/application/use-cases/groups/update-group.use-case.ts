import type { IGroupRepository } from "../../../domain/ports/repositories/group.repository.js";
import type { Group, UpdateGroupInput } from "../../../domain/entities/group.js";
import { NotFoundError } from "../../../domain/errors/not-found.js";
import { ForbiddenError } from "../../../domain/errors/forbidden.js";

export interface UpdateGroupCommand {
  groupId: string;
  userId: string;
  userRole: string;
  input: UpdateGroupInput;
}

export class UpdateGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(command: UpdateGroupCommand): Promise<Group> {
    const existing = await this.groupRepository.findById(command.groupId);
    if (!existing) throw new NotFoundError();

    const canEdit = await this.groupRepository.isAuthorOrAdmin(
      command.groupId,
      command.userId,
      command.userRole,
    );
    if (!canEdit) throw new ForbiddenError();

    return this.groupRepository.update(command.groupId, command.input);
  }
}
