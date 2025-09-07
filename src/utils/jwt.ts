import { Session, User } from '@prisma/client';
import jwt, { SignOptions } from 'jsonwebtoken';
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

const defaults: SignOptions = {
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
  return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};
