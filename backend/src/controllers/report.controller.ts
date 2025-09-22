import { BAD_REQUEST, OK } from '../libs/http';
import { getMonthlyReport, getYearlyReport } from '../services/report.service';
import appAssert from '../utils/appAssert';
import catchErrors from '../utils/catchErrors';
import {
  getMonthlyReportSchema,
  getYearlyReportSchema,
} from './z-schema/report.schema';

export const getMonthlyReportHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, BAD_REQUEST, 'User not authenticated');

  const data = getMonthlyReportSchema.parse(req.query);

  const report = await getMonthlyReport(userId, data.year, data.month);

  return res.status(OK).json({
    message: 'Monthly report retrieved successfully',
    data: report,
  });
});

export const getYearlyReportHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, BAD_REQUEST, 'User not authenticated');

  const data = getYearlyReportSchema.parse(req.query);
  const report = await getYearlyReport(userId, data.year);

  return res.status(OK).json({
    message: 'Yearly report retrieved successfully',
    data: report,
  });
});
