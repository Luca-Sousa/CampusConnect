import { FastifyInstance } from "fastify";
import { formatZodErrors } from "../../shared/utils/format-zod-errors.js";
import { ClientError } from "../../domain/errors/client-error.js";
import { NotFoundError } from "../../domain/errors/not-found.js";
import { ForbiddenError } from "../../domain/errors/forbidden.js";
import { InvalidError } from "../../domain/errors/invalid.js";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, _request, reply) => {
  const err = error as Record<string, unknown>;

  if (err.code === "FST_ERR_CTP_BODY_TOO_LARGE") {
    return reply.status(413).send({
      error: "payload_too_large",
      message: "A imagem enviada excede o tamanho máximo permitido (10 MB). Tente reduzir a resolução ou comprimir a imagem.",
    });
  }

  if (err.code === "FST_ERR_VALIDATION") {
    return reply.status(400).send(formatZodErrors({ error: err as never }));
  }

  if (error instanceof ClientError) {
    return reply.status(400).send({ message: error.message });
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({ error: error.message });
  }

  if (error instanceof ForbiddenError) {
    return reply.status(403).send({ error: error.message });
  }

  if (error instanceof InvalidError) {
    return reply.status(400).send({ error: error.message });
  }

  console.error(error);

  return reply.status(500).send({ message: "Internal server error" });
};
