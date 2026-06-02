import type { IPostRepository } from "../../../domain/ports/repositories/post.repository.js";

export interface DeletePostCommand {
  postId: string;
  userId: string;
  userRole: string;
}

export class DeletePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const post = await this.postRepository.findById(command.postId);

    if (!post) {
      throw new Error("NOT_FOUND");
    }

    if (post.authorId !== command.userId && command.userRole !== "admin") {
      throw new Error("FORBIDDEN");
    }

    await this.postRepository.delete(command.postId);
  }
}
