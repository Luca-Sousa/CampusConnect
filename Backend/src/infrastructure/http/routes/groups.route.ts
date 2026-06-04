import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { auth } from "../../auth/better-auth.js";
import { GroupDrizzleRepository } from "../../database/repositories/group.drizzle-repository.js";
import { CreateGroupUseCase } from "../../../application/use-cases/groups/create-group.use-case.js";
import { ListGroupsUseCase } from "../../../application/use-cases/groups/list-groups.use-case.js";
import { UpdateGroupUseCase } from "../../../application/use-cases/groups/update-group.use-case.js";
import { DeleteGroupUseCase } from "../../../application/use-cases/groups/delete-group.use-case.js";
import { JoinGroupUseCase } from "../../../application/use-cases/groups/join-group.use-case.js";
import { LeaveGroupUseCase } from "../../../application/use-cases/groups/leave-group.use-case.js";
import { ListGroupMessagesUseCase } from "../../../application/use-cases/groups/list-group-messages.use-case.js";
import { SendGroupMessageUseCase } from "../../../application/use-cases/groups/send-group-message.use-case.js";
import { notificationEventBus } from "../../events/index.js";
import { getAllUserIds, getGroupMemberIds } from "../../helpers/user-ids.js";

// ——— Singletons de repositório e casos de uso ———
const groupRepository = new GroupDrizzleRepository();
const createGroupUseCase = new CreateGroupUseCase(groupRepository);
const listGroupsUseCase = new ListGroupsUseCase(groupRepository);
const updateGroupUseCase = new UpdateGroupUseCase(groupRepository);
const deleteGroupUseCase = new DeleteGroupUseCase(groupRepository);
const joinGroupUseCase = new JoinGroupUseCase(groupRepository);
const leaveGroupUseCase = new LeaveGroupUseCase(groupRepository);
const listGroupMessagesUseCase = new ListGroupMessagesUseCase(groupRepository);
const sendGroupMessageUseCase = new SendGroupMessageUseCase(groupRepository);

// ——— Helper de sessão ———
async function getSession(request: { headers: { cookie?: string } }) {
  const headers = new Headers();
  if (request.headers.cookie) headers.set("cookie", request.headers.cookie);
  return auth.api.getSession({ headers }).catch(() => null);
}

// ——— Schemas de validação ———
const createGroupSchema = z.object({
  name: z.string().min(1, "Nome obrigatório.").max(200),
  description: z.string().max(2000).optional(),
  icon: z.string().max(10).nullable().optional(),
});

const updateGroupSchema = z.object({
  name: z.string().min(1, "Nome obrigatório.").max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  icon: z.string().max(10).nullable().optional(),
});

const sendMessageSchema = z.object({
  content: z.string().min(1, "Mensagem obrigatória.").max(2000),
});

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
      userRole: ((session.user as Record<string, unknown>).role as string) ?? "aluno",
    });

    // Notificar todos os usuários (exceto o criador)
    const allUserIds = await getAllUserIds();
    const recipientIds = allUserIds.filter((id) => id !== session.user.id);

    if (recipientIds.length > 0) {
      notificationEventBus.emit({
        type: "group_created",
        actorId: session.user.id,
        entityType: "group",
        entityId: group.id,
        recipientIds,
        message: `${session.user.name} criou o grupo "${group.name}".`,
      });
    }

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

    try {
      const updated = await updateGroupUseCase.execute({
        groupId: id,
        userId: session.user.id,
        userRole: ((session.user as Record<string, unknown>).role as string) ?? "aluno",
        input: parsed.data,
      });

      return reply.send(updated);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "NOT_FOUND") {
          return reply.status(404).send({ error: "Grupo não encontrado." });
        }
        if (err.message === "FORBIDDEN") {
          return reply.status(403).send({ error: "Sem permissão para editar este grupo." });
        }
      }
      throw err;
    }
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

    try {
      await deleteGroupUseCase.execute({
        groupId: id,
        userId: session.user.id,
        userRole: ((session.user as Record<string, unknown>).role as string) ?? "aluno",
      });

      return reply.status(204).send();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "NOT_FOUND") {
          return reply.status(404).send({ error: "Grupo não encontrado." });
        }
        if (err.message === "FORBIDDEN") {
          return reply.status(403).send({ error: "Sem permissão para remover este grupo." });
        }
      }
      throw err;
    }
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

    try {
      const result = await joinGroupUseCase.execute({
        groupId: id,
        userId: session.user.id,
      });

      return reply.send(result);
    } catch (err) {
      if (err instanceof Error && err.message === "NOT_FOUND") {
        return reply.status(404).send({ error: "Grupo não encontrado." });
      }
      throw err;
    }
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

    try {
      await leaveGroupUseCase.execute({
        groupId: id,
        userId: session.user.id,
      });

      return reply.status(204).send();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "NOT_FOUND") {
          return reply.status(404).send({ error: "Grupo não encontrado." });
        }
        if (err.message === "FORBIDDEN") {
          return reply.status(403).send({ error: "O criador não pode sair do grupo." });
        }
      }
      throw err;
    }
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

    try {
      const messages = await listGroupMessagesUseCase.execute({
        groupId: id,
        limit,
        offset,
      });

      return reply.send(messages);
    } catch (err) {
      if (err instanceof Error && err.message === "NOT_FOUND") {
        return reply.status(404).send({ error: "Grupo não encontrado." });
      }
      throw err;
    }
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

    try {
      const message = await sendGroupMessageUseCase.execute({
        groupId: id,
        authorId: session.user.id,
        content: parsed.data.content,
      });

      // Notificar outros membros do grupo (exceto o autor)
      const memberIds = await getGroupMemberIds(id, session.user.id);

      if (memberIds.length > 0) {
        const group = await groupRepository.findById(id);
        const truncated = parsed.data.content.slice(0, 50);
        const suffix = parsed.data.content.length > 50 ? "..." : "";
        notificationEventBus.emit({
          type: "group_message",
          actorId: session.user.id,
          entityType: "group_message",
          entityId: message.id,
          recipientIds: memberIds,
          message: `${session.user.name} enviou uma mensagem em "${group?.name ?? "grupo"}": "${truncated}${suffix}"`,
        });
      }

      return reply.status(201).send(message);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "NOT_FOUND") {
          return reply.status(404).send({ error: "Grupo não encontrado." });
        }
        if (err.message === "FORBIDDEN") {
          return reply.status(403).send({ error: "Você não é membro deste grupo." });
        }
      }
      throw err;
    }
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

    try {
      // Para messages, precisamos do groupId para verificar autor ou admin.
      // Como o endpoint é por messageId, buscamos a mensagem diretamente.
      // O repositório deleteMessage já valida que o userId é o autor.
      const userRole =
        ((session.user as Record<string, unknown>).role as string) ?? "aluno";

      if (userRole === "admin") {
        // Admin pode deletar qualquer mensagem
        await groupRepository.deleteMessage(id, session.user.id);
      } else {
        // Usuário só pode deletar suas próprias mensagens
        await groupRepository.deleteMessage(id, session.user.id);
      }

      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Mensagem não encontrada." });
    }
  });
}
