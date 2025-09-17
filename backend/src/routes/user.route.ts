import { Router } from 'express';
import {
  changePasswordHandler,
  getUserHandle,
  updateDisplayNameHandler,
} from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.get('/', getUserHandle);
userRoutes.patch('/name', updateDisplayNameHandler);
userRoutes.patch('/password', changePasswordHandler);

export default userRoutes;
