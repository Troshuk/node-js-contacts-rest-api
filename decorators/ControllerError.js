export const catchErrors = (callback) => (req, res, next) =>
  callback(req, res).catch(next);
