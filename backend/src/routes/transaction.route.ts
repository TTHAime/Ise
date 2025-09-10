import { Router } from 'express';
import {
  createTransactionHandler,
  getTransactionByIdHandler,
  getTransactionsHandler,
} from '../controllers/transaction.controller';

const transactionRoutes = Router();

transactionRoutes.post('/', createTransactionHandler);
transactionRoutes.get('/', getTransactionsHandler);
transactionRoutes.get('/:id', getTransactionByIdHandler);

export default transactionRoutes;
