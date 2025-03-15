import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  HOST: z.string().default("http://127.0.0.1"),
  PORT: z.coerce.number().optional().default(4444),
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  API_PATH: z.string().default("api"),
  API_VERSION: z.string().default("1.0.0"),
  SWAGGER_PATH: z.string().default("docs"),
});

export type Env = z.infer<typeof envSchema>;
