/**
 * Documentação manual dos endpoints do Better Auth para o Swagger.
 * O Better Auth bypassa o sistema de rotas do Fastify, por isso os paths
 * precisam ser injetados diretamente no spec OpenAPI via transformObject.
 */
export const authOpenApiPaths: Record<string, object> = {
  "/api/auth/sign-up/email": {
    post: {
      tags: ["Auth"],
      summary: "Criar conta",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: { type: "string", minLength: 2 },
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 8 },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Usuário criado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string" },
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      email: { type: "string" },
                      emailVerified: { type: "boolean" },
                      image: { type: "string", nullable: true },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
        "422": { description: "Email já em uso ou dados inválidos" },
      },
    },
  },

  "/api/auth/sign-in/email": {
    post: {
      tags: ["Auth"],
      summary: "Entrar com email e senha",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 8 },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Autenticado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string" },
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      email: { type: "string" },
                      emailVerified: { type: "boolean" },
                      image: { type: "string", nullable: true },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
        "401": { description: "Credenciais inválidas" },
      },
    },
  },

  "/api/auth/sign-out": {
    post: {
      tags: ["Auth"],
      summary: "Encerrar sessão",
      responses: {
        "200": { description: "Sessão encerrada com sucesso" },
        "401": { description: "Não autenticado" },
      },
    },
  },

  "/api/auth/session": {
    get: {
      tags: ["Auth"],
      summary: "Obter sessão atual",
      responses: {
        "200": {
          description: "Dados da sessão ativa",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  session: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      userId: { type: "string" },
                      expiresAt: { type: "string", format: "date-time" },
                      ipAddress: { type: "string", nullable: true },
                      userAgent: { type: "string", nullable: true },
                    },
                  },
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      email: { type: "string" },
                      emailVerified: { type: "boolean" },
                      image: { type: "string", nullable: true },
                    },
                  },
                },
              },
            },
          },
        },
        "401": { description: "Não autenticado" },
      },
    },
  },
};
