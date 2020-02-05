const argon2 = require('argon2');
const { validateBody } = require('../utils/validators');

const NewLogin = () => ({
  userName: {
    presence: { allowEmpty: false },
    format: {
      pattern: /^[a-zA-Z-\s]+$/,
      message: () => 'input not valid',
    },
    length: {
      minimum: 3,
      maximum: 40,
    },
    type: 'string',
  },
  oldPassword: {
    presence: { allowEmpty: false },
    format: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_?])[A-Za-z\d@$!%*?&\-_?]{8,}$/,
      message: () => 'input not valid',
    },
    length: {
      minimum: 8,
      maximum: 64,
    },
    type: 'string',
  },
  newPassword: {
    presence: { allowEmpty: false },
    format: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_?])[A-Za-z\d@$!%*?&\-_?]{10,}$/,
      message: () => 'input not valid',
    },
    length: {
      minimum: 10 ,
      maximum: 64,
    },
    type: 'string',
  },
  confirmPassword: {
    presence: { allowEmpty: false },
    equality: 'newPassword',
  },
});

const create = async (credentials) => {
  const newLogin = await validateBody(credentials, NewLogin())
    .then(async ({ userName, newPassword }) => {
      const password = await argon2.hash(newPassword);
      return { password, userName };
    }).catch((error) => ({ error }));
  if (newLogin.error) {
    return Promise.reject(newLogin);
  }
  return newLogin;
};

module.exports = Object.freeze({
  name: NewLogin.name,
  create,
});
