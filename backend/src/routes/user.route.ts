import { Router } from 'express';
import { getUserHandle } from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.get('/', getUserHandle);

export default userRoutes;
