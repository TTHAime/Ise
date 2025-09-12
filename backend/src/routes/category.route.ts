import { Router } from 'express';
import {
  createCategoryHandler,
  deleteCategoryHandler,
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
categoryRoutes.delete('/:id', deleteCategoryHandler);

export default categoryRoutes;
