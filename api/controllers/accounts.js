const { signJwt } = require('../utils/auth');
const AccountRepository = require('../repository/AccountRepository');

const login = async (req, res) => {
  const accountRepository = AccountRepository();
  const { Login } = req;
  const result = await accountRepository.login(Login);
  accountRepository.close();
  if (result.error) {
    return res.status(result.status)
      .json(result);
  }
  const token = await signJwt(result)
    .catch((error) => {
      res.status(400);
      return { error };
    });
  return res.json({ token });
};

const register = (req, res) => {
  const accountRepository = AccountRepository();
  const { Account } = req;
  const result = accountRepository.register(Account);
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result });
};

module.exports = Object.freeze({
  register,
  login,
});
