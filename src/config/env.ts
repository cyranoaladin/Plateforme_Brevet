import { z } from "zod";

const envSchema = z.object({
  // Infrastructure
  QDRANT_URL: z.string().url().default("http://localhost:6333"),
  QDRANT_TIMEOUT_MS: z.coerce.number().default(2500),
  
  // RAG Logic
  ARIA_MODE: z.enum(["mock", "rag"]).default("mock"),
  ARIA_LLM_PROVIDER: z.enum(["mock", "openai", "openrouter"]).default("mock"),
  ARIA_RERANK_PROVIDER: z.enum(["none", "llm"]).default("none"),
  
  // Security
  SALT: z.string().min(16).optional(), // Obligatoire en prod via validateEnv
  
  // API Keys
  OPENAI_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),

  // Server
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ [ENV] Invalid environment variables:", JSON.stringify(result.error.format(), null, 2));
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
      throw new Error("Invalid environment configuration.");
    }
    return envSchema.parse({ SALT: "dev-salt-dummy-32-chars-long-security" }); 
  }

  const data = result.data;

  // Règle de Sécurité P0 : Fail fast en production sans SALT
  if (data.NODE_ENV === 'production' && !data.SALT) {
    throw new Error("❌ SECURITY CRITICAL: SALT environment variable is missing in production.");
  }

  // Warning en dev pour sensibiliser
  if (data.NODE_ENV === 'development' && !data.SALT) {
    console.warn("⚠️ [SECURITY] Running without a SALT. IP hashing will be weak. Define SALT in .env.local");
  }

  return {
    ...data,
    SALT: data.SALT || "dev-fallback-salt-min-32-chars-long"
  };
}

export const env = validateEnv();
