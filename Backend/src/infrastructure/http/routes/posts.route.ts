import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { auth } from "../../auth/better-auth.js";
import { PostDrizzleRepository } from "../../database/repositories/post.drizzle-repository.js";
import { CreatePostUseCase } from "../../../application/use-cases/posts/create-post.use-case.js";
import { ListPostsUseCase } from "../../../application/use-cases/posts/list-posts.use-case.js";
import { DeletePostUseCase } from "../../../application/use-cases/posts/delete-post.use-case.js";
import { ToggleRsvpUseCase } from "../../../application/use-cases/posts/toggle-rsvp.use-case.js";

// ——— Singletons de repositório e casos de uso ———
const postRepository = new PostDrizzleRepository();
const createPostUseCase = new CreatePostUseCase(postRepository);
const listPostsUseCase = new ListPostsUseCase(postRepository);
const deletePostUseCase = new DeletePostUseCase(postRepository);
const toggleRsvpUseCase = new ToggleRsvpUseCase(postRepository);

// ——— Helper de sessão ———
async function getSession(request: { headers: { cookie?: string } }) {
  const headers = new Headers();
  if (request.headers.cookie) headers.set("cookie", request.headers.cookie);
  return auth.api.getSession({ headers }).catch(() => null);
}

// ——— Schema de validação ———
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

    const posts = await listPostsUseCase.execute({
      limit,
      offset,
      currentUserId: session?.user.id,
    });

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

    try {
      const created = await createPostUseCase.execute({
        authorId: session.user.id,
        type: body.type,
        content: "content" in body ? (body.content ?? null) : null,
        imageUrl: "imageUrl" in body ? body.imageUrl : null,
        eventTitle: "eventTitle" in body ? body.eventTitle : null,
        eventDate: "eventDate" in body ? body.eventDate : null,
        eventTime: "eventTime" in body ? body.eventTime : null,
        eventLocation: "eventLocation" in body ? body.eventLocation : null,
        newsTitle: "newsTitle" in body ? body.newsTitle : null,
        userRole:
          ((session.user as Record<string, unknown>).role as string) ?? "aluno",
        userCargo:
          ((session.user as Record<string, unknown>).cargo as string) ??
          "aluno",
      });

      return reply.status(201).send(created);
    } catch (err) {
      if (err instanceof Error && err.message === "FORBIDDEN") {
        return reply
          .status(403)
          .send({ error: "Apenas perfis oficiais podem publicar notícias." });
      }
      throw err;
    }
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

    try {
      await deletePostUseCase.execute({
        postId: id,
        userId: session.user.id,
        userRole:
          ((session.user as Record<string, unknown>).role as string) ?? "aluno",
      });

      return reply.status(204).send();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "NOT_FOUND") {
          return reply
            .status(404)
            .send({ error: "Publicação não encontrada." });
        }
        if (err.message === "FORBIDDEN") {
          return reply
            .status(403)
            .send({ error: "Sem permissão para remover esta publicação." });
        }
      }
      throw err;
    }
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

    try {
      const result = await toggleRsvpUseCase.execute({
        postId,
        userId: session.user.id,
      });

      return reply.send(result);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "NOT_FOUND") {
          return reply
            .status(404)
            .send({ error: "Publicação não encontrada." });
        }
        if (err.message.startsWith("INVALID:")) {
          return reply
            .status(400)
            .send({
              error: "RSVP só é válido para publicações do tipo evento.",
            });
        }
      }
      throw err;
    }
  });
}
