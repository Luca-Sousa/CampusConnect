/**
 * OpenAPI definitions for Groups and Group Messages endpoints.
 *
 * Tags: Grupos
 */

// ── Shared Schemas ──────────────────────────────────────────────────────────

const groupSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    description: { type: "string", nullable: true },
    icon: { type: "string", nullable: true },
    authorId: { type: "string", format: "uuid" },
    memberCount: { type: "integer" },
    isMember: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const groupMessageSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    groupId: { type: "string", format: "uuid" },
    authorId: { type: "string", format: "uuid" },
    content: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    author: {
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

export const groupsOpenApiPaths: Record<string, object> = {
  "/api/groups": {
    get: {
      tags: ["Grupos"],
      summary: "Listar grupos",
      description: "Lista grupos paginados com busca opcional por nome.",
      parameters: [
        { name: "search", in: "query", schema: { type: "string" }, description: "Busca por nome" },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50, default: 20 } },
        { name: "offset", in: "query", schema: { type: "integer", minimum: 0, default: 0 } },
      ],
      responses: {
        "200": {
          description: "Lista de grupos.",
          content: { "application/json": { schema: { type: "array", items: groupSchema } } },
        },
      },
    },
    post: {
      tags: ["Grupos"],
      summary: "Criar grupo",
      description: "Cria um novo grupo. Qualquer usuário autenticado pode criar.",
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", minLength: 1, maxLength: 200 },
                description: { type: "string", maxLength: 2000 },
                icon: { type: "string", maxLength: 10 },
              },
            },
          },
        },
      },
      responses: {
        "201": { description: "Grupo criado.", content: { "application/json": { schema: groupSchema } } },
        "401": { description: "Não autorizado." },
      },
    },
  },

  "/api/groups/{id}": {
    put: {
      tags: ["Grupos"],
      summary: "Editar grupo",
      description: "Atualiza um grupo existente. Apenas o autor ou admin.",
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
                name: { type: "string", minLength: 1, maxLength: 200 },
                description: { type: "string", maxLength: 2000, nullable: true },
                icon: { type: "string", maxLength: 10, nullable: true },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "Grupo atualizado.", content: { "application/json": { schema: groupSchema } } },
        "401": { description: "Não autorizado." },
        "403": { description: "Sem permissão para editar." },
        "404": { description: "Grupo não encontrado." },
      },
    },
    delete: {
      tags: ["Grupos"],
      summary: "Remover grupo",
      description: "Remove um grupo. Apenas o autor ou admin.",
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
      ],
      responses: {
        "204": { description: "Grupo removido." },
        "401": { description: "Não autorizado." },
        "403": { description: "Sem permissão para remover." },
        "404": { description: "Grupo não encontrado." },
      },
    },
  },

  "/api/groups/{id}/join": {
    post: {
      tags: ["Grupos"],
      summary: "Entrar/sair do grupo",
      description: "Alterna a participação do usuário no grupo (toggle).",
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
                  isMember: { type: "boolean" },
                  memberCount: { type: "integer" },
                },
              },
            },
          },
        },
        "401": { description: "Não autorizado." },
        "404": { description: "Grupo não encontrado." },
      },
    },
  },

  "/api/groups/{id}/leave": {
    delete: {
      tags: ["Grupos"],
      summary: "Sair do grupo",
      description: "Remove a participação do usuário. O criador não pode sair.",
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
      ],
      responses: {
        "204": { description: "Saiu do grupo." },
        "400": { description: "O criador não pode sair do grupo." },
        "401": { description: "Não autorizado." },
        "404": { description: "Grupo não encontrado." },
      },
    },
  },

  "/api/groups/{id}/messages": {
    get: {
      tags: ["Mensagens do Grupo"],
      summary: "Listar mensagens do grupo",
      description: "Lista mensagens paginadas do grupo. Apenas membros.",
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50, default: 20 } },
        { name: "offset", in: "query", schema: { type: "integer", minimum: 0, default: 0 } },
      ],
      responses: {
        "200": {
          description: "Lista de mensagens.",
          content: { "application/json": { schema: { type: "array", items: groupMessageSchema } } },
        },
        "401": { description: "Não autorizado." },
        "403": { description: "Apenas membros podem ver as mensagens." },
        "404": { description: "Grupo não encontrado." },
      },
    },
    post: {
      tags: ["Mensagens do Grupo"],
      summary: "Enviar mensagem no grupo",
      description: "Envia uma mensagem para o grupo. Apenas membros.",
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
                content: { type: "string", minLength: 1, maxLength: 2000 },
              },
            },
          },
        },
      },
      responses: {
        "201": { description: "Mensagem enviada.", content: { "application/json": { schema: groupMessageSchema } } },
        "401": { description: "Não autorizado." },
        "403": { description: "Apenas membros podem enviar mensagens." },
        "404": { description: "Grupo não encontrado." },
      },
    },
  },

  "/api/messages/{id}": {
    delete: {
      tags: ["Mensagens do Grupo"],
      summary: "Remover mensagem",
      description: "Remove uma mensagem. Autor da mensagem ou admin.",
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
      ],
      responses: {
        "204": { description: "Mensagem removida." },
        "401": { description: "Não autorizado." },
        "403": { description: "Sem permissão para remover." },
        "404": { description: "Mensagem não encontrada." },
      },
    },
  },
};

export const groupsOpenApiComponents = {
  schemas: {
    Group: groupSchema,
    GroupMessage: groupMessageSchema,
  },
};
