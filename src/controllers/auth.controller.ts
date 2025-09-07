import { CREATED, OK, UNAUTHORIZED } from '../libs/http';
import { prisma } from '../libs/prisma';
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
} from '../services/auth.service';
import appAssert from '../utils/appAssert';
import catchErrors from '../utils/catchErrors';
import {
  clearAuthCookie,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookie,
} from '../utils/cookie';
import { AccessTokenPayload, verifyToken } from '../utils/jwt';
import { loginSchema, registerSchema } from './auth.schema';

export const registerHandler = catchErrors(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  });
  // call service
  const { user, accessToken, refreshToken } = await createAccount(request);
  // return response
  return setAuthCookie({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});

export const loginHandler = catchErrors(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  });

  const { accessToken, refreshToken } = await loginUser(request);
  return setAuthCookie({ res, accessToken, refreshToken })
    .status(OK)
    .json({ message: 'Login Successful' });
});

export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || '');

  if (payload) {
    const { sessionId } = payload as AccessTokenPayload;
    await prisma.session.delete({
      where: { id: sessionId },
    });
  }
  return clearAuthCookie(res).status(OK).json({
    message: 'Logout successful',
  });
});

export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, 'Missing refresh token');

  const { accessToken, newRefreshToken } =
    await refreshUserAccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie(
      'refresh token',
      newRefreshToken,
      getRefreshTokenCookieOptions()
    );
  }

  return res
    .status(OK)
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .json({
      message: 'Access token refreshed',
    });
});
