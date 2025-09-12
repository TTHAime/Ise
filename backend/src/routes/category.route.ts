import { Router } from 'express';
import {
  createCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  getDefaultCategoriesHandler,
} from '../controllers/category.controller';

const categoryRoutes = Router();

categoryRoutes.post('/', createCategoryHandler);
categoryRoutes.get('/', getCategoriesHandler);
categoryRoutes.get('/defaults', getDefaultCategoriesHandler);
categoryRoutes.get('/:id', getCategoryByIdHandler);

export default categoryRoutes;
