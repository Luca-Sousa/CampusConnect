import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../client.js";
import { post, rsvp } from "../schema/posts.schema.js";
import { user } from "../schema/auth.schema.js";
import type {
  IPostRepository,
  ListPostsOptions,
} from "../../../domain/ports/repositories/post.repository.js";
import type {
  Post,
  PostWithAuthor,
  CreatePostInput,
} from "../../../domain/entities/post.js";

export class PostDrizzleRepository implements IPostRepository {
  async create(input: CreatePostInput): Promise<Post> {
    const [created] = await db
      .insert(post)
      .values({
        authorId: input.authorId,
        type: input.type,
        content: input.content ?? null,
        imageUrl: input.imageUrl ?? null,
        eventTitle: input.eventTitle ?? null,
        eventDate: input.eventDate ?? null,
        eventTime: input.eventTime ?? null,
        eventLocation: input.eventLocation ?? null,
        newsTitle: input.newsTitle ?? null,
      })
      .returning();

    return created as Post;
  }

  async findById(
    id: string,
  ): Promise<Pick<Post, "id" | "authorId" | "type"> | null> {
    const [existing] = await db
      .select({ id: post.id, authorId: post.authorId, type: post.type })
      .from(post)
      .where(eq(post.id, id))
      .limit(1);

    return existing ?? null;
  }

  async findMany(options: ListPostsOptions): Promise<PostWithAuthor[]> {
    const rows = await db
      .select({
        post,
        author: {
          id: user.id,
          name: user.name,
          cargo: user.cargo,
        },
        rsvpCount: count(rsvp.id),
      })
      .from(post)
      .leftJoin(user, eq(post.authorId, user.id))
      .leftJoin(rsvp, eq(rsvp.postId, post.id))
      .groupBy(post.id, user.id)
      .orderBy(desc(post.createdAt))
      .limit(options.limit)
      .offset(options.offset);

    return Promise.all(
      rows.map(async (row) => {
        if (row.post.type !== "event" || !options.currentUserId) {
          return {
            ...row.post,
            author: row.author,
            rsvpCount: Number(row.rsvpCount),
            hasRsvp: false,
          };
        }

        const existingRsvp = await this.findRsvp(
          row.post.id,
          options.currentUserId,
        );

        return {
          ...row.post,
          author: row.author,
          rsvpCount: Number(row.rsvpCount),
          hasRsvp: !!existingRsvp,
        };
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await db.delete(post).where(eq(post.id, id));
  }

  async findRsvp(
    postId: string,
    userId: string,
  ): Promise<{ id: string } | null> {
    const [existing] = await db
      .select({ id: rsvp.id })
      .from(rsvp)
      .where(and(eq(rsvp.postId, postId), eq(rsvp.userId, userId)))
      .limit(1);

    return existing ?? null;
  }

  async createRsvp(postId: string, userId: string): Promise<void> {
    await db.insert(rsvp).values({ postId, userId });
  }

  async deleteRsvp(rsvpId: string): Promise<void> {
    await db.delete(rsvp).where(eq(rsvp.id, rsvpId));
  }
}
