import type { IPostRepository } from "../../../domain/ports/repositories/post.repository.js";

export interface DeletePostCommand {
  postId: string;
  userId: string;
  userRole: string;
}

export interface DeletePostResult {
  notifyAuthor: boolean;
  authorId: string | null;
}

export class DeletePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(command: DeletePostCommand): Promise<DeletePostResult> {
    const post = await this.postRepository.findById(command.postId);

    if (!post) {
      throw new Error("NOT_FOUND");
    }

    if (post.authorId !== command.userId && command.userRole !== "admin") {
      throw new Error("FORBIDDEN");
    }

    // Check if we need to notify the author (admin deleting moderated post of another user)
    const shouldNotify =
      post.moderated === true &&
      command.userRole === "admin" &&
      post.authorId !== command.userId;

    await this.postRepository.delete(command.postId);

    return {
      notifyAuthor: shouldNotify,
      authorId: shouldNotify ? post.authorId : null,
    };
  }
}
