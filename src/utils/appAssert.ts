import assert from 'assert';
import AppError from './AppError';
import { HttpStatusCode } from '../libs/http';
import AppErrorCode from '../libs/appErrorCode';

// Assert a condition and throws an AppError if the condition is falsy

type AppAssert = (
  conditon: unknown,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts conditon;

const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
