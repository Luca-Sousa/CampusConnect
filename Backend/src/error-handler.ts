import { FastifyInstance } from "fastify";
import { formatZodErrors } from "./lib/format-zod-errors";
import { ClientError } from "./errors/client-error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  const err = error as Record<string, unknown>;

  if (err.code === "FST_ERR_VALIDATION") {
    return reply.status(400).send(formatZodErrors({ error: err as never }));
  }

  if (error instanceof ClientError) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  console.error(error);

  return reply.status(500).send({
    message: "Internal server error",
  });
};
