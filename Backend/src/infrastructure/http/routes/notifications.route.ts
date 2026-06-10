import type { FastifyInstance } from "fastify";
import { auth } from "../../auth/better-auth.js";
import { emailService } from "../../email/nodemailer.service.js";
import { buildNewLoginEmailHtml } from "../../email/templates.js";
import { SendLoginNotificationUseCase } from "../../../application/use-cases/notifications/send-login-notification.use-case.js";

const sendLoginNotificationUseCase = new SendLoginNotificationUseCase(
  emailService,
);

export async function notificationsRoute(app: FastifyInstance): Promise<void> {
  // Aceita POST sem Content-Type (fire-and-forget, só lê cookies)
  app.addContentTypeParser("*", { parseAs: "string" }, (_req, _payload, done) => {
    done(null, undefined);
  });

  /**
   * POST /api/notifications/login
   * Envia notificação de novo acesso ao usuário da sessão atual.
   * Chamado pelo cliente imediatamente após um login bem-sucedido.
   */
  app.post("/api/notifications/login", async (request, reply) => {
    const headers = new Headers();
    const cookie = request.headers.cookie;
    if (cookie) headers.set("cookie", cookie);

    const session = await auth.api.getSession({ headers }).catch(() => null);
    if (!session) {
      return reply.status(401).send({ error: "Não autorizado." });
    }

    // Fire-and-forget: não bloqueia a resposta em caso de falha de SMTP
    sendLoginNotificationUseCase
      .execute({
        userEmail: session.user.email,
        userName: session.user.name,
        htmlBody: buildNewLoginEmailHtml(session.user.name),
      })
      .catch(console.error);

    return reply.send({ ok: true });
  });
}
