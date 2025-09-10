import { Session, User } from '@prisma/client';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { config } from '../libs/config';

export type RefreshTokenPayload = {
  sessionId: Session['id'];
};

export type AccessTokenPayload = {
  userId: User['id'];
  sessionId: Session['id'];
};

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

const signdefaults: SignOptions = {
  audience: ['user'],
};

const verifyDefaults: VerifyOptions = {
  audience: ['user'],
};

const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: '15m',
  secret: config.JWT_ACCESS_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: '30d',
  secret: config.JWT_REFRESH_SECRET,
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...signdefaults, ...signOpts });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  const { secret = config.JWT_ACCESS_SECRET, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      ...verifyDefaults,
      ...verifyOpts,
    }) as TPayload;
    return {
      payload,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: String(error) };
  }
};
