import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmailForPasswordChange = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'farhan.adnan1952@gmail.com',
      pass: 'odogzppnxqlrgqjr',
    },
  });

  await transporter.sendMail({
    from: 'farhan.adnan1952@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within 10 mins!', // Subject line
    text: '', // plain text body
    html, // html body
  });
};