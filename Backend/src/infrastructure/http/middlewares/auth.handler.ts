import type { FastifyReply, FastifyRequest } from "fastify";
import { auth } from "../../auth/better-auth.js";

/**
 * Handler Fastify para todas as rotas do Better Auth (`/api/auth/*`).
 *
 * Converte a requisição Fastify para um Web Request padrão e repassa
 * ao handler do Better Auth, depois devolve a resposta ao cliente.
 */
export async function authHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const host = request.headers.host ?? "localhost";
  const protocol =
    (request.headers["x-forwarded-proto"] as string) ?? request.protocol;
  const url = `${protocol}://${host}${request.url}`;
  const origin = (request.headers.origin as string) ?? `${protocol}://${host}`;

  const headers: Record<string, string> = {
    "content-type":
      (request.headers["content-type"] as string) ?? "application/json",
    origin,
  };
  if (request.headers.cookie) headers["cookie"] = request.headers.cookie;
  if (request.headers.authorization)
    headers["authorization"] = request.headers.authorization as string;

  const isBodyless = ["GET", "HEAD"].includes(request.method);
  const body =
    !isBodyless && request.body != null
      ? JSON.stringify(request.body)
      : undefined;

  const webRequest = new Request(url, {
    method: request.method,
    headers,
    body,
  });
  const response = await auth.handler(webRequest);

  reply.status(response.status);
  response.headers.forEach((value: string, key: string) =>
    reply.header(key, value),
  );
  return reply.send(Buffer.from(await response.arrayBuffer()));
}
