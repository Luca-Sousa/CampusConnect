import { buildApp } from "./infrastructure/http/app.js";
import { env } from "./shared/env.js";

const app = buildApp();

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log(`Server running on http://localhost:${env.PORT}`);
  console.log(`Swagger UI: http://localhost:${env.PORT}/docs`);
});
