import { VerificationCodeType } from '@prisma/client';
import { prisma } from '../libs/prisma';
import { compareValue, hashValue } from '../utils/bcrypt';
import { addYears } from 'date-fns';
import appAssert from '../utils/appAssert';
import { CONFLICT, UNAUTHORIZED } from '../libs/http';
import { refreshTokenSignOptions, signToken } from '../utils/jwt';

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
      displayName: data.name,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      createdAt: true,
      updatedAt: true,
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

  const refreshToken = signToken(
    { sessionId: session.id },
    refreshTokenSignOptions
  );

  const accessToken = signToken({ userId: user.id, sessionId: session.id });

  return {
    user: user,
    accessToken,
    refreshToken,
  };
};

export type LoginParams = {
  email: string;
  password: string;
  name?: string;
  userAgent?: string;
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  appAssert(user, UNAUTHORIZED, 'Invalid email or password');

  const isPasswordValid = await compareValue(password, user.passwordHash);
  appAssert(isPasswordValid, UNAUTHORIZED, 'Invalid email or password');

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      userAgent,
    },
  });
  const sessionInfo = {
    sessionId: session.id,
  };
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
  const accessToken = signToken({ userId: user.id, ...sessionInfo });

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      verified: user.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
    refreshToken,
  };
};
