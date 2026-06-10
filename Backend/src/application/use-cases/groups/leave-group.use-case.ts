import type { IGroupRepository } from "../../../domain/ports/repositories/group.repository.js";
import { NotFoundError } from "../../../domain/errors/not-found.js";
import { ForbiddenError } from "../../../domain/errors/forbidden.js";

export interface LeaveGroupCommand {
  groupId: string;
  userId: string;
}

export class LeaveGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(command: LeaveGroupCommand): Promise<void> {
    const existing = await this.groupRepository.findById(command.groupId);
    if (!existing) throw new NotFoundError();

    // Não pode sair se for o autor do grupo
    if (existing.authorId === command.userId) {
      throw new ForbiddenError();
    }

    await this.groupRepository.removeMember(command.groupId, command.userId);
  }
}
