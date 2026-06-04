import type { Comment, CommentWithAuthor } from "../../entities/comment.js";

export interface ICommentRepository {
  create(data: {
    postId: string;
    authorId: string;
    parentId?: string;
    content: string;
  }): Promise<Comment>;

  findByPostId(postId: string): Promise<CommentWithAuthor[]>;

  countByPostId(postId: string): Promise<number>;

  delete(id: string, userId: string): Promise<void>;

  findById(id: string): Promise<Comment | null>;
}
