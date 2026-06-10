import type { IGroupRepository } from "../../../domain/ports/repositories/group.repository.js";
import { NotFoundError } from "../../../domain/errors/not-found.js";
import { ForbiddenError } from "../../../domain/errors/forbidden.js";

export interface JoinGroupCommand {
  groupId: string;
  userId: string;
}

export class JoinGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(command: JoinGroupCommand): Promise<{ isMember: boolean }> {
    const existing = await this.groupRepository.findById(command.groupId);
    if (!existing) throw new NotFoundError();

    const alreadyMember = await this.groupRepository.findMember(
      command.groupId,
      command.userId,
    );

    if (alreadyMember) {
      if (existing.authorId === command.userId) {
        throw new ForbiddenError("O criador não pode sair do grupo.");
      }

      await this.groupRepository.removeMember(
        command.groupId,
        command.userId,
      );
      return { isMember: false };
    }

    await this.groupRepository.addMember(command.groupId, command.userId);
    return { isMember: true };
  }
}
