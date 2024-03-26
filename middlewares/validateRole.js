import { StatusCodes } from 'http-status-codes';

import HttpError from '../helpers/HttpError.js';
import catchErrors from '../decorators/catchErrors.js';

export default (...roles) =>
  catchErrors(({ user }, _, next) => {
    if (!user) throw new HttpError(StatusCodes.UNAUTHORIZED);

    if (!roles.includes(user.role)) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You are not allowed to perform this action'
      );
    }

    next();
  });
