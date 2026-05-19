import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle/client";
import * as schema from "../drizzle/schema/auth";
import { env } from "../env";

export const auth = betterAuth({
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
});
