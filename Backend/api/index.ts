import type { IncomingMessage, ServerResponse } from "http";
import { buildApp } from "../src/app";

// O app é criado uma vez e reutilizado em invocações quentes (warm starts)
const app = buildApp();
let ready = false;

/**
 * Aplica os headers CORS diretamente no nível Node.js.
 * Garante que os headers estejam presentes mesmo quando o Fastify
 * retorna um 500 antes de rodar seus próprios hooks de CORS.
 */
function applyCorsHeaders(req: IncomingMessage, res: ServerResponse): boolean {
  const origin = req.headers.origin;
  const allowed = (process.env.FRONTEND_URL ?? "http://localhost:5173")
    .split(",")
    .map((o) => o.trim());

  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,Cookie",
    );
    res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
  }

  // Preflight — responde imediatamente sem passar pelo Fastify
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return false;
  }

  return true;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const proceed = applyCorsHeaders(req, res);
  if (!proceed) return;

  if (!ready) {
    await app.ready();
    ready = true;
  }
  app.server.emit("request", req, res);
}
