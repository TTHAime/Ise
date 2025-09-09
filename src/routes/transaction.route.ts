import { Router } from 'express';
import { createTransactionHandler } from '../controllers/transaction.controller';

const transactionRoutes = Router();

transactionRoutes.post('/', createTransactionHandler);

export default transactionRoutes;
