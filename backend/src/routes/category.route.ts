import { Router } from 'express';
import { createCategoryHandler } from '../controllers/category.controller';

const categoryRoutes = Router();

categoryRoutes.post('/', createCategoryHandler);

export default categoryRoutes;
