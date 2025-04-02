import { z } from "zod";

// SUPABASE_URL=""
// SUPABASE_KEY=""
// SUPABASE_ACCESS_TOKEN=""

export const envSchema = z.object({
  // NODE
  NODE_ENV: z.string().default("development"),
  HOST: z.string().default("http://127.0.0.1"),
  PORT: z.coerce.number().optional().default(4444),
  // DATABASE
  DATABASE_URL: z.string().url(),
  // JWT
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  // API
  API_PATH: z.string().default("api"),
  API_VERSION: z.string().default("1.0.0"),
  SWAGGER_PATH: z.string().default("docs"),
  // SUPABASE
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
