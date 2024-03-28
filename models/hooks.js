import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const handlePostSaveError = (error, _, next) => {
  // eslint-disable-next-line no-param-reassign
  error.status = 400;

  next();
};

export function setPreUpdateSettings(next) {
  // Make sure that after update we return back an updated record instead of original
  this.options.new = true;
  // Enable data validation for the update method
  this.options.runValidators = true;

  next();
}

export function preFindOneAndUpdatePassword(next) {
  const { password } = this.getUpdate();

  if (password) {
    this.getUpdate().password = bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(10)
    );
  }

  next();
}

export function preSavePassword(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  }

  next();
}

export function preCreateAvatar(next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');

    this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=identicon`;
  }

  next();
}
