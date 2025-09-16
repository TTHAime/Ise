import { NOT_FOUND, OK } from '../libs/http';
import { prisma } from '../libs/prisma';
import { updateDisplayName } from '../services/user.service';
import appAssert from '../utils/appAssert';
import catchErrors from '../utils/catchErrors';
import { selectUserWithoutPassword } from '../utils/omitPassword';
import { updateDisplayNameSchema } from './z-schema/ีuser.schema';

export const getUserHandle = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, NOT_FOUND, 'User not found');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: selectUserWithoutPassword,
  });
  appAssert(user, NOT_FOUND, 'User not found');
  return res.status(OK).json({ user });
});

export const updateDisplayNameHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, NOT_FOUND, 'User not found');

  const data = updateDisplayNameSchema.parse(req.body);
  const user = await updateDisplayName(userId, data);

  return res.status(OK).json({
    user,
    message: 'Display name update successfully',
  });
});
