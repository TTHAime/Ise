import { VerificationCodeType } from '@prisma/client';
import { prisma } from '../libs/prisma';
import { hashValue } from '../utils/bcrypt';
import { addYears } from 'date-fns';
import jwt from 'jsonwebtoken';
import { config } from '../libs/config';
import appAssert from '../utils/appAssert';
import { CONFLICT } from '../libs/http';

export type CreateAccountParams = {
  email: string;
  password: string;
  name?: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  appAssert(!existingUser, CONFLICT, 'Email already in use');

  const passwordHash = await hashValue(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      displayName: data.name, // ต้องมี field นี้ใน schema.prisma ด้วย
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      createdAt: true,
      updatedAt: true,
      verified: true,
    },
  });

  const verificationCode = await prisma.verificationCode.create({
    data: {
      userId: user.id,
      type: VerificationCodeType.email_verification,
      expiresAt: addYears(new Date(), 1),
    },
  });

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      userAgent: data.userAgent,
    },
  });

  const refreshToken = jwt.sign(
    { sessionId: session.id },
    config.JWT_REFRESH_SECRET,
    {
      audience: ['user'],
      expiresIn: '30d',
    }
  );

  const accessToken = jwt.sign(
    { userId: user.id, sessionId: session.id },
    config.JWT_ACCESS_SECRET,
    {
      audience: ['user'],
      expiresIn: '15m',
    }
  );

  return {
    user: user,
    accessToken,
    refreshToken,
  };
};
