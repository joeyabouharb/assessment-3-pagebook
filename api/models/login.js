const constraints = require('../../shared/validations/login');
const { validateBody } = require('../utils/validators');

const Login = ({ userName, password }) => ({
  userName,
  password,
});

const create = async (credentials) => {
  const login = await validateBody(credentials, constraints);
  if (login.error) {
    Promise.reject(login);
  }
  return Login(login);
};

module.exports = Object.freeze({
  name: Login.name,
  create,
});
