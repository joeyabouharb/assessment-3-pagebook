const jsonwebtoken = require('jsonwebtoken');
const AccountRepository = require('../repository/AccountRepository');

const secret = 'Hello, Secret-World!';

const verifyJwt = (token) => new Promise((resolve, reject) => {
  jsonwebtoken.verify(token, secret, (err, decoded) => {
    if (err) {
      reject(err);
    } else {
      resolve(decoded);
    }
  });
});

const pullTokenFromHeader = (headers) => {
  const auth = headers.authorization;
  if (!auth) {
    return { error: 'Not Authorized', status: 401 };
  }
  const [bearer, token] = auth.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return { error: 'Not Authorized', status: 401 };
  }
  return token;
};

const authNeeded = (req, res, next) => {
  const token = pullTokenFromHeader(req.headers);
  if (token.error) {
    return res.status(token.status).json(token);
  }
  return verifyJwt(token)
    .then((decoded) => {
      const accountRepository = AccountRepository();
      const { accountID } = decoded;
      const account = accountRepository
        .checkIfUserExists(accountID);
      accountRepository.close();
      if (account.error) {
        return Promise.reject(account);
      }
      req.user = decoded;
      return next();
    })
    .catch(() => {
      res.status(401).json({
        error: 'authentication failure',
      });
    });
};

const signJwt = (credentials) => new Promise((resolve, reject) => {
  jsonwebtoken.sign(credentials, secret, { expiresIn: '1d' }, (err, encoded) => {
    if (err) {
      reject(err);
    } else {
      resolve(encoded);
    }
  });
});

module.exports = Object.freeze({
  authNeeded,
  signJwt,
  verifyJwt,
});
