import { neon } from "@neondatabase/serverless";
import { env } from "../env";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/auth";

const sql = neon(env.POSTGRES_URL);

export const db = drizzle(sql, { schema });
