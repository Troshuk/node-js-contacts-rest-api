import crypto from 'crypto';

export const hashResetToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');
