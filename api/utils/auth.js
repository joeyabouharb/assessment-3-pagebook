const jsonwebtoken = require('jsonwebtoken');

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

const authNeeded = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ error: 'Not Authorized' });
  } else {
    const [bearer, token] = auth.split(' ');
    if (bearer !== 'Bearer') {
      res.status(401).json({ error: 'Not Authorized' });
    } else {
      verifyJwt(token)
        .then((decoded) => {
          req.user = decoded;
          next();
        })
        .catch(() => {
          res.status(401).json({
            error: 'authentication failure',
          });
        });
    }
  }
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
