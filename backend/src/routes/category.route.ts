import { Router } from 'express';
import {
  createCategoryHandler,
  getCategoriesHandler,
  getDefaultCategoriesHandler,
} from '../controllers/category.controller';

const categoryRoutes = Router();

categoryRoutes.post('/', createCategoryHandler);
categoryRoutes.get('/', getCategoriesHandler);
categoryRoutes.get('/defaults', getDefaultCategoriesHandler);

export default categoryRoutes;
