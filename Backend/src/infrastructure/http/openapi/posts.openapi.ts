/**
 * OpenAPI definitions for Posts, Comments, Likes, and RSVP endpoints.
 *
 * Tags: Posts, Comentários, Curtidas, RSVP
 */

// ── Shared Schemas ──────────────────────────────────────────────────────────

const postAuthorSchema = {
  type: "object",
  nullable: true,
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    image: { type: "string", nullable: true },
    cargo: { type: "string" },
  },
};

const postSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    authorId: { type: "string", format: "uuid" },
    type: { type: "string", enum: ["text", "image", "event", "news"] },
    content: { type: "string", nullable: true },
    imageUrl: { type: "string", nullable: true },
    eventTitle: { type: "string", nullable: true },
    eventDate: { type: "string", nullable: true },
    eventTime: { type: "string", nullable: true },
    eventEndTime: { type: "string", nullable: true },
    eventLocation: { type: "string", nullable: true },
    newsTitle: { type: "string", nullable: true },
    tags: { type: "array", items: { type: "string" }, nullable: true },
    moderated: { type: "boolean" },
    moderationReasons: { type: "array", items: { type: "string" }, nullable: true },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    author: postAuthorSchema,
    rsvpCount: { type: "integer" },
    hasRsvp: { type: "boolean" },
  },
};

const commentAuthorSchema = {
  type: "object",
  nullable: true,
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    image: { type: "string", nullable: true },
  },
};

const commentSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    postId: { type: "string", format: "uuid" },
    authorId: { type: "string", format: "uuid" },
    parentId: { type: "string", format: "uuid", nullable: true },
    content: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    author: commentAuthorSchema,
    replies: { type: "array", items: { $ref: "#/components/schemas/Comment" } },
  },
};

const errorSchema = {
  type: "object",
  properties: { error: { type: "string" } },
};

// ── Paths ───────────────────────────────────────────────────────────────────

