import { FastifyInstance } from "fastify";
import { formatZodErrors } from "../../shared/utils/format-zod-errors.js";
import { ClientError } from "../../domain/errors/client-error.js";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, _request, reply) => {
  const err = error as Record<string, unknown>;

  if (err.code === "FST_ERR_VALIDATION") {
    return reply.status(400).send(formatZodErrors({ error: err as never }));
  }

  if (error instanceof ClientError) {
    return reply.status(400).send({ message: error.message });
  }

  console.error(error);

  return reply.status(500).send({ message: "Internal server error" });
};
