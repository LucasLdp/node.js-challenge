import z from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.url(),
});

export const validateEnvFunction = (env: Record<string, string>) => {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    throw new Error(`Environment validation failed: ${result.error.message}`);
  }

  return result.data;
};
