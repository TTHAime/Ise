import 'dotenv/config';
import { z } from 'zod';

const Env = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3000),
  APP_ORIGIN: z.url().default('http://localhost:3000'),
});

export const config = Env.parse(process.env);
