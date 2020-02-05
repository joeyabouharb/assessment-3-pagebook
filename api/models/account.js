const argon2 = require('argon2');
const uuid = require('uuid/v4');
const { validateBody } = require('../utils/validators');

const Account = () => ({
  userName: {
    presence: { allowEmpty: false },
    format: {
      message: () => 'input not valid!',
      pattern: /^([ \u00c0-\u01ffa-zA-Z'\-])+$/,
    },
    length: {
      minimum: 3,
      maximum: 50,
    },
    type: 'string',
  },
  password: {
    presence: { allowEmpty: false },
    format: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_?])[A-Za-z\d@$!%*?&\-_?]{10,}$/,
      message: () => 'must contain 1 lower case, 1 uppercase, 1 numeric character',
    },
    length: {
      minimum: 10,
      maximum: 64,
    },
    type: 'string',
  },
  confirmPassword: {
    presence: { allowEmpty: false },
    equality: 'password',
  },
  email: {
    presence: { allowEmpty: false },
    email: {
      message: () => 'is not valid!',
    },
    length: {
      minimum: 4,
      maximum: 255,
    },
    type: 'string',
  },
});

const create = async (user) => {
  const account = await validateBody(user, Account());
  if (account.error) {
    return Promise.reject(account);
  }
  const { confirmPassword, password, ...details } = account;
  const hash = await argon2.hash(password);
  const userAccount = {
    ...details,
    password: hash,
    accountID: uuid(),
    isVerified: 0,
    isTwoFactor: 0,
    token: uuid(),
  };
  return userAccount;
};

module.exports = Object.freeze({
  name: Account.name,
  create,
});

// Please do not throw sausage pizza away
