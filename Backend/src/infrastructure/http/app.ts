import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { errorHandler } from "./error-handler.js";
import { env } from "../../shared/env.js";
import { authOpenApiPaths } from "./openapi/auth.openapi.js";
import { authHandler } from "./middlewares/auth.handler.js";
import { notificationsRoute } from "./routes/notifications.route.js";
import { notificationInAppRoutes } from "./routes/notification-in-app.route.js";
import { postsRoute } from "./routes/posts.route.js";
import { groupsRoute } from "./routes/groups.route.js";
import { usersRoute } from "./routes/users.route.js";
import { notificationEventBus } from "../events/index.js";
import { NotificationDrizzleRepository } from "../database/repositories/notification.drizzle-repository.js";
import { NotificationEventHandler } from "../../application/event-handlers/notification-event.handler.js";

// Registrar handler de notificações (escuta eventos e cria notificações)
const notificationRepository = new NotificationDrizzleRepository();
new NotificationEventHandler(notificationEventBus, notificationRepository);

export function buildApp() {
  const app = fastify({ bodyLimit: 10 * 1024 * 1024 }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);

  const allowedOrigins = env.FRONTEND_URL.split(",").map((o) => o.trim());

  app.register(fastifyCors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error(`Origin not allowed: ${origin}`), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
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

  app.register(fastifySwaggerUi, { routePrefix: "/docs" });

  app.register(notificationsRoute);
  app.register(notificationInAppRoutes);
  app.register(postsRoute);
  app.register(groupsRoute);
  app.register(usersRoute);
  app.all("/api/auth/*", authHandler);

  return app;
}
