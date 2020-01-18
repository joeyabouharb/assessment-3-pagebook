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
  const { accountID } = req.user;
  const { Account } = req;
  Account.accountID = accountID;
  const accountRepository = AccountRepository();
  const account = accountRepository.updateAccountDetails(Account);
  accountRepository.close();
  if (account.error) {
    return res.status(account.status).json(account);
  }
  return res.json({ success: true });
};

const getUserDetails = (req, res) => {
  const { accountID } = res.user;
  if (!accountID) {
    return res.status(400).json({ error: 'bad request', status: 400 });
  }
  const accountRepository = AccountRepository();
  const result = accountRepository.checkIfUserExists(accountID);
  accountRepository.close();
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result });
};

const changeUserPassword = (req, res) => {
  const { accountID } = req.user;
  const { NewLogin } = req;
  const accountRepository = AccountRepository();
  const result = accountRepository.changeUserPassword({ ...NewLogin, accountID });
  if (result.error) {
    return res.send(result.status).json(result);
  }
  return res.json(result);
};

module.exports = Object.freeze({
  register,
  login,
  updateAccount,
  deleteAccount,
  getUserDetails,
  changeUserPassword,
});
