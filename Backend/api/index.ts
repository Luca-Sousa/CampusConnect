import type { IncomingMessage, ServerResponse } from "http";
import { buildApp } from "../src/infrastructure/http/app.js";

// O app é criado uma vez e reutilizado em invocações quentes (warm starts)
const app = buildApp();
let ready = false;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (!ready) {
    await app.ready();
    ready = true;
  }
  app.server.emit("request", req, res);
}
