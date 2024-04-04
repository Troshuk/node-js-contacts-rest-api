import mail from '@sendgrid/mail';

import serverConfigs from '../../../../configs/serverConfigs.js';

const { API_KEY, EMAIL_FROM } = serverConfigs.SENDGRID;

mail.setApiKey(API_KEY);

export default {
  transporter: mail,
  from: EMAIL_FROM,
};
