import type { FastifyInstance } from "fastify";
import { NotificationDrizzleRepository } from "../../database/repositories/notification.drizzle-repository.js";
import { ListNotificationsUseCase } from "../../../application/use-cases/notifications/list-notifications.use-case.js";
import { MarkNotificationAsReadUseCase } from "../../../application/use-cases/notifications/mark-notification-as-read.use-case.js";
import { MarkAllNotificationsAsReadUseCase } from "../../../application/use-cases/notifications/mark-all-notifications-as-read.use-case.js";
import { getSession } from "../helpers/session.js";

const notificationRepository = new NotificationDrizzleRepository();
const listNotificationsUseCase = new ListNotificationsUseCase(notificationRepository);
const markAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepository);
const markAllAsReadUseCase = new MarkAllNotificationsAsReadUseCase(notificationRepository);

export async function notificationInAppRoutes(app: FastifyInstance): Promise<void> {
  /**
   * GET /api/notifications/in-app?limit=&offset=&unreadOnly=
   * Lista notificações do usuário com contagem de não lidas.
   */
  app.get("/api/notifications/in-app", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const query = request.query as Record<string, string>;
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 50);
    const offset = Math.max(Number(query.offset) || 0, 0);
    const unreadOnly = query.unreadOnly === "true";

    const result = await listNotificationsUseCase.execute({
      recipientId: session.user.id,
      limit,
      offset,
      unreadOnly,
    });

    return reply.send(result);
  });

  /**
   * GET /api/notifications/in-app/unread-count
   * Retorna apenas a contagem de notificações não lidas.
   */
  app.get("/api/notifications/in-app/unread-count", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const count = await notificationRepository.countUnread(session.user.id);
    return reply.send({ count });
  });

  /**
   * PATCH /api/notifications/in-app/:id/read
   * Marca uma notificação como lida.
   */
  app.patch("/api/notifications/in-app/:id/read", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    const { id } = request.params as { id: string };

    await markAsReadUseCase.execute({
      id,
      recipientId: session.user.id,
    });

    return reply.status(204).send();
  });

  /**
   * PATCH /api/notifications/in-app/read-all
   * Marca todas as notificações como lidas.
   */
  app.patch("/api/notifications/in-app/read-all", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    await markAllAsReadUseCase.execute(session.user.id);

    return reply.status(204).send();
  });
}
