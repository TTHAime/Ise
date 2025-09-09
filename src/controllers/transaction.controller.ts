import { BAD_REQUEST, CREATED } from '../libs/http';
import { createTransaction } from '../services/transaction.service';
import appAssert from '../utils/appAssert';

import catchErrors from '../utils/catchErrors';
import { createTransactionSchema } from './transaction.schema';

export const createTransactionHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, BAD_REQUEST, 'User not authenticated');
  const data = createTransactionSchema.parse(req.body);
  const transaction = await createTransaction({ ...data, userId });

  return res.status(CREATED).json({ transaction });
});
