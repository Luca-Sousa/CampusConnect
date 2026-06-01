import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { post, rsvp } from "../drizzle/schema/posts";
import { user } from "../drizzle/schema/auth";
import { auth } from "../lib/auth";

/** Cargos que têm permissão para publicar notícias oficiais. */
const OFFICIAL_CARGOS = new Set([
  "direcao",
  "administracao",
  "coordenador",
  "centro_academico",
]);

async function getSession(request: { headers: { cookie?: string } }) {
  const headers = new Headers();
  if (request.headers.cookie) headers.set("cookie", request.headers.cookie);
  return auth.api.getSession({ headers }).catch(() => null);
}

const createPostSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    content: z.string().min(1, "Conteúdo obrigatório.").max(5000),
  }),
  z.object({
    type: z.literal("image"),
    content: z.string().max(2000).optional(),
    imageUrl: z.string().min(1, "Imagem obrigatória."),
  }),
  z.object({
    type: z.literal("event"),
    content: z.string().max(2000).optional(),
    eventTitle: z.string().min(1, "Título do evento obrigatório.").max(200),
    eventDate: z.string().min(1, "Data obrigatória."),
    eventTime: z.string().min(1, "Horário obrigatório."),
    eventLocation: z.string().min(1, "Local obrigatório.").max(300),
  }),
  z.object({
    type: z.literal("news"),
    newsTitle: z.string().min(1, "Título obrigatório.").max(200),
    content: z.string().min(1, "Conteúdo obrigatório.").max(5000),
  }),
]);

export async function postsRoute(app: FastifyInstance): Promise<void> {
  /**
   * GET /api/posts
   * Lista publicações paginadas com autor e contagem de RSVP.
   */
  app.get("/api/posts", async (request, reply) => {
    const query = request.query as Record<string, string>;
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 50);
    const offset = Math.max(Number(query.offset) || 0, 0);

    const session = await getSession(request);

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
      .limit(limit)
      .offset(offset);

    const posts = await Promise.all(
      rows.map(async (row) => {
        if (row.post.type !== "event" || !session) {
          return {
            ...row.post,
            author: row.author,
            rsvpCount: Number(row.rsvpCount),
            hasRsvp: false,
          };
        }

        const [existingRsvp] = await db
          .select({ id: rsvp.id })
          .from(rsvp)
          .where(
            and(eq(rsvp.postId, row.post.id), eq(rsvp.userId, session.user.id)),
          )
          .limit(1);

        return {
          ...row.post,
          author: row.author,
          rsvpCount: Number(row.rsvpCount),
          hasRsvp: !!existingRsvp,
        };
      }),
    );

    return reply.send(posts);
  });

  /**
   * POST /api/posts
   * Cria uma publicação. Notícias exigem cargo oficial.
   */
  app.post("/api/posts", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const parsed = createPostSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.issues[0]?.message });
    }

    const body = parsed.data;

    if (body.type === "news") {
      const cargo = session.user.cargo ?? "";
      const role = session.user.role ?? "";
      if (role !== "admin" && !OFFICIAL_CARGOS.has(cargo)) {
        return reply
          .status(403)
          .send({ error: "Apenas perfis oficiais podem publicar notícias." });
      }
    }

    const [created] = await db
      .insert(post)
      .values({
        authorId: session.user.id,
        type: body.type,
        content: "content" in body ? (body.content ?? null) : null,
        imageUrl: "imageUrl" in body ? body.imageUrl : null,
        eventTitle: "eventTitle" in body ? body.eventTitle : null,
        eventDate: "eventDate" in body ? body.eventDate : null,
        eventTime: "eventTime" in body ? body.eventTime : null,
        eventLocation: "eventLocation" in body ? body.eventLocation : null,
        newsTitle: "newsTitle" in body ? body.newsTitle : null,
      })
      .returning();

    return reply.status(201).send(created);
  });

  /**
   * DELETE /api/posts/:id
   * Remove uma publicação (dono ou admin).
   */
  app.delete("/api/posts/:id", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };

    const [existing] = await db
      .select({ authorId: post.authorId })
      .from(post)
      .where(eq(post.id, id))
      .limit(1);

    if (!existing) {
      return reply.status(404).send({ error: "Publicação não encontrada." });
    }

    const role = session.user.role ?? "";
    if (existing.authorId !== session.user.id && role !== "admin") {
      return reply
        .status(403)
        .send({ error: "Sem permissão para remover esta publicação." });
    }

    await db.delete(post).where(eq(post.id, id));
    return reply.status(204).send();
  });

  /**
   * POST /api/posts/:id/rsvp
   * Confirma ou cancela presença em um evento (toggle).
   */
  app.post("/api/posts/:id/rsvp", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id: postId } = request.params as { id: string };

    const [existing] = await db
      .select({ type: post.type })
      .from(post)
      .where(eq(post.id, postId))
      .limit(1);

    if (!existing) {
      return reply.status(404).send({ error: "Publicação não encontrada." });
    }

    if (existing.type !== "event") {
      return reply
        .status(400)
        .send({ error: "RSVP só é válido para publicações do tipo evento." });
    }

    const [existingRsvp] = await db
      .select({ id: rsvp.id })
      .from(rsvp)
      .where(and(eq(rsvp.postId, postId), eq(rsvp.userId, session.user.id)))
      .limit(1);

    if (existingRsvp) {
      await db.delete(rsvp).where(eq(rsvp.id, existingRsvp.id));
      return reply.send({ hasRsvp: false });
    }

    await db.insert(rsvp).values({ postId, userId: session.user.id });
    return reply.send({ hasRsvp: true });
  });
}
