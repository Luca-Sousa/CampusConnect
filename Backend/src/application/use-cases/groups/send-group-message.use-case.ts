import type { IGroupRepository } from "../../../domain/ports/repositories/group.repository.js";
import type { GroupMessageWithAuthor } from "../../../domain/entities/group.js";
import { NotFoundError } from "../../../domain/errors/not-found.js";
import { ForbiddenError } from "../../../domain/errors/forbidden.js";

export interface SendGroupMessageCommand {
  groupId: string;
  authorId: string;
  content: string;
}

export class SendGroupMessageUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(command: SendGroupMessageCommand): Promise<GroupMessageWithAuthor> {
    const group = await this.groupRepository.findById(command.groupId);
    if (!group) throw new NotFoundError();

    // Verifica se é membro
    const isMember = await this.groupRepository.findMember(
      command.groupId,
      command.authorId,
    );
    if (!isMember) throw new ForbiddenError();

    return this.groupRepository.createMessage(
      command.groupId,
      command.authorId,
      command.content,
    );
  }
}
