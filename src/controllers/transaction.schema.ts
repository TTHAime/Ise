import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
  categoryId: z.cuid().optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.coerce.date().optional(),
});
