export const handlePostSaveError = (error, _, next) => {
  error.status = 400;
  next();
};

export const setPreUpdateSettings = function (next) {
  // Make sure that after update we return back an updated record instead of original
  this.options.new = true;
  // Enable data validation for the update method
  this.options.runValidators = true;
  next();
};
