import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import path from "path";
import { env } from "../shared/env.js";

async function runMigrations() {
  const sql = postgres(env.POSTGRES_URL, { ssl: "require", max: 1 });
  const db = drizzle(sql);

  const migrationsFolder = path.resolve(__dirname, "migrations");

  console.log("Applying migrations from:", migrationsFolder);

  await migrate(db, { migrationsFolder });

  console.log("Migrations applied successfully.");
  await sql.end();
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
