import { UpdateDisplayNameParams } from '../controllers/z-schema/ีuser.schema';
import { prisma } from '../libs/prisma';
import { selectUserWithoutPassword } from '../utils/omitPassword';

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
