import { z } from 'zod';

export const StrongPassword = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  );
export const loginSchema = z.object({
  email: z.email().min(1).max(255),
  password: StrongPassword,
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(6).max(255),
    name: z
      .string()
      .min(1, 'Name must be at least 1 characters long')
      .max(50, 'Name must not exceed 50 characters')
      .optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  });

export const verificationCodeSchema = z.object({
  code: z.string().min(1, 'Verification code is required'),
});
