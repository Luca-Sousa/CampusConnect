import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../drizzle/client";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema/users";
import { ClientError } from "../errors/client-error";
import bcrypt from "bcrypt";

export const loginRoute: FastifyPluginAsyncZod = async (app) => {
  app.post("/auth/login", {
    schema: {
      summary: "Login a user",
      tags: ["Auth"],
      body: z.object({
        email: z.email(),
        password: z.string().min(8),
      }),
      response: {
        200: z.object({
          userId: z.string(),
          name: z.string(),
          email: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;

      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        throw new ClientError("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new ClientError("Invalid credentials");
      }

      return reply.status(200).send({
        userId: user.id,
        name: user.name,
        email: user.email,
      });
    },
  });
};
