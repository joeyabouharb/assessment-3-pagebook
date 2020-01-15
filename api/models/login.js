const validate = require('validate.js');
const constraints = require('../../shared/validations/login');

const Login = ({ userName, password }) => ({
  userName,
  password,
});

const create = async (credentials) => {
  const login = await validate.async(credentials, constraints)
    .catch((error) => ({ error }));
  if (login.error) {
    return { error: login.error, status: 400 };
  }
  return Login(credentials);
};

module.exports = Object.freeze({
  name: Login.name,
  create,
});
