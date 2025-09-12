import { BAD_REQUEST, CONFLICT, CREATED, OK } from '../libs/http';
import {
  checkCategoryNameExisting,
  createCategory,
  getCategoies,
  getDefaultCategories,
} from '../services/category.service';
import appAssert from '../utils/appAssert';
import catchErrors from '../utils/catchErrors';
import {
  createCategorySchema,
  getCategoriesSchema,
} from './z-schema/category.schema';

export const createCategoryHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, BAD_REQUEST, 'User not authenticated');

  const data = createCategorySchema.parse(req.body);

  const nameExists = await checkCategoryNameExisting(data.name, userId);
  appAssert(!nameExists, CONFLICT, 'Category name already exists');

  const category = await createCategory({ ...data, userId });

  return res.status(CREATED).json({ category });
});

export const getCategoriesHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, BAD_REQUEST, 'User not authenticated');

  const params = getCategoriesSchema.parse(req.query);
  const categories = await getCategoies(userId, params);

  return res.status(OK).json({ categories });
});

export const getDefaultCategoriesHandler = catchErrors(async (req, res) => {
  const defaultCategories = await getDefaultCategories();

  return res.status(OK).json({ categories: defaultCategories });
});
