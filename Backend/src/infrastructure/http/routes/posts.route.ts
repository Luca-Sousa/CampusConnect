import type { FastifyInstance } from "fastify";
import { createPostSchema, updatePostSchema, pickField } from "../schemas/post.schemas.js";
import { postRepository, likeRepository, commentRepository, createPostUseCase, listPostsUseCase, deletePostUseCase, toggleRsvpUseCase, updatePostUseCase, approvePostUseCase, rejectPostUseCase, toggleLikeUseCase, listCommentsUseCase, addCommentUseCase, notificationService } from "../di/posts.di.js";
import { getSession } from "../helpers/session.js";

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
      currentUserRole: session ? ((session.user as Record<string, unknown>).role as string) ?? "aluno" : undefined,
      currentUserCargo: session ? ((session.user as Record<string, unknown>).cargo as string) ?? "" : undefined,
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

    if (!created.moderated) {
      await notificationService.notifyPostCreated(body.type, session.user.id, session.user.name, created.id);
    }

    return reply.status(201).send(created);
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

    const updated = await updatePostUseCase.execute({
      postId: id,
      userId: session.user.id,
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
  });

  /**
   * DELETE /api/posts/:id
   * Remove uma publicação (apenas o autor).
   */
  app.delete("/api/posts/:id", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };

    await deletePostUseCase.execute({
      postId: id,
      userId: session.user.id,
    });

    return reply.status(204).send();
  });

  /**
   * POST /api/posts/:id/approve
   * Aprova uma publicação retida pela moderação (apenas admins).
   */
  app.post("/api/posts/:id/approve", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };

    const post = await postRepository.findById(id);
    if (!post) {
      return reply.status(404).send({ error: "Publicação não encontrada." });
    }

    const updated = await approvePostUseCase.execute({
      postId: id,
      userId: session.user.id,
      userRole:
        ((session.user as Record<string, unknown>).role as string) ?? "aluno",
      userCargo:
        ((session.user as Record<string, unknown>).cargo as string) ?? "",
    });

    notificationService.notifyPostApproved(
      id,
      post.authorId,
      session.user.id,
      ((session.user as Record<string, unknown>).role as string) ?? "aluno",
    );

    return reply.send(updated);
  });

  /**
   * POST /api/posts/:id/reject
   * Rejeita uma publicação retida pela moderação (deleta o post e notifica o autor).
   */
  app.post("/api/posts/:id/reject", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };

    const result = await rejectPostUseCase.execute({
      postId: id,
      userId: session.user.id,
      userRole:
        ((session.user as Record<string, unknown>).role as string) ?? "aluno",
      userCargo:
        ((session.user as Record<string, unknown>).cargo as string) ?? "",
    });

    notificationService.notifyModerationRejected(id, result.authorId, session.user.id, ((session.user as Record<string, unknown>).role as string) ?? "aluno");

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

    const result = await toggleRsvpUseCase.execute({
      postId,
      userId: session.user.id,
    });

    return reply.send(result);
  });

  /**
   * GET /api/posts/:id/like
   * Retorna contagem de likes e se o usuário atual curtiu.
   */
  app.get("/api/posts/:id/like", async (request, reply) => {
    const { id: postId } = request.params as { id: string };
    const session = await getSession(request);

    const [likesCount, hasLiked] = await Promise.all([
      likeRepository.countByPostId(postId),
      session
        ? likeRepository.hasUserLiked(postId, session.user.id)
        : false,
    ]);

    return reply.send({ likesCount, hasLiked });
  });

  /**
   * POST /api/posts/:id/like
   * Alterna curtida (toggle) na publicação.
   */
  app.post("/api/posts/:id/like", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id: postId } = request.params as { id: string };

    const result = await toggleLikeUseCase.execute({
      postId,
      userId: session.user.id,
    });

    if (result.hasLiked) {
      const post = await postRepository.findById(postId);
      if (post && post.authorId !== session.user.id) {
        notificationService.notifyLike(postId, post.authorId, session.user.id, session.user.name);
      }
    }

    return reply.send(result);
  });

  /**
   * GET /api/posts/:id/comments
   * Lista comentários da publicação (com respostas aninhadas 1 nível).
   */
  app.get("/api/posts/:id/comments", async (request, reply) => {
    const { id: postId } = request.params as { id: string };

    const comments = await listCommentsUseCase.execute({ postId });
    return reply.send(comments);
  });

  /**
   * POST /api/posts/:id/comments
   * Adiciona um comentário (ou resposta) à publicação.
   */
  app.post("/api/posts/:id/comments", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id: postId } = request.params as { id: string };
    const body = request.body as { content?: string; parentId?: string };

    if (!body.content?.trim()) {
      return reply.status(400).send({ error: "Conteúdo obrigatório." });
    }

    const comment = await addCommentUseCase.execute({
      postId,
      authorId: session.user.id,
      parentId: body.parentId,
      content: body.content.trim(),
    });

    const post = await postRepository.findById(postId);
    const notifyRecipients = new Set<string>();
    if (post && post.authorId !== session.user.id) {
      notifyRecipients.add(post.authorId);
    }
    if (body.parentId) {
      const parentComment = await commentRepository.findById(body.parentId);
      if (parentComment && parentComment.authorId !== session.user.id) {
        notifyRecipients.add(parentComment.authorId);
      }
    }
    notificationService.notifyComment(postId, Array.from(notifyRecipients), session.user.id, session.user.name, body.content.trim());

    return reply.status(201).send(comment);
  });
}
