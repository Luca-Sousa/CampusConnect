import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "../../auth/better-auth.js";
import { db } from "../../database/client.js";
import { user } from "../../database/schema/auth.schema.js";

// ——— Helper de sessão ———
async function getSession(request: { headers: { cookie?: string } }) {
  const headers = new Headers();
  if (request.headers.cookie) headers.set("cookie", request.headers.cookie);
  return auth.api.getSession({ headers }).catch(() => null);
}

// ——— Schema de validação ———
const updateProfileSchema = z.object({
  name: z.string().min(1, "Nome obrigatório.").max(200).optional(),
  image: z.string().max(10000000).nullable().optional(),
  course: z.string().max(200).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
});

export async function usersRoute(app: FastifyInstance): Promise<void> {
  /**
   * PATCH /api/users/me
   * Atualiza o perfil do usuário autenticado.
   */
  app.patch("/api/users/me", async (request, reply) => {
    const session = await getSession(request);
    if (!session) {
      return reply.status(401).send({ error: "Não autenticado." });
    }

    const parsed = updateProfileSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "Dados inválidos.",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const fields = parsed.data;
    if (Object.keys(fields).length === 0) {
      return reply.status(400).send({ error: "Nenhum campo para atualizar." });
    }

    const [updated] = await db
      .update(user)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(user.id, session.user.id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        course: user.course,
        bio: user.bio,
        role: user.role,
        cargo: user.cargo,
      });

    return reply.send({ user: updated });
  });
}
