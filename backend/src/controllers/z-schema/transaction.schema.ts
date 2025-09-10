import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
  categoryId: z.cuid().optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.coerce.date().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const getTransactionsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.cuid().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  search: z.string().optional(),
});

export type CreateTransactionParams = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionParams = z.infer<typeof updateTransactionSchema>;
export type GetTransactionsParams = z.infer<typeof getTransactionsSchema>;
