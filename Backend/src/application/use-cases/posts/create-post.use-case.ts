import type { IPostRepository } from "../../../domain/ports/repositories/post.repository.js";
import type { Post, CreatePostInput } from "../../../domain/entities/post.js";
import { OFFICIAL_CARGOS } from "../../constants/permissions.js";

export interface CreatePostCommand extends CreatePostInput {
  userRole: string;
  userCargo: string;
}

export class CreatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(command: CreatePostCommand): Promise<Post> {
    if (command.type === "news") {
      if (
        command.userRole !== "admin" &&
        !OFFICIAL_CARGOS.has(command.userCargo)
      ) {
        throw new Error("FORBIDDEN");
      }
    }

    return this.postRepository.create(command);
  }
}
