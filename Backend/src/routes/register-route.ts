import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../drizzle/client";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema/users";
import { ClientError } from "../errors/client-error";
import bcrypt from "bcrypt";

export const registerRoute: FastifyPluginAsyncZod = async (app) => {
  app.post("/auth/register", {
    schema: {
      summary: "Register a new user",
      tags: ["Auth"],
      body: z.object({
        name: z.string().min(2),
        email: z.email(),
        password: z.string().min(8),
      }),
      response: {
        201: z.object({
          userId: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { name, email, password } = request.body;

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
        throw new ClientError("Email already in use");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const [user] = await db
        .insert(users)
        .values({
          name,
          email,
          passwordHash,
        })
        .returning({
          id: users.id,
        });

      return reply.status(201).send({
        userId: user.id,
      });
    },
  });
};
