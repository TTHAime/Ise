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
export type CreateTransactionParams = {
  amount: number;
  description?: string;
  categoryId?: string;
  type: 'INCOME' | 'EXPENSE';
  date?: Date;
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
