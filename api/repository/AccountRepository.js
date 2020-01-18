const argon2 = require('argon2');
const pagesDBClient = require('./DatabaseClient');

/**
 *
 * Handles CRUD opperations for Accounts in specified database,
 * Register, Login, Logout, Delete and update details
 *
 * @param {string} db
 */
const AccountRepository = () => {
  const client = pagesDBClient();

  /**
   * create a new account
   * @param {Account} account
   */
  const register = (account) => {
    console.log(account);
    const sql = `
    INSERT INTO Accounts(accountID, userName, password, email, isVerified, isTwoFactor, token)
      VALUES($accountID, $userName, $password, $email, $isVerified, $isTwoFactor, $token)
    `;
    const result = client.modify(sql, account);
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
    if (user.error) {
      return { error: 'credentials were not valid!', status: 401 };
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
    if (account.error) {
      return { error: account.status, status: 401 };
    }
    return account;
  };

  const deleteAccount = (accountID) => {
    const sql = `
    DELETE
    FROM Accounts
    WHERE accountID == $accountID
    `;
    const result = client.modify(sql, { accountID });
    if (result.error) {
      return { error: result, status: result.status };
    }
    return result;
  };

  const updateAccountDetails = (details) => {
    const sql = `
    UPDATE Accounts
    SET email == $email,
    userName == $userName
    WHERE accountID == $accountID
    `;
    const result = client.modify(sql, details);
    if (result.error) {
      return { error: result.error, status: result.status };
    }
    return result;
  };

  const updateAccountPassword = (details) => {
    const sql = `
    UPDATE Accounts
    SET password == $password
    WHERE accountID == $accountID
    `;
    const result = client.modify(sql, details);
    if (result.error) {
      return { error: result.error, status: 400 };
    }
    return result;
  };

  return {
    register,
    login,
    checkIfUserExists,
    deleteAccount,
    updateAccountDetails,
    updateAccountPassword,
    close: () => { client.close(); },
  };
};

module.exports = Object.freeze(AccountRepository);
