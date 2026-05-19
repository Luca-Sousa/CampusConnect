import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { errorHandler } from "./error-handler";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { env } from "./env";
import { auth } from "./lib/auth";
import { authOpenApiPaths } from "./lib/auth-openapi";

export function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler(errorHandler);

  app.register(fastifyCors, {
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "CampusConnect API",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
    transformObject: (doc) => {
      if (!("openapiObject" in doc)) return doc.swaggerObject;
      return {
        ...doc.openapiObject,
        paths: { ...doc.openapiObject.paths, ...authOpenApiPaths },
      };
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  app.all("/api/auth/*", async (request, reply) => {
    const host = request.headers.host ?? "localhost";
    // Em produção (Vercel/proxy) usa x-forwarded-proto para detectar HTTPS corretamente
    const protocol =
      (request.headers["x-forwarded-proto"] as string) ?? request.protocol;
    const url = `${protocol}://${host}${request.url}`;

    const origin =
      (request.headers.origin as string) ?? `${protocol}://${host}`;
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

    const webRequest = new Request(url, { method: request.method, headers, body });
    const response = await auth.handler(webRequest);

    reply.status(response.status);
    response.headers.forEach((value, key) => reply.header(key, value));
    return reply.send(Buffer.from(await response.arrayBuffer()));
  });

  return app;
}
