import cookieParser from 'cookie-parser';
import { config } from './libs/config';
import { prisma } from './libs/prisma';
import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import { OK } from './libs/http';
import authRoutes from './routes/auth.route';
import authenticate from './middlewares/authenticate';
import userRoutes from './routes/user.route';
import sessionRoutes from './routes/session.route';
import transactionRoutes from './routes/transaction.route';
import categoryRoutes from './routes/category.route';
import cloudinary from './libs/cloudinary';
import helmet from 'helmet';
import { createWorker } from 'tesseract.js';

const PORT = config.PORT || 4000;
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production',
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.APP_ORIGIN,
    credentials: true,
  })
);

app.get('/', (req, res) => {
  return res.status(OK).json({
    status: 'healthy',
  });
});

app.use('/auth', authRoutes);

app.use('/user', authenticate, userRoutes);
app.use('/session', authenticate, sessionRoutes);
app.use('/transaction', authenticate, transactionRoutes);
app.use('/category', authenticate, categoryRoutes);

app.use(errorHandler);

async function start() {
  console.log('TZ =', process.env.TZ);
  console.log('Now =', new Date().toString());
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('DB connect');
  } catch (err) {
    console.error('DB not ready', err);
    process.exit(1);
  }
  try {
    const res = await cloudinary.api.ping();
    console.log('Cloudinary connected:', res.status);
  } catch (err) {
    console.error('Cloudinary connection failed:', err);
  }
  try {
    const worker = await createWorker('tha+eng');
    console.log('[OCR] Tesseract worker ready ✅');
    await worker.terminate();
  } catch (err) {
    console.error('[OCR] Tesseract failed ❌', err);
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
