import { Router } from 'express';
import {
  getUserHandle,
  updateDisplayNameHandler,
} from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.get('/', getUserHandle);
userRoutes.patch('/name', updateDisplayNameHandler);

export default userRoutes;
