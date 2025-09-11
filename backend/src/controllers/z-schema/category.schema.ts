import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format (must be hex color)')
    .optional(),
  icon: z.union([
    z.string().regex(/^(lucide|heroicons|tabler):[a-z0-9-]+$/i), // ชื่อไอคอนจาก lib
    z.string().regex(/^emoji:.+$/), // emoji:🍔
    z.string().regex(/^url:https?:\/\/.+$/i), // url:https://...
  ]),
  type: z.enum(['INCOME', 'EXPENSE']),
});

export type CreateCategoryParams = z.infer<typeof createCategorySchema>;
