import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import {
  CreateTransactionParams,
  GetTransactionsParams,
  UpdateTransactionParams,
} from '../controllers/z-schema/transaction.schema';
import { BAD_REQUEST, NOT_FOUND } from '../libs/http';
import { prisma } from '../libs/prisma';
import appAssert from '../utils/appAssert';
import { ocrSlip } from '../utils/ocrSlip';
import { pctChange, toNum } from '../utils/money';
import { Prisma } from '@prisma/client';

const selectTransaction = {
  id: true,
  amount: true,
  description: true,
  type: true,
  date: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      color: true,
      icon: true,
    },
  },
};

export const createTransaction = async (
  data: CreateTransactionParams & { userId: string }
) => {
  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId: data.userId,
      },
    });
    appAssert(category, NOT_FOUND, 'Category not found');
  }
  const transaction = await prisma.transaction.create({
    data: {
      amount: data.amount,
      description: data.description,
      type: data.type,
      date: data.date ? new Date(data.date) : new Date(),
      userId: data.userId,
      categoryId: data.categoryId,
    },
    select: selectTransaction,
  });

  return transaction;
};

export interface createTransactionBySlipInput {
  userId: string;
  fileBuffer?: Buffer;
}

export const createTransactionBySlip = async (
  input: createTransactionBySlipInput
) => {
  const { userId, fileBuffer } = input;
  if (!fileBuffer) {
    appAssert(fileBuffer, BAD_REQUEST, 'File buffer is required');
  }
  const ocrData = await ocrSlip(fileBuffer);

  const transaction = await prisma.transaction.create({
    data: {
      amount: ocrData.amount ? parseFloat(ocrData.amount) : 0,
      type: 'EXPENSE',
      date: ocrData.date ? new Date(ocrData.date) : new Date(),
      userId: userId,
    },
    select: selectTransaction,
  });

  return {
    transaction,
    ocrData,
  };
};

export const getTransactions = async (
  userId: string,
  params: GetTransactionsParams
) => {
  const { page, limit, type, categoryId, dateFrom, dateTo, search } = params;
  const skip = (page - 1) * limit;
  const where = {
    userId,
    ...(type ? { type } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(dateFrom || dateTo
      ? {
          date: {
            ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
            ...(dateTo ? { lte: new Date(dateTo) } : {}),
          },
        }
      : {}),
    ...(search && search.trim()
      ? {
          description: {
            contains: search.trim(),
            mode: 'insensitive' as const,
          },
        }
      : {}),
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      select: selectTransaction,
      orderBy: { date: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTransactionById = async (id: string, userId: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
    select: selectTransaction,
  });

  return transaction;
};

export const updateTransaction = async (
  id: string,
  userId: string,
  data: UpdateTransactionParams
) => {
  const existingTransaction = await prisma.transaction.findFirst({
    where: { id, userId },
    select: selectTransaction,
  });
  appAssert(existingTransaction, NOT_FOUND, 'Transaction not found');

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId,
      },
    });
    appAssert(category, NOT_FOUND, 'Category not found');
  }

  const transaction = await prisma.transaction.update({
    where: { id, userId },
    data: {
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
    },
    select: selectTransaction,
  });
  return transaction;
};

export const deleteTransaction = async (id: string, userId: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
  });
  appAssert(transaction, NOT_FOUND, 'Transaction not found');

  await prisma.transaction.delete({
    where: { id, userId },
  });
};

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  transactionCount: number;
  monthlyComparison: {
    income: { current: number; previous: number; percentage: number };
    expense: { current: number; previous: number; percentage: number };
  };
  incomeVsExpenseThisMonth: {
    incomeSharePct: number; // % ของรายรับเมื่อเทียบกับรายจ่าย+รายรับในเดือนนี้
    expenseSharePct: number;
  };
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string;
    total: number;
    count: number;
    percentage: number; // % ของหมวดนั้นเทียบกับ totalExpense เดือนนี้
  }>;
  recentTransactions: Array<{
    id: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    date: Date;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string;
  }>;
}

