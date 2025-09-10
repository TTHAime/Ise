import { Router } from 'express';
import {
  createTransactionHandler,
  getTransactionsHandler,
} from '../controllers/transaction.controller';

const transactionRoutes = Router();

transactionRoutes.post('/', createTransactionHandler);
transactionRoutes.get('/', getTransactionsHandler);

export default transactionRoutes;
