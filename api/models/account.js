const argon2 = require('argon2');
const uuid = require('uuid/v4');
const { validateBody } = require('../utils/validators');

const Account = () => ({
  userName: {
    presence: true,
    format: {
      message: () => 'input not valid!',
      pattern: /^[a-zA-Z-\s]+$/,
    },
    length: {
      minimum: 3,
      maximum: 40,
    },
    type: 'string',
  },
  password: {
    presence: true,
    format: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_?])[A-Za-z\d@$!%*?&\-_?]{8,}$/,
      message: () => 'must contain 1 lower case, 1 uppercase, 1 numeric character',
    },
    length: {
      minimum: 8,
      maximum: 64,
    },
    type: 'string',
  },
  confirmPassword: {
    presence: true,
    equality: 'password',
  },
  email: {
    presence: true,
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
  console.log(userAccount);
  return userAccount;
};

module.exports = Object.freeze({
  name: Account.name,
  create,
});

// Please do not throw sausage pizza away
