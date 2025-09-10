import { VerificationCodeType } from '@prisma/client';
import { prisma } from '../libs/prisma';
import { compareValue, hashValue } from '../utils/bcrypt';
import { addDays, addHours, addMinutes, addYears, subMinutes } from 'date-fns';
import appAssert from '../utils/appAssert';
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from '../libs/http';
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from '../utils/jwt';
import { sendMail } from '../utils/sendmail';
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from '../utils/emailTemplate';
import { config } from '../libs/config';
import { selectUserWithoutPassword } from '../utils/omitPassword';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

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
    select: selectUserWithoutPassword,
  });

  const verificationCode = await prisma.verificationCode.create({
    data: {
      userId: user.id,
      type: VerificationCodeType.EmailVerification,
      expiresAt: addYears(new Date(), 1),
    },
  });

  const url = `${config.APP_ORIGIN}/email/verify/${verificationCode.id}`;
  try {
    await sendMail({
      to: user.email,
      ...getVerifyEmailTemplate(url),
    });
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }

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

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, 'Invalid refresh token');

  const { sessionId } = payload;
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    'Session expired'
  );
  // refresh the session if it expires in the next 24 hours
  const sessionNeedRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
  if (sessionNeedRefresh) {
    await prisma.session.updateMany({
      where: {
        id: session.id,
        expiresAt: { lte: new Date(now + ONE_DAY_MS) },
      },
      data: { expiresAt: addDays(now, 30) },
    });
  }

  const newRefreshToken = sessionNeedRefresh
    ? signToken(
        {
          sessionId: session.id,
        },
        refreshTokenSignOptions
      )
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session.id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};
export const verifyEmail = async (code: string) => {
  const validCode = await prisma.verificationCode.findFirst({
    where: {
      id: code,
      type: VerificationCodeType.EmailVerification,
      expiresAt: {
        gt: new Date(), // ยังไม่หมดอายุ
      },
    },
  });
  appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');

  const updatedUser = await prisma.user.update({
    where: { id: validCode.userId },
    data: { verified: true },
    select: { id: true, email: true, verified: true },
  });
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to verify email');

  await prisma.verificationCode.delete({
    where: { id: validCode.id },
  });

  return {
    updatedUser,
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  appAssert(user, NOT_FOUND, 'User not found');

  const fiveMinAgo = subMinutes(new Date(), 5);
  const count = await prisma.verificationCode.count({
    where: {
      userId: user.id,
      type: 'PasswordReset',
      createdAt: { gt: fiveMinAgo },
    },
  });
  appAssert(
    count <= 1,
    TOO_MANY_REQUESTS,
    'Too many request, please try again later'
  );

  const expiresAt = addHours(new Date(), 1);
  const verificationCode = await prisma.verificationCode.create({
    data: {
      userId: user.id, // user._id → Prisma จะใช้ id ที่ map กับ schema
      type: 'PasswordReset', // ต้องตรงกับ enum VerificationCodeType
      expiresAt: expiresAt, // กำหนดวันหมดอายุ
    },
  });

  const url = `${config.APP_ORIGIN}/password/reset?code=${verificationCode.id}&exp=${expiresAt.getTime()}`;

  try {
    const data = await sendMail({
      to: user.email,
      ...getPasswordResetTemplate(url),
    });

    appAssert(data?.messageId, INTERNAL_SERVER_ERROR, 'Failed to send email');

    return {
      url,
      emailId: data.messageId,
    };
  } catch (error) {
    appAssert(
      false,
      INTERNAL_SERVER_ERROR,
      `Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};
export const resetPassword = async ({
  password,
  verificationCode,
}: ResetPasswordParams) => {
  const validCode = await prisma.verificationCode.findFirst({
    where: {
      id: verificationCode,
      type: VerificationCodeType.PasswordReset,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');

  const passwordHash = await hashValue(password);

  const updatedUser = await prisma.user.update({
    where: { id: validCode.userId },
    data: { passwordHash },
    select: selectUserWithoutPassword,
  });
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to reset password');

  await prisma.verificationCode.delete({
    where: { id: validCode.id },
  });

  await prisma.session.deleteMany({
    where: { userId: updatedUser.id },
  });

  return {
    user: updatedUser,
  };
};
