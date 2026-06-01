import postgres from "postgres";
import { env } from "../env";
import { drizzle } from "drizzle-orm/postgres-js";
import * as authSchema from "./schema/auth";
import * as postsSchema from "./schema/posts";

export const pg = postgres(env.POSTGRES_URL);

export const db = drizzle(pg, { schema: { ...authSchema, ...postsSchema } });
