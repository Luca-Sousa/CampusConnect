import postgres from "postgres";
import { env } from "../../shared/env.js";
import { drizzle } from "drizzle-orm/postgres-js";
import * as authSchema from "./schema/auth.schema.js";
import * as postsSchema from "./schema/posts.schema.js";

export const pg = postgres(env.POSTGRES_URL);

export const db = drizzle(pg, {
  schema: { ...authSchema, ...postsSchema },
});
