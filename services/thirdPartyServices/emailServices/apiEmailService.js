import serverConfigs from '../../../configs/serverConfigs.js';
import EmailBase from './EmailBase.js';
import sendGridApiTransporter from './transporters/sendGridApiTransporter.js';

const {
  SENDGRID: { PASSWORD_RESET_TEMPLATE_ID, EAMIL_VERIFICATION_TEMPLATE_ID },
  APP: { BASE_API_URL },
} = serverConfigs;

class ApiEmailService extends EmailBase {
  sendPasswordReset(to, token) {
    return this.send({
      to,
      template_id: PASSWORD_RESET_TEMPLATE_ID,
      dynamic_template_data: {
        reset_password_url: `${BASE_API_URL}/users/password/reset/${token}`,
      },
    });
  }

  sendEmailVerification(to, token) {
    return this.send({
      to,
      template_id: EAMIL_VERIFICATION_TEMPLATE_ID,
      dynamic_template_data: {
        verify_url: `${BASE_API_URL}/users/verify/${token}`,
      },
    });
  }
}

const { transporter, from } = sendGridApiTransporter;

transporter.sendMail = transporter.send;

export default new ApiEmailService(transporter, from);
