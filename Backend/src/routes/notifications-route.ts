import type { FastifyInstance } from "fastify";
import { auth } from "../lib/auth";
import { sendEmail } from "../lib/email";
import { buildNewLoginEmailHtml } from "../lib/email-templates";

/**
 * Rota de notificações transacionais.
 * Envia e-mails informativos de segurança para o usuário autenticado.
 */
export async function notificationsRoute(app: FastifyInstance): Promise<void> {
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
    sendEmail({
      to: session.user.email,
      subject: "Novo acesso à sua conta - CampusConnect",
      html: buildNewLoginEmailHtml(session.user.name),
    }).catch(console.error);

    return reply.send({ ok: true });
  });
}
