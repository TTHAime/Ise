import { z } from 'zod';

export const getMonthlyReportSchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(2000, 'Year must be >= 2000')
    .transform(val => {
      // ถ้าเป็น พ.ศ. ให้ลบ 543
      return val > 2400 ? val - 543 : val;
    }),
  month: z.coerce
    .number()
    .int()
    .min(1, 'Month must be between 1-12')
    .max(12, 'Month must be between 1-12'),
});

export const getYearlyReportSchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(2000, 'Year must be >= 2000')
    .transform(val => {
      // ถ้าเป็น พ.ศ. ให้ลบ 543
      return val > 2400 ? val - 543 : val;
    }),
});

export type GetMonthlyReportParams = z.infer<typeof getMonthlyReportSchema>;
export type GetYearlyReportParams = z.infer<typeof getYearlyReportSchema>;
