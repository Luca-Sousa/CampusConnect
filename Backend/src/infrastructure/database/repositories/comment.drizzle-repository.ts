import { and, asc, count, eq } from "drizzle-orm";
import { db } from "../client.js";
import { comment } from "../schema/posts.schema.js";
import { user } from "../schema/auth.schema.js";
import type {
  Comment,
  CommentWithAuthor,
} from "../../../domain/entities/comment.js";
import type { ICommentRepository } from "../../../domain/ports/repositories/comment-repository.js";

export class CommentDrizzleRepository implements ICommentRepository {
  async create(data: {
    postId: string;
    authorId: string;
    parentId?: string;
    content: string;
  }): Promise<Comment> {
    const [created] = await db
      .insert(comment)
      .values({
        postId: data.postId,
        authorId: data.authorId,
        parentId: data.parentId ?? null,
        content: data.content,
      })
      .returning();

    return created as Comment;
  }

  async findByPostId(postId: string): Promise<CommentWithAuthor[]> {
    const rows = await db
      .select({
        id: comment.id,
        postId: comment.postId,
        authorId: comment.authorId,
        parentId: comment.parentId,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: {
          id: user.id,
          name: user.name,
          image: user.image,
          cargo: user.cargo,
        },
      })
      .from(comment)
      .leftJoin(user, eq(comment.authorId, user.id))
      .where(eq(comment.postId, postId))
      .orderBy(asc(comment.createdAt));

    return rows.map((row) => ({
      ...row,
      author: row.author?.id ? row.author : null,
    }));
  }

  async countByPostId(postId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(comment)
      .where(eq(comment.postId, postId));
    return Number(result[0]?.count ?? 0);
  }

  async delete(id: string, userId: string): Promise<void> {
    await db
      .delete(comment)
      .where(and(eq(comment.id, id), eq(comment.authorId, userId)));
  }

  async findById(id: string): Promise<Comment | null> {
    const [existing] = await db
      .select()
      .from(comment)
      .where(eq(comment.id, id))
      .limit(1);

    return (existing as Comment) ?? null;
  }
}
