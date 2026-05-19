import postgres from "postgres";
import { env } from "../env";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema/auth";

export const pg = postgres(env.POSTGRES_URL);

export const db = drizzle(pg, { schema });
