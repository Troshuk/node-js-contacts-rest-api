import serverConfigs from '../../../../configs/serverConfigs.js';
import smtpTransporter from './smtpTransporter.js';

export default smtpTransporter(serverConfigs.MAILTRAP_SMTP);
