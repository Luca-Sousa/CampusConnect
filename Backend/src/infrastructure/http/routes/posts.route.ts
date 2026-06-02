import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { auth } from "../../auth/better-auth.js";
import { PostDrizzleRepository } from "../../database/repositories/post.drizzle-repository.js";
import { CreatePostUseCase } from "../../../application/use-cases/posts/create-post.use-case.js";
import { ListPostsUseCase } from "../../../application/use-cases/posts/list-posts.use-case.js";
import { DeletePostUseCase } from "../../../application/use-cases/posts/delete-post.use-case.js";
import { ToggleRsvpUseCase } from "../../../application/use-cases/posts/toggle-rsvp.use-case.js";
import { UpdatePostUseCase } from "../../../application/use-cases/posts/update-post.use-case.js";

// ——— Singletons de repositório e casos de uso ———
const postRepository = new PostDrizzleRepository();
const createPostUseCase = new CreatePostUseCase(postRepository);
const listPostsUseCase = new ListPostsUseCase(postRepository);
const deletePostUseCase = new DeletePostUseCase(postRepository);
const toggleRsvpUseCase = new ToggleRsvpUseCase(postRepository);
const updatePostUseCase = new UpdatePostUseCase(postRepository);

// ——— Helper de sessão ———
async function getSession(request: { headers: { cookie?: string } }) {
  const headers = new Headers();
  if (request.headers.cookie) headers.set("cookie", request.headers.cookie);
  return auth.api.getSession({ headers }).catch(() => null);
}

// ——— Helper de normalização para o body do PUT ———
// Convenção de três estados:
//  - chave AUSENTE no body → retorna `undefined` (sentinela: "não tocar no DB")
//  - chave presente com `null` ou `""` → retorna `null` (limpar explicitamente)
//  - chave presente com string não-vazia → retorna a string (atualizar)
//
// Isso evita o bug antigo em que editar um campo que não era imagem
// apagava a imagem existente, porque a rota normalizava campo ausente
// para `null` e o repositório sempre incluía o campo no UPDATE.
function pickField(
  body: Record<string, unknown>,
  key: string,
): string | null | undefined {
  if (!(key in body)) return undefined;
  const v = body[key];
  if (v === null) return null;
  if (typeof v === "string") return v === "" ? null : v;
  return undefined;
}

// ——— Helpers de validação temporal ———
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_TIME = /^\d{2}:\d{2}$/;
const pad2 = (n: number) => String(n).padStart(2, "0");
const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

// ——— Schema de validação ———
const eventSchema = z
  .object({
    type: z.literal("event"),
    content: z.string().max(2000).optional(),
    eventTitle: z
      .string()
      .min(1, "Título do evento obrigatório.")
      .max(200),
    eventDate: z
      .string()
      .regex(ISO_DATE, "Data inválida.")
      .min(1, "Data de início obrigatória."),
    eventTime: z
      .string()
      .regex(ISO_TIME, "Horário inválido.")
      .min(1, "Horário de início obrigatório."),
    eventEndTime: z
      .union([
        z.literal(""),
        z.string().regex(ISO_TIME, "Horário final inválido."),
      ])
      .optional(),
    eventLocation: z
      .string()
      .min(1, "Local obrigatório.")
      .max(300),
    imageUrl: z
      .union([z.literal(""), z.string().min(1)])
      .optional(),
  })
  .superRefine((val, ctx) => {
    // ⚠️ Validação em UTC (Vercel serverless). Diferença de até 3h vs BRT é aceitável.
    const now = new Date();
    const todayIso = toIsoDate(now);
    const nowHHmm = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
    if (val.eventDate < todayIso) {
      ctx.addIssue({
        code: "custom",
        path: ["eventDate"],
        message: "Data de início não pode ser no passado.",
      });
    } else if (val.eventDate === todayIso && val.eventTime <= nowHHmm) {
      ctx.addIssue({
        code: "custom",
        path: ["eventTime"],
        message: "Horário deve ser posterior ao atual.",
      });
    }
    if (val.eventEndTime && val.eventEndTime <= val.eventTime) {
      ctx.addIssue({
        code: "custom",
        path: ["eventEndTime"],
        message: "Horário final deve ser posterior ao inicial.",
      });
    }
  });

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
  eventSchema,
  z.object({
    type: z.literal("news"),
    newsTitle: z.string().min(1, "Título obrigatório.").max(200),
    content: z.string().min(1, "Conteúdo obrigatório.").max(5000),
    imageUrl: z
      .union([z.literal(""), z.string().min(1)])
      .optional(),
  }),
]);

