import { Router } from 'express';
import {
  createCategoryHandler,
  getCategoriesHandler,
} from '../controllers/category.controller';

const categoryRoutes = Router();

categoryRoutes.post('/', createCategoryHandler);
categoryRoutes.get('/', getCategoriesHandler);

export default categoryRoutes;
