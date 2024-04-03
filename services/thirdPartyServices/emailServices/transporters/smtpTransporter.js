import nodemailer from 'nodemailer';
import serverConfigs from '../../../../configs/serverConfigs.js';

export default (
  { HOST, USERNAME, PASSWORD, PORT, FROM } = serverConfigs.SMTP_EMAIL
) => ({
  transporter: nodemailer.createTransport({
    host: HOST,
    port: PORT,
    auth: {
      user: USERNAME,
      pass: PASSWORD,
    },
  }),
  from: FROM,
});
