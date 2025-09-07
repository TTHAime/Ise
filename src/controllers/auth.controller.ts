import { CREATED, OK } from '../libs/http';
import { createAccount, loginUser } from '../services/auth.service';
import catchErrors from '../utils/catchErrors';
import { z } from 'zod';
import { setAuthCookie } from '../utils/cookie';
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