export const getDashboardStats = async (
  userId: string
): Promise<DashboardStats> => {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);

  const prev = subMonths(now, 1);
  const prevMonthStart = startOfMonth(prev);
  const prevMonthEnd = endOfMonth(prev);

  const [currentStatRaw, prevStatRaw, topCategoriesRaw, recentTransactionsRaw] =
    await Promise.all([
      prisma.transaction.groupBy({
        where: {
          userId,
          date: { gte: currentMonthStart, lte: currentMonthEnd },
        },
        by: ['type'],
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.transaction.groupBy({
        where: {
          userId,
          date: { gte: prevMonthStart, lte: prevMonthEnd },
        },
        by: ['type'],
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        where: {
          userId,
          type: 'EXPENSE',
          categoryId: { not: null },
          date: { gte: currentMonthStart, lte: currentMonthEnd },
        },
        by: ['categoryId'],
        _sum: { amount: true },
        _count: { _all: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 5,
      }),
      prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: currentMonthStart, lte: currentMonthEnd },
        },
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }], // กันกรณีวันที่เท่ากัน
        take: 10,
        select: {
          id: true,
          amount: true,
          type: true,
          date: true,
          category: { select: { name: true, color: true, icon: true } },
        },
      }),
    ]);

  // ----- สรุปเดือนปัจจุบัน -----
  const totalIncome = toNum(
    currentStatRaw.find(r => r.type === 'INCOME')?._sum.amount
  );
  const totalExpense = toNum(
    currentStatRaw.find(r => r.type === 'EXPENSE')?._sum.amount
  );
  const netIncome = totalIncome - totalExpense;
  const transactionCount = currentStatRaw.reduce(
    (s, r) => s + r._count._all,
    0
  );

  // ----- เดือนก่อนหน้า สำหรับ comparison -----
  const prevIncome = toNum(
    prevStatRaw.find(r => r.type === 'INCOME')?._sum.amount
  );
  const prevExpense = toNum(
    prevStatRaw.find(r => r.type === 'EXPENSE')?._sum.amount
  );

  // ----- เติม meta ของหมวดหมู่ -----
  const catIds = topCategoriesRaw
    .map(r => r.categoryId!)
    .filter(Boolean) as string[];
  const catMetas = catIds.length
    ? await prisma.category.findMany({
        where: { id: { in: catIds } },
        select: { id: true, name: true, color: true, icon: true },
      })
    : [];
  const catMap = new Map(catMetas.map(c => [c.id, c]));

  const topCategories = topCategoriesRaw.map(r => {
    const meta = catMap.get(r.categoryId!);
    const total = toNum(r._sum.amount);
    return {
      categoryId: r.categoryId!,
      categoryName: meta?.name ?? 'Uncategorized',
      categoryColor: meta?.color ?? '#999999',
      categoryIcon: meta?.icon ?? 'tag',
      total,
      count: r._count._all,
      percentage: totalExpense > 0 ? (total / totalExpense) * 100 : 0,
    };
  });

  const recentTransactions = recentTransactionsRaw.map(t => ({
    id: t.id,
    amount: toNum(t.amount as unknown as Prisma.Decimal),
    type: t.type,
    date: t.date,
    categoryName: t.category?.name ?? '—',
    categoryColor: t.category?.color ?? '#999999',
    categoryIcon: t.category?.icon ?? 'tag',
  }));

  const sumThisMonth = totalIncome + totalExpense;
  const incomeVsExpenseThisMonth = {
    incomeSharePct: sumThisMonth > 0 ? (totalIncome / sumThisMonth) * 100 : 0,
    expenseSharePct: sumThisMonth > 0 ? (totalExpense / sumThisMonth) * 100 : 0,
  };

  return {
    totalIncome,
    totalExpense,
    netIncome,
    transactionCount,
    monthlyComparison: {
      income: {
        current: totalIncome,
        previous: prevIncome,
        percentage: pctChange(totalIncome, prevIncome),
      },
      expense: {
        current: totalExpense,
        previous: prevExpense,
        percentage: pctChange(totalExpense, prevExpense),
      },
    },
    incomeVsExpenseThisMonth,
    topCategories,
    recentTransactions,
  };
};
