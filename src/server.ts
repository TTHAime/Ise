import { config } from './libs/config';
import { prisma } from './libs/prisma';
import express from 'express';

const app = express();

const PORT = process.env.PORT || 4000;

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
