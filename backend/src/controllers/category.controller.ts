import { BAD_REQUEST, CONFLICT, CREATED } from '../libs/http';
import {
  checkCategoryNameExisting,
  createCategory,
} from '../services/category.service';
import appAssert from '../utils/appAssert';
import catchErrors from '../utils/catchErrors';
import { createCategorySchema } from './z-schema/category.schema';

export const createCategoryHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, BAD_REQUEST, 'User not authenticated');

  const data = createCategorySchema.parse(req.body);

  const nameExists = await checkCategoryNameExisting(data.name, userId);
  appAssert(!nameExists, CONFLICT, 'Category name already exists');

  const category = await createCategory({ ...data, userId });

  return res.status(CREATED).json({ category });
});
