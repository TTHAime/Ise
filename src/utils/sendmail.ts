import transporter from '../libs/nodemailer';
import { config } from '../libs/config';
import appAssert from './appAssert';
import { INTERNAL_SERVER_ERROR } from '../libs/http';

type Params = {
  to: string;
  subject: string;
  text?: string;
  html: string;
};

export const sendMail = async ({ to, subject, text, html }: Params) => {
  const result = await transporter.sendMail({
    from: `"ISE Expense Tracker" <${config.EMAIL_SENDER}>`,
    to,
    subject,
    text,
    html,
  });

  appAssert(result, INTERNAL_SERVER_ERROR, 'Failed to send email');

  console.log('✅ Email sent successfully:', result.messageId);
  return result;
};
