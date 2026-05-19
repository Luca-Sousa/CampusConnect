import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { i18n } from "@better-auth/i18n";
import { db } from "../drizzle/client";
import * as schema from "../drizzle/schema/auth";
import { env } from "../env";
import { ptBR } from "./auth-i18n";
import { authDatabaseHooks } from "./auth-hooks";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "aluno",
      },
      cargo: {
        type: "string",
        required: false,
      },
    },
  },
  databaseHooks: authDatabaseHooks,
  trustedOrigins: [env.FRONTEND_URL, env.BACKEND_URL],
  advanced: {
    database: {
      generateId: "uuid",
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
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
