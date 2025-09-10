import { Router } from 'express';
import {
  createTransactionHandler,
  getTransactionByIdHandler,
  getTransactionsHandler,
  updateTransactionHandler,
} from '../controllers/transaction.controller';

const transactionRoutes = Router();

transactionRoutes.post('/', createTransactionHandler);
transactionRoutes.get('/', getTransactionsHandler);
transactionRoutes.get('/:id', getTransactionByIdHandler);
transactionRoutes.patch('/:id', updateTransactionHandler);

export default transactionRoutes;
