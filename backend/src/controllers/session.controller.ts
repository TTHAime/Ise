import { NOT_FOUND, OK } from '../libs/http';
import catchErrors from '../utils/catchErrors';
import { prisma } from '../libs/prisma';
import z from 'zod';
import appAssert from '../utils/appAssert';

export const getSessionHandler = catchErrors(async (req, res) => {
  const userId = req.userId;

  const sessions = await prisma.session.findMany({
    where: {
      userId: userId,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      userAgent: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(OK).json(
    sessions.map(session => ({
      ...session,
      ...(session.id === req.sessionId && {
        isCurrent: true,
      }),
    }))
  );
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);
  const userId = req.userId;
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      userId: userId,
    },
  });

  appAssert(session, NOT_FOUND, 'Session not found');

  await prisma.session.delete({
    where: { id: sessionId },
  });

  return res.status(OK).json({
    message: 'Session deleted successfully',
  });
});
