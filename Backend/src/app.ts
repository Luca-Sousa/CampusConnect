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
import { authOpenApiPaths } from "./lib/auth-openapi";
import { authHandler } from "./lib/auth-handler";
import { notificationsRoute } from "./routes/notifications-route";

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

  app.register(notificationsRoute);
  app.all("/api/auth/*", authHandler);

  return app;
}
