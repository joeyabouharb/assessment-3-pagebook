const argon2 = require('argon2');
const pagesDBClient = require('./DatabaseClient').pagesDb;

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
    const sql = `
    INSERT INTO Accounts(
      accountID, userName, password,
      email, isVerified, isTwoFactor, token
    )
      VALUES(
        $accountID, $userName, $password, $email,
        $isVerified, $isTwoFactor, $token
      )
    `;
    const result = client.modify(sql, account);
    if (result.error) {
      const { code } = result.error;
      return code === 'SQLITE_CONSTRAINT_UNIQUE'
        ? { error: 'user already exists', status: 400 }
        : { error: 'an unspecified error occured.', status: 500 };
    }
    return result;
  };
  const registerMany = (accounts) => {
    const sql = `
    INSERT INTO Accounts(
      accountID, userName, password,
      email, isVerified, isTwoFactor, token
    )
      VALUES(
        $accountID, $userName, $password,
        $email, $isVerified, $isTwoFactor, $token
      )
    `;
    const result = client.batchModify(sql, accounts);
    return result;
  };

  /**
   * Login user from user Name credentials and verify password
   * @param {Login} param0
   */
  const login = async ({ userName, password }) => {
    const sql = `
    SELECT password, userName, token, accountID
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

  const updateAccountDetails = (account) => {
    const sql = `
    UPDATE Accounts
    SET email = $email,
    userName = $userName
    WHERE token == $token
    `;
    const result = client.modify(sql, account);
    if (result.error) {
      return { error: result.error, status: result.status };
    }
    return result;
  };

  const updateAccountPassword = (details) => {
    const sql = `
    UPDATE Accounts
    SET password = $password
    WHERE token == $token
    `;
    const result = client.modify(sql, details);
    if (result.error) {
      return { error: result.error, status: 400 };
    }
    return result;
  };

  const authorizePageAccess = (pageID, accountID) => {
    const sql = `
    SELECT *
    FROM Accounts a
    INNER JOIN Pages p
    ON p.accountID = a.accountID
    WHERE p.accountID = $accountID
    AND p.pageID = $pageID
    `;
    const result = client.getOne(sql, { pageID, accountID });
    return result;
  };

  return Object.freeze({
    register,
    login,
    checkIfUserExists,
    deleteAccount,
    updateAccountDetails,
    updateAccountPassword,
    registerMany,
    close: () => { client.close(); },
    authorizePageAccess,
  });
};

module.exports = Object.freeze(AccountRepository);
