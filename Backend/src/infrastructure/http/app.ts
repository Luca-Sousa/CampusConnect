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
import {
  postsOpenApiPaths,
  postsOpenApiComponents,
} from "./openapi/posts.openapi.js";
import {
  groupsOpenApiPaths,
  groupsOpenApiComponents,
} from "./openapi/groups.openapi.js";
import {
  notificationsOpenApiPaths,
  notificationsOpenApiComponents,
} from "./openapi/notifications.openapi.js";
import {
  usersOpenApiPaths,
  usersOpenApiComponents,
} from "./openapi/users.openapi.js";
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

// ── Merge de todos os paths OpenAPI ─────────────────────────────────────────
const allOpenApiPaths = {
  ...authOpenApiPaths,
  ...postsOpenApiPaths,
  ...groupsOpenApiPaths,
  ...notificationsOpenApiPaths,
  ...usersOpenApiPaths,
};

export function buildApp() {
  const app = fastify({
    bodyLimit: 10 * 1024 * 1024,
  }).withTypeProvider<ZodTypeProvider>();

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
        description:
          "API do CampusConnect — rede social acadêmica com moderação AI.",
      },
      tags: [
        { name: "Auth", description: "Autenticação e sessão" },
        {
          name: "Posts",
          description: "CRUD de publicações (texto, imagem, evento, notícia)",
        },
        { name: "Curtidas", description: "Curtidas em publicações" },
        {
          name: "Comentários",
          description: "Comentários e respostas em publicações",
        },
        { name: "RSVP", description: "Confirmação de presença em eventos" },
        { name: "Grupos", description: "CRUD de grupos e participação" },
        {
          name: "Mensagens do Grupo",
          description: "Mensagens dentro de grupos",
        },
        {
          name: "Notificações",
          description: "Notificações por email e in-app",
        },
        { name: "Usuários", description: "Perfil do usuário" },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "session",
            description: "Sessão Better Auth (cookie httpOnly)",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
    transformObject: (doc) => {
      if (!("openapiObject" in doc)) return doc.swaggerObject;
      return {
        ...doc.openapiObject,
        paths: { ...doc.openapiObject.paths, ...allOpenApiPaths },
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
