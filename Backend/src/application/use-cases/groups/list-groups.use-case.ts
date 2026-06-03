import type { IGroupRepository, ListGroupsOptions } from "../../../domain/ports/repositories/group.repository.js";
import type { GroupWithAuthor } from "../../../domain/entities/group.js";

export class ListGroupsUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(options: ListGroupsOptions): Promise<GroupWithAuthor[]> {
    return this.groupRepository.findMany(options);
  }
}
