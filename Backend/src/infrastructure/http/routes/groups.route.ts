import type { FastifyInstance } from "fastify";
import { createGroupSchema, updateGroupSchema, sendMessageSchema } from "../schemas/group.schemas.js";
import { groupRepository, createGroupUseCase, listGroupsUseCase, updateGroupUseCase, deleteGroupUseCase, joinGroupUseCase, leaveGroupUseCase, listGroupMessagesUseCase, sendGroupMessageUseCase, notificationService } from "../di/groups.di.js";
import { getSession } from "../helpers/session.js";

export async function groupsRoute(app: FastifyInstance): Promise<void> {
  /**
   * GET /api/groups?search=&limit=&offset=
   */
  app.get("/api/groups", async (request, reply) => {
    const query = request.query as Record<string, string>;
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 50);
    const offset = Math.max(Number(query.offset) || 0, 0);
    const search = query.search?.trim() || undefined;

    const session = await getSession(request);

    const groups = await listGroupsUseCase.execute({
      limit,
      offset,
      search,
      currentUserId: session?.user.id,
    });

    return reply.send(groups);
  });

  /**
   * POST /api/groups
   * Qualquer usuário autenticado pode criar um grupo (torna-se admin).
   */
  app.post("/api/groups", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const parsed = createGroupSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.issues[0]?.message });
    }

    const group = await createGroupUseCase.execute({
      ...parsed.data,
      authorId: session.user.id,
    });

    await notificationService.notifyGroupCreated(group.id, group.name, session.user.id, session.user.name);

    return reply.status(201).send(group);
  });

  /**
   * PUT /api/groups/:id
   * Admin ou autor do grupo pode editar.
   */
  app.put("/api/groups/:id", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };

    const parsed = updateGroupSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.issues[0]?.message });
    }

    const updated = await updateGroupUseCase.execute({
      groupId: id,
      userId: session.user.id,
      userRole: ((session.user as Record<string, unknown>).role as string) ?? "aluno",
      input: parsed.data,
    });

    return reply.send(updated);
  });

  /**
   * DELETE /api/groups/:id
   * Admin ou autor do grupo pode remover.
   */
  app.delete("/api/groups/:id", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };

    await deleteGroupUseCase.execute({
      groupId: id,
      userId: session.user.id,
      userRole: ((session.user as Record<string, unknown>).role as string) ?? "aluno",
    });

    return reply.status(204).send();
  });

  /**
   * POST /api/groups/:id/join
   * Toggle entrar/sair do grupo.
   */
  app.post("/api/groups/:id/join", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };

    const result = await joinGroupUseCase.execute({
      groupId: id,
      userId: session.user.id,
    });

    return reply.send(result);
  });

  /**
   * DELETE /api/groups/:id/leave
   * Sai do grupo (não pode ser o autor).
   */
  app.delete("/api/groups/:id/leave", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };

    await leaveGroupUseCase.execute({
      groupId: id,
      userId: session.user.id,
    });

    return reply.status(204).send();
  });

  /**
   * GET /api/groups/:id/messages?limit=&offset=
   * Lista mensagens do grupo (precisa ser membro).
   */
  app.get("/api/groups/:id/messages", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };
    const query = request.query as Record<string, string>;
    const limit = Math.min(Math.max(Number(query.limit) || 50, 1), 100);
    const offset = Math.max(Number(query.offset) || 0, 0);

    const messages = await listGroupMessagesUseCase.execute({
      groupId: id,
      limit,
      offset,
    });

    return reply.send(messages);
  });

  /**
   * POST /api/groups/:id/messages
   * Envia uma mensagem no grupo (precisa ser membro).
   */
  app.post("/api/groups/:id/messages", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };

    const parsed = sendMessageSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.issues[0]?.message });
    }

    const message = await sendGroupMessageUseCase.execute({
      groupId: id,
      authorId: session.user.id,
      content: parsed.data.content,
    });

    const group = await groupRepository.findById(id);
    await notificationService.notifyGroupMessage(id, group?.name ?? "grupo", message.id, session.user.id, session.user.name, parsed.data.content);

    return reply.status(201).send(message);
  });

  /**
   * DELETE /api/messages/:id
   * Remove uma mensagem (autor da mensagem ou admin).
   */
  app.delete("/api/messages/:id", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };

    const userRole =
      ((session.user as Record<string, unknown>).role as string) ?? "aluno";

    if (userRole === "admin") {
      await groupRepository.deleteMessageAdmin(id);
    } else {
      await groupRepository.deleteMessage(id, session.user.id);
    }

    return reply.status(204).send();
  });
}
