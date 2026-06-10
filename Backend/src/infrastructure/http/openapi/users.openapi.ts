/**
 * OpenAPI definitions for Users endpoints.
 *
 * Tags: Usuários
 */

// ── Shared Schemas ──────────────────────────────────────────────────────────

const userSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    email: { type: "string", format: "email" },
    image: { type: "string", nullable: true },
    role: { type: "string", enum: ["aluno", "colaborador", "admin"] },
    cargo: { type: "string", nullable: true },
    course: { type: "string", nullable: true },
    bio: { type: "string", nullable: true },
  },
};

const errorSchema = {
  type: "object",
  properties: { error: { type: "string" } },
};

// ── Paths ───────────────────────────────────────────────────────────────────

export const usersOpenApiPaths: Record<string, object> = {
  "/api/users/me": {
    patch: {
      tags: ["Usuários"],
      summary: "Atualizar perfil",
      description: "Atualiza o perfil do usuário autenticado (nome, imagem, curso, bio).",
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", minLength: 1, maxLength: 100 },
                image: { type: "string", maxLength: 2000, nullable: true },
                course: { type: "string", maxLength: 200, nullable: true },
                bio: { type: "string", maxLength: 500, nullable: true },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "Perfil atualizado.", content: { "application/json": { schema: userSchema } } },
        "400": { description: "Erro de validação." },
        "401": { description: "Não autorizado." },
      },
    },
  },
};

export const usersOpenApiComponents = {
  schemas: {
    User: userSchema,
  },
};
