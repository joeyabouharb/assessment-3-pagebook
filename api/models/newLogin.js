const argon2 = require('argon2');
const { validateBody } = require('../utils/validators');

const NewLogin = () => ({
  userName: {
    presence: true,
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
    presence: true,
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
    presence: true,
    format: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_?])[A-Za-z\d@$!%*?&\-_?]{8,}$/,
      message: () => 'input not valid. please make sure you have 1 numeric, lowercase, uppecase and special character.',
    },
    length: {
      minimum: 8,
      maximum: 64,
    },
  },
  confirmPassword: {
    presence: true,
    equality: 'newPassword',
  },
});

const create = async (credentials) => {
  const newLogin = await validateBody(credentials, NewLogin)
    .then(({ userName, newPassword }) => ({
      userName, password: argon2.hash(newPassword),
    }));
  if (newLogin.error) {
    return Promise.reject(newLogin);
  }
  return newLogin;
};

module.exports = Object.freeze({
  name: NewLogin.name,
  create,
});
