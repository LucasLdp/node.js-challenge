import z from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REDIS_URL: z.url().optional(),
  CACHE_TTL: z.coerce.number().default(60000),
});

export const validateEnvFunction = (env: Record<string, string>) => {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    throw new Error(`Environment validation failed: ${result.error.message}`);
  }

  return result.data;
};
