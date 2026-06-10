import type { IPostRepository } from "../../../domain/ports/repositories/post.repository.js";
import type { Post } from "../../../domain/entities/post.js";

export interface ApprovePostCommand {
  postId: string;
  userId: string;
  userRole: string;
}

export class ApprovePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(command: ApprovePostCommand): Promise<Post> {
    const post = await this.postRepository.findById(command.postId);

    if (!post) {
      throw new Error("NOT_FOUND");
    }

    if (command.userRole !== "admin") {
      throw new Error("FORBIDDEN");
    }

    return this.postRepository.update(command.postId, {
      moderated: false,
      moderationReasons: [],
    });
  }
}
