import 'dotenv/config';
import { z } from 'zod';

const Env = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3000),
  APP_ORIGIN: z.url().default('http://localhost:3000'),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT Access Secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT Refresh Secret must be at least 32 characters'),
});

export const config = Env.parse(process.env);
