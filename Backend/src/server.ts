import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { errorHandler } from "./error-handler";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { registerRoute } from "./routes/register-route";
import { loginRoute } from "./routes/login-route";
import { env } from "./env";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "CampusConnect API",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

// Auth routes
app.register(registerRoute);
app.register(loginRoute);

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log(`Server is running on port ${env.PORT}`);
  console.log(`http://localhost:${env.PORT}`);
  console.log(`Swagger UI available at http://localhost:${env.PORT}/docs`);
});
