import {
  CreateCategoryParams,
  GetCategoriesParams,
  UpdateCategoryParams,
} from '../controllers/z-schema/category.schema';
import { NOT_FOUND } from '../libs/http';
import { prisma } from '../libs/prisma';
import appAssert from '../utils/appAssert';

const selectCategory = {
  id: true,
  name: true,
  color: true,
  icon: true,
  type: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      transactions: true,
    },
  },
};

export const createCategory = async (
  data: CreateCategoryParams & { userId: string }
) => {
  const category = await prisma.category.create({
    data: {
      name: data.name,
      color: data.color,
      icon: data.icon,
      type: data.type,
      userId: data.userId,
    },
    select: selectCategory,
  });

  return category;
};

export const checkCategoryNameExisting = async (
  name: string,
  userId: string,
  excludeId?: string
) => {
  const where = {
    userId,
    name: {
      equals: name,
      mode: 'insensitive' as const,
    },
    ...(excludeId && { id: { not: excludeId } }),
  };

  const category = await prisma.category.findFirst({ where });
  return !!category;
};

export const getCategoies = async (
  userId: string,
  params: GetCategoriesParams
) => {
  const { type, search } = params;

  const where = {
    userId,
    ...(type ? { type } : {}),
    ...(search?.trim()
      ? {
          name: {
            contains: search.trim(),
            mode: 'insensitive' as const,
          },
        }
      : {}),
  };

  const categories = await prisma.category.findMany({
    where,
    select: selectCategory,
    orderBy: [{ name: 'asc' }],
  });

  return categories;
};

export const getCategoryById = async (id: string, userId: string) => {
  const category = await prisma.category.findFirst({
    where: { id, userId },
    select: selectCategory,
  });

  return category;
};
export const getDefaultCategories = async () => {
  return [
    // Expense categories
    { name: 'Food & Dining', color: '#FF6B6B', icon: '🍽️', type: 'EXPENSE' },
    { name: 'Transportation', color: '#4ECDC4', icon: '🚗', type: 'EXPENSE' },
    { name: 'Shopping', color: '#45B7D1', icon: '🛍️', type: 'EXPENSE' },
    { name: 'Entertainment', color: '#96CEB4', icon: '🎬', type: 'EXPENSE' },
    { name: 'Healthcare', color: '#FFEAA7', icon: '🏥', type: 'EXPENSE' },
    { name: 'Education', color: '#DDA0DD', icon: '📚', type: 'EXPENSE' },
    {
      name: 'Bills & Utilities',
      color: '#FDA7DF',
      icon: '📋',
      type: 'EXPENSE',
    },
    { name: 'Travel', color: '#74B9FF', icon: '✈️', type: 'EXPENSE' },

    // Income categories
    { name: 'Salary', color: '#00B894', icon: '💰', type: 'INCOME' },
    { name: 'Freelance', color: '#FDCB6E', icon: '💼', type: 'INCOME' },
    { name: 'Investment', color: '#6C5CE7', icon: '📈', type: 'INCOME' },
    { name: 'Gift', color: '#FD79A8', icon: '🎁', type: 'INCOME' },
    { name: 'Other Income', color: '#81ECEC', icon: '💸', type: 'INCOME' },
  ];
};

export const updateCategory = async (
  id: string,
  userId: string,
  data: UpdateCategoryParams
) => {
  const existingCategory = await prisma.category.findFirst({
    where: { id, userId },
  });
  appAssert(existingCategory, NOT_FOUND, 'Category not found');

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.color !== undefined && { color: data.color }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.type !== undefined && { type: data.type }),
    },
    select: selectCategory,
  });

  return category;
};
