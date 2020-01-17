const argon2 = require('argon2');
const uuid = require('uuid/v4');
const constraints = require('../../shared/validations/account');
const { validateBody } = require('../utils/validators');

const Account = ({
  userName, hash, email,
}) => ({
  userName,
  password: hash,
  email,
  isVerified: 0,
  isTwoFactor: 0,
  token: uuid(),
  accountId: uuid(),
});

const create = async (user) => {
  const account = await validateBody(user, constraints);
  if (account.error) {
    Promise.reject(account);
  }
  const hash = await argon2.hash(user.password);
  const userAccount = Account({ hash, ...account });
  return userAccount;
};

module.exports = Object.freeze({
  name: Account.name,
  create,
});

// Please do not throw sausage pizza away
