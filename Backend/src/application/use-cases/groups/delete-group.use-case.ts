import type { IGroupRepository } from "../../../domain/ports/repositories/group.repository.js";

export interface DeleteGroupCommand {
  groupId: string;
  userId: string;
  userRole: string;
}

export class DeleteGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(command: DeleteGroupCommand): Promise<void> {
    const existing = await this.groupRepository.findById(command.groupId);
    if (!existing) throw new Error("NOT_FOUND");

    const canDelete = await this.groupRepository.isAuthorOrAdmin(
      command.groupId,
      command.userId,
      command.userRole,
    );
    if (!canDelete) throw new Error("FORBIDDEN");

    await this.groupRepository.delete(command.groupId);
  }
}
