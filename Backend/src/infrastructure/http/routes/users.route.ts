import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { UserDrizzleRepository } from "../../database/repositories/user.drizzle-repository.js";
import { getSession } from "../helpers/session.js";

const userRepository = new UserDrizzleRepository();

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

    const updated = await userRepository.updateProfile(session.user.id, fields);

    return reply.send({
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        image: updated.image,
        course: updated.course,
        bio: updated.bio,
        role: updated.role,
        cargo: updated.cargo,
      },
    });
  });
}
