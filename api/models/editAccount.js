const { validateBody } = require('../utils/validators');

const Account = () => ({
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
  userName: {
    presence: { allowEmpty: false },
    length: {
      minimum: 4,
      maximum: 50,
    },
  },
});

const create = async (user) => {
  const account = await validateBody(user, Account());
  if (account.error) {
    return Promise.reject(account);
  }
  return account;
};

module.exports = Object.freeze({
  name: Account.name,
  create,
});
