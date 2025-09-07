import { Response, CookieOptions } from 'express';
import { config } from '../libs/config';
import { addDays, addMinutes } from 'date-fns';

export const REFRESH_PATH = '/auth/refresh';
const secure = config.NODE_ENV !== 'development';

const defaultCookieOptions: CookieOptions = {
  sameSite: 'strict',
  httpOnly: true,
  secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaultCookieOptions,
  expires: addMinutes(new Date(), 15),
});
export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaultCookieOptions,
  expires: addDays(new Date(), 30),
  path: REFRESH_PATH,
});

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookie = ({ res, accessToken, refreshToken }: Params) =>
  res
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookie = (res: Response) =>
  res.clearCookie('accessToken').clearCookie('refreshToken', {
    path: REFRESH_PATH,
  });
