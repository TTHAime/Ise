import { CreateCategoryParams } from '../controllers/z-schema/category.schema';
import { prisma } from '../libs/prisma';

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
