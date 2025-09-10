import nodemailer from 'nodemailer';
import { config } from './config';

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_SECURE,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

// Test connection
transporter.verify(error => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server ready to send emails');
  }
});

export default transporter;
