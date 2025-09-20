import { Router } from 'express';

import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  sendPasswordResetHandler,
  verifyEmailHandler,
} from '../controllers/auth.controller';
import upload from '../middlewares/upload';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

const authRoutes = Router();

authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/refresh', refreshHandler);
authRoutes.get('/logout', logoutHandler);
authRoutes.get('/email/verify/:code', verifyEmailHandler);
authRoutes.post('/password/forgot', sendPasswordResetHandler);
authRoutes.post('/password/reset', resetPasswordHandler);

authRoutes.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(
      req.file.path,
      'profiles',
      'profile'
    );

    return res.status(200).json({
      success: true,
      message: 'Uploaded!',
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Error uploading file' });
  }
});

export default authRoutes;
