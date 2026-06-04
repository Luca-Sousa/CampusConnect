import type { CommentWithAuthor } from "../../domain/entities/comment.js";
import type { ICommentRepository } from "../../domain/ports/repositories/comment-repository.js";

export class ListCommentsUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(input: { postId: string }): Promise<CommentWithAuthor[]> {
    const comments = await this.commentRepository.findByPostId(input.postId);
    return this.buildTree(comments);
  }

  private buildTree(comments: CommentWithAuthor[]): CommentWithAuthor[] {
    const root = comments.filter((c) => c.parentId === null);
    const children = comments.filter((c) => c.parentId !== null);

    return root.map((comment) => ({
      ...comment,
      replies: children.filter((c) => c.parentId === comment.id),
    }));
  }
}
