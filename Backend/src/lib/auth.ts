import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { i18n } from "@better-auth/i18n";
import { db } from "../drizzle/client";
import * as schema from "../drizzle/schema/auth";
import { env } from "../env";

const ptBR: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "E-mail ou senha inválidos.",
  INVALID_EMAIL: "E-mail inválido.",
  INVALID_PASSWORD: "Senha inválida.",
  PASSWORD_TOO_SHORT: "A senha deve ter pelo menos 8 caracteres.",
  PASSWORD_TOO_LONG: "A senha é muito longa.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Já existe uma conta com este e-mail.",
  USER_NOT_FOUND: "Usuário não encontrado.",
  FAILED_TO_CREATE_USER: "Não foi possível criar o usuário.",
  FAILED_TO_CREATE_SESSION: "Não foi possível criar a sessão.",
  EMAIL_NOT_VERIFIED: "E-mail não verificado.",
  SESSION_EXPIRED: "Sessão expirada. Faça login novamente.",
};

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [env.FRONTEND_URL, env.BACKEND_URL],
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  plugins: [
    i18n({
      defaultLocale: "pt",
      detection: ["callback"],
      getLocale: () => "pt",
      translations: { pt: ptBR },
    }),
  ],
});
