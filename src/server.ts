import cookieParser from 'cookie-parser';
import { config } from './libs/config';
import { prisma } from './libs/prisma';
import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import { OK } from './libs/http'
import catchErrors from './utils/catchErrors';

const PORT = config.PORT || 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.APP_ORIGIN,
    credentials: true,
  })
);

app.get("/" , (req , res) => {
  return res.status(OK).json({
    status:"healthy"
  });
})
app.use(errorHandler);

async function start() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('DB connect');
  } catch (err) {
    console.error('DB not ready', err);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
