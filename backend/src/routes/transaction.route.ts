import { Router } from 'express';
import {
  createTransactionHandler,
  deleteTransactionHandler,
  getTransactionByIdHandler,
  getTransactionsHandler,
  getTransactionStatsHandler,
  updateTransactionHandler,
} from '../controllers/transaction.controller';

const transactionRoutes = Router();

transactionRoutes.post('/', createTransactionHandler);
transactionRoutes.get('/', getTransactionsHandler);
transactionRoutes.get('/stats', getTransactionStatsHandler);
transactionRoutes.get('/:id', getTransactionByIdHandler);
transactionRoutes.patch('/:id', updateTransactionHandler);
transactionRoutes.delete('/:id', deleteTransactionHandler);

export default transactionRoutes;
