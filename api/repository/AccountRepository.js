const argon2 = require('argon2');
const pagesDBClient = require('./DatabaseClient');

/**
 *
 * Handles CRUD opperations for Accounts in specified database,
 * Register, Login, Logout, Delete and update details
 *
 * @param {string} db
 */
const AccountRepository = (db = './pages.db') => {
  const client = pagesDBClient(db);

  /**
   * create a new account
   * @param {Account} account
   */
  const register = (account) => {
    const sql = `
    INSERT INTO Accounts(userName, password, email, isVerified, isTwoFactor, token, accountId)
      VALUES($userName, $password, $email, $isVerified, $isTwoFactor, $token, $accountId)
    `;
    const result = client.write(sql, account);
    if (result.error) {
      const { error, status } = result;
      return error === 'SQLITE_CONSTRAINT_UNIQUE'
        ? { error: 'user already exists', status }
        : { error: 'an unspecified error occured.', status };
    }
    return result;
  };
  /**
   * Login user from user Name credentials and verify password
   * @param {Login} param0
   */
  const login = async ({ userName, password }) => {
    const sql = `
    SELECT password, userName, email, accountID
    FROM Accounts
    where userName == $userName
    `;
    const user = client.getOne(sql, { userName });
    if (!user || user.error) {
      return { error: 'Credentials were not valid!', status: 401 };
    }
    const { password: hash, ...rest } = user;
    const success = await argon2.verify(hash, password);
    if (!success) {
      return { error: 'Credentials were not valid!', status: 401 };
    }
    return rest;
  };
  const checkIfUserExists = (accountID) => {
    const sql = `
    SELECT userName, email
    FROM Accounts
    WHERE accountID == $accountID
    `;
    const account = client.getOne(sql, { accountID });
    if (!account || account.error) {
      return { error: 'credentials were not valid!', status: 400 };
    }
    return account;
  };

  const deleteAccount = (accountID) => {
    const sql = `
    DELETE
    FROM Accounts
    WHERE accountID == $accountID
    `;
    const result = client.write(sql, { accountID });
    if (result.error || !result) {
      return { error: result.error, status: 400 };
    }
    return result;
  };

  const updateAccountDetails = (details) => {
    const sql = `
    UPDATE TABLE 
    `;
    const result = client.write(sql, details);
    if (!result || result.error) {
      return { error: 'could not update db at this time', status: 400 };
    }
    return result;
  };
  return {
    register,
    login,
    checkIfUserExists,
    deleteAccount,
    updateAccountDetails,
    close: () => { client.close(); },
  };
};

module.exports = Object.freeze(AccountRepository);
