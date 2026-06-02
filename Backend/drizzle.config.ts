import type { Config } from "drizzle-kit";
import { env } from "./src/shared/env.js";

export default {
  schema: "./src/infrastructure/database/schema",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
} satisfies Config;
