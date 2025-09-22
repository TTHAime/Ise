import { Prisma } from '@prisma/client';

export const toNum = (
  v: number | string | bigint | Prisma.Decimal | null | undefined
): number => {
  if (v === null || v === undefined) return 0;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return Number(v);
  if (typeof v === 'bigint') return Number(v);
  return (v as Prisma.Decimal).toNumber();
};

export const toStr = (
  v: number | string | bigint | Prisma.Decimal | null | undefined
): string => {
  if (v === null || v === undefined) return '0';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'bigint') return String(v);
  return (v as Prisma.Decimal).toString();
};

export const pctChange = (current: number, previous: number): number => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
};
