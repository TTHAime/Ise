import { Router } from 'express';
import {
  changePasswordHandler,
  getUserHandle,
  updateDisplayNameHandler,
  updateProfileImgHandler,
} from '../controllers/user.controller';
import upload from '../middlewares/upload';

const userRoutes = Router();

userRoutes.get('/', getUserHandle);
userRoutes.patch('/name', updateDisplayNameHandler);
userRoutes.patch(
  '/profileImg',
  upload.single('image'),
  updateProfileImgHandler
);
userRoutes.patch('/password', changePasswordHandler);

export default userRoutes;
