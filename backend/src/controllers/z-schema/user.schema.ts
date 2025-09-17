import { z } from 'zod';
import { StrongPassword } from './auth.schema';

export const updateDisplayNameSchema = z.object({
  name: z
    .string()
    .min(1, 'Name must be at least 1 characters long')
    .max(50, 'Name must not exceed 50 characters'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: StrongPassword,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const updateProfileImageSchema = z.object({
  profileImage: z.url(),
});

export type UpdateDisplayNameParams = z.infer<typeof updateDisplayNameSchema>;
export type ChangePasswordParams = z.infer<typeof changePasswordSchema>;
export type UpdateProfileImageParams = z.infer<typeof updateProfileImageSchema>;
