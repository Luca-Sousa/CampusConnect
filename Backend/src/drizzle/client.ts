import { neon } from "@neondatabase/serverless";
import { env } from "../env";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "./schema/auth";
import * as postsSchema from "./schema/posts";

const sql = neon(env.POSTGRES_URL);

export const db = drizzle(sql, { schema: { ...authSchema, ...postsSchema } });
