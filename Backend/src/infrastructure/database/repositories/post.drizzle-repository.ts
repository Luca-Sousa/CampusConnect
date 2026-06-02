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
  UpdatePostInput,
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
        eventEndTime: input.eventEndTime ?? null,
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

  /**
   * Atualiza apenas os campos presentes em `input` (partial update). O schema
   * Drizzle já cuida de atualizar `updatedAt` automaticamente via
   * `$onUpdate(() => new Date())`.
   *
   * Convenção de "ausente" vs "explícito":
   *  - Campo `undefined` em `input` → NÃO incluir no UPDATE (preserva valor).
   *  - Campo `null` em `input` → gravar `null` explicitamente (limpar).
   *  - Campo com string → gravar o valor.
   *
   * Usamos `!== undefined` em vez de `"X" in input` porque em TypeScript
   * objetos sempre têm todas as chaves opcionais declaradas — a distinção
   * semântica entre "ausente" e "presente com undefined" só é capturável
   * pelo valor, não pela presença da chave.
   */
  async update(id: string, input: UpdatePostInput): Promise<Post> {
    const updates: Partial<typeof post.$inferInsert> = {};
    if (input.content !== undefined) updates.content = input.content ?? null;
    if (input.imageUrl !== undefined) updates.imageUrl = input.imageUrl ?? null;
    if (input.eventTitle !== undefined) updates.eventTitle = input.eventTitle ?? null;
    if (input.eventDate !== undefined) updates.eventDate = input.eventDate ?? null;
    if (input.eventTime !== undefined) updates.eventTime = input.eventTime ?? null;
    if (input.eventEndTime !== undefined) updates.eventEndTime = input.eventEndTime ?? null;
    if (input.eventLocation !== undefined) updates.eventLocation = input.eventLocation ?? null;
    if (input.newsTitle !== undefined) updates.newsTitle = input.newsTitle ?? null;

    const [updated] = await db
      .update(post)
      .set(updates)
      .where(eq(post.id, id))
      .returning();

    return updated as Post;
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
