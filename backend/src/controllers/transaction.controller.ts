import { BAD_REQUEST, CREATED, OK } from '../libs/http';
import {
  createTransaction,
  getTransactions,
} from '../services/transaction.service';
import appAssert from '../utils/appAssert';

import catchErrors from '../utils/catchErrors';
import {
  createTransactionSchema,
  getTransactionsSchema,
} from './z-schema/transaction.schema';

export const createTransactionHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, BAD_REQUEST, 'User not authenticated');
  const data = createTransactionSchema.parse(req.body);
  const transaction = await createTransaction({ ...data, userId });

  return res.status(CREATED).json({ transaction });
});

export const getTransactionsHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, BAD_REQUEST, 'User not authenticated');
  const params = getTransactionsSchema.parse(req.query);
  const result = await getTransactions(userId, params);

  return res.status(OK).json(result);
});
