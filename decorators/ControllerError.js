export const catchErrors = (action) => (req, res, next) =>
  action(req, res).catch(next);
