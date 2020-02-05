const { validateBody } = require('../utils/validators');

const Login = () => ({
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
  password: {
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
});


const create = async (credentials) => {
  const login = await validateBody(credentials, Login());
  if (login.error) {
    Promise.reject(login);
  }
  return login;
};

module.exports = Object.freeze({
  name: Login.name,
  create,
});
