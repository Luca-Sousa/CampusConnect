/**
 * OpenAPI definitions for Notifications endpoints.
 *
 * Tags: Notificações
 */

// ── Shared Schemas ──────────────────────────────────────────────────────────

const notificationSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    recipientId: { type: "string", format: "uuid" },
    actorId: { type: "string", format: "uuid", nullable: true },
    type: { type: "string", enum: ["like", "comment", "post_created", "post_approved", "post_moderation_rejected", "pending_moderation", "group_created", "group_message"] },
    entityType: { type: "string" },
    entityId: { type: "string", format: "uuid" },
    message: { type: "string" },
    readAt: { type: "string", format: "date-time", nullable: true },
    createdAt: { type: "string", format: "date-time" },
    actor: {
      type: "object",
      nullable: true,
      properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string" },
        image: { type: "string", nullable: true },
      },
    },
  },
};

const errorSchema = {
  type: "object",
  properties: { error: { type: "string" } },
};

// ── Paths ───────────────────────────────────────────────────────────────────

export const notificationsOpenApiPaths: Record<string, object> = {
  // ─── Notificações por Email ────────────────────────────────────────────────
  "/api/notifications/login": {
    post: {
      tags: ["Notificações"],
      summary: "Notificar login por email",
      description: "Envia notificação de novo acesso por email (fire-and-forget).",
      security: [{ cookieAuth: [] }],
      responses: {
        "202": { description: "Notificação enviada (async)." },
        "401": { description: "Não autorizado." },
      },
    },
  },

  // ─── Notificações In-App ───────────────────────────────────────────────────
  "/api/notifications/in-app": {
    get: {
      tags: ["Notificações"],
      summary: "Listar notificações",
      description: "Lista notificações do usuário com contagem de não lidas.",
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50, default: 20 } },
        { name: "offset", in: "query", schema: { type: "integer", minimum: 0, default: 0 } },
        { name: "unreadOnly", in: "query", schema: { type: "string", enum: ["true", "false"], default: "false" }, description: "Filtrar apenas não lidas" },
      ],
      responses: {
        "200": {
          description: "Lista de notificações.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  notifications: { type: "array", items: notificationSchema },
                  unreadCount: { type: "integer" },
                },
              },
            },
          },
        },
        "401": { description: "Não autorizado." },
      },
    },
  },

  "/api/notifications/in-app/unread-count": {
    get: {
      tags: ["Notificações"],
      summary: "Contar não lidas",
      description: "Retorna apenas a contagem de notificações não lidas.",
      security: [{ cookieAuth: [] }],
      responses: {
        "200": {
          description: "Contagem.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { count: { type: "integer" } },
              },
            },
          },
        },
        "401": { description: "Não autorizado." },
      },
    },
  },

  "/api/notifications/in-app/{id}/read": {
    patch: {
      tags: ["Notificações"],
      summary: "Marcar como lida",
      description: "Marca uma notificação específica como lida.",
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
      ],
      responses: {
        "204": { description: "Notificação marcada como lida." },
        "401": { description: "Não autorizado." },
      },
    },
  },

  "/api/notifications/in-app/read-all": {
    patch: {
      tags: ["Notificações"],
      summary: "Marcar todas como lidas",
      description: "Marca todas as notificações do usuário como lidas.",
      security: [{ cookieAuth: [] }],
      responses: {
        "204": { description: "Todas marcadas como lidas." },
        "401": { description: "Não autorizado." },
      },
    },
  },
};

export const notificationsOpenApiComponents = {
  schemas: {
    Notification: notificationSchema,
  },
};
