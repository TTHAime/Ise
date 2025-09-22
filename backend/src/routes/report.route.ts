import { Router } from 'express';
import {
  getMonthlyReportHandler,
  getYearlyReportHandler,
} from '../controllers/report.controller';

const reportRoutes = Router();

reportRoutes.get('/monthly', getMonthlyReportHandler);
reportRoutes.get('/yearly', getYearlyReportHandler);

export default reportRoutes;
