import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  POSTGRES_URL: z.string(),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  BACKEND_URL: z.string().default("http://localhost:3333"),
  BETTER_AUTH_SECRET: z.string().optional(),
  // SMTP — opcional em dev (logs no console se não configurado)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  // AI provider configuration (Groq - gratuito)
  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().default("llama-3.1-8b-instant"),
  MODERATION_THRESHOLD: z.coerce.number().default(0.6),
});

export const env = envSchema.parse(process.env);
