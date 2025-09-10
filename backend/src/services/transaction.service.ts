import {
  CreateTransactionParams,
  GetTransactionsParams,
  UpdateTransactionParams,
} from '../controllers/z-schema/transaction.schema';
import { NOT_FOUND } from '../libs/http';
import { prisma } from '../libs/prisma';
import appAssert from '../utils/appAssert';

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

export const getTransactionStats = async (userId: string) => {
  const currentDate = new Date();
  const currentMonthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const currentMonthEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const [totalIncome, totalExpense, monthlyIncome, monthlyExpense] =
    await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: 'INCOME' },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'EXPENSE' },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'INCOME',
          date: { gte: currentMonthStart, lt: currentMonthEnd },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'EXPENSE',
          date: { gte: currentMonthStart, lt: currentMonthEnd },
        },
        _sum: { amount: true },
      }),
    ]);

  const totalIncomeAmount = Number(totalIncome._sum.amount) || 0;
  const totalExpenseAmount = Math.abs(Number(totalExpense._sum.amount) || 0); // ใช้ abs เพื่อแสดงเป็นบวก
  const monthlyIncomeAmount = Number(monthlyIncome._sum.amount) || 0;
  const monthlyExpenseAmount = Math.abs(
    Number(monthlyExpense._sum.amount) || 0
  );

  return {
    totalIncome: totalIncomeAmount,
    totalExpense: totalExpenseAmount,
    monthlyIncome: monthlyIncomeAmount,
    monthlyExpense: monthlyExpenseAmount,
    balance: totalIncomeAmount - totalExpenseAmount,
    monthlyBalance: monthlyIncomeAmount - monthlyExpenseAmount,
  };
};
