import type { IPostRepository } from "../../../domain/ports/repositories/post.repository.js";
import { NotFoundError } from "../../../domain/errors/not-found.js";
import { ForbiddenError } from "../../../domain/errors/forbidden.js";

export interface DeletePostCommand {
  postId: string;
  userId: string;
}

export class DeletePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const post = await this.postRepository.findById(command.postId);

    if (!post) {
      throw new NotFoundError();
    }

    if (post.authorId !== command.userId) {
      throw new ForbiddenError();
    }

    await this.postRepository.delete(command.postId);
  }
}
