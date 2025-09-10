import {
  CreateTransactionParams,
  GetTransactionsParams,
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
