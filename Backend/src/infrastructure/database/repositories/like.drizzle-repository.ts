import { and, count, eq } from "drizzle-orm";
import { db } from "../client.js";
import { like } from "../schema/posts.schema.js";
import type { Like, ToggleLikeResult } from "../../../domain/entities/like.js";
import type { ILikeRepository } from "../../../domain/ports/repositories/like-repository.js";

export class LikeDrizzleRepository implements ILikeRepository {
  async toggle(postId: string, userId: string): Promise<ToggleLikeResult> {
    const existing = await this.findByPostAndUser(postId, userId);

    if (existing) {
      await db.delete(like).where(eq(like.id, existing.id));
    } else {
      await db.insert(like).values({ postId, userId });
    }

    const likesCount = await this.countByPostId(postId);
    return { hasLiked: !existing, likesCount };
  }

  async countByPostId(postId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(like)
      .where(eq(like.postId, postId));
    return Number(result[0]?.count ?? 0);
  }

  async hasUserLiked(postId: string, userId: string): Promise<boolean> {
    const result = await this.findByPostAndUser(postId, userId);
    return result !== null;
  }

  async findByPostAndUser(
    postId: string,
    userId: string,
  ): Promise<Like | null> {
    const [existing] = await db
      .select()
      .from(like)
      .where(and(eq(like.postId, postId), eq(like.userId, userId)))
      .limit(1);

    return (existing as Like) ?? null;
  }
}