export const postsOpenApiPaths: Record<string, object> = {
  // ─── Posts ────────────────────────────────────────────────────────────────
  "/api/posts": {
    get: {
      tags: ["Posts"],
      summary: "Listar publicações",
      description: "Lista publicações paginadas com autor e contagem de RSVP.",
      parameters: [
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50, default: 20 } },
        { name: "offset", in: "query", schema: { type: "integer", minimum: 0, default: 0 } },
      ],
      responses: {
        "200": {
          description: "Lista de publicações.",
          content: { "application/json": { schema: { type: "array", items: postSchema } } },
        },
      },
    },
    post: {
      tags: ["Posts"],
      summary: "Criar publicação",
      description: "Cria uma nova publicação. Notícias exigem cargo oficial. Conteúdo passa por moderação AI.",
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              oneOf: [
                {
                  type: "object",
                  required: ["type", "content"],
                  properties: {
                    type: { type: "string", enum: ["text"] },
                    content: { type: "string", minLength: 1, maxLength: 5000 },
                  },
                },
                {
                  type: "object",
                  required: ["type", "imageUrl"],
                  properties: {
                    type: { type: "string", enum: ["image"] },
                    content: { type: "string", maxLength: 2000 },
                    imageUrl: { type: "string", minLength: 1 },
                  },
                },
                {
                  type: "object",
                  required: ["type", "eventTitle", "eventDate", "eventTime", "eventLocation"],
                  properties: {
                    type: { type: "string", enum: ["event"] },
                    content: { type: "string", maxLength: 2000 },
                    eventTitle: { type: "string", minLength: 1, maxLength: 200 },
                    eventDate: { type: "string", description: "YYYY-MM-DD" },
                    eventTime: { type: "string", description: "HH:mm" },
                    eventEndTime: { type: "string", description: "HH:mm (opcional)" },
                    eventLocation: { type: "string", minLength: 1, maxLength: 300 },
                    imageUrl: { type: "string" },
                  },
                },
                {
                  type: "object",
                  required: ["type", "newsTitle", "content"],
                  properties: {
                    type: { type: "string", enum: ["news"] },
                    newsTitle: { type: "string", minLength: 1, maxLength: 200 },
                    content: { type: "string", minLength: 1, maxLength: 5000 },
                    imageUrl: { type: "string" },
                  },
                },
              ],
            },
          },
        },
      },
      responses: {
        "201": { description: "Publicação criada.", content: { "application/json": { schema: postSchema } } },
        "400": { description: "Erro de validação ou conteúdo tóxico grave.", content: { "application/json": { schema: errorSchema } } },
        "401": { description: "Não autorizado." },
        "403": { description: "Sem permissão para criar este tipo de publicação." },
      },
    },
  },

  "/api/posts/{id}": {
    put: {
      tags: ["Posts"],
      summary: "Editar publicação",
      description: "Edita uma publicação existente. O tipo é imutável. Conteúdo passa por moderação AI.",
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                content: { type: "string", maxLength: 5000 },
                imageUrl: { type: "string", nullable: true },
                eventTitle: { type: "string", maxLength: 200 },
                eventDate: { type: "string" },
                eventTime: { type: "string" },
                eventEndTime: { type: "string", nullable: true },
                eventLocation: { type: "string", maxLength: 300 },
                newsTitle: { type: "string", maxLength: 200 },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "Publicação atualizada.", content: { "application/json": { schema: postSchema } } },
        "400": { description: "Erro de validação ou conteúdo tóxico grave.", content: { "application/json": { schema: errorSchema } } },
        "401": { description: "Não autorizado." },
        "403": { description: "Sem permissão para editar." },
        "404": { description: "Publicação não encontrada." },
      },
    },
    delete: {
      tags: ["Posts"],
      summary: "Remover publicação",
      description: "Remove uma publicação. Autor do post ou admin.",
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
      ],
      responses: {
        "204": { description: "Publicação removida." },
        "401": { description: "Não autorizado." },
        "403": { description: "Sem permissão para remover." },
        "404": { description: "Publicação não encontrada." },
      },
    },
  },

  "/api/posts/{id}/approve": {
    post: {
      tags: ["Posts"],
      summary: "Aprovar publicação retida",
      description: "Aprova uma publicação que foi retida pela moderação AI. Apenas admins.",
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
      ],
      responses: {
        "200": { description: "Publicação aprovada.", content: { "application/json": { schema: postSchema } } },
        "401": { description: "Não autorizado." },
        "403": { description: "Apenas administradores podem aprovar." },
        "404": { description: "Publicação não encontrada." },
      },
    },
  },

  // ─── Curtidas ─────────────────────────────────────────────────────────────
  "/api/posts/{id}/like": {
    get: {
      tags: ["Curtidas"],
      summary: "Consultar curtidas",
      description: "Retorna a contagem de curtidas e se o usuário atual curtiu.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
      ],
      responses: {
        "200": {
          description: "Contagem e status.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  likesCount: { type: "integer" },
                  hasLiked: { type: "boolean" },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Curtidas"],
      summary: "Alternar curtida",
      description: "Alterna a curtida do usuário na publicação (toggle).",
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
      ],
      responses: {
        "200": {
          description: "Status atualizado.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  hasLiked: { type: "boolean" },
                },
              },
            },
          },
        },
        "401": { description: "Não autorizado." },
        "404": { description: "Publicação não encontrada." },
      },
    },
  },

  // ─── RSVP ─────────────────────────────────────────────────────────────────
  "/api/posts/{id}/rsvp": {
    post: {
      tags: ["RSVP"],
      summary: "Confirmar presença em evento",
      description: "Alterna a presença do usuário em um evento (toggle).",
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
      ],
      responses: {
        "200": {
          description: "Status do RSVP.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  hasRsvp: { type: "boolean" },
                  rsvpCount: { type: "integer" },
                },
              },
            },
          },
        },
        "400": { description: "RSVP só é válido para eventos." },
        "401": { description: "Não autorizado." },
        "404": { description: "Publicação não encontrada." },
      },
    },
  },

  // ─── Comentários ──────────────────────────────────────────────────────────
  "/api/posts/{id}/comments": {
    get: {
      tags: ["Comentários"],
      summary: "Listar comentários",
      description: "Lista os comentários de uma publicação com respostas aninhadas (1 nível).",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
      ],
      responses: {
        "200": {
          description: "Lista de comentários.",
          content: { "application/json": { schema: { type: "array", items: commentSchema } } },
        },
      },
    },
    post: {
      tags: ["Comentários"],
      summary: "Adicionar comentário",
      description: "Adiciona um comentário ou resposta a uma publicação.",
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["content"],
              properties: {
                content: { type: "string", minLength: 1 },
                parentId: { type: "string", format: "uuid", description: "ID do comentário pai (para respostas)" },
              },
            },
          },
        },
      },
      responses: {
        "201": { description: "Comentário criado.", content: { "application/json": { schema: commentSchema } } },
        "400": { description: "Conteúdo obrigatório ou comentário pai não encontrado." },
        "401": { description: "Não autorizado." },
        "404": { description: "Publicação não encontrada." },
      },
    },
  },
};

export const postsOpenApiComponents = {
  schemas: {
    Post: postSchema,
    Comment: commentSchema,
  },
  securitySchemes: {
    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "session",
      description: "Sessão Better Auth (cookie httpOnly)",
    },
  },
};