/**
 * Schema de atualização — espelha o `createPostSchema` mas SEM `type` (o tipo
 * é fixo, decidido na criação) e SEM o `superRefine` temporal do evento
 * (eventos passados ainda podem ser editados se escaparem à regra do front,
 * e a única invariante temporal que preservamos é fim > início).
 *
 * Usamos `z.union` (sem discriminator) porque o tipo do post já é conhecido
 * no servidor — o cliente envia o payload de acordo com o tipo atual.
 */
const updateEventSchema = z
  .object({
    eventTitle: z
      .string()
      .min(1, "Título do evento obrigatório.")
      .max(200),
    eventDate: z
      .string()
      .regex(ISO_DATE, "Data inválida.")
      .min(1, "Data de início obrigatória."),
    eventTime: z
      .string()
      .regex(ISO_TIME, "Horário inválido.")
      .min(1, "Horário de início obrigatório."),
    eventEndTime: z
      .union([
        z.literal(""),
        z.string().regex(ISO_TIME, "Horário final inválido."),
      ])
      .nullable()
      .optional(),
    eventLocation: z
      .string()
      .min(1, "Local obrigatório.")
      .max(300),
    content: z.string().max(2000).nullable().optional(),
    imageUrl: z
      .union([z.literal(""), z.string().min(1)])
      .nullable()
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.eventEndTime && val.eventEndTime <= val.eventTime) {
      ctx.addIssue({
        code: "custom",
        path: ["eventEndTime"],
        message: "Horário final deve ser posterior ao inicial.",
      });
    }
  });

const updatePostSchema = z.union([
  // Texto puro: `content` é obrigatório (não pode ficar vazio).
  z.object({
    content: z.string().min(1, "Conteúdo obrigatório.").max(5000),
  }),
  // Imagem: ambos opcionais. O cliente envia `null` para limpar
  // (legenda/imagem) e omite a chave para não tocar. O backend usa
  // `undefined` como sentinela de "não alterar".
  z.object({
    content: z.string().max(2000).nullable().optional(),
    imageUrl: z.string().min(1, "Imagem obrigatória.").nullable().optional(),
  }),
  updateEventSchema,
  // Comunicado: `newsTitle` e `content` obrigatórios; `imageUrl` opcional.
  z.object({
    newsTitle: z.string().min(1, "Título obrigatório.").max(200),
    content: z.string().min(1, "Conteúdo obrigatório.").max(5000),
    imageUrl: z
      .union([z.literal(""), z.string().min(1)])
      .nullable()
      .optional(),
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
        imageUrl:
          "imageUrl" in body && body.imageUrl
            ? body.imageUrl
            : null,
        eventTitle: "eventTitle" in body ? body.eventTitle : null,
        eventDate: "eventDate" in body ? body.eventDate : null,
        eventTime: "eventTime" in body ? body.eventTime : null,
        eventEndTime:
          "eventEndTime" in body && body.eventEndTime
            ? body.eventEndTime
            : null,
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
   * PUT /api/posts/:id
   * Edita uma publicação existente (dono ou admin). O `type` é fixo e
   * decidido no momento da criação; esta rota aceita apenas os campos
   * editáveis do tipo atual.
   */
  app.put("/api/posts/:id", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };

    const parsed = updatePostSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.issues[0]?.message });
    }

    const body = parsed.data;

    try {
      const updated = await updatePostUseCase.execute({
        postId: id,
        userId: session.user.id,
        userRole:
          ((session.user as Record<string, unknown>).role as string) ?? "aluno",
        input: {
          content: pickField(body, "content"),
          imageUrl: pickField(body, "imageUrl"),
          eventTitle: pickField(body, "eventTitle"),
          eventDate: pickField(body, "eventDate"),
          eventTime: pickField(body, "eventTime"),
          eventEndTime: pickField(body, "eventEndTime"),
          eventLocation: pickField(body, "eventLocation"),
          newsTitle: pickField(body, "newsTitle"),
        },
      });

      return reply.send(updated);
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
            .send({ error: "Sem permissão para editar esta publicação." });
        }
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
