import { NOT_FOUND, OK } from '../libs/http';
import { prisma } from '../libs/prisma';
import appAssert from '../utils/appAssert';
import catchErrors from '../utils/catchErrors';
import { selectUserWithoutPassword } from '../utils/omitPassword';

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
