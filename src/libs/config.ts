import 'dotenv/config';
import { z } from 'zod';

const Env = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3000),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT Access Secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT Refresh Secret must be at least 32 characters'),
  APP_ORIGIN: z.url(),

  SMTP_HOST: z.string().default('smtp-relay.brevo.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.email('Must be valid email'),
  SMTP_PASS: z.string().min(1, 'SMTP password required'),
  EMAIL_SENDER: z.email('Must be valid email'),
});

export const config = Env.parse(process.env);
