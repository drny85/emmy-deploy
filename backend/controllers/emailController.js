import dotenv from 'dotenv';
import nodeMailer from 'nodemailer';

dotenv.config();

const transport = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'login',
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async ({ to, from, subject, html }) => {
  try {
    const msg = {
      to: to,
      from: from,
      subject: subject,

      html: html,
    };
    transport.sendMail(msg, (err, info) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(info);
    });
  } catch (error) {
    console.error(error);
  }
};
