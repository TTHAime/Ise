import {
  ChangePasswordParams,
  UpdateDisplayNameParams,
} from '../controllers/z-schema/user.schema';
import { BAD_REQUEST, UNAUTHORIZED } from '../libs/http';
import { prisma } from '../libs/prisma';
import appAssert from '../utils/appAssert';
import { compareValue, hashValue } from '../utils/bcrypt';
import { getPasswordChangedTemplate } from '../utils/emailTemplate';
import { selectUserWithoutPassword } from '../utils/omitPassword';
import { sendMail } from '../utils/sendmail';

export const updateDisplayName = async (
  userId: string,
  data: UpdateDisplayNameParams
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { displayName: data.name },
    select: selectUserWithoutPassword,
  });

  return user;
};

export const changePassword = async (
  userId: string,
  data: ChangePasswordParams
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  appAssert(user, BAD_REQUEST, 'User not found');

  const isCurrentPasswordValid = await compareValue(
    data.currentPassword,
    user.passwordHash
  );
  appAssert(
    isCurrentPasswordValid,
    UNAUTHORIZED,
    'Current password is incorrect'
  );

  const newPasswordHash = await hashValue(data.newPassword);

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
    select: selectUserWithoutPassword,
  });

  await prisma.session.deleteMany({
    where: { userId },
  });

  try {
    await sendMail({
      to: user.email,
      ...getPasswordChangedTemplate(),
    });
  } catch (error) {
    console.error('Failed to send password change notification', error);
  }

  return updateUser;
};
