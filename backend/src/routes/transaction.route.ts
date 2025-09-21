import { Router } from 'express';
import {
  createTransactionBySlipHandler,
  createTransactionHandler,
  deleteTransactionHandler,
  getTransactionByIdHandler,
  getTransactionsHandler,
  getTransactionStatsHandler,
  updateTransactionHandler,
} from '../controllers/transaction.controller';
import upload from '../middlewares/upload';

const transactionRoutes = Router();

transactionRoutes.post('/', createTransactionHandler);
transactionRoutes.post(
  '/slip',
  upload.single('image'),
  createTransactionBySlipHandler
);
transactionRoutes.get('/', getTransactionsHandler);
transactionRoutes.get('/stats', getTransactionStatsHandler);
transactionRoutes.get('/:id', getTransactionByIdHandler);
transactionRoutes.patch('/:id', updateTransactionHandler);
transactionRoutes.delete('/:id', deleteTransactionHandler);

export default transactionRoutes;
