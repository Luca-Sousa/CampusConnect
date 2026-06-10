import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import { env } from "../../shared/env.js";
import * as authSchema from "./schema/auth.schema.js";
import * as postsSchema from "./schema/posts.schema.js";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: env.POSTGRES_URL });

export const pg = pool;
export const db = drizzle(pool, {
  schema: { ...authSchema, ...postsSchema },
});
