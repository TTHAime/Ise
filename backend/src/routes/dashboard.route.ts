import { Router } from 'express';
import { getDashboardHandler } from '../controllers/dashboard.controller';

const dashboardRoutes = Router();

dashboardRoutes.get('/', getDashboardHandler);

export default dashboardRoutes;
