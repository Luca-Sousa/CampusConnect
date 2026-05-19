import { buildApp } from "./app";
import { env } from "./env";

const app = buildApp();

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log(`Server is running on port ${env.PORT}`);
  console.log(`http://localhost:${env.PORT}`);
  console.log(`Swagger UI available at http://localhost:${env.PORT}/docs`);
});

