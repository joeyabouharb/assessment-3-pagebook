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
  accountRepository.close();
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result });
};

const deleteAccount = (req, res) => {
  const accountRepository = AccountRepository();
  const { id: pageID } = req.params;
  const result = accountRepository.deleteAccount({ pageID });
  accountRepository.close();
  if (result.error || !result) {
    return res.status(result.status).json(result);
  }
  return res.json({
    result: 'success!',
  });
};

const updateAccount = (req, res) => {
  const accountRepository = AccountRepository();
  const account = accountRepository.updateAccountDetails(req.Account);
  if (account.error) {
    return res.status(account.status).josn(account);
  }
  return res.json({ success: true });
};

module.exports = Object.freeze({
  register,
  login,
  updateAccount,
  deleteAccount,
});
