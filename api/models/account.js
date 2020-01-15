const validate = require('validate.js');
const argon2 = require('argon2');
const uuid = require('uuid/v4');
const constraints = require('../../shared/validations/account');

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
const create = async ({
  userName, password, email, confirmPassword,
}) => {
  const account = await validate.async({
    userName,
    password,
    email,
    confirmPassword,
  }, constraints)
    .catch((error) => ({ error }));
  if (account.error) {
    return { error: account.error, status: 400 };
  }
  const hash = await argon2.hash(password);
  const acc = Account({ hash, ...account });
  return acc;
};

module.exports = Object.freeze({
  name: Account.name,
  create,
});

// Please do not throw sausage pizza away
