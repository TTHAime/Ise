import { CREATED } from '../libs/http';
import { createAccount } from '../services/auth.service';
import catchErrors from '../utils/catchErrors';
import { z } from 'zod';
import { setAuthCookie } from '../utils/cookie';

export const StrongPassword = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character'
  );

export const registerSchema = z
  .object({
    email: z.email().min(1).max(255),
    password: StrongPassword,
    confirmPassword: z.string(),
    name: z
      .string()
      .min(1, 'Name must be at least 1 characters long')
      .max(50, 'Name must not exceed 50 characters')
      .optional(),
    userAgent: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  });

export const registerHandler = catchErrors(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  });
  // call service
  const { user, accessToken, refreshToken } = await createAccount(request);
  // return response
  return setAuthCookie({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});
