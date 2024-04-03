import pug from 'pug';
import path from 'path';

import EmailBase from './EmailBase.js';
import smtpTransporter from './transporters/smtpTransporter.js';
import serverConfigs from '../../../configs/serverConfigs.js';

const { BASE_API_URL } = serverConfigs.APP;

class SmtpEmail extends EmailBase {
  #sendPug(to, template, subject, data = {}, from = this.from) {
    const html = pug.renderFile(
      path.join(process.cwd(), 'views', 'email', `${template}.pug`),
      {
        subject,
        ...data,
      }
    );

    this.send({ to, html, subject, from });
  }

  sendEmailVerification(to, token) {
    return this.#sendPug(
      to,
      'emailConfirmation',
      'Your email verification to Contacts App',
      { url: `${BASE_API_URL}/users/verify/${token}` }
    );
  }

  sendPasswordReset(to, token) {
    return this.#sendPug(
      to,
      'resetPassword',
      'Reset Password for Contacts App',
      {
        url: `${BASE_API_URL}/users/password/reset/${token}`,
      }
    );
  }
}

const { transporter, from } = smtpTransporter();

export default new SmtpEmail(transporter, from);
