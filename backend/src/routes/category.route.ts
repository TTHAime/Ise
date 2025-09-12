import { Router } from 'express';
import {
  createCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  getDefaultCategoriesHandler,
  updateCategoryHandler,
} from '../controllers/category.controller';

const categoryRoutes = Router();

categoryRoutes.post('/', createCategoryHandler);
categoryRoutes.get('/', getCategoriesHandler);
categoryRoutes.get('/defaults', getDefaultCategoriesHandler);
categoryRoutes.get('/:id', getCategoryByIdHandler);
categoryRoutes.patch('/:id', updateCategoryHandler);

export default categoryRoutes;
