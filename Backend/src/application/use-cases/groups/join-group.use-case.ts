import type { IGroupRepository } from "../../../domain/ports/repositories/group.repository.js";

export interface JoinGroupCommand {
  groupId: string;
  userId: string;
}

export class JoinGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(command: JoinGroupCommand): Promise<{ isMember: boolean }> {
    const existing = await this.groupRepository.findById(command.groupId);
    if (!existing) throw new Error("NOT_FOUND");

    const alreadyMember = await this.groupRepository.findMember(
      command.groupId,
      command.userId,
    );

    if (alreadyMember) {
      // Sair do grupo (toggle)
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
